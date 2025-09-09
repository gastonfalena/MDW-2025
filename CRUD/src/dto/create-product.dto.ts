import { IsString, Length, IsOptional, IsNumber, Min } from "class-validator";

export class CreateProductDto {
  @IsString({ message: "El nombre debe ser un string" })
  @Length(5, 20, { message: "El nombre debe tener entre 5 y 20 caracteres" })
  name!: string;

  @IsOptional()
  @IsString({ message: "La descripción debe ser un string" })
  @Length(0, 20, { message: "La descripción no puede superar 20 caracteres" })
  description?: string;

  @IsNumber({}, { message: "El stock debe ser un número" })
  @Min(0, { message: "El stock no puede ser negativo" })
  stock!: number;

  @IsNumber({}, { message: "El precio debe ser un número" })
  @Min(0, { message: "El precio no puede ser negativo" })
  price!: number;
}
