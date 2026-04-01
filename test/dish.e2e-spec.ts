import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe, VersioningType } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/common/database/prisma.service';
import { AiService } from '../src/modules/ai/services/ai.service';
import { ResponseInterceptor } from '../src/common/interceptors/response.interceptor';
import { GlobalExceptionFilter } from '../src/common/filters/http-exception.filter';
import { LoggerService } from '../src/common/logger/logger.service';

const mockAiService = {
  getIngredients: jest.fn().mockResolvedValue({
    ingredients: ['rice', 'egg', 'soy sauce'],
  }),
};

const mockPrismaService = {
  dish: {
    create: jest.fn().mockResolvedValue({
      id: 'test-uuid',
      name: 'Nasi Goreng',
      ingredients: ['rice', 'egg', 'soy sauce'],
      createdAt: new Date(),
    }),
    findMany: jest.fn().mockResolvedValue([]),
    findUnique: jest.fn().mockResolvedValue(null),
  },
  $connect: jest.fn(),
};

describe('Dish (e2e)', () => {
  let app: INestApplication;
  let logger: LoggerService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrismaService)
      .overrideProvider(AiService)
      .useValue(mockAiService)
      .compile();

    app = moduleFixture.createNestApplication();
    logger = app.get(LoggerService);

    app.setGlobalPrefix('api');
    app.enableVersioning({ type: VersioningType.URI });
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    app.useGlobalInterceptors(new ResponseInterceptor());
    app.useGlobalFilters(new GlobalExceptionFilter(logger));

    await app.init();
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /api/v1/dishes', () => {
    it('should create dish and return standard response', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/dishes')
        .send({ name: 'Nasi Goreng' })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data).toHaveProperty('name', 'Nasi Goreng');
      expect(response.body.data).toHaveProperty('ingredients');
      expect(response.body).toHaveProperty('timestamp');
    });

    it('should return 400 when name is empty', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/dishes')
        .send({ name: '' })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toHaveProperty('code');
    });

    it('should return 400 when body is missing', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/dishes')
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/v1/dishes', () => {
    it('should return standard response with array', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/dishes')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('GET /api/v1/dishes/:id', () => {
    it('should return 404 for unknown id', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/dishes/non-existent-id')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('DISH_NOT_FOUND');
    });
  });
});