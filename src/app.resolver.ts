import { Args, Int, Mutation, Resolver, Query } from '@nestjs/graphql';
import { GraphQLUpload, FileUpload } from 'graphql-upload';
import { AppService } from './app.service';

@Resolver()
export class AppResolver {
  constructor(private readonly appService: AppService) {}

  @Mutation(() => String, { name: 'uploadFile', nullable: true })
  async uploadFile(
    @Args('file', { type: () => [GraphQLUpload] }) file: FileUpload[],
  ): Promise<void> {
    this.appService.uploadFiles(file);
  }

  @Query(() => String)
  getHello() {
    return 'Hello';
  }
}
