# Run this file to test cloudformation in CODE

aws cloudformation deploy \
    --profile membership \
    --stack-name support-CODE-frontend \
    --template-file cfn.yaml \
    --region eu-west-1 \
    --capabilities CAPABILITY_IAM