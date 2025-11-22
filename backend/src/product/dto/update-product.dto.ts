import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateProductDto{
    @ApiProperty({description: 'O novo nome do produto, pode ser null se não houver alterações a serem feitas'})
    @IsString()
    @IsOptional()
    produto?:           string;

    @ApiProperty({description: 'O preço do produto, pode ser null se não houver alterações a serem feitas'})
    @Type(() => Number)
    @IsNumber()
    @IsOptional()
    preco?:             number;

    @ApiProperty({description: 'CategoriaId: 1- Pizza, 2- Esfiha, 3- Refrigerante, 4- Vinhos, 5- Sobremesas, 6- Bebidas Alcólicas'})
    @Type(() => Number)
    @IsNumber()
    @IsOptional()
    categoriaId?:       number;

    // @ApiProperty({description: 'A URL da imagem do produto, pode ser null se não houver alterações a serem feitas'})
    // @IsString()
    // @IsOptional()
    // imagem_produto?:    string;
}