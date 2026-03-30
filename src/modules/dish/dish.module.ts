import { Module } from '@nestjs/common';
import { DishController } from './controllers/dish.controller';
import { DishService } from './services/dish.service';
import { DishRepository } from './repositories/dish.repository';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [AiModule],
  controllers: [DishController],
  providers: [DishService, DishRepository],
})
export class DishModule {}