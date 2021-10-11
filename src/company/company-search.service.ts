import { Injectable } from '@nestjs/common';
// import { SearchDto } from './dto/search.dto';
import { CompanyService } from './company.service';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { CompanyModel } from './company.model';
import { CompanySearchResult } from './search-index/company-search-result.interface';
import { CompanySearchBody } from './search-index/company-search-body.interface';

@Injectable()
export class CompanySearchService {
  constructor(private readonly elasticsearchService: ElasticsearchService) {
  }
  index = 'company'


  async indexCompany(company: CompanyModel) {
    return this.elasticsearchService.index<CompanySearchResult, CompanySearchBody>({
      index: this.index,
      body: {
        id: company.id.toString(),
        name: company.name,
        city: company.city,
        entity: company.entity,
        businessmanSurname: company.businessmanSurname,
        inn: company.inn,
        ogrn: company.ogrn,
        address: company.address,
        site: company.site,
        phone: company.phone,
        email: company.email
      }
    })
  }

  async search(query: string) {
    const { body } = await this.elasticsearchService.search<CompanySearchResult>({
      index: this.index,
      body: {
        query: {
          multi_match: {
            query: query,
            fields: ['id', 'name', 'city', 'entity', 'businessmanSurname', 'inn', 'ogrn', 'address', 'site', 'phone', 'email']
          }
        }
      }
    })

    const hits = body.hits.hits
    return hits.map((item) => item._source)
  }

  private async remove(id: number) {
    this.elasticsearchService.deleteByQuery({
      index: this.index,
      body: {
        query: {
          match: {
            id: id.toString(),
          }
        }
      }
    })
  }
}
