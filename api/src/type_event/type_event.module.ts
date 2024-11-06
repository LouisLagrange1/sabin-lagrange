import { Module } from '@nestjs/common';
import { TypeEventService } from './type_event.service';
import { TypeEventController } from './type_event.controller';

@Module({
  controllers: [TypeEventController],
  providers: [TypeEventService],
})
export class TypeEventModule {}
