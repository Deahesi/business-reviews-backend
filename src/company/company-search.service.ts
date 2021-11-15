import { Injectable } from '@nestjs/common';
// import { SearchDto } from './dto/search.dto';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { CompanyModel } from './company.model';
import { CompanySearchResult } from './search-index/company-search-result.interface';
import { CompanySearchBody } from './search-index/company-search-body.interface';

@Injectable()
export class CompanySearchService {
  constructor(private readonly elasticsearchService: ElasticsearchService) {
  }

  index = 'company';


  async indexCompany(company: CompanyModel) {
    return this.elasticsearchService.index<CompanySearchResult, CompanySearchBody>({
      index: this.index,
      body: {
        id: company.id.toString(),
        name: company.name,
        city: company.city,
        entity: company.entity,
        businessman_fullname: company.businessman_fullname,
        director_fullname: company.director_fullname,
        director_position: company.director_position,
        kpp: company.kpp,
        inn: company.inn,
        ogrn: company.ogrn,
        address: company.address,
        tax_authority: company.tax_authority,
        activity: company.activity,
        sites: company.sites,
        phones: company.phones,
        emails: company.emails
      }
    });
  }

  async search(query: string, page: number) {
    // for (let i = 0; i <= 10000; i++) {
    //   await this.elasticsearchService.deleteByQuery({
    //     index: this.index,
    //     body: {
    //       query: {
    //         match: {
    //           id: i.toString()
    //         }
    //       }
    //     }
    //   });
    // }
    const { body } = await this.elasticsearchService.search<CompanySearchResult>({
      index: this.index,
      body: {
        query: {
          multi_match: {
            query: query,
            fields: ['id', 'name', 'city', 'entity', 'businessman_fullname', 'director_fullname', 'director_position', 'kpp', 'inn', 'ogrn', 'address', 'tax_authority', 'activity', 'site', 'phone', 'email'],
            lenient: true,
            fuzziness: 1
          }
        }
      },
      from: (page - 1) * 10,
      size: 10
    });

    const hits = body.hits.hits;
    console.log(hits.map((item) => item._source));
    return hits.map((item) => item._source);
  }

  private async remove(id: number) {
    this.elasticsearchService.deleteByQuery({
      index: this.index,
      body: {
        query: {
          match: {
            id: id.toString()
          }
        }
      }
    });
  }
}
