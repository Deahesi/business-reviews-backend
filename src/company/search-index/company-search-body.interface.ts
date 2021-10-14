export interface CompanySearchBody {
  id: string,
  name: string,
  city: string,
  entity: string,
  businessmanSurname: string,
  inn: string,
  ogrn: string,
  address: string,
  sites: string[],
  phones: string[],
  emails: string[]
}
