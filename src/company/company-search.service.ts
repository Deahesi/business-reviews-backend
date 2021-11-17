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

  private toIndexData(c) {
    const company = {
      id: c.id.toString(),
      name: c.name,
      city: c.city,
      entity: c.entity,
      businessman_fullname: c.businessman_fullname,
      director_fullname: c.director_fullname,
      director_position: c.director_position,
      kpp: c.kpp,
      inn: c.inn,
      ogrn: c.ogrn,
      address: c.address,
      tax_authority: c.tax_authority,
      activity: c.activity,
      sites: c.sites,
      phones: c.phones,
      emails: c.emails
    }

    return company
  }

  async indexCompany(company: CompanyModel) {
    return this.elasticsearchService.index<CompanySearchResult, CompanySearchBody>({
      index: this.index,
      body: this.toIndexData(company)
    });
  }

  async updateCompany(company: CompanyModel) {
    await this.elasticsearchService.updateByQuery({
      index: this.index,
      body: {
        script: {
          lang: 'painless',
          source: 'ctx._source = params.company',
          params: {
            company: this.toIndexData(company)
          }
        },
        query: {
          match: {
            id: company.id.toString()
          }
        }
      }
    })
    await this.indexCompany(company)
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
