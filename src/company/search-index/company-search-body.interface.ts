export interface CompanySearchBody {
  id: string,
  name: string,
  city: string,
  entity: string,
  businessman_fullname: string,
  director_fullname: string,
  director_position: string,
  kpp: string,
  inn: string,
  ogrn: string,
  address: string,
  tax_authority: string,
  activity: string,
  sites: string[],
  phones: string[],
  emails: string[]
}
