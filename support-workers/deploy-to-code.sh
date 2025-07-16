S3_BUCKET="membership-dist"
S3_KEY="support/CODE/support-workers-typescript/support-workers.zip"
LAMBDA_FUNCTIONS=(
  "CreatePaymentMethodLambda"
  "CreateSalesforceContactLambda"
)
echo "Uploading target/typescript/support-workers.zip to S3 (to update the zipfile before upload use the yarn deploy-to-code command)"
aws s3 cp target/typescript/support-workers.zip s3://$S3_BUCKET/$S3_KEY --profile membership

for function in "${LAMBDA_FUNCTIONS[@]}"; do
  echo "Updating $function..."
  aws lambda update-function-code --function-name support-${function}-CODE --s3-bucket $S3_BUCKET --s3-key $S3_KEY --profile membership --region eu-west-1
  echo "Finished updating $function"
done
