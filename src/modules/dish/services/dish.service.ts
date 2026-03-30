import { Injectable } from '@nestjs/common';
import { DishRepository } from '../repositories/dish.repository';
import { AiService } from '../../ai/services/ai.service';
import { CreateDishDto } from '../dto/create-dish.dto';

@Injectable()
export class DishService {
  constructor(
    private readonly dishRepository: DishRepository,
    private readonly aiService: AiService,
) {}
  
s
  async create(dto: CreateDishDto) {
    const { ingredients } = await this.aiService.getIngredients(dto.name);
    return this.dishRepository.create(dto, ingredients);
  }

  async findAll() {
    return this.dishRepository.findAll();
  }

  async findById(id: string) {
    return this.dishRepository.findById(id);
  }
}