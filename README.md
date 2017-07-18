This project helps unifies the config settings for [support-frontend](https://github.com/guardian/support-frontend) and
[support-workers](https://github.com/guardian/support-workers)

## Concepts

### Test users
Creating an identity user with [particular details](https://support.theguardian.com/test-users)
results in a 'test user' which can use test credit card details and a separate set of backend of systems (Zuora and Salesforce)
This works regardless of the runtime environment in which the test user is created, and allows us to test end to end
checkout flows in the production environment without having to use real payment methods and without cluttering up
production systems with test data.

In order to support this we have two closely related concepts Stage and TouchpointEnvironment which are described below.

### Stage
Stage represents a runtime environment for the applications which use this library,
 either on a local machine (DEV) or in AWS (CODE or PROD)

### Touchpoint Environment
TouchpointEnvironment represents a logical environment for our backend systems, mainly Zuora and Salesforce.
Environments are: SANDBOX, UAT or PROD

Any environment *could* be used by any stage however in practice they are restricted to the following:
DEV and CODE stages use the SANDBOX environment for non test users the UAT environment for test users
PROD stage uses the PROD environment for non test users and UAT for test users. See table below for full details.


--------------------------------------

##### Interaction between support-frontend, support-workers and the touchpoint environments

|support-frontend stage| Is test user?|support-workers stage|Touchpoint Environment |
|----------------------|--------------|---------------------|-----------------------|
|DEV                   |No            |CODE                 |SANDBOX                |
|DEV                   |Yes           |CODE                 |UAT                    |
|CODE                  |No            |CODE                 |SANDBOX                |
|CODE                  |Yes           |CODE                 |UAT                    |
|PROD                  |No            |PROD                 |PROD                   |
|PROD                  |Yes           |PROD                 |UAT                    |



## Public settings
Any public config settings can be put in the application.conf file,
private settings should go in a separate private conf file as described in
the main project repos


