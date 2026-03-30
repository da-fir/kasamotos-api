import { Controller, Post, Get, Param, Body, Version } from '@nestjs/common';
import { DishService } from '../services/dish.service';
import { CreateDishDto } from '../dto/create-dish.dto';

@Controller({ path: 'dishes', version: '1' })
export class DishController {
  constructor(private readonly dishService: DishService) {}

  @Post()
  create(@Body() dto: CreateDishDto) {
    return this.dishService.create(dto);
  }

  @Get()
  findAll() {
    return this.dishService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.dishService.findById(id);
  }
}