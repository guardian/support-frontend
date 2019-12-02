All step functions executions are logged to Elasticsearch to allow easy querying and analysis.

The way that this works is 
* We log the result of each lambda execution to CloudWatch as Json (see `LambdaExecutionResult.scala`)
* A CloudWatch subscription sends all log messages matching a particular filter to Elasticsearch (via the LogsToElasticsearch_support-elk-domain lambda. See `cloudWatchToElasticSearchLambda.js`) 
* Elasticsearch has a pipeline set up which extracts the Json into separate fields. This can be defined via the Kibana dev tools with the following request:

```
PUT _ingest/pipeline/extractJsonPipeline
{
    "description": "Extract the lambda execution json into separate fields",
    "processors": [
        {
            "grok": {
                "field": "@message",
                "patterns": [
                    "^.*\\$ - LambdaExecutionResult: (?<lambdaJson>.*)"
                ]
            }
        },
        {
            "json": {
                "field": "lambdaJson",
                "add_to_root": true
            }
        },
        {
            "remove": {
                "field": [
                    "lambdaJson",
                    "@message",
                    "@owner"
                ]
            }
        }
    ]
}
```
