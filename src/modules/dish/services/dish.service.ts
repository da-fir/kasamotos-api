import { Injectable } from '@nestjs/common';
import { DishRepository } from '../repositories/dish.repository';
import { CreateDishDto } from '../dto/create-dish.dto';

@Injectable()
export class DishService {
  constructor(private readonly dishRepository: DishRepository) {}

  async create(dto: CreateDishDto) {
    // hardcoded for now — AI replaces this in Step 6
    const ingredients = ['ingredient 1', 'ingredient 2', 'ingredient 3'];
    return this.dishRepository.create(dto, ingredients);
  }

  async findAll() {
    return this.dishRepository.findAll();
  }

  async findById(id: string) {
    return this.dishRepository.findById(id);
  }
}