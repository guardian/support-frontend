# aws s3 rm s3://supporter-product-data-export-prod/ --recursive --profile membership
# aws cloudformation delete-stack --stack-name support-PROD-supporter-product-data
# aws cloudformation delete-stack --stack-name supporter-product-data-tables-PROD
aws cloudformation create-stack \
  --capabilities CAPABILITY_IAM  \
  --stack-name supporter-product-data-tables-CODE \
  --template-body file://dynamo-tables.yaml \
  --parameters  ParameterKey=Stage,ParameterValue=CODE
