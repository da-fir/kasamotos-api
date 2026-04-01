import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../common/database/prisma.service';
import { CreateDishDto } from '../dto/create-dish.dto';
import { Prisma } from '@prisma/client';
import { ConflictException } from '@nestjs/common';

@Injectable()
export class DishRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateDishDto, ingredients: string[]) {
    try {
      return await this.prisma.dish.create({
        data: {
          name: dto.name,
          ingredients,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          // Race condition — dish was created between our check and insert
          // Just return the existing one
          return this.findByName(dto.name);
        }
      }
      throw error;
    }
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

  async findByName(name: string) {
    return this.prisma.dish.findUnique({
      where: { name },
    });
  }
}