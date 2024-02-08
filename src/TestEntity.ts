import {  Entity, PrimaryKey, Property } from "@mikro-orm/core";

@Entity()
export class TestEntity {
  @PrimaryKey()
  id: number;

  @Property()
  columnA: string;
}