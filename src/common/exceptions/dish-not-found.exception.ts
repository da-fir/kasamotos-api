import { NotFoundException } from '@nestjs/common';

export class DishNotFoundException extends NotFoundException {
  constructor(id: string) {
    super({
      code: 'DISH_NOT_FOUND',
      message: `Dish with id ${id} not found`,
    });
  }
}