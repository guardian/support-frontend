import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { defaultProvider } from "@aws-sdk/credential-provider-node";
import type { Stage } from "../model/stage";

const bucketNameForStage = (stage: Stage): string =>
  `supporter-product-data-export-${stage.toLowerCase()}`;

export class S3Service {
  constructor(
    private readonly s3Client = new S3Client({
      region: "eu-west-1",
      credentials: defaultProvider(),
    })
  ) {}

  async streamToS3(
    stage: Stage,
    filename: string,
    body: Uint8Array,
    length: number
  ): Promise<void> {
    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: bucketNameForStage(stage),
        Key: filename,
        Body: body,
        ContentLength: length,
      })
    );
  }
}
