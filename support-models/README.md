# support-models

[![Maven Central](https://maven-badges.herokuapp.com/maven-central/com.gu/support-models_2.11/badge.svg)](https://maven-badges.herokuapp.com/maven-central/com.gu/support-models_2.11)

Shared models used to interact with support step-functions. 

## Releasing to local repo

Run `sbt publishLocal`.


## Releasing to maven

We use sbt to release to Maven. Please check notes here to ensure you are set up to release to Maven:
https://docs.google.com/document/d/1rNXjoZDqZMsQblOVXPAIIOMWuwUKe3KzTCttuqS7AcY/edit?usp=sharing

Then run `sbt release`.

## PaperRound API

This is a description of the PaperRound API made available to us for describing delivery agents. The API was described to us using [a Swagger page](https://testguardianapi.ppruk.net/swagger-ui/), and this document is an addition to that.

A test version of the API is available at <https://testapi.guardianhnd.co.uk/v1/guardian>, and a prod version of the API will be available at <https://api.guardianhnd.co.uk/v1/guardian>.

All endpoints require a POST request with content-type `x-www-form-urlencoded`, and a header `x-api-key` whose value is the API key we’ve been given. (The API key can be found [in the parameter store](https://eu-west-1.console.aws.amazon.com/systems-manager/parameters/?region=eu-west-1&tab=Table#list_parameter_filters=Name:Contains:paper-round) if needed.)

- swagger: https://testguardianapi.ppruk.net/swagger-ui/
- url (test): https://testapi.guardianhnd.co.uk/v1/guardian
- url (prod): https://api.guardianhnd.co.uk/v1/guardian
- api key header: x-api-key
- api key (in parameter store): https://eu-west-1.console.aws.amazon.com/systems-manager/parameters/?region=eu-west-1&tab=Table#list_parameter_filters=Name:Contains:paper-round

There are four endpoints in the API, which are described in more detail in the next sections:

- /coverage
- /agents
- /chargebands
- /../server_status

### /coverage

Given a postcode, the coverage endpoint returns whether that postcode is covered by any delivery agents, and gives the details of the agents if it is.

There are two parameters for this endpoint: postcode and dayprojection. According to PaperRound we can ignore dayprojection, as it’s an extra that is not required for this project.

The `data.status` field can return one of the following values, which defines the meaning of the response:

- CO (postcode is covered; see agent list)
- NC (postcode has no agent coverage)
- MP (postcode is missing from the list of valid postcodes)
- IP (problem with input)
- IE (internal PaperRound system error)

#### Covered

If the status is `"CO"`, then the postcode is covered, and `data.agents` contains a list of agents for this postcode.

For the test API, there are two postcodes that will return Covered:

- DE10HN (returns a single agent)
- DE10FD (returns multiple agents)

Here is an example curl call and response:

``` sh
curl -i -H "x-api-key: $apiKey" -X POST https://testapi.guardianhnd.co.uk/v1/guardian/coverage --data-urlencode "postcode=DE1 0FD" --data-urlencode "dayprojection=10" -H "Accept: application/json" -H "Content-Type: application/x-www-form-urlencoded"
```

``` http
HTTP/2 200 
date: Wed, 19 Jul 2023 08:43:17 GMT
content-type: application/json
content-length: 722
server: Apache
x-frame-options: SAMEORIGIN
cache-control: max-age=600
expires: Wed, 19 Jul 2023 08:53:17 GMT
vary: Accept-Encoding,User-Agent
x-xss-protection: 1; mode=block
x-content-type-options: nosniff

{
    "status_code": 200,
    "data": {
        "message": "",
        "status": "CO",
        "agents": [
            {
                "postcode": "DE10FD",
                "deliverymethod": "Car",
                "refgroupid": 46,
                "nbrdeliverydays": 7,
                "summary": "",
                "agentid": 46,
                "agentname": "Test Shop "
            },
            {
                "postcode": "DE10FD",
                "deliverymethod": "Car",
                "refgroupid": 1099,
                "nbrdeliverydays": 7,
                "summary": "",
                "agentid": 1816,
                "agentname": "NewsTeam Group Ltd"
            }
        ]
    },
    "message": ""
}
```

##### Type Description: GuardianAgentsCoverage

Each entry in `data.agents` is a value of type `GuardianAgentsCoverage` (as called in the swagger). This section contains information on some of the fields of this type.

###### postcode

This seems to be the postcode used for the request. (Not, e.g., the postcode of the delivery agent.)

###### deliverymethod

This is a string describing the delivery method for the agent. I asked PaperRound if there’s a fixed set of values this could take (to see if we could use an enumeration to represent its values), but they said to treat it as just text for now.

###### agentid and refgroupid

I believe the `agentid` matches the `refid` field returned for this agent from the `/agents` endpoint.

These two fields can be different when an agent is a group of shops or covers the whole country and is split into different areas. In these cases `refgroupid` is the id for the whole group, and `agentid` is the id for the specific instance.

For example:

> Spar Wheathamppstead would be 123 and the group would be 90
> Spar Whitwell would be 234 and the group would be 90
>
> 90 is the Spar group

###### nbrdeliverydays

This is the number of days each week that the agent does deliveries: 7 means every day of the week, and 6 means Monday to Saturday. I believe we have agreed with PaperRound that only agents who deliver every day will be available, so this should always be 7.

#### Not Covered

If the status is `"NC"`, the postcode is not covered by any agents, and `data.agents` will be empty.

Here is an example curl call and response:

``` sh
curl -i -H "x-api-key: $apiKey" -X POST https://testapi.guardianhnd.co.uk/v1/guardian/coverage --data-urlencode "postcode=B15 1HN" --data-urlencode "dayprojection=10" -H "Accept: application/json" -H "Content-Type: application/x-www-form-urlencoded"
```

``` http
HTTP/2 200 
date: Wed, 19 Jul 2023 08:42:56 GMT
content-type: application/json
content-length: 145
server: Apache
x-frame-options: SAMEORIGIN
cache-control: max-age=600
expires: Wed, 19 Jul 2023 08:52:56 GMT
vary: Accept-Encoding,User-Agent
x-xss-protection: 1; mode=block
x-content-type-options: nosniff

{
    "status_code": 200,
    "data": {
        "message": "Not Covered",
        "status": "NC",
        "agents": []
    },
    "message": ""
}
```

#### Missing Postcode

If the status is `"MP"`, the postcode is missing from PaperRound’s list of valid postcodes. One postcode which produces this error is `BX5 5AT`, which is the VAT Central Unit of HM Revenue and Customs and is a non-geographic postcode (whatever that means). Note that the API may still return a 200 in this case.

Here is an example curl call and response:

``` sh
curl -i -H "x-api-key: $apiKey" -X POST https://testapi.guardianhnd.co.uk/v1/guardian/coverage --data-urlencode "postcode=BX5 5AT" --data-urlencode "dayprojection=10" -H "Accept: application/json" -H "Content-Type: application/x-www-form-urlencoded"
```

``` http
HTTP/2 200 
date: Wed, 19 Jul 2023 08:43:40 GMT
content-type: application/json
content-length: 150
server: Apache
x-frame-options: SAMEORIGIN
cache-control: max-age=600
expires: Wed, 19 Jul 2023 08:53:40 GMT
vary: Accept-Encoding,User-Agent
x-xss-protection: 1; mode=block
x-content-type-options: nosniff

{
    "status_code": 200,
    "data": {
        "message": "Missing Postcode",
        "status": "MP",
        "agents": []
    },
    "message": ""
}
```

#### Input Problem

If the status is `"IP"`, something is wrong with the input. Anything that doesn’t meet the right format for the postcode gives this error. Note that the API may still return a 200 in this case.

``` sh
curl -i -H "x-api-key: $apiKey" -X POST https://testapi.guardianhnd.co.uk/v1/guardian/coverage --data-urlencode "postcode=m" --data-urlencode "dayprojection=10" -H "Accept: application/json" -H "Content-Type: application/x-www-form-urlencoded"
```

``` http
HTTP/2 200 
date: Wed, 19 Jul 2023 08:43:58 GMT
content-type: application/json
content-length: 170
server: Apache
x-frame-options: SAMEORIGIN
cache-control: max-age=600
expires: Wed, 19 Jul 2023 08:53:58 GMT
vary: Accept-Encoding,User-Agent
x-xss-protection: 1; mode=block
x-content-type-options: nosniff

{
    "status_code": 200,
    "data": {
        "message": "Problem with input",
        "status": "IP",
        "agents": []
    },
    "message": "Problem with input"
}
```

#### Internal Error

If the status is `"IE"`, PaperRound have had an internal error. I haven’t been able to reproduce this case, so I have no further information.

### /agents

The agents endpoint returns the full list of delivery agents available. There are no parameters for this endpoint.

Here is an example curl call and response:

``` sh
curl -i -H "x-api-key: $apiKey" -X POST https://testapi.guardianhnd.co.uk/v1/guardian/agents -H "Accept: application/json" -H "Content-Type: application/json"
```

``` http
HTTP/2 200 
date: Wed, 19 Jul 2023 08:42:22 GMT
content-type: application/json
content-length: 1682
server: Apache
x-frame-options: SAMEORIGIN
cache-control: max-age=600
expires: Wed, 19 Jul 2023 08:52:22 GMT
vary: Accept-Encoding,User-Agent
x-xss-protection: 1; mode=block
x-content-type-options: nosniff

{
    "status_code": 200,
    "data": {
        "agents": [
            {
                "refid": 46,
                "postcode": "AL4 8HA",
                "town": "Twn",
                "startdate": "2022-05-10",
                "address2": "Test",
                "county": "Cnty",
                "telephone": "01234 56789 / 0987 654321",
                "enddate": "2100-01-00",
                "refgroupid": 46,
                "agentname": "Test Shop ",
                "address1": "1",
                "email": "test_email@test_email.co.uk"
            },
            {
                "refid": 1533,
                "postcode": "TN30 7LZ",
                "town": "Smallhythe Road, Tenterden",
                "startdate": "2023-07-10",
                "address2": "",
                "county": "Kent",
                "telephone": "01580 763183",
                "enddate": "2100-01-01",
                "refgroupid": 1533,
                "agentname": "Jackie's News Limited",
                "address1": "Unit 6, Pickhill Business Centre",
                "email": "mail@jackiesnews.co.uk"
            },
            {
                "refid": 1816,
                "postcode": "ST1 5LQ",
                "town": "Hanley",
                "startdate": "2022-05-10",
                "address2": "43-45 Trinity Street",
                "county": "",
                "telephone": "01782 958565",
                "enddate": "2100-01-00",
                "refgroupid": 1099,
                "agentname": "NewsTeam Group Ltd",
                "address1": "Trinity House",
                "email": "Reach@newsteamgroup.co.uk"
            }
        ]
    },
    "message": ""
}
```

### /chargebands

The chargebands endpoint takes no parameters.

Here is an example curl call and response:

``` sh
curl -i -H "X-API-Key: $apiKey" -X POST https://testapi.guardianhnd.co.uk/v1/guardian/chargebands -H "Accept: application/json" -H "Content-Type: application/json"
```

<details>

<summary>Response</summary>

``` http
HTTP/2 200 
date: Wed, 19 Jul 2023 08:41:36 GMT
content-type: application/json
content-length: 28291
server: Apache
x-frame-options: SAMEORIGIN
cache-control: max-age=600
expires: Wed, 19 Jul 2023 08:51:36 GMT
vary: Accept-Encoding,User-Agent
x-xss-protection: 1; mode=block
x-content-type-options: nosniff

{
    "status_code": 200,
    "data": {
        "bands": [
            {
                "Sun": 0.35,
                "Fri": 0.35,
                "Mon": 0.35,
                "Thu": 0.35,
                "description": "Standard 35p Mon-Sun RDH",
                "Sat": 0.35,
                "Tue": 0.35,
                "deliverychargeid": 126,
                "Wed": 0.35
            },
            {
                "Sun": 0.4,
                "Fri": 0.35,
                "Mon": 0.35,
                "Thu": 0.35,
                "description": "35p Mon-Sat, 40p Sun",
                "Sat": 0.35,
                "Tue": 0.35,
                "deliverychargeid": 127,
                "Wed": 0.35
            },
            {
                "Sun": 0.4,
                "Fri": 0.4,
                "Mon": 0.4,
                "Thu": 0.4,
                "description": "40p Mon-Sun",
                "Sat": 0.4,
                "Tue": 0.4,
                "deliverychargeid": 128,
                "Wed": 0.4
            },
            {
                "Sun": 0.5,
                "Fri": 0.4,
                "Mon": 0.4,
                "Thu": 0.4,
                "description": "40p Mon-Fri 50p Sat-Sun",
                "Sat": 0.5,
                "Tue": 0.4,
                "deliverychargeid": 129,
                "Wed": 0.4
            },
            {
                "Sun": 0.6,
                "Fri": 0.4,
                "Mon": 0.4,
                "Thu": 0.4,
                "description": "40p Mon-Fri 60p Sat-Sun",
                "Sat": 0.6,
                "Tue": 0.4,
                "deliverychargeid": 130,
                "Wed": 0.4
            },
            {
                "Sun": 0.45,
                "Fri": 0.45,
                "Mon": 0.45,
                "Thu": 0.45,
                "description": "45p Mon-Sun",
                "Sat": 0.45,
                "Tue": 0.45,
                "deliverychargeid": 131,
                "Wed": 0.45
            },
            {
                "Sun": 0.5,
                "Fri": 0.45,
                "Mon": 0.45,
                "Thu": 0.45,
                "description": "45p Mon-Sat 50p Sun",
                "Sat": 0.45,
                "Tue": 0.45,
                "deliverychargeid": 132,
                "Wed": 0.45
            },
            {
                "Sun": 0.5,
                "Fri": 0.45,
                "Mon": 0.45,
                "Thu": 0.45,
                "description": "45p Mon-Fri 50p Sat-Sun",
                "Sat": 0.5,
                "Tue": 0.45,
                "deliverychargeid": 133,
                "Wed": 0.45
            },
            {
                "Sun": 0.5,
                "Fri": 0.5,
                "Mon": 0.5,
                "Thu": 0.5,
                "description": "50p Mon-Sun",
                "Sat": 0.5,
                "Tue": 0.5,
                "deliverychargeid": 134,
                "Wed": 0.5
            },
            {
                "Sun": 0.55,
                "Fri": 0.55,
                "Mon": 0.55,
                "Thu": 0.55,
                "description": "55p Mon-Sun",
                "Sat": 0.55,
                "Tue": 0.55,
                "deliverychargeid": 135,
                "Wed": 0.55
            },
            {
                "Sun": 1.1,
                "Fri": 0.55,
                "Mon": 0.55,
                "Thu": 0.55,
                "description": "55p Mon-Fri 85p Sat, \u00a31.10 Sun",
                "Sat": 0.85,
                "Tue": 0.55,
                "deliverychargeid": 136,
                "Wed": 0.55
            },
            {
                "Sun": 0.6,
                "Fri": 0.6,
                "Mon": 0.6,
                "Thu": 0.6,
                "description": "60p Mon-Sun",
                "Sat": 0.6,
                "Tue": 0.6,
                "deliverychargeid": 137,
                "Wed": 0.6
            },
            {
                "Sun": 1.0,
                "Fri": 0.6,
                "Mon": 0.6,
                "Thu": 0.6,
                "description": "60p Mon-Fri, Sat-Sun \u00a31.00",
                "Sat": 1.0,
                "Tue": 0.6,
                "deliverychargeid": 138,
                "Wed": 0.6
            },
            {
                "Sun": 0.65,
                "Fri": 0.65,
                "Mon": 0.65,
                "Thu": 0.65,
                "description": "65p Mon-Sun",
                "Sat": 0.65,
                "Tue": 0.65,
                "deliverychargeid": 139,
                "Wed": 0.65
            },
            {
                "Sun": 0.7,
                "Fri": 0.7,
                "Mon": 0.7,
                "Thu": 0.7,
                "description": "70p Mon-Sun",
                "Sat": 0.7,
                "Tue": 0.7,
                "deliverychargeid": 140,
                "Wed": 0.7
            },
            {
                "Sun": 0.75,
                "Fri": 0.75,
                "Mon": 0.75,
                "Thu": 0.75,
                "description": "75p Mon-Sun",
                "Sat": 0.75,
                "Tue": 0.75,
                "deliverychargeid": 141,
                "Wed": 0.75
            },
            {
                "Sun": 0.8,
                "Fri": 0.8,
                "Mon": 0.8,
                "Thu": 0.8,
                "description": "80p Mon-Sun",
                "Sat": 0.8,
                "Tue": 0.8,
                "deliverychargeid": 142,
                "Wed": 0.8
            },
            {
                "Sun": 0.85,
                "Fri": 0.85,
                "Mon": 0.85,
                "Thu": 0.85,
                "description": "85p Mon-Sun",
                "Sat": 0.85,
                "Tue": 0.85,
                "deliverychargeid": 143,
                "Wed": 0.85
            },
            {
                "Sun": 0.9,
                "Fri": 0.9,
                "Mon": 0.9,
                "Thu": 0.9,
                "description": "90p Mon-Sun",
                "Sat": 0.9,
                "Tue": 0.9,
                "deliverychargeid": 144,
                "Wed": 0.9
            },
            {
                "Sun": 0.95,
                "Fri": 0.95,
                "Mon": 0.95,
                "Thu": 0.95,
                "description": "95p Mon-Sun",
                "Sat": 0.95,
                "Tue": 0.95,
                "deliverychargeid": 145,
                "Wed": 0.95
            },
            {
                "Sun": 1.0,
                "Fri": 1.0,
                "Mon": 1.0,
                "Thu": 1.0,
                "description": "\u00a31.00 Mon-Sun",
                "Sat": 1.0,
                "Tue": 1.0,
                "deliverychargeid": 146,
                "Wed": 1.0
            },
            {
                "Sun": 0.5,
                "Fri": 0.6,
                "Mon": 0.6,
                "Thu": 0.6,
                "description": "60p Mon- Fri, 50p Sat-Sun",
                "Sat": 0.6,
                "Tue": 0.6,
                "deliverychargeid": 147,
                "Wed": 0.6
            },
            {
                "Sun": 0.0,
                "Fri": 0.5,
                "Mon": 0.5,
                "Thu": 0.5,
                "description": "MONDAY to SATURDAY ONLY",
                "Sat": 0.5,
                "Tue": 0.5,
                "deliverychargeid": 148,
                "Wed": 0.5
            },
            {
                "Sun": 0.5,
                "Fri": 0.4,
                "Mon": 0.4,
                "Thu": 0.4,
                "description": "40p Mon -Fri, 45p Sat, 50p Sun",
                "Sat": 0.45,
                "Tue": 0.4,
                "deliverychargeid": 149,
                "Wed": 0.4
            },
            {
                "Sun": 0.75,
                "Fri": 0.7,
                "Mon": 0.7,
                "Thu": 0.7,
                "description": "70p Mon -Fri, 75p Sat & Sun",
                "Sat": 0.75,
                "Tue": 0.7,
                "deliverychargeid": 150,
                "Wed": 0.7
            },
            {
                "Sun": 0.45,
                "Fri": 0.35,
                "Mon": 0.35,
                "Thu": 0.35,
                "description": "35p Mon- Fri, 40p Sat, 45p Sun",
                "Sat": 0.4,
                "Tue": 0.35,
                "deliverychargeid": 151,
                "Wed": 0.35
            },
            {
                "Sun": 0.0,
                "Fri": 0.0,
                "Mon": 0.0,
                "Thu": 0.0,
                "description": "No delivery charge",
                "Sat": 0.0,
                "Tue": 0.0,
                "deliverychargeid": 152,
                "Wed": 0.0
            },
            {
                "Sun": 0.8,
                "Fri": 0.6,
                "Mon": 0.6,
                "Thu": 0.6,
                "description": "60p Mon - Fri , 80p Sat & Sun",
                "Sat": 0.8,
                "Tue": 0.6,
                "deliverychargeid": 153,
                "Wed": 0.6
            },
            {
                "Sun": 1.0,
                "Fri": 0.5,
                "Mon": 0.5,
                "Thu": 0.5,
                "description": "50p Mon-Fri; \u00a31 Sat & Sun",
                "Sat": 1.0,
                "Tue": 0.5,
                "deliverychargeid": 154,
                "Wed": 0.5
            },
            {
                "Sun": 0.85,
                "Fri": 0.75,
                "Mon": 0.75,
                "Thu": 0.75,
                "description": "75p Mon_Fri; 85p Sat & Sun",
                "Sat": 0.85,
                "Tue": 0.75,
                "deliverychargeid": 155,
                "Wed": 0.75
            },
            {
                "Sun": 0.4,
                "Fri": 0.35,
                "Mon": 0.35,
                "Thu": 0.35,
                "description": "35p Mon-Fri; 40p Sat & Sun",
                "Sat": 0.4,
                "Tue": 0.35,
                "deliverychargeid": 156,
                "Wed": 0.35
            },
            {
                "Sun": 0.6,
                "Fri": 0.5,
                "Mon": 0.5,
                "Thu": 0.5,
                "description": "50p Mon-Fri; 60p Sat & Sun",
                "Sat": 0.6,
                "Tue": 0.5,
                "deliverychargeid": 157,
                "Wed": 0.5
            },
            {
                "Sun": 0.45,
                "Fri": 0.35,
                "Mon": 0.35,
                "Thu": 0.35,
                "description": "35p Mon-Sat; 45p Sun",
                "Sat": 0.45,
                "Tue": 0.35,
                "deliverychargeid": 158,
                "Wed": 0.35
            },
            {
                "Sun": 0.65,
                "Fri": 0.55,
                "Mon": 0.55,
                "Thu": 0.55,
                "description": "55p Mon-Fri; 65p Sat & Sun",
                "Sat": 0.65,
                "Tue": 0.55,
                "deliverychargeid": 159,
                "Wed": 0.55
            },
            {
                "Sun": 1.0,
                "Fri": 0.8,
                "Mon": 0.8,
                "Thu": 0.8,
                "description": "80p Mon-Fri; \u00a31 Sat & Sun",
                "Sat": 1.0,
                "Tue": 0.8,
                "deliverychargeid": 160,
                "Wed": 0.8
            },
            {
                "Sun": 0.55,
                "Fri": 0.45,
                "Mon": 0.45,
                "Thu": 0.45,
                "description": "45p Mon-Fri; 55p Sat & Sun",
                "Sat": 0.55,
                "Tue": 0.45,
                "deliverychargeid": 161,
                "Wed": 0.45
            },
            {
                "Sun": 0.35,
                "Fri": 0.45,
                "Mon": 0.35,
                "Thu": 0.35,
                "description": "35p Mon-Fri; 45p Sat & Sun",
                "Sat": 0.45,
                "Tue": 0.35,
                "deliverychargeid": 162,
                "Wed": 0.35
            },
            {
                "Sun": 0.8,
                "Fri": 0.5,
                "Mon": 0.5,
                "Thu": 0.5,
                "description": "50p Mon-Fri; 80p Sat & Sun",
                "Sat": 0.8,
                "Tue": 0.5,
                "deliverychargeid": 163,
                "Wed": 0.5
            },
            {
                "Sun": 0.5,
                "Fri": 0.35,
                "Mon": 0.35,
                "Thu": 0.35,
                "description": "35p Mon-Sat; 50p Sun",
                "Sat": 0.35,
                "Tue": 0.35,
                "deliverychargeid": 164,
                "Wed": 0.35
            },
            {
                "Sun": 0.65,
                "Fri": 0.5,
                "Mon": 0.5,
                "Thu": 0.5,
                "description": "50p Mon-Fri; 60p Sat; 65p Sun",
                "Sat": 0.6,
                "Tue": 0.5,
                "deliverychargeid": 165,
                "Wed": 0.5
            },
            {
                "Sun": 0.75,
                "Fri": 0.7,
                "Mon": 0.7,
                "Thu": 0.7,
                "description": "65p Mon-Fri; 70p Sat; 75p Sun",
                "Sat": 0.75,
                "Tue": 0.7,
                "deliverychargeid": 166,
                "Wed": 0.7
            },
            {
                "Sun": 1.05,
                "Fri": 0.95,
                "Mon": 0.95,
                "Thu": 0.95,
                "description": "95p Mon-Fri; \u00a31 Sat; \u00a31.05 Sun",
                "Sat": 1.0,
                "Tue": 0.95,
                "deliverychargeid": 167,
                "Wed": 0.95
            },
            {
                "Sun": 0.75,
                "Fri": 0.65,
                "Mon": 0.65,
                "Thu": 0.65,
                "description": "65p Mon-Fri; 75p Sat & Sun",
                "Sat": 0.75,
                "Tue": 0.65,
                "deliverychargeid": 168,
                "Wed": 0.65
            },
            {
                "Sun": 0.85,
                "Fri": 0.55,
                "Mon": 0.55,
                "Thu": 0.55,
                "description": "55p Mon-Fri; 85p Sat & Sun",
                "Sat": 0.85,
                "Tue": 0.55,
                "deliverychargeid": 169,
                "Wed": 0.55
            },
            {
                "Sun": 0.5,
                "Fri": 0.35,
                "Mon": 0.35,
                "Thu": 0.35,
                "description": "35p Mon-Fri; 50p Sat & Sun",
                "Sat": 0.5,
                "Tue": 0.35,
                "deliverychargeid": 170,
                "Wed": 0.35
            },
            {
                "Sun": 0.45,
                "Fri": 0.4,
                "Mon": 0.4,
                "Thu": 0.4,
                "description": "40p Mon-Fri; 45p Sat & Sun",
                "Sat": 0.45,
                "Tue": 0.4,
                "deliverychargeid": 171,
                "Wed": 0.4
            },
            {
                "Sun": 2.1,
                "Fri": 0.3,
                "Mon": 0.3,
                "Thu": 0.3,
                "description": "30p Mon-Fri; \u00a32.10 Sat & Sun",
                "Sat": 2.1,
                "Tue": 0.3,
                "deliverychargeid": 172,
                "Wed": 0.3
            },
            {
                "Sun": 2.1,
                "Fri": 0.4,
                "Mon": 0.4,
                "Thu": 0.4,
                "description": "40p Mon-Fri; \u00a32.10 Sat & Sun",
                "Sat": 2.1,
                "Tue": 0.4,
                "deliverychargeid": 173,
                "Wed": 0.4
            },
            {
                "Sun": 2.1,
                "Fri": 0.35,
                "Mon": 0.35,
                "Thu": 0.35,
                "description": "35p Mon-Fri; \u00a32.10 Sat & Sun",
                "Sat": 2.1,
                "Tue": 0.35,
                "deliverychargeid": 174,
                "Wed": 0.35
            },
            {
                "Sun": 2.1,
                "Fri": 0.45,
                "Mon": 0.45,
                "Thu": 0.45,
                "description": "45p Mon-Fri; \u00a32.10 Sat & Sun",
                "Sat": 2.1,
                "Tue": 0.45,
                "deliverychargeid": 175,
                "Wed": 0.45
            },
            {
                "Sun": 2.1,
                "Fri": 0.5,
                "Mon": 0.5,
                "Thu": 0.5,
                "description": "50p Mon-Fri; \u00a32.10 Sat & Sun",
                "Sat": 2.1,
                "Tue": 0.5,
                "deliverychargeid": 176,
                "Wed": 0.5
            },
            {
                "Sun": 0.55,
                "Fri": 0.45,
                "Mon": 0.45,
                "Thu": 0.45,
                "description": "45p Mon-Fri; 50p Sat; 55p Sun",
                "Sat": 0.5,
                "Tue": 0.45,
                "deliverychargeid": 177,
                "Wed": 0.45
            },
            {
                "Sun": 0.7,
                "Fri": 0.6,
                "Mon": 0.6,
                "Thu": 0.6,
                "description": "60p Mon-Fri; 65p Sat; 70p Sun",
                "Sat": 0.65,
                "Tue": 0.6,
                "deliverychargeid": 178,
                "Wed": 0.6
            },
            {
                "Sun": 0.75,
                "Fri": 0.6,
                "Mon": 0.6,
                "Thu": 0.6,
                "description": "60p Mon-Fri; 75p Sat & Sun",
                "Sat": 0.75,
                "Tue": 0.6,
                "deliverychargeid": 179,
                "Wed": 0.6
            },
            {
                "Sun": 0.75,
                "Fri": 0.5,
                "Mon": 0.5,
                "Thu": 0.5,
                "description": "50p Mon-Fri; 75p Sat & Sun",
                "Sat": 0.75,
                "Tue": 0.5,
                "deliverychargeid": 180,
                "Wed": 0.5
            },
            {
                "Sun": 0.6,
                "Fri": 0.5,
                "Mon": 0.5,
                "Thu": 0.5,
                "description": "50p Mon-Fri; 55p Sat; 60p Sun",
                "Sat": 0.55,
                "Tue": 0.5,
                "deliverychargeid": 181,
                "Wed": 0.5
            },
            {
                "Sun": 0.7,
                "Fri": 0.45,
                "Mon": 0.45,
                "Thu": 0.45,
                "description": "45p Mon-Fri; 70p Sat & Sun",
                "Sat": 0.7,
                "Tue": 0.45,
                "deliverychargeid": 182,
                "Wed": 0.45
            },
            {
                "Sun": 0.7,
                "Fri": 0.55,
                "Mon": 0.55,
                "Thu": 0.55,
                "description": "55p Mon-Fri; 70p Sat & Sun",
                "Sat": 0.7,
                "Tue": 0.55,
                "deliverychargeid": 183,
                "Wed": 0.55
            },
            {
                "Sun": 0.55,
                "Fri": 0.5,
                "Mon": 0.5,
                "Thu": 0.5,
                "description": "50p Mon-Fri; 55p Sat & Sun",
                "Sat": 0.55,
                "Tue": 0.5,
                "deliverychargeid": 184,
                "Wed": 0.5
            },
            {
                "Sun": 0.7,
                "Fri": 0.5,
                "Mon": 0.5,
                "Thu": 0.5,
                "description": "50p Mon-Fri; 70p Sat & Sun",
                "Sat": 0.7,
                "Tue": 0.5,
                "deliverychargeid": 185,
                "Wed": 0.5
            },
            {
                "Sun": 0.75,
                "Fri": 0.55,
                "Mon": 0.55,
                "Thu": 0.55,
                "description": "55p Mon-Fri; 75p Sat & Sun",
                "Sat": 0.75,
                "Tue": 0.55,
                "deliverychargeid": 186,
                "Wed": 0.55
            },
            {
                "Sun": 0.65,
                "Fri": 0.55,
                "Mon": 0.55,
                "Thu": 0.55,
                "description": "55p Mon-Fri; 60p Sat; 65p Sun",
                "Sat": 0.6,
                "Tue": 0.55,
                "deliverychargeid": 187,
                "Wed": 0.55
            },
            {
                "Sun": 1.0,
                "Fri": 0.75,
                "Mon": 0.75,
                "Thu": 0.75,
                "description": "75p Mon-Fri; \u00a31 Sat & Sun",
                "Sat": 1.0,
                "Tue": 0.75,
                "deliverychargeid": 188,
                "Wed": 0.75
            },
            {
                "Sun": 0.5,
                "Fri": 0.35,
                "Mon": 0.35,
                "Thu": 0.35,
                "description": "35p Mon-Fri; 40p Sat; 50p Sun",
                "Sat": 0.4,
                "Tue": 0.35,
                "deliverychargeid": 189,
                "Wed": 0.35
            },
            {
                "Sun": 0.6,
                "Fri": 0.55,
                "Mon": 0.55,
                "Thu": 0.55,
                "description": "55p Mon-Fri; 60p Sat & Sun",
                "Sat": 0.6,
                "Tue": 0.55,
                "deliverychargeid": 190,
                "Wed": 0.55
            },
            {
                "Sun": 0.85,
                "Fri": 0.75,
                "Mon": 0.75,
                "Thu": 0.75,
                "description": "75p Mon-Fri; 90p Sat; 85p Sun",
                "Sat": 0.9,
                "Tue": 0.75,
                "deliverychargeid": 191,
                "Wed": 0.75
            },
            {
                "Sun": 0.7,
                "Fri": 0.6,
                "Mon": 0.6,
                "Thu": 0.6,
                "description": "60p Mon-Fri; 70p Sat & Sun",
                "Sat": 0.7,
                "Tue": 0.6,
                "deliverychargeid": 192,
                "Wed": 0.6
            },
            {
                "Sun": 0.8,
                "Fri": 0.75,
                "Mon": 0.75,
                "Thu": 0.75,
                "description": "75p Mon-Sat; 80p Sun",
                "Sat": 0.75,
                "Tue": 0.75,
                "deliverychargeid": 193,
                "Wed": 0.75
            },
            {
                "Sun": 1.0,
                "Fri": 0.5,
                "Mon": 0.5,
                "Thu": 0.5,
                "description": "50p Mon-Sat; \u00a31 Sun",
                "Sat": 0.5,
                "Tue": 0.5,
                "deliverychargeid": 194,
                "Wed": 0.5
            },
            {
                "Sun": 1.5,
                "Fri": 1.0,
                "Mon": 1.0,
                "Thu": 1.0,
                "description": "\u00a31.00 Mon-Fri; \u00a31.50 Sat & Sun",
                "Sat": 1.5,
                "Tue": 1.0,
                "deliverychargeid": 195,
                "Wed": 1.0
            },
            {
                "Sun": 0.7,
                "Fri": 0.65,
                "Mon": 0.65,
                "Thu": 0.65,
                "description": "65p Mon-Sat; 70p Sun",
                "Sat": 0.65,
                "Tue": 0.65,
                "deliverychargeid": 196,
                "Wed": 0.65
            },
            {
                "Sun": 0.75,
                "Fri": 0.45,
                "Mon": 0.45,
                "Thu": 0.45,
                "description": "45p Mon-Fri; 65p Sat; 75p Sun",
                "Sat": 0.65,
                "Tue": 0.45,
                "deliverychargeid": 197,
                "Wed": 0.45
            },
            {
                "Sun": 1.0,
                "Fri": 0.5,
                "Mon": 0.5,
                "Thu": 0.5,
                "description": "50p Mon-Fri; 75p Sat; \u00a31.00 Sun",
                "Sat": 0.75,
                "Tue": 0.5,
                "deliverychargeid": 198,
                "Wed": 0.5
            },
            {
                "Sun": 0.65,
                "Fri": 0.6,
                "Mon": 0.6,
                "Thu": 0.6,
                "description": "60p Mon-Sat; 65p Sun",
                "Sat": 0.6,
                "Tue": 0.6,
                "deliverychargeid": 199,
                "Wed": 0.6
            },
            {
                "Sun": 0.9,
                "Fri": 0.85,
                "Mon": 0.85,
                "Thu": 0.85,
                "description": "85p Mon-Sat; 90p Sun",
                "Sat": 0.85,
                "Tue": 0.85,
                "deliverychargeid": 200,
                "Wed": 0.85
            },
            {
                "Sun": 0.75,
                "Fri": 0.35,
                "Mon": 0.35,
                "Thu": 0.35,
                "description": "35p Mon-Fri; 75p Sat & Sun",
                "Sat": 0.75,
                "Tue": 0.35,
                "deliverychargeid": 201,
                "Wed": 0.35
            },
            {
                "Sun": 0.55,
                "Fri": 0.4,
                "Mon": 0.4,
                "Thu": 0.4,
                "description": "40p Mon-Fri; 55p Sat & Sun",
                "Sat": 0.55,
                "Tue": 0.4,
                "deliverychargeid": 202,
                "Wed": 0.4
            },
            {
                "Sun": 1.6,
                "Fri": 1.6,
                "Mon": 1.6,
                "Thu": 1.6,
                "description": "\u00a31.60 Mon-Sun",
                "Sat": 1.6,
                "Tue": 1.6,
                "deliverychargeid": 203,
                "Wed": 1.6
            },
            {
                "Sun": 0.55,
                "Fri": 0.35,
                "Mon": 0.35,
                "Thu": 0.35,
                "description": "35p Mon-Fri; 55p Sat & Sun",
                "Sat": 0.55,
                "Tue": 0.35,
                "deliverychargeid": 204,
                "Wed": 0.35
            },
            {
                "Sun": 1.2,
                "Fri": 1.2,
                "Mon": 1.2,
                "Thu": 1.2,
                "description": "\u00a31.20 Mon-Sun",
                "Sat": 1.2,
                "Tue": 1.2,
                "deliverychargeid": 205,
                "Wed": 1.2
            },
            {
                "Sun": 0.8,
                "Fri": 0.75,
                "Mon": 0.75,
                "Thu": 0.75,
                "description": "75p Mon-Fri; 80p Sat & Sun",
                "Sat": 0.8,
                "Tue": 0.75,
                "deliverychargeid": 206,
                "Wed": 0.75
            },
            {
                "Sun": 0.65,
                "Fri": 0.5,
                "Mon": 0.5,
                "Thu": 0.5,
                "description": "50p Mon-Fri; 65p Sat & Sun",
                "Sat": 0.65,
                "Tue": 0.5,
                "deliverychargeid": 207,
                "Wed": 0.5
            },
            {
                "Sun": 0.75,
                "Fri": 0.4,
                "Mon": 0.4,
                "Thu": 0.4,
                "description": "40p Mon-Sat; 75p Sun",
                "Sat": 0.4,
                "Tue": 0.4,
                "deliverychargeid": 208,
                "Wed": 0.4
            },
            {
                "Sun": 0.3,
                "Fri": 0.28,
                "Mon": 0.28,
                "Thu": 0.28,
                "description": "28p Mon-Fri; 30p Sat & Sun",
                "Sat": 0.3,
                "Tue": 0.28,
                "deliverychargeid": 209,
                "Wed": 0.28
            },
            {
                "Sun": 2.1,
                "Fri": 0.5,
                "Mon": 0.5,
                "Thu": 0.5,
                "description": "50p Mon-Fri; 60p Sat; \u00a32.10 Sun",
                "Sat": 0.6,
                "Tue": 0.5,
                "deliverychargeid": 210,
                "Wed": 0.5
            },
            {
                "Sun": 2.1,
                "Fri": 0.85,
                "Mon": 0.85,
                "Thu": 0.85,
                "description": "85p Mon-Fri; 95p Sat; \u00a32.10 Sun",
                "Sat": 0.95,
                "Tue": 0.85,
                "deliverychargeid": 211,
                "Wed": 0.85
            }
        ]
    },
    "message": ""
}
```

</details>

### /../server_status

The server status endpoint returns a string describing the current status of the server.

``` sh
curl -i -H "x-api-key: $apiKey" -X GET https://testapi.guardianhnd.co.uk/v1/guardian/../server_status -H "Accept: application/json" -H "Content-Type: application/json"
```

``` http
HTTP/2 200 
date: Wed, 26 Jul 2023 09:46:56 GMT
content-type: application/json
content-length: 95
server: Apache
x-frame-options: SAMEORIGIN
cache-control: max-age=600
expires: Wed, 26 Jul 2023 09:56:56 GMT
vary: Accept-Encoding,User-Agent
x-xss-protection: 1; mode=block
x-content-type-options: nosniff

{
    "status_code": 200,
    "data": {
        "status": "Server is running correctly"
    }
}
```

### Open Questions

#### Why is the timestamp field called “error_code”?

i.e. is the naming/typing correct?

#### What’s the error behaviour?

Do we only get the error type when the status is non-2xx? Can we always distinguish the error and success types?

#### What’s the `summary` field on `GuardianAgentsCoverage`?

So far it seems to always be empty: what does it mean?

#### Is it right that the postcode returned for each agent in the /coverage list is the same?

Or should it match the postcode returned from the /agents endpoint?

#### How often does the list of agents change? Can an agent suddenly stop being valid?

If we offer a choice of agent to a user based on the /coverage response, how soon might that agent be taken off the list? (Could it happen before they complete checkout?)

Do we need to check the `enddate` for a selected agent at checkout, and make the user choose another one if it’s in the past?
