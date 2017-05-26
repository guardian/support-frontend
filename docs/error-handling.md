# Support workers - Error handling

One of the main benefits of Step functions is the flexibility it gives us in dealing with error conditions. For any error we encounter we have two ways of dealing with it:

* Retry - For failures where we believe that the cause may be temporary step functions allow us to simply retry with a back off and, optionally, a maximum number of retries.

* Fallback - For permanent failures we can catch the exception and pass it to a fallback state which should then log the error and notify developers and the user that their payment has failed.

This means that we now need to do a bit more analysis of the error conditions our app is likely to encounter to group them into those which can be retried and those
which are permanent failures. The rest of this document is an attempt to do that analysis for the Monthly contributions step function

## Logging
Most errors should be logged to Sentry so they can be investigated. Errors which probably don't need to be logged in Sentry and can just be logged in Cloudwatch are transient ones such as timeouts, and Stripe card errors/

## Types of errors

### General errors

<table>
  <tr>
    <td>Error type</td>
    <td>Description</td>
    <td>Retry?</td>
    <td>Max retries?</td>
  </tr>
  <tr>
    <td>Input parsing errors</td>
    <td>Errors caused by invalid input JSON</td>
    <td>N</td>
    <td></td>
  </tr>
  <tr>
    <td>Service timeouts</td>
    <td>Any http timeout from a 3rd party service</td>
    <td>Y</td>
    <td></td>
  </tr>
  <tr>
    <td>Service 500s</td>
    <td>Any 500 result code from a 3rd party service</td>
    <td>Y</td>
    <td></td>
  </tr>
  <tr>
    <td>Unknown error</td>
    <td>Any unhandled exception thrown during execution</td>
    <td>Y?</td>
    <td>1</td>
  </tr>
</table>


## Service specific errors

### Stripe

[Error docs](https://stripe.com/docs/api#errors)

<table>
  <tr>
    <td>Error type</td>
    <td>Description</td>
    <td>Retry?</td>
    <td>Max retries?</td>
  </tr>
  <tr>
    <td>api_connection_error</td>
    <td>Failure to connect to Stripe's API.</td>
    <td>Y</td>
    <td></td>
  </tr>
  <tr>
    <td>api_error</td>
    <td>API errors cover any other type of problem (e.g., a temporary problem with Stripe's servers) and are extremely uncommon.</td>
    <td>Y</td>
    <td></td>
  </tr>
  <tr>
    <td>authentication_error</td>
    <td>Failure to properly authenticate yourself in the request.</td>
    <td>Y?</td>
    <td></td>
  </tr>
  <tr>
    <td>card_error*</td>
    <td>Card errors are the most common type of error you should expect to handle. They result when the user enters a card that can't be charged for some reason.</td>
    <td>N</td>
    <td></td>
  </tr>
  <tr>
    <td>invalid_request_error</td>
    <td>Invalid request errors arise when your request has invalid parameters.</td>
    <td>N</td>
    <td></td>
  </tr>
  <tr>
    <td>rate_limit_error</td>
    <td>Too many requests hit the API too quickly.</td>
    <td>Y</td>
    <td></td>
  </tr>
  <tr>
    <td>validation_error</td>
    <td>Errors triggered by our client-side libraries when failing to validate fields (e.g., when a card number or expiration date is invalid or incomplete).</td>
    <td>N</td>
    <td></td>
  </tr>
</table>

### AWS Encryption
<table>
  <tr>
    <td>Error</td>
    <td>Description</td>
    <td>Retry?</td>
    <td>Max retries </td>
  </tr>
  <tr>
    <td>NotFoundException</td>
    <td>The request was rejected because the specified entity or resource could not be found.</td>
    <td>Y?</td>
    <td></td>
  </tr>
  <tr>
    <td>DisabledException</td>
    <td>The request was rejected because the specified CMK is not enabled.</td>
    <td>Y</td>
    <td></td>
  </tr>
  <tr>
    <td>KeyUnavailableException</td>
    <td>The request was rejected because the specified CMK was not available. The request can be retried.</td>
    <td>Y</td>
    <td></td>
  </tr>
  <tr>
    <td>DependencyTimeoutException</td>
    <td>The system timed out while trying to fulfill the request. The request can be retried.</td>
    <td>Y</td>
    <td></td>
  </tr>
  <tr>
    <td>InvalidKeyUsageException</td>
    <td>The request was rejected because the specified KeySpec value is not valid.</td>
    <td>N</td>
    <td></td>
  </tr>
  <tr>
    <td>InvalidGrantTokenException</td>
    <td>The request was rejected because the specified grant token is not valid.</td>
    <td>N</td>
    <td></td>
  </tr>
  <tr>
    <td>KMSInternalException</td>
    <td>The request was rejected because an internal exception occurred. The request can be retried.</td>
    <td>Y</td>
    <td></td>
  </tr>
  <tr>
    <td>KMSInvalidStateException</td>
    <td>The request was rejected because the state of the specified resource is not valid for this request.</td>
    <td>Y</td>
    <td></td>
  </tr>
</table>


### Zuora

[Error docs](https://knowledgecenter.zuora.com/DC_Developers/C_REST_API/A_REST_basics/3_Responses_and_errors)

It’s hard to get exact details of what errors Zuora might throw but there are general categories which we can get by taking the last 2 character of the error code

<table>
  <tr>
    <td>Code</td>
    <td>Category</td>
    <td>Retry?</td>
    <td>Max retries</td>
  </tr>
  <tr>
    <td>00</td>
    <td>Unknown</td>
    <td>Y</td>
    <td>3 (got to be worth retrying here?)</td>
  </tr>
  <tr>
    <td>10</td>
    <td>Permission or access denied</td>
    <td>N</td>
    <td></td>
  </tr>
</tr>
  <tr>
    <td>11</td>
    <td>Authentication failed</td>
    <td>N</td>
    <td></td>
  </tr>
</tr>
  <tr>
    <td>20</td>
    <td>Invalid format or value</td>
    <td>N</td>
    <td></td>
  </tr>
</tr>
  <tr>
    <td>21</td>
    <td>Unknown field in request</td>
    <td>N</td>
    <td></td>
  </tr>
</tr>
  <tr>
    <td>22</td>
    <td>Missing required field</td>
    <td>N</td>
    <td></td>
  </tr>
</tr>
  <tr>
    <td>30</td>
    <td>Rule restriction</td>
    <td>N</td>
    <td></td>
  </tr>
</tr>
  <tr>
    <td>40</td>
    <td>Not found</td>
    <td>Y</td>
    <td>2</td>
  </tr>
</tr>
  <tr>
    <td>50</td>
    <td>Locking contention</td>
    <td>Y</td>
    <td>5</td>
  </tr>
</tr>
  <tr>
    <td>60</td>
    <td>Internal error</td>
    <td>Y</td>
    <td></td>
  </tr>
</tr>
  <tr>
    <td>70</td>
    <td>Request exceeded limit</td>
    <td>Y</td>
    <td></td>
  </tr>
</tr>
  <tr>
    <td>90</td>
    <td>Malformed request</td>
    <td>N</td>
    <td></td>
  </tr>
</tr>
  <tr>
    <td>99</td>
    <td>Extension error</td>
    <td>N</td>
    <td></td>
  </tr>
</tr>
</table>


### Salesforce

[Error docs](https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/errorcodes.htm)

Again, hard to get specific error codes for the request we are using as it seems it is a custom endpoint built using [Apex Rest](https://developer.salesforce.com/page/Creating_REST_APIs_using_Apex_REST)

General codes are here:

<table>
  <tr>
    <td>HTTP Response code</td>
    <td></td>
    <td>Retry</td>
    <td>Max retries</td>
  </tr>
  <tr>
    <td>400</td>
    <td>The request couldn’t be understood, usually because the JSON or XML body contains an error.</td>
    <td>N</td>
    <td></td>
  </tr>
  <tr>
    <td>401</td>
    <td>The session ID or OAuth token used has expired or is invalid</td>
    <td>Y</td>
    <td></td>
  </tr>
  <tr>
    <td>403</td>
    <td>The request has been refused. Verify that the logged-in user has appropriate permissions.</td>
    <td>N</td>
    <td></td>
  </tr>
  <tr>
    <td>404</td>
    <td>The requested resource couldn’t be found. Check the URI for errors, and verify that there are no sharing issues.</td>
    <td>N</td>
    <td></td>
  </tr>
  <tr>
    <td>405</td>
    <td>The method specified in the Request-Line isn’t allowed for the resource specified in the URI.</td>
    <td>N</td>
    <td></td>
  </tr>
  <tr>
    <td>415</td>
    <td>The entity in the request is in a format that’s not supported by the specified method.</td>
    <td>N</td>
    <td></td>
  </tr>
</table>

### PayPal
No request specific error codes as we are only retrieving the user's email address.
