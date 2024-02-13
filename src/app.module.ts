import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { defineConfig, EntityManager } from '@mikro-orm/mysql';
import { TestEntity } from './TestEntity';
import type { MikroOrmModuleSyncOptions } from '@mikro-orm/nestjs/typings';
import { WinstonModule } from "nest-winston";
import { format, transports } from "winston";

const cfg = defineConfig({
  entities: [TestEntity],
  user: 'root',
  host: '127.0.0.1',
  password: 'jays1234',
  dbName: 'jays_test',
  baseDir: __dirname,
});
const dbConfig: MikroOrmModuleSyncOptions = {
  ...cfg,
  registerRequestContext: true,
};

@Module({
  imports: [
    MikroOrmModule.forRoot(dbConfig),
    MikroOrmModule.forFeature([TestEntity]),
    WinstonModule.forRoot({
      transports: [
        // new transports.Console({
        //   level: 'debug',
        //   format: format.json(),
        // }),
        new transports.File({
          level: 'debug',
          filename: 'out.log',
        }),
      ],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly em: EntityManager) {}
  async onModuleInit() {
    const driver = this.em.getDriver();
    const schemaGenerator = this.em.getPlatform().getSchemaGenerator(driver);
    await schemaGenerator.dropSchema();
    await schemaGenerator.updateSchema();
  }
}
