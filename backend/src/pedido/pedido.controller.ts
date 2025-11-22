import { 
    Controller, 
    Post, 
    Get, 
    Patch, 
    Param, 
    ParseIntPipe, 
    Body 
} from '@nestjs/common';
import { PedidoService } from './pedido.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdatePedidoStatusDto } from './dto/update-pedido-status.dto';

@ApiTags('Pedidos')
@Controller('pedido')
export class PedidoController {

    constructor(private readonly pedidoService: PedidoService) {}

    @Post(':userId')
    @ApiOperation({ summary: 'Cria um novo pedido a partir do carrinho do usuário.' })
    create(@Param('userId', ParseIntPipe) userId: number) {
        return this.pedidoService.create(userId);
    }

    @Get(':userId')
    @ApiOperation({ summary: 'Lista todos os pedidos de um usuário.' })
    findAllByUser(@Param('userId', ParseIntPipe) userId: number) {
        return this.pedidoService.findAllByUser(userId);
    }

    @Get(':userId/:pedidoId')
    @ApiOperation({ summary: 'Busca um pedido específico de um usuário.' })
    findOne(
        @Param('userId', ParseIntPipe) userId: number,
        @Param('pedidoId', ParseIntPipe) pedidoId: number
    ) {
        return this.pedidoService.findOne(pedidoId, userId);
    }

    @Patch(':pedidoId/status')
    @ApiOperation({ summary: 'Atualiza o status de um pedido (Admin).' })
    updateStatus(
        @Param('pedidoId', ParseIntPipe) pedidoId: number,
        @Body() data: UpdatePedidoStatusDto
    ) {
        return this.pedidoService.updateStatus(pedidoId, data);
    }
}