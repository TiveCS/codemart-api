import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { S3 } from 'aws-sdk';
import { S3Service } from '../s3.service';
import { MulterHelperFile } from './../../../../test/helpers/MulterFileHelper';

describe('S3Service', () => {
  let app: TestingModule;
  let s3Service: S3Service;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env.test',
        }),
      ],
      providers: [
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
        S3Service,
      ],
    }).compile();

    s3Service = app.get<S3Service>(S3Service);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('uploadFile', () => {
    it('should upload file into cloud and return url', async () => {
      // Arrange
      const file = MulterHelperFile.toMulter({
        fieldname: 'source',
        buffer: Buffer.from('../../../../test/mocks/files/example-zip.zip'),
        mimetype: 'application/zip',
        originalname: 'example-zip',
      }) as Express.Multer.File;

      // Action
      const result = await s3Service.uploadFile(file);

      // Assert
      const url = await s3Service.getSignedUrl(file.originalname);
      expect(result).toBeDefined();
      expect(url).toBeDefined();
    });
  });
});
