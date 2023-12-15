# acquisitions-firehose-transformer
This project contains a lambda which acts as a [transformer](https://docs.aws.amazon.com/firehose/latest/dev/data-transformation.html)
for the `acquisitions-firehose-{STAGE}` Kinesis Data Firehose.

The source of this Data Firehose is the `acquisitions-stream-{STAGE}` Kinesis data stream and the destination is an S3 bucket.

The data is then used to drive the epic super mode and tickers.

Both streams are defined in the [contributions-platform](https://github.com/guardian/contributions-platform) repository

