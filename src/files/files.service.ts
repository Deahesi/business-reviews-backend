import { Injectable } from '@nestjs/common';
import * as fs from 'fs'
import * as path from 'path'
import * as uuid from 'uuid'
import { ValidationException } from '../exceptions/validation.exception';

@Injectable()
export class FilesService {
  async createFile(file) {
    try {
      const fileName = uuid.v4() + '.jpg'
      const filePath = process.env.NODE_ENV === 'development' ? path.resolve(__dirname, '..', 'static') : '/var/www/static/'
      if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, {recursive: true})
      }
      fs.writeFileSync(path.join(filePath, fileName), file.buffer)
      return fileName
    } catch (e) {

    }
  }

  async deleteFile(image: string) {
    try {
      const filePath = process.env.NODE_ENV === 'development' ? path.resolve(__dirname, '..', 'static', image) : '/var/www/static/' + image
      if (!fs.existsSync(filePath)) {
        throw new ValidationException([{
          field: 'file',
          errors: ['No files with this name']
        }])
      }
      fs.rmSync(filePath)
      return
    } catch (e) {
      throw e
    }
  }
}
