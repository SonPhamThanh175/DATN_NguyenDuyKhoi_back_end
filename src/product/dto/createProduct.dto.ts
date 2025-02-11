import { IsNotEmpty, IsNumber, IsString, isString } from 'class-validator';

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

  @IsNotEmpty()
  @IsString()
  typeId: string;
}

// dialSize (Kích thước mặt)
// thickness (Độ dày)
// Color (Màu mặt)
// movementType (Loại máy)
// strapSize (Kích cỡ dây)
// waterResistance (Chống nước)
// glassMaterial (Mặt kính)
// strapMaterial (Chất liệu dây)
