import { Module } from '@nestjs/common';
import { ShowsService } from './shows.service';
import { ShowsController } from './shows.controller';

@Module({
  controllers: [ShowsController],
  providers: [ShowsService]
})
export class ShowsModule {}
