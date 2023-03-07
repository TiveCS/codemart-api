import { IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateProductDTO {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  version: string;

  @IsUrl()
  @IsOptional()
  imageUrl?: string;

  @IsUrl()
  codeUrl: string;
}
