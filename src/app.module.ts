import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './common/database/database.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,   // no need to import ConfigModule in every feature module
      envFilePath: '.env',
    }),
    DatabaseModule,
  ],
})
export class AppModule {}