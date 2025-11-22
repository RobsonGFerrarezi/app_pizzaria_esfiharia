import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CarrinhoService } from './carrinho.service';
import { AddItemDto } from './dto/add-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

@ApiTags('Carrinho')
@Controller('carrinho')
export class CarrinhoController {

    constructor(private readonly carrinhoService: CarrinhoService) {}

    @Get(':userId')
    @ApiOperation({ summary: 'Busca o carrinho de um usuário' })
    find(@Param('userId', ParseIntPipe) userId: number) {
        return this.carrinhoService.findByUser(userId);
    }

    @Post(':userId/add')
    @ApiOperation({ summary: 'Adiciona um item ao carrinho do usuário' })
    addItem(
        @Param('userId', ParseIntPipe) userId: number,
        @Body() data: AddItemDto
    ) {
        return this.carrinhoService.addItem(userId, data);
    }

    @Patch(':userId/item/:itemId')
    @ApiOperation({ summary: 'Atualiza quantidade de um item do carrinho' })
    updateItem(
        @Param('userId', ParseIntPipe) userId: number,
        @Param('itemId', ParseIntPipe) itemId: number,
        @Body() data: UpdateItemDto
    ) {
        return this.carrinhoService.updateItem(userId, itemId, data);
    }

    @Delete(':userId/item/:itemId')
    @ApiOperation({ summary: 'Remove um item do carrinho' })
    removeItem(
        @Param('userId', ParseIntPipe) userId: number,
        @Param('itemId', ParseIntPipe) itemId: number
    ) {
        return this.carrinhoService.removeItem(userId, itemId);
    }

    @Delete(':userId/clear')
    @ApiOperation({ summary: 'Remove todos os itens do carrinho' })
    clear(@Param('userId', ParseIntPipe) userId: number) {
        return this.carrinhoService.clear(userId);
    }
}
