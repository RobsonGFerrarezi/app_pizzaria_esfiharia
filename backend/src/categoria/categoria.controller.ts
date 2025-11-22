import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    ParseIntPipe,
    HttpCode,
    HttpStatus
} from '@nestjs/common';
import { CategoriaService } from './categoria.service';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Categorias')
@Controller('categoria')
export class CategoriaController {
    constructor(private readonly categoriaService: CategoriaService) { }

    @Post()
    @ApiOperation({ summary: 'Cria uma nova categoria.' })
    create(@Body() data: CreateCategoriaDto) {
        return this.categoriaService.create(data);
    }

    @Get()
    @ApiOperation({ summary: 'Lista todas as categorias.' })
    findAll() {
        return this.categoriaService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Busca uma categoria por ID.' })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.categoriaService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Edita uma categoria por ID.' })
    update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateCategoriaDto) {
        return this.categoriaService.update(id, data);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Deleta uma categoria por ID.' })
    @HttpCode(HttpStatus.OK) // Seguindo seu padrão do ProductController
    delete(@Param('id', ParseIntPipe) id: number) {
        return this.categoriaService.delete(id);
    }
}