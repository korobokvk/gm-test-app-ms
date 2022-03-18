import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import * as AWS from 'aws-sdk';
import { ConfigService } from '@nestjs/config';

type FileResultT = {
  filename: string;
  mimetype: string;
  createReadStream: () => any;
};

enum UploadStatuses {
  SUCCESS = 'Fulfilled',
  ERROR = 'Rejected',
}

@Injectable()
export class AppService {
  private AWS_KEY: string;
  private AWS_SECRET: string;
  private s3;
  private log = new Logger(AppService.name);

  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {
    this.AWS_KEY = this.configService.get('AWS_KEY');
    this.AWS_SECRET = this.configService.get('AWS_SECRET');

    this.s3 = new AWS.S3({
      credentials: {
        accessKeyId: this.AWS_KEY,
        secretAccessKey: this.AWS_SECRET,
      },
    });
  }

  async uploadFiles(files) {
    const filesResolved = await Promise.allSettled<FileResultT[]>(files);
    const fileUploadResult = [];

    filesResolved.forEach(async (file, index) => {
      if (file.status === 'fulfilled') {
        const { createReadStream, mimetype, filename } = file.value;
        const result = await this.s3_upload(
          createReadStream(),
          filename,
          mimetype,
        );

        if (result) {
          fileUploadResult.push(result);
        }

        if (fileUploadResult.length === files.length && !index) {
          this.sendStatus(UploadStatuses.SUCCESS).subscribe((data) =>
            this.log.log(data.data),
          );
        }

        if (!index && fileUploadResult.length !== files.length) {
          this.sendStatus(UploadStatuses.ERROR).subscribe((data) =>
            this.log.log(data.data),
          );
        }
      }
    });
  }

  private sendStatus(status: UploadStatuses) {
    return this.httpService.post(
      process.env.CLIENT_SERVICE_URL,
      JSON.stringify({
        query: `mutation {\n  getStatus(status: "${status}")\n}`,
      }),
      { headers: { 'Content-Type': 'application/json' } },
    );
  }

  private async s3_upload(file, name, mimetype) {
    const params = {
      Bucket: process.env.AWS_BUCKET,
      Key: String(name),
      Body: file,
      ContentType: mimetype,
      ContentDisposition: 'inline',
      CreateBucketConfiguration: {
        LocationConstraint: process.env.AWS_LOCATION,
      },
    };

    try {
      const s3Response = await this.s3.upload(params).promise();
      this.log.log(s3Response);
      return s3Response;
    } catch (e) {
      this.log.error(e);
    }
  }
}
