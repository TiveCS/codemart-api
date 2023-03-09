import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';

@Injectable()
export class S3Service {
  constructor(
    @Inject('AWS_S3_CLIENT') private s3Client: S3,
    private config: ConfigService,
  ) {}

  async uploadFile(file: Express.Multer.File) {
    const { originalname, buffer, mimetype } = file;

    const params: S3.PutObjectRequest = {
      Bucket: this.config.get('S3_BUCKET'),
      Key: originalname,
      Body: buffer,
      ACL: 'private',
      ContentType: mimetype,
      ContentDisposition: 'inline',
    };

    return await this.s3Client.upload(params).promise();
  }

  async getSignedUrl(key: string) {
    return await this.s3Client.getSignedUrlPromise('getObject', {
      Bucket: this.config.get('S3_BUCKET'),
      Key: key,
      Expires: 60 * 60,
    });
  }
}
