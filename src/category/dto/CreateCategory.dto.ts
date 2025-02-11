import { IsNotEmpty, IsString, isString } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  gender: string;

  @IsNotEmpty()
  @IsString()
  order: number;

  @IsNotEmpty()
  @IsString()
  menuId: string;
}
