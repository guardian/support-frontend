all:
	zip -r ../support-logs-retention-lambda.zip . > /dev/null
clean:
	ls | grep -v -E 'cfn.yaml|Makefile|riff-raff.yaml|configure|lambda_function.py' | xargs rm -rf
