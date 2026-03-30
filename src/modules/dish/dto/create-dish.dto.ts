import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class CreateDishDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  name: string;
}