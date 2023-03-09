import { TestingModule } from '@nestjs/testing';
import createTestModule from '../../../../test/helpers/TestModuleHelper';
import { S3Module } from '../s3.module';
import { S3Service } from '../s3.service';

describe('S3Service', () => {
  let app: TestingModule;
  let s3Service: S3Service;

  beforeAll(async () => {
    app = await createTestModule({
      imports: [S3Module],
      providers: [S3Service],
    });

    s3Service = app.get<S3Service>(S3Service);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('uploadFile', () => {
    it('should upload file into cloud and return url', async () => {});
  });
});
