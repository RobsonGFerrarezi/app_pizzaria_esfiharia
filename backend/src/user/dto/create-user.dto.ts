import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, Matches, MinLength } from "class-validator";

export class CreateUserDto {
    @ApiProperty({ description: 'Nome do usuário.' })
    @IsString()
    nome: string;

    @ApiProperty({ description: 'Email do usuário, obrigatório formato de email.' })
    @IsEmail()
    email: string;

    @ApiProperty({ description: 'Telefone do usuário, tem que ser formato de telefone BR (00) 00000-0000, pode ser null.' })
    @IsPhoneNumber('BR')
    @IsOptional()
    telefone?: string;

    @ApiProperty({ description: 'Senha (mín. 8 caracteres, 1 maiúscula, 1 minúscula, 1 número, 1 símbolo).' })
    @IsString()
    @IsNotEmpty()
    @MinLength(8, { message: 'A senha deve ter no mínimo 8 caracteres.' })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.,;:]).*$/, {
        message: 'A senha deve conter pelo menos uma letra maiúscula, uma minúscula, um número e um caractere especial (@$!%*?&.,;:).'
    })
    senha:      string;
}