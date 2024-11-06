import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TypeEventService } from './type_event.service';
import { CreateTypeEventDto } from './dto/create-type_event.dto';
import { UpdateTypeEventDto } from './dto/update-type_event.dto';

@Controller('type-event')
export class TypeEventController {
  constructor(private readonly typeEventService: TypeEventService) {}

  @Post()
  create(@Body() createTypeEventDto: CreateTypeEventDto) {
    return this.typeEventService.create(createTypeEventDto);
  }

  @Get()
  findAll() {
    return this.typeEventService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.typeEventService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTypeEventDto: UpdateTypeEventDto) {
    return this.typeEventService.update(+id, updateTypeEventDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.typeEventService.remove(+id);
  }
}
