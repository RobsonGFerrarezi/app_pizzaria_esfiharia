import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsString } from "class-validator";

export class CreateProductDto {

    @ApiProperty({description: 'Nome do produto'})
    @IsString()
    produto:        string;

    @ApiProperty({description: 'Preço do produto'})
    @Type(() => Number)
    @IsNumber()
    preco:          number;
    
    @ApiProperty({description: 'CategoriaId: 1- Pizza, 2- Esfiha, 3- Refrigerante, 4- Vinhos, 5- Sobremesas, 6- Bebidas Alcólicas'})
    @Type(() => Number)
    @IsNumber()
    categoriaId:    number;
    
    // @ApiProperty({description: 'A URL do caminho da imagem do produto...'})
    // @IsString()
    // imagem_produto: string;
}