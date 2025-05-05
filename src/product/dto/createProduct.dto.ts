import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  isString,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  descriptionFull: string;

  @IsNotEmpty()
  @IsNumber()
  originalPrice: number;

  @IsNotEmpty()
  @IsNumber()
  salePrice: number;

  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  Color: string[];

  @IsNumber()
  @Min(0)
  quantity: number;

  @IsNotEmpty()
  @IsString()
  typeId: string;

  @IsNotEmpty()
  @IsString()
  categoryId: string;
}
