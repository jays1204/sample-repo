import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/sqlite';
import { TestEntity } from './TestEntity';

@Injectable()
export class AppService {
  constructor(private readonly em: EntityManager) {}

  async getHello(): Promise<string> {
    const list = await this.em.findByCursor(
      TestEntity,
      {},
      {
        first: 10,
        orderBy: { id: 'desc' },
      },
    );
    return 'Hello World!';
  }
}
