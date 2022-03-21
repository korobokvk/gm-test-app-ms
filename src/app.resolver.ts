import { Logger } from '@nestjs/common';
import { Args, Int, Mutation, Resolver, Query } from '@nestjs/graphql';
import { GraphQLUpload, FileUpload } from 'graphql-upload';
import { AppService } from './app.service';

@Resolver()
export class AppResolver {
  private log = new Logger(AppResolver.name);

  constructor(private readonly appService: AppService) {}

  @Mutation(() => String, { name: 'uploadFile', nullable: true })
  async uploadFile(
    @Args('files', { type: () => [GraphQLUpload] }) files: FileUpload[],
  ): Promise<void> {
    this.log.log(files);
    this.appService.uploadFiles(files);
  }

  @Query(() => String)
  getHello() {
    return 'Hello';
  }
}
