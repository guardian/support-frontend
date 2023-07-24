# aws s3 rm s3://supporter-product-data-export-code/ --recursive --profile membership
# aws cloudformation delete-stack --stack-name support-CODE-supporter-product-data
# aws cloudformation delete-stack --stack-name supporter-product-data-tables-CODE
aws cloudformation update-stack \
  --capabilities CAPABILITY_AUTO_EXPAND CAPABILITY_NAMED_IAM CAPABILITY_IAM  \
  --stack-name support-CODE-supporter-product-data \
  --template-body file://cfn.yaml \
  --parameters  ParameterKey=Stage,ParameterValue=CODE \
  > /dev/null
