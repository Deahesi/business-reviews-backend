import { Injectable } from '@nestjs/common';
// import { SearchDto } from './dto/search.dto';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { CityModel } from './city.model';
import { CitySearchResult } from './search-index/city-search-result.interface';
import { CitySearchBody } from './search-index/city-search-body.interface';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class CitySearchService {
  constructor(private readonly elasticsearchService: ElasticsearchService,
              private readonly httpService: HttpService) {
  }

  index = 'city';


  async indexCity(city: CityModel) {
    // await this.removeAllIndexes()
    return this.elasticsearchService.index<CitySearchResult, CitySearchBody>({
      index: this.index,
      body: {
        id: city.id.toString(),
        city: city.city.toUpperCase()
      }
    });
  }

  async search(query: string) {
    const { body } = await this.elasticsearchService.search<CitySearchResult>({
      index: this.index,
      body: {
        query: {
          multi_match: {
            query: query,
            fields: ['id', 'city'],
            fuzziness: 1
          }
        }
      }
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
  async removeAllIndexes() {
    await this.httpService.delete<any>('http://localhost:9200/city')
    // for (let i = 0; i <= 2395; i++) {
    //
    //   this.elasticsearchService.deleteByQuery({
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

  }

}
