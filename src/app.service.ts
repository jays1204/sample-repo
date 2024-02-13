import { Inject, Injectable, Logger } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/mysql';
import { TestEntity } from './TestEntity';
import Redis from 'ioredis';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Injectable()
export class AppService {
  private readonly redis;
  constructor(
    private readonly em: EntityManager,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {
    this.redis = new Redis();
  }

  async getHello(): Promise<string> {
    this.logger.log('debug', 'Hello World');
    this.logger.error('this is error!!');

    this.logger.verbose('before redis');
    await this.redis.set('aaa', 1, 'ex', 10);
    const val = await this.redis.get('aaa');
    this.logger.verbose('after redis', val);

    this.logger.verbose('before mysql');
    const list = await this.em.findByCursor(
      TestEntity,
      {},
      {
        first: 10,
        orderBy: { id: 'desc' },
      },
    );
    this.logger.verbose('after mysql', list);
    return 'Hello World!';
  }
}
