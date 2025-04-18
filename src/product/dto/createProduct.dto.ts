import { IsNotEmpty, IsNumber, IsString, isString, Min } from 'class-validator';

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

  // @IsNotEmpty()
  // @IsNumber()
  // dialSize: number;

  // @IsNotEmpty()
  // @IsNumber()
  // thickness: number;

  @IsNotEmpty()
  @IsString()
  Color: string;

  // @IsNotEmpty()
  // @IsString()
  // size: string;

  // @IsNotEmpty()
  // @IsString()
  // movementType: string;

  // @IsNotEmpty()
  // @IsNumber()
  // strapSize: number;

  // @IsNotEmpty()
  // @IsString()
  // waterResistance: string;

  // @IsNotEmpty()
  // @IsString()
  // glassMaterial: string;

  // @IsNotEmpty()
  // @IsString()
  // strapMaterial: string;

  @IsNumber()
  @Min(0)
  quantity: number;

  @IsNotEmpty()
  @IsString()
  typeId: string;
}


