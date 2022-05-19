# aws s3 rm s3://stripe-patrons-data-export-prod/ --recursive --profile membership
# aws cloudformation delete-stack --stack-name support-PROD-stripe-patrons-data
# aws cloudformation delete-stack --stack-name stripe-patrons-data-tables-PROD
aws cloudformation create-stack \
  --capabilities CAPABILITY_IAM  \
  --stack-name stripe-patrons-data-tables-PROD \
  --template-body file://dynamo-tables.yaml \
  --parameters  ParameterKey=Stage,ParameterValue=PROD
