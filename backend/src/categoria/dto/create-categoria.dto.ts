import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateCategoriaDto{
    @ApiProperty({description: 'Tipo de categoria. Ex: Pizza; Refrigerante'})
    @IsString()
    categoria:   string;
}