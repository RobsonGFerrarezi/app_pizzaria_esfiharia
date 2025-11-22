import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class UpdateCategoriaDto{
    @ApiProperty({description: 'Tipo de categoria. Ex: Pizza; Refrigerante'})
    @IsString()
    @IsOptional()
    categoria?:   string;
}