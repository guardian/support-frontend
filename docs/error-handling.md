# Support workers - Error handling

One of the main benefits of Step functions is the flexibility it gives us in dealing with error conditions. For any error we encounter we have three ways of dealing with it:

* Unlimited Retry - For failures where we believe that the cause may be temporary step functions allow us to simply retry with a back off period.
* Limited Retry - For failures where we suspect that a retry may succeed but don't want to get stuck in an infinite retry loop if it doesn't, we can specify a maximum number of retries before the task fails permanently.
* Fallback - For permanent failures we can catch the exception and pass it to a fallback state which should then log the error and notify developers and the user that their payment has failed.

This means that we now need to do a bit more analysis of the error conditions our app is likely to encounter to group them into those which can be retried and those
which are permanent failures. The rest of this document is an attempt to do that analysis for the Monthly contributions step function

## Logging
Most errors should be logged to Sentry so they can be investigated. However transient ones such as timeouts probably don't need to be logged in Sentry and can just be logged in Cloudwatch. This is also the case for Stripe card errors.

## Types of errors

### General errors

| Error type           | Description                                     | Retry?    |
|----------------------|-------------------------------------------------|-----------|
| Input parsing errors | Errors caused by invalid input JSON             | No        |
| Service timeouts     | Any http timeout from a 3rd party service       | Unlimited |
| Service 500s         | Any 500 result code from a 3rd party service    | Unlimited |
| Unknown error        | Any unhandled exception thrown during execution | Limited   |


## Service specific errors

### Stripe

[Error docs](https://stripe.com/docs/api#errors)

| Error type            | Description                                                                                                                                               | Retry?    |
|-----------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------|-----------|
| api_connection_error  | Failure to connect to Stripe's API.                                                                                                                       | Unlimited |
| api_error             | API errors cover any other type of problem (e.g., a temporary problem with Stripe's servers) and are extremely uncommon.                                  | Unlimited |
| rate_limit_error      | Too many requests hit the API too quickly.                                                                                                                | Unlimited |
| authentication_error  | Failure to properly authenticate yourself in the request.                                                                                                 | Limited   |
| card_error            | Card errors are the most common type of error you should expect to handle. They result when the user enters a card that can't be charged for some reason. | No        |
| invalid_request_error | Invalid request errors arise when your request has invalid parameters.                                                                                    | No        |
| validation_error      | Errors triggered by our client-side libraries when failing to validate fields (e.g., when a card number or expiration date is invalid or incomplete).     | No        |

### AWS Encryption
| Error                      | Description                                                                                         | Retry?    |
|----------------------------|-----------------------------------------------------------------------------------------------------|-----------|
| NotFoundException          | The request was rejected because the specified entity or resource could not be found.               | Limited   |
| DisabledException          | The request was rejected because the specified CMK is not enabled.                                  | Limited   |
| InvalidKeyUsageException   | The request was rejected because the specified KeySpec value is not valid.                          | Limited   |
| AWSKMSException            | Any other KMS exception, for instance expired creds.                                                | Limited   |
| KeyUnavailableException    | The request was rejected because the specified CMK was not available. The request can be retried.   | Unlimited |
| DependencyTimeoutException | The system timed out while trying to fulfill the request. The request can be retried.               | Unlimited |
| KMSInternalException       | The request was rejected because an internal exception occurred. The request can be retried.        | Unlimited |
| KMSInvalidStateException   | The request was rejected because the state of the specified resource is not valid for this request. | Unlimited |
| InvalidGrantTokenException | The request was rejected because the specified grant token is not valid.                            | No        |


### Zuora

[Error docs](https://knowledgecenter.zuora.com/DC_Developers/C_REST_API/A_REST_basics/3_Responses_and_errors) - note that the error json structure described on this page is incorrect as 
the api endpoint we call returns a different structure documented [here](https://www.zuora.com/developer/api-reference/#operation/Action_POSTsubscribe). Note that this returns a list of errors,
which are not yet included in the REST documentation, but can be found [here](https://knowledgecenter.zuora.com/DC_Developers/G_SOAP_API/L_Error_Handling/Errors#ErrorCode_Object). 

This is a fairly long list, and many don't seem to be particularly relevant to the API call(s) that we're making, so I have started by adding retries for the more obvious candidates:

| Code                   | Description                                                                                                                                                        | Retry?    |
|------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------|
| API_DISABLED           | The API was disabled                                                                                                                                               | Unlimited |
| LOCK_COMPETITION       | The operation failed from a lock competition. For example, a lock can occur when multiple client operations try to update an object at the same time. Retry later. | Unlimited |
| REQUEST_EXCEEDED_LIMIT | The total number of requests for the unit interval has exceeded the limit allowed by the system.                                                                   | Unlimited |  
| REQUEST_EXCEEDED_RATE  | The total number of concurrent requests has exceeded the limit allowed by the system. Please resubmit your request later.                                          | Unlimited |  
| SERVER_UNAVAILABLE     | The Zuora server wasn't available.                                                                                                                                 | Unlimited |
| UNKNOWN_ERROR          | There was an unknown error. No further details are available.                                                                                                      | Unlimited |  

Handling Zuora errors is made more complicated because the response may return a list of errors, meaning we need to decide how to deal with a mixture of fatal and non-fatal errors. 
In practice, the list never seems to contain more than one item, and if the response contains multiple errors, or an error which we don't think is safe to retry, we currently assume that the request will never succeed and fail at this point.

### Salesforce

[Error docs](https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/errorcodes.htm)

Again, hard to get specific error codes for the request we are using as it seems it is a custom endpoint built using [Apex Rest](https://developer.salesforce.com/page/Creating_REST_APIs_using_Apex_REST)

General codes are here:

| HTTP Response code |                                                                                                                  | Retry?    |
|--------------------|------------------------------------------------------------------------------------------------------------------|-----------|
| 400                | The request couldn’t be understood, usually because the JSON or XML body contains an error.                      | No        |
| 401                | The session ID or OAuth token used has expired or is invalid                                                     | Unlimited |
| 403                | The request has been refused. Verify that the logged-in user has appropriate permissions.                        | No        |
| 404                | The requested resource couldn’t be found. Check the URI for errors, and verify that there are no sharing issues. | No        |
| 405                | The method specified in the Request-Line isn’t allowed for the resource specified in the URI.                    | No        |
| 415                | The entity in the request is in a format that’s not supported by the specified method.                           | No        |

### PayPal
No request specific error codes as we are only retrieving the user's email address. Just retry on 500s.

### SQS
|Error                     |Description                                             |Retry? |
|--------------------------|--------------------------------------------------------|-------|
|QueueDoesNotExistException|The queue referred to doesn't exist                     |Limited|
|InvalidMessageContents    |The message contains characters outside the allowed set.|No     |