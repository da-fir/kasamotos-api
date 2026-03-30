import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { AiIngredientsResponseDto } from '../dto/ai-response.dto';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly genAI: GoogleGenerativeAI;

  constructor(private readonly configService: ConfigService) {
    this.genAI = new GoogleGenerativeAI(
      this.configService.get<string>('GEMINI_API_KEY'),
    );
  }

  async getIngredients(dishName: string): Promise<AiIngredientsResponseDto> {
    try {
      const model = this.genAI.getGenerativeModel({
        model: 'gemini-3-flash-preview',
      });

      const prompt = `
        List the typical ingredients for "${dishName}".
        Respond ONLY with a valid JSON object in this exact format:
        {"ingredients": ["ingredient1", "ingredient2", "ingredient3"]}
        No explanation, no markdown, just the JSON object.
      `;

      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();

      const parsed = JSON.parse(text) as AiIngredientsResponseDto;
      return parsed;
    } catch (error) {
      this.logger.error(`Failed to get ingredients for ${dishName}`, error);
      throw error;
    }
  }
}