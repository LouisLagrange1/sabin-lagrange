import { Injectable } from '@nestjs/common';
import { CreateTypeEventDto } from './dto/create-type_event.dto';
import { UpdateTypeEventDto } from './dto/update-type_event.dto';

@Injectable()
export class TypeEventService {
  create(createTypeEventDto: CreateTypeEventDto) {
    return 'This action adds a new typeEvent';
  }

  findAll() {
    return `This action returns all typeEvent`;
  }

  findOne(id: number) {
    return `This action returns a #${id} typeEvent`;
  }

  update(id: number, updateTypeEventDto: UpdateTypeEventDto) {
    return `This action updates a #${id} typeEvent`;
  }

  remove(id: number) {
    return `This action removes a #${id} typeEvent`;
  }
}
