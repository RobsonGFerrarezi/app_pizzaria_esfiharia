import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';

@Injectable()
export class CategoriaService {

    constructor(private prisma: PrismaService) { }

    async create(data: CreateCategoriaDto) {
        const categoria = await this.prisma.categoria.create({
            data: {
                categoria: data.categoria,
            }
        });

        return categoria;
    }

    async findAll() {
        const categoria = await this.prisma.categoria.findMany();
        return categoria;
    }

    async findOne(id: number) {
        const categoria = await this.prisma.categoria.findUnique({
            where: {
                id: id,
            }
        });

        if (!categoria) {
            throw new NotFoundException(`A categoria de ID ${id} não foi encontrada.`)
        }

        return categoria;
    }

    async update(id: number, data: UpdateCategoriaDto) {
        await this.findOne(id);

        const categoria = await this.prisma.categoria.update({
            where: {
                id: id,
            },
            data: data,
        });

        return categoria;
    }

    async delete(id: number){
        await this.findOne(id);

        try {
            await this.prisma.categoria.delete({
                where: {
                    id: id,
                }
            });

            return { message: `Categoria com ID ${id} deletada com sucesso.` };

        } catch (error) {
            throw new NotFoundException(
                `Não foi possível deletar a categoria com ID ${id}, pois ela está sendo usada por produtos.`
            );
        }
    }
}
