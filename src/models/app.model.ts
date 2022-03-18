import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AppModel {
  @Field()
  url: string;
}
