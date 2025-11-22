import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Injectable()
export class UserService {

    constructor(private prisma: PrismaService) { }

    async create(data: CreateUserDto) {

        const saltRounds = 10;
        const senhaCriptografada = await bcrypt.hash(data.senha, saltRounds);

        return this.prisma.$transaction(async (prisma) => {
            const user = await prisma.user.create({
                data: {
                    nome: data.nome,
                    email: data.email,
                    telefone: data.telefone,
                    senha: senhaCriptografada,
                },
            });
            await prisma.carrinho.create({
                data: {
                    userId: user.id,
                }
            });

            const { senha, ...result } = user;
            return result;
        });
    }

    async findByEmail(email: string) {

        const user = await this.prisma.user.findUnique({
            where: {
                email: email,
                ativo: true,
            },
        });

        if (!user) {
            throw new NotFoundException(`Usuário do email ${email} não encontrado.`)
        }

        return user;
    }

    async findAll() {
        const users = await this.prisma.user.findMany({
            where: {
                ativo: true,
            },
            select: {
                id: true,
                nome: true,
                email: true,
                telefone: true,
            }
        });
        return users;
    }

    async findOne(id: number) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: id,
                ativo: true,
            },
            select: {
                id: true,
                nome: true,
                email: true,
                telefone: true,
            }
        });

        if (!user) {
            throw new NotFoundException(`O usuário de ID ${id} não foi encontrado.`)
        }

        return user;
    }

    async update(id: number, data: UpdateUserDto) {
        await this.findOne(id);

        const user = await this.prisma.user.update({
            where: {
                id: id,
            },
            data: data,
            select: {
                id: true,
                nome: true,
                email: true,
                telefone: true,
            }
        });

        return user;
    }

    async delete(id: number) {

        await this.findOne(id);

        const user = await this.prisma.user.update({
            where: {
                id: id
            },
            data: {
                ativo: false,
                // Opcional: Anônimizar dados (bom para LGPD)
                email: `deleted-${id}@user.com`,
                nome: 'Usuário Deletado',
                telefone: null,
            },
        });

        return user;
    }

    //Uso Interno apenas
    private async findUserWithPassword(id: number) {
        const user = await this.prisma.user.findUnique({
            where: { id: id },
        });

        if (!user) {
            throw new NotFoundException(`O usuário de ID ${id} não foi encontrado.`);
        }
        return user;
    }

    async updatePassword(id: number, data: UpdatePasswordDto) {

        const user = await this.findUserWithPassword(id);

        const isMatch = await bcrypt.compare(data.senhaAntiga, user.senha);

        if (!isMatch) {
            throw new BadRequestException('A senha antiga está incorreta.')
        }

        //CRIPTOGRAFANDO A SENHA
        const saltRounds = 10;
        const novaSenhaCriptografada = await bcrypt.hash(data.novaSenha, saltRounds)

        await this.prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                senha: novaSenhaCriptografada,
            }
        });

        return { message: 'Senha atualizada com sucesso!' }
    }
}
