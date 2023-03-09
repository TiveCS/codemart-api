import { S3 } from 'aws-sdk';
import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Service } from './s3.service';

@Global()
@Module({
  providers: [
    S3Service,
    {
      provide: 'AWS_S3_CLIENT',
      inject: [ConfigService],
      useFactory: (config: ConfigService): S3 => {
        const s3 = new S3({
          credentials: {
            accessKeyId: config.get<string>('S3_ACCESS_KEY'),
            secretAccessKey: config.get<string>('S3_SECRET_KEY'),
          },
          endpoint: config.get<string>('S3_ENDPOINT'),
        });
        return s3;
      },
    },
  ],
  exports: [S3Service],
})
export class S3Module {}
