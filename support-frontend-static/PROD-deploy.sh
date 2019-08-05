# Run this file to deploy the bucket

aws cloudformation deploy \
    --profile membership \
    --stack-name support-PROD-frontend-static \
    --template-file cfn.yaml \
    --region eu-west-1 \
    --tags App=frontend-static Stage=PROD Stack=support
