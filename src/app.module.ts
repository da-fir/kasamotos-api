import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,   // no need to import ConfigModule in every feature module
      envFilePath: '.env',
    }),
  ],
})
export class AppModule {}