import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { AddItemDto } from './dto/add-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

@Injectable()
export class CarrinhoService {

    constructor(private prisma: PrismaService) {}

    // Buscar carrinho de um usuário
    async findByUser(userId: number) {
        const carrinho = await this.prisma.carrinho.findUnique({
            where: { userId },
            include: {
                itens: {
                    include: {
                        product: true,
                    }
                }
            }
        });

        if (!carrinho) {
            throw new NotFoundException(`Carrinho do usuário ${userId} não encontrado`);
        }

        return carrinho;
    }

    // Adicionar um item ao carrinho
    async addItem(userId: number, data: AddItemDto) {

        const carrinho = await this.findByUser(userId);

        const itemExistente = await this.prisma.carrinhoItem.findFirst({
            where: {
                carrinhoId: carrinho.id,
                productId: data.productId,
            }
        });

        if (itemExistente) {
            return this.prisma.carrinhoItem.update({
                where: { id: itemExistente.id },
                data: {
                    quantidade: itemExistente.quantidade + data.quantidade,
                }
            });
        }

        return this.prisma.carrinhoItem.create({
            data: {
                carrinhoId: carrinho.id,
                productId: data.productId,
                quantidade: data.quantidade
            }
        });
    }

    async updateItem(userId: number, itemId: number, data: UpdateItemDto) {

        const carrinho = await this.findByUser(userId);

        const item = await this.prisma.carrinhoItem.findFirst({
            where: {
                id: itemId,
                carrinhoId: carrinho.id // Garante que o item é deste carrinho
            }
        });

        if (!item) {
            throw new NotFoundException(`Item ${itemId} não encontrado no carrinho do usuário ${userId}`);
        }

        return this.prisma.carrinhoItem.update({
            where: { id: itemId },
            data,
        });
    }

    async removeItem(userId: number, itemId: number) {

        const carrinho = await this.findByUser(userId);

        const item = await this.prisma.carrinhoItem.findFirst({
            where: {
                id: itemId,
                carrinhoId: carrinho.id
            }
        });

        if (!item) {
            throw new NotFoundException(`Item ${itemId} não encontrado no carrinho do usuário ${userId}`);
        }

        return this.prisma.carrinhoItem.delete({
            where: { id: itemId }
        });
    }

    async clear(userId: number) {
        const carrinho = await this.findByUser(userId);

        return this.prisma.carrinhoItem.deleteMany({
            where: { carrinhoId: carrinho.id }
        });
    }
}
