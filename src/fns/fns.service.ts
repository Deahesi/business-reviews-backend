import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import * as https from 'https';
import * as fs from 'fs';
import * as path from 'path';
import * as AdmZip from 'adm-zip';
import { JSDOM } from 'jsdom';
import { CompanyService } from '../company/company.service';
import { CompanyDto } from '../company/dto/company.dto';

const iconv = require('iconv-lite');
const parser = require('fast-xml-parser');

const xmlOptions = {
  ignoreAttributes: false,
  attributeNamePrefix: '@_'
};


const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
  cert: fs.readFileSync(path.resolve('fns-data', 'cert.crt')),
  key: fs.readFileSync(path.resolve('fns-data', 'privateKey.pem')),
  passphrase: ''
});

@Injectable()
export class FnsService {
  constructor(private readonly httpService: HttpService,
              private readonly companyService: CompanyService) {
  }

  async startCompaniesDownload() {
    const html = (await this.httpService.get(`https://ftp.egrul.nalog.ru/?dir=EGRUL_406/01.01.${new Date().getFullYear()}_FULL`, {
      httpsAgent
    }).toPromise()).data;
    const { document } = (new JSDOM(html)).window;
    let links = document.querySelectorAll('.clearfix');


    for (let i = 1; i < links.length; i++) {
      console.log(`https://ftp.egrul.nalog.ru/${ links[i].getAttribute('href') }`);
      const response = (await this.httpService.get(`https://ftp.egrul.nalog.ru/${ links[i].getAttribute('href') }`, {
        httpsAgent,
        responseType: 'arraybuffer',
        timeout: 30000
      }).toPromise())

      const fileNameHeader = 'x-suggested-filename';
      const suggestedFileName = response.headers[fileNameHeader];
      const effectiveFileName = (suggestedFileName === undefined
        ? 'fns.zip'
        : suggestedFileName);

      console.log(`Received header [${fileNameHeader}]: ${suggestedFileName}, effective fileName: ${effectiveFileName}`);


      const dirPath = path.resolve(__dirname, 'data');
      const filePath = path.join(dirPath, effectiveFileName);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, {recursive: true})
      }
      await fs.writeFileSync(filePath, response.data)


      const zip = new AdmZip(filePath);
      const zipEntries = zip.getEntries();

      for (const entry of zipEntries) {
        const encoded = iconv.encode(iconv.decode(entry.getData(), 'win1251'), 'utf8').toString('utf8');
        const jsonObj = parser.parse(encoded, xmlOptions);
        for (const ul of jsonObj['EGRUL']['СвЮЛ']) {
          if (Array.isArray(ul)) {

          } else {
            const ooo = ul;
            await this.createCompany(ooo);
          }
        }
      }

      fs.rmSync(filePath)
    }


    return 'DONE';
  }

  async startCompaniesUpdate() {
    console.log(`https://ftp.egrul.nalog.ru/?dir=EGRUL_406/${new Date(Date.now() - 172800000).toLocaleDateString('ru-RU')}`);
    const html = (await this.httpService.get(`https://ftp.egrul.nalog.ru/?dir=EGRUL_406/${new Date(Date.now() - 172800000).toLocaleDateString('ru-RU')}`, {
      httpsAgent
    }).toPromise()).data;
    const { document } = (new JSDOM(html)).window;
    let links = document.querySelectorAll('.clearfix');


    for (let i = 1; i < links.length; i++) {
      console.log(`https://ftp.egrul.nalog.ru/${ links[i].getAttribute('href') }`);
      const response = (await this.httpService.get(`https://ftp.egrul.nalog.ru/${ links[i].getAttribute('href') }`, {
        httpsAgent,
        responseType: 'arraybuffer',
        timeout: 30000
      }).toPromise())

      const fileNameHeader = 'x-suggested-filename';
      const suggestedFileName = response.headers[fileNameHeader];
      const effectiveFileName = (suggestedFileName === undefined
        ? 'fns.zip'
        : suggestedFileName);

      console.log(`Received header [${fileNameHeader}]: ${suggestedFileName}, effective fileName: ${effectiveFileName}`);


      const dirPath = path.resolve(__dirname, 'data');
      const filePath = path.join(dirPath, effectiveFileName);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, {recursive: true})
      }
      await fs.writeFileSync(filePath, response.data)


      const zip = new AdmZip(filePath);
      const zipEntries = zip.getEntries();

      for (const entry of zipEntries) {
        const encoded = iconv.encode(iconv.decode(entry.getData(), 'win1251'), 'utf8').toString('utf8');
        const jsonObj = parser.parse(encoded, xmlOptions);
        for (const ul of jsonObj['EGRUL']['СвЮЛ']) {
          if (Array.isArray(ul)) {

          } else {
            const ooo = ul;
            await this.updateCompany(ooo);
          }
        }
      }

      fs.rmSync(filePath)
    }


    return 'DONE';
  }

  private async updateCompany(ooo) {
    const companyData = this.companyData(ooo)
    companyData ? await this.companyService.updateCompanyOOO(companyData) : '';
  }


  private async createCompany(ooo) {
    const companyData = this.companyData(ooo)
    if (companyData) await this.companyService.updateCompanyOOO(companyData);
  }

  private companyData(ooo) {
    try {
      const addressType = ooo['СвАдресЮЛ']['АдресРФ'] ? 'АдресРФ' : 'СвАдрЮЛФИАС';

      const oooCity =
        ooo['СвАдресЮЛ']['АдресРФ'] ?
          (ooo['СвАдресЮЛ']['АдресРФ']['Город']
            ? ooo['СвАдресЮЛ']['АдресРФ']['Город']['@_НаимГород']
            : (ooo['СвАдресЮЛ']['АдресРФ']['Регион']['@_НаимРегион'] ?? ooo['СвАдресЮЛ']['АдресРФ']['Регион']))
          : ooo['СвАдресЮЛ']['СвАдрЮЛФИАС']['НаимРегион'];

      const oooAddress = ooo['СвАдресЮЛ'][addressType]['@_Индекс'] + ', ' + ooo['СвАдресЮЛ'][addressType]['Регион']['@_НаимРегион'] + ' ' + ooo['СвАдресЮЛ'][addressType]['Регион']['@_ТипРегион']
        ?? ooo['СвАдресЮЛ'][addressType]['НаимРегион'];

      const oooRegistration = ooo['СвРегПФ'] ? ooo['СвРегПФ']['@_ДатаРег'] : ooo['СвОбрЮЛ']['ГРНДата']['@_ДатаЗаписи']

      const director = ooo['СведДолжнФЛ']
        ? (ooo['СведДолжнФЛ']['СвФЛ'] ? (ooo['СведДолжнФЛ']['СвФЛ']['@_Фамилия'] + ' ' + ooo['СведДолжнФЛ']['СвФЛ']['@_Имя'] + ' ' + ooo['СведДолжнФЛ']['СвФЛ']['@_Отчество'])
          : (ooo['СведДолжнФЛ'][0]['СвФЛ']['@_Фамилия'] + ' ' + ooo['СведДолжнФЛ'][0]['СвФЛ']['@_Имя'] + ' ' + ooo['СведДолжнФЛ'][0]['СвФЛ']['@_Отчество'])) : null

      const director_position = ooo['СведДолжнФЛ']
        ? (ooo['СведДолжнФЛ']['СвДолжн'] ? (ooo['СведДолжнФЛ']['СвДолжн']['@_НаимДолжн'])
          : (ooo['СведДолжнФЛ'][0]['СвДолжн']['@_НаимДолжн'])): null

      const director_date = ooo['СведДолжнФЛ']
        ? (ooo['СведДолжнФЛ']['СвДолжн'] ? (ooo['СведДолжнФЛ']['СвДолжн']['ГРНДата']['@_ДатаЗаписи'])
          : (ooo['СведДолжнФЛ'][0]['СвДолжн']['ГРНДата']['@_ДатаЗаписи'])): null

      const companyData: CompanyDto = {
        name: ooo['СвНаимЮЛ']['СвНаимЮЛСокр'] ? ooo['СвНаимЮЛ']['СвНаимЮЛСокр']['@_НаимСокр'].replaceAll('&quot;', '') : ooo['СвНаимЮЛ']['@_НаимЮЛПолн'].replaceAll('&quot;', ''),
        city: oooCity.toUpperCase().replace('Г.', ''),
        type: 'company',
        address: ooo['СвРегОрг']['@_АдрРО'],
        ogrn: ooo['@_ОГРН'],
        inn: ooo['@_ИНН'],
        kpp: ooo['@_КПП'],
        createdAt: oooRegistration,
        tax_authority: ooo['СвУчетНО']['СвНО'] ? ooo['СвУчетНО']['СвНО']['@_НаимНО'] : ooo['СвРегОрг']['@_НаимНО'],
        director_fullname: director,
        director_position: director_position,
        director_date: director_date,
        capital: ooo['СвУстКап'] ? (parseFloat(ooo['СвУстКап']['@_СумКап'])) : null,
        activity: ooo['СвОКВЭД'] ? (ooo['СвОКВЭД']['СвОКВЭДОсн']['@_НаимОКВЭД']) : null,
        entity: ooo['СвНаимЮЛ']['@_НаимЮЛПолн'].replaceAll('&quot;', '')
      };
      return companyData
    } catch (e) {
      return null
    }
  }
}
