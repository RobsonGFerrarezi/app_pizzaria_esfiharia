import {
    Body,
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    UploadedFile,
    UseInterceptors,
    Res,
    StreamableFile,
    Delete,
    HttpCode,
    HttpStatus
} from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter } from 'src/utils/file-filter.util';
import { type Response } from 'express';

@ApiTags('Products')
@Controller('product')
export class ProductController {

    constructor(private readonly productService: ProductService) { }

    @Post()
    @UseInterceptors(FileInterceptor('imagem', { fileFilter })) // 'imagem' é a chave do form-data
    @ApiConsumes('multipart/form-data') // Informa o Swagger
    @ApiOperation({ summary: 'Cria um novo produto com upload de imagem.' })
    @ApiBody({
        description: 'Dados do produto e upload da imagem',
        schema: {
            type: 'object',
            properties: {
                // Descrevemos os campos do DTO manualmente
                produto: {
                    type: 'string',
                    description: 'Nome do produto'
                },
                preco: {
                    type: 'number',
                    description: 'Preço do produto'
                },
                categoriaId: {
                    type: 'number',
                    description: 'CategoriaId: 1- Pizza, 2- Esfiha, 3- Refrigerante, 4- Vinhos, 5- Sobremesas, 6- Bebidas Alcólicas'
                },
                // E agora o campo do arquivo
                imagem: {
                    type: 'string',
                    format: 'binary', // Isso diz ao Swagger que é um arquivo
                    description: 'Arquivo de imagem (jpg, jpeg, png)',
                },
            },
        },
    })
    create(
        @Body() data: CreateProductDto,
        @UploadedFile() file: Express.Multer.File
    ) {
        if (!file) {
            // O fileFilter já deve ter rejeitado, mas é uma boa prática verificar
            throw new Error('Arquivo de imagem é obrigatório.');
        }
        // Passa o buffer da imagem para o service
        return this.productService.create(data, file.buffer);
    }

    @Get()
    @ApiOperation({ summary: 'Lista todos os produtos (sem dados da imagem).' })
    findAll() {
        return this.productService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Busca um produto por ID (sem dados da imagem).' })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.productService.findOne(id);
    }

    @Patch(':id')
    @UseInterceptors(FileInterceptor('imagem', { fileFilter }))
    @ApiConsumes('multipart/form-data')
    @ApiOperation({ summary: 'Edita um produto. Pode ou não enviar uma nova imagem.' })
    @ApiBody({
        description: 'Dados para atualizar (opcionais) e nova imagem (opcional)',
        schema: {
            type: 'object',
            properties: {
                produto: { type: 'string' }, // <--- Correto
                preco: { type: 'number' }, // <--- Correto
                categoria: { type: 'string' }, // <--- Correto
                imagem: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() data: UpdateProductDto,
        @UploadedFile() file?: Express.Multer.File, // Imagem opcional na atualização
    ) {
        const buffer = file ? file.buffer : undefined;
        return this.productService.update(id, data, buffer);
    }

    // NOVA ROTA: Servir a imagem convertida para JPEG
    @Get(':id/image')
    @ApiOperation({ summary: 'Busca a imagem de um produto por ID (formato JPEG).' })
    async getImage(
        @Param('id', ParseIntPipe) id: number,
        @Res({ passthrough: true }) res: Response
    ) {
        // O service vai buscar e converter para JPEG
        const jpegBuffer = await this.productService.getProductImageAsJpeg(id);

        // Define os headers para o navegador entender que é uma imagem JPEG
        res.setHeader('Content-Type', 'image/jpeg');
        res.setHeader('Content-Disposition', `inline; filename="product-${id}.jpeg"`);

        // Retorna o buffer da imagem
        return new StreamableFile(jpegBuffer);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Deleta um produto por ID.' })
    @HttpCode(HttpStatus.OK)
    async delete(@Param('id', ParseIntPipe) id: number) {
        return this.productService.delete(id);
    }
}