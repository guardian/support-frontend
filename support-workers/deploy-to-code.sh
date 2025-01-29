S3_BUCKET="membership-dist"
S3_KEY="support/CODE/support-workers-typescript/support-workers.zip"
aws s3 cp target/support-workers.zip s3://$S3_BUCKET/$S3_KEY --profile membership
LAMBDA_FUNCTIONS=(
  "-CreatePaymentMethodLambda-"
)

aws s3 cp target/support-workers.zip s3://$S3_BUCKET/$S3_KEY --profile membership

for function in "${LAMBDA_FUNCTIONS[@]}"; do
  echo "Updating $function..."
  aws lambda update-function-code --function-name support${function}CODE --s3-bucket $S3_BUCKET --s3-key $S3_KEY --profile membership --region eu-west-1
  echo "Finished updating $function"
done
