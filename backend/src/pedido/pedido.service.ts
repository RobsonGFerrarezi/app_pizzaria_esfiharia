import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { UpdatePedidoStatusDto } from './dto/update-pedido-status.dto';

@Injectable()
export class PedidoService {

    constructor(private prisma: PrismaService) { }

    /**
     * Cria um novo pedido a partir do carrinho de um usuário.
     * Limpa o carrinho após a criação.
     * Executado como uma transação de banco de dados.
     */
    async create(userId: number) {
        // 1. Encontrar o carrinho do usuário com seus itens e produtos
        const carrinho = await this.prisma.carrinho.findUnique({
            where: { userId },
            include: {
                itens: {
                    include: {
                        product: true, // Precisamos do produto para pegar o preço
                    }
                }
            }
        });

        // 2. Validar se o carrinho existe ou está vazio
        if (!carrinho || !carrinho.itens.length) {
            throw new BadRequestException('Não é possível criar um pedido com um carrinho vazio.');
        }

        // 3. Calcular o total do pedido
        const total = carrinho.itens.reduce((acc, item) => {
            return acc + (item.quantidade * item.product.preco);
        }, 0);

        // 4. Iniciar a transação
        return this.prisma.$transaction(async (tx) => {
            // 4a. Criar o Pedido
            const pedido = await tx.pedido.create({
                data: {
                    userId: userId,
                    total: total,
                    status: 'PENDENTE', // Status inicial 
                }
            });

            // 4b. Preparar os PedidoItens
            const itensDoPedido = carrinho.itens.map(item => ({
                pedidoId: pedido.id,
                productId: item.productId,
                quantidade: item.quantidade,
                precoNoMomento: item.product.preco, // Salva o preço no momento da compra 
            }));

            // 4c. Criar os PedidoItens
            await tx.pedidoItem.createMany({
                data: itensDoPedido,
            });

            // 4d. Limpar o carrinho (deletando os CarrinhoItens)
            await tx.carrinhoItem.deleteMany({
                where: { carrinhoId: carrinho.id }
            });

            return pedido;
        });
    }


    async findAllByUser(userId: number) {
        return this.prisma.pedido.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }, 
            include: {
                itens: {
                    include: {
                        product: { 
                            select: {
                                id: true,
                                produto: true
                            }
                        }
                    }
                }
            }
        });
    }

    async findOne(pedidoId: number, userId: number) {
        const pedido = await this.prisma.pedido.findFirst({
            where: {
                id: pedidoId,
                userId: userId // Garante que o usuário só veja seus próprios pedidos
            },
            include: {
                itens: {
                    include: {
                        product: true
                    }
                },
                user: {
                    select: {
                        id: true,
                        nome: true
                    }
                }
            }
        });

        if (!pedido) {
            throw new NotFoundException(`Pedido com ID ${pedidoId} não encontrado para este usuário.`);
        }
        return pedido;
    }

    /**
     * Atualiza o status de um pedido (Ex: PENDENTE -> EM_PREPARO).
     * (Rota tipicamente usada por um administrador).
     */
    async updateStatus(pedidoId: number, data: UpdatePedidoStatusDto) {
        const pedido = await this.prisma.pedido.findUnique({ where: { id: pedidoId } });
        if (!pedido) {
            throw new NotFoundException(`Pedido com ID ${pedidoId} não encontrado.`);
        }

        return this.prisma.pedido.update({
            where: { id: pedidoId },
            data: {
                status: data.status,
            }
        });
    }
}