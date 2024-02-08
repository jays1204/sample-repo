import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { defineConfig } from "@mikro-orm/sqlite";
import { TestEntity } from "./TestEntity";

const cfg = defineConfig({
  entities: [TestEntity],
  dbName: ':memory:',
  baseDir: __dirname,
});

@Module({
  imports: [
    MikroOrmModule.forRoot(cfg),
    MikroOrmModule.forFeature([TestEntity])
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
