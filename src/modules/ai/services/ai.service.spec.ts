import { Test, TestingModule } from '@nestjs/testing';
import { AiService } from './ai.service';
import { ConfigService } from '@nestjs/config';
import { AiServiceException } from '../../../common/exceptions/ai-service.exception';

const mockConfigService = {
  get: jest.fn().mockReturnValue('fake-gemini-key'),
};

const mockModel = {
  generateContent: jest.fn(),
};

const mockGenAI = {
  getGenerativeModel: jest.fn().mockReturnValue(mockModel),
};

jest.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: jest.fn().mockImplementation(() => mockGenAI),
}));

describe('AiService', () => {
  let service: AiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AiService,
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<AiService>(AiService);
    jest.clearAllMocks();
  });

  describe('getIngredients', () => {
    it('should return parsed ingredients from Gemini', async () => {
      const mockResponse = {
        response: {
          text: () =>
            JSON.stringify({ ingredients: ['rice', 'egg', 'soy sauce'] }),
        },
      };

      mockModel.generateContent.mockResolvedValue(mockResponse);

      const result = await service.getIngredients('Nasi Goreng');

      expect(result).toEqual({
        ingredients: ['rice', 'egg', 'soy sauce'],
      });
      expect(mockModel.generateContent).toHaveBeenCalledTimes(1);
    });

    it('should throw AiServiceException when Gemini fails', async () => {
      mockModel.generateContent.mockRejectedValue(new Error('API Error'));

      await expect(service.getIngredients('Sushi')).rejects.toThrow(
        AiServiceException,
      );
    });

    it('should throw AiServiceException when response is invalid JSON', async () => {
      const mockResponse = {
        response: {
          text: () => 'not valid json',
        },
      };

      mockModel.generateContent.mockResolvedValue(mockResponse);

      await expect(service.getIngredients('Sushi')).rejects.toThrow(
        AiServiceException,
      );
    });
  });
});