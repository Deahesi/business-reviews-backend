import { CompanySearchBody } from './company-search-body.interface';


export interface CompanySearchResult {
  hits: {
    total: number,
    hits: Array<{_source: CompanySearchBody}>
  }
}
