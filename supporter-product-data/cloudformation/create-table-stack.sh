#  aws cloudformation delete-stack --stack-name support-PROD-supporter-product-data
# aws cloudformation delete-stack --stack-name supporter-product-data-tables-PROD
aws cloudformation create-stack \
  --capabilities CAPABILITY_IAM  \
  --stack-name supporter-product-data-tables-PROD \
  --template-body file:///Users/rupert_bates/code/support-frontend/supporter-product-data/cloudformation/dynamo-tables.yaml \
  --parameters  ParameterKey=Stage,ParameterValue=PROD
