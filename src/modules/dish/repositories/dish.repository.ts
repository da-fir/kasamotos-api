import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../common/database/prisma.service';
import { CreateDishDto } from '../dto/create-dish.dto';

@Injectable()
export class DishRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateDishDto, ingredients: string[]) {
    return this.prisma.dish.create({
      data: {
        name: dto.name,
        ingredients,
      },
    });
  }

  async findAll() {
    return this.prisma.dish.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    return this.prisma.dish.findUnique({
      where: { id },
    });
  }
}