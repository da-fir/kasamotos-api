import { Test, TestingModule } from '@nestjs/testing';
import { DishService } from './dish.service';
import { DishRepository } from '../repositories/dish.repository';
import { AiService } from '../../ai/services/ai.service';
import { DishNotFoundException } from '../../../common/exceptions/dish-not-found.exception';

const mockDishRepository = {
  create: jest.fn(),
  findAll: jest.fn(),
  findById: jest.fn(),
  findByName: jest.fn(),
};

const mockAiService = {
  getIngredients: jest.fn(),
};

describe('DishService', () => {
  let service: DishService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DishService,
        { provide: DishRepository, useValue: mockDishRepository },
        { provide: AiService, useValue: mockAiService },
      ],
    }).compile();

    service = module.get<DishService>(DishService);

    // reset mocks before each test
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should call AiService and save dish', async () => {
      const dto = { name: 'Nasi Goreng' };
      const normalizedName = 'nasi goreng'; // ← normalized
      const ingredients = ['rice', 'egg', 'soy sauce'];
      const savedDish = { id: 'uuid', name: normalizedName, ingredients };
    
      mockDishRepository.findByName.mockResolvedValue(null); // ← not cached
      mockAiService.getIngredients.mockResolvedValue({ ingredients });
      mockDishRepository.create.mockResolvedValue(savedDish);
    
      const result = await service.create(dto);
    
      expect(mockAiService.getIngredients).toHaveBeenCalledWith(normalizedName);
      expect(mockDishRepository.create).toHaveBeenCalledWith(
        { name: normalizedName },
        ingredients,
      );
      expect(result).toEqual(savedDish);
    });

    it('should throw AiServiceException when Gemini fails', async () => {
      mockAiService.getIngredients.mockRejectedValue(
        new Error('Gemini failed'),
      );

      await expect(service.create({ name: 'Sushi' })).rejects.toThrow();
      expect(mockDishRepository.create).not.toHaveBeenCalled();
    });

    it('should return cached dish without calling AI', async () => {
      const dto = { name: 'sushi' };
      const cachedDish = {
        id: 'uuid',
        name: 'sushi',
        ingredients: ['rice', 'fish'],
      };
  
      mockDishRepository.findByName = jest.fn().mockResolvedValue(cachedDish);
  
      const result = await service.create(dto);
  
      expect(mockAiService.getIngredients).not.toHaveBeenCalled();
      expect(mockDishRepository.create).not.toHaveBeenCalled();
      expect(result).toEqual(cachedDish);
    });
  });

  describe('findById', () => {
    it('should return dish when found', async () => {
      const dish = { id: 'uuid', name: 'Sushi', ingredients: [] };
      mockDishRepository.findById.mockResolvedValue(dish);

      const result = await service.findById('uuid');
      expect(result).toEqual(dish);
    });

    it('should throw DishNotFoundException when not found', async () => {
      mockDishRepository.findById.mockResolvedValue(null);

      await expect(service.findById('bad-id')).rejects.toThrow(
        DishNotFoundException,
      );
    });
  });

  describe('findAll', () => {
    it('should return array of dishes', async () => {
      const dishes = [{ id: 'uuid', name: 'Sushi', ingredients: [] }];
      mockDishRepository.findAll.mockResolvedValue(dishes);

      const result = await service.findAll();
      expect(result).toEqual(dishes);
    });

    it('should return empty array when no dishes', async () => {
      mockDishRepository.findAll.mockResolvedValue([]);

      const result = await service.findAll();
      expect(result).toHaveLength(0);
    });
  });
});