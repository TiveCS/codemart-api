import { IsArray, IsOptional, MaxLength, MinLength } from 'class-validator';

export class CreateProductFilesDTO {
  @IsArray()
  @IsOptional()
  @MaxLength(1)
  images?: Express.Multer.File[];

  @IsArray()
  @MinLength(1)
  @MaxLength(1)
  source: Express.Multer.File[];
}
