import { CitySearchBody } from './city-search-body.interface';


export interface CitySearchResult {
  hits: {
    total: number,
    hits: Array<{_source: CitySearchBody}>
  }
}
