import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import sharp from 'sharp'; // Importação 'default', como corrigimos antes
import { Product } from '@prisma/client'; // É bom importar o tipo

@Injectable()
export class ProductService {

    constructor(private prisma: PrismaService) { }

    async create(data: CreateProductDto, imageBuffer: Buffer) {
        const product = await this.prisma.product.create({
            data: {
                produto: data.produto,
                preco: data.preco,
                categoriaId: data.categoriaId,
                // CORREÇÃO 1: Converte Buffer (do Multer) para Uint8Array (que o Prisma está esperando)
                imagem_produto: new Uint8Array(imageBuffer), 
            },
        });

        return product;
    }

    async findAll() {
        // ... (sem alteração)
        const products = await this.prisma.product.findMany({
            select: {
                id: true,
                produto: true,
                preco: true,
                categoria: true,
            }
        });
        return products
    }

    async findOne(id: number){
        // ... (sem alteração)
        const product = await this.prisma.product.findUnique({
            where: { id },
            select: {
                id: true,
                produto: true,
                preco: true,
                categoria: true,
            }
        });

        if (!product){
            throw new NotFoundException(`Produto com ID ${id} não encontrado.`)
        }

        return product;
    }

    // Função interna para buscar o produto COM a imagem
    private async findProductWithImage(id: number): Promise<Product> { // Adicionando tipo de retorno
        const product = await this.prisma.product.findUnique({
            where: { id },
        });

        if (!product){
            throw new NotFoundException(`Produto com ID ${id} não encontrado.`)
        }
        if (!product.imagem_produto) {
            throw new NotFoundException(`Imagem para o produto com ID ${id} não encontrada.`)
       }
       return product;
   }

    async update(id: number, data: UpdateProductDto, imageBuffer?: Buffer){
        await this.findOne(id); 

        const product = await this.prisma.product.update({
            where: {
                id: id,
            },
            data: {
                ...data,
                // CORREÇÃO 2: Converte Buffer (do Multer) para Uint8Array (que o Prisma está esperando)
                ...(imageBuffer && { imagem_produto: new Uint8Array(imageBuffer) }),
            },
        });

        return product;
    }

    async getProductImageAsJpeg(id: number): Promise<Buffer> {
        const product = await this.findProductWithImage(id);
        try {
            const jpegBuffer = await sharp(Buffer.from(product.imagem_produto!))
                .jpeg({ quality: 90 }) 
                .toBuffer();

            return jpegBuffer;
        } catch (error) {
            throw new Error(`Erro ao converter a imagem do produto ${id} para JPEG.`);
        }
    }

    async delete(id: number) {
        await this.findOne(id);

        await this.prisma.product.delete({
            where: { id },
        });

        return { message: `Produto com ID ${id} foi deletado com sucesso.` };
    }
}