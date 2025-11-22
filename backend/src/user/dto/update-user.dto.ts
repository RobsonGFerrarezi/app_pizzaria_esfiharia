import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsPhoneNumber, IsString } from "class-validator";

export class UpdateUserDto{
    @ApiProperty({description: 'Novo nome do usuário, pode ser null se não houver alterações a serem feitas'})
    @IsString()
    @IsOptional()
    nome?:      string;

    @ApiProperty({description: 'Novo email do usuário, deve ser em formato de email, pode ser null se não houver alterações a serem feitas'})
    @IsEmail()
    @IsOptional()
    email?:     string;
    
    @ApiProperty({description: 'Novo telefone do usuário, deve ser em formato de telefone BR, pode ser null se não houver alterações a serem feitas'})
    @IsPhoneNumber('BR')
    @IsOptional()
    telefone?:  string;
}