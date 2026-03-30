import { Injectable } from '@nestjs/common';
import { DishRepository } from '../repositories/dish.repository';
import { AiService } from '../../ai/services/ai.service';
import { CreateDishDto } from '../dto/create-dish.dto';
import { DishNotFoundException } from '../../../common/exceptions/dish-not-found.exception';


@Injectable()
export class DishService {
  constructor(
    private readonly dishRepository: DishRepository,
    private readonly aiService: AiService,
) {}
  
  async create(dto: CreateDishDto) {
    const { ingredients } = await this.aiService.getIngredients(dto.name);
    return this.dishRepository.create(dto, ingredients);
  }

  async findAll() {
    return this.dishRepository.findAll();
  }

  async findById(id: string) {
    const dish = await this.dishRepository.findById(id);
    if (!dish) throw new DishNotFoundException(id);
    return dish;
  }
}