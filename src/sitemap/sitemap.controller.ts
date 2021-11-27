import { Controller, Get, Res } from '@nestjs/common';
import { SitemapStream, streamToPromise } from 'sitemap';
import { CompanyService } from '../company/company.service';
import { ReviewService } from '../review/review.service';
// @ts-ignore
import * as cyrillicToTranslit from 'cyrillic-to-translit-js'

@Controller('sitemap.xml')
export class SitemapController {
  constructor(private companyService: CompanyService,
              private reviewService: ReviewService) {
  }

  sitemapXmlCache;
  sitemapTimeoutMs = 1000 * 60 * 60;

  private getCompanyUrl(name, id) {
    // @ts-ignore
    return cyrillicToTranslit().transform(name).replaceAll(' ', '-').replaceAll('«', '').replaceAll('»', '').replaceAll('\"', '') + '-ID:' + id
  }

  @Get('')
  async sitemap(@Res() res) {
    res.set('Content-Type', 'text/xml')
    if (this.sitemapXmlCache) {
      res.send(this.sitemapXmlCache);
      return;
    }

    const companiesIds = await this.companyService.getAllCompaniesIdsNames()
    const reviewsIds = await this.reviewService.getAllReviewsId()


    const smStream = new SitemapStream({
      hostname: 'https://xn----9sbekjcd5bl2an3ib.xn--p1ai/'
    });
    smStream.write({
      url: '/',
      changefreq: 'monthly', priority: 0.3
    })

    reviewsIds.forEach(review => {
      smStream.write({
        url: `review/${review.id}`,
        changefreq: 'daily', priority: 1
      })
    })

    companiesIds.forEach(company => {
      smStream.write({
        url: `company/${this.getCompanyUrl(company.name, company.id)}`,
        changefreq: 'daily', priority: 1
      })
    })

    smStream.end()
    streamToPromise(smStream).then(xml => {
      this.sitemapXmlCache = xml;
      setTimeout(() => {
        this.sitemapXmlCache = null
      }, this.sitemapTimeoutMs)
      res.send(xml);
    })
  }

}
