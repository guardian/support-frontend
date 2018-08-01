: <<'END'
This script allows you to decrypt the state from step function executions, it can be used as follows:

* Copy the json state from the AWS console
* Call the script eg.

    `./decode.sh '{"state":"AQICAHjJHubNEB1WH+W22uvaeQCP8EVHJ9ho4gS436mo+W3QTgElyN3fytZnRAf/RZHakPJ4AAADyTCCA8UGCSqGSIb3DQEHBqCCA7YwggOyAgEAMIIDqwYJKoZIhvcNAQcBMB4GCWCGSAFlAwQBLjARBAzwkC7RmZDUD8ilI30CARCAggN8sbrM0O02pxDmKvsOvRPh9nY+saum8hCe7g0XAhxq/pDVmj9SQjmSSt6m4qEypeUsnmpaCsSJyAPDPit59auzRja6LFtx9eBohUYZa9q1vjiQysTIigXRxHVFMI2VuRO9rwcgyJyMBIHh+7jB0sZ5/7Bl8tdBPDJ+MAPZt/mVa7k533ee1zxNz/EcMlmVr3ncHSYGowDLU5fBxCfk0LM3aJ7mMcEMLoWNkKl4S+eruimumSGsr5IL34b4Aru/Lshp17/7XypemvhPv13ACfzHwuQQ3t33Kvja5CQW5xNUlnAtlSYwrocptJcjQNszciH4UqWND0SgyTZ/8OHN8dpHmjwBsp7auD8uZ9kAO0lRxQh/jhgIoBhslxSgBQSioSHBMFApyRJC0ge96EOU9vgVNe9XwgvZg68WiLO9cOcdw0wAvVemiTNLdTfO8QoNEw2ecbHQyXE0QvKliCTuylKNpKcpnTey1WnES+VJO5XDxYn1bS6euCadhWUVvOGQ4BtjCZgtTUlUkO8s2Uct5qMWkC6pSjLjpIJcnMddXU4xveWHxWKjyYyExDvDHsU99EYheMoSg4KdwJL32StI4+2Nlrv/PBgFNHADB1H+/XNxnPsn0+4WsK+VdOBck64kgilDKJw41rPWRqdP5Sol7VUBzkzoLA7kunhDW5/8qH1cvx+Xu7MJhqg1tT+vSfddABGfyHFkZQ/3DmacrY8kVaTUGUt72F7ytTSVJXp7r18s+VdQx6cKudCXJtEUa6A3gk1OuUbLjE95Xf/lMf3piMVSk/uZESQBvmiIsbIKqsH7jv28w7aBeC5EHdMqn/De/WReE6kJ3JWV1eAnEzp1UQINJnuasx3b6Xi9rR1kDyn2IbujWZR2UFga0NuDxqhH5sTh2CP7QFdDtMmKik2R0S//RjuIk0ARPAi0ceQBHeoG1KdpEVCo1ZjG8KS+kz0RTQE4UWXRTIgy7xG4mlLo/A7hWVDoc064XOIbrc3JKtKytp+SAkf3RTxQ3t+gJdYcIbEGx9Op7ubRyJXvAKNLxz3Hvjrr0BOdw/m/ByojDQNkvCPn17RRNt0jd//+WHHLaZcMSDy02KBp0teHzcATB05QhsxmlxlFWbgE2NHS2Q4pV1Nwv3BBJrlG4jj/4rd+LkFZxQbv2Zd7f8Tcbs8sX8Ktq788E5vSMdP4gfMkJg==","error":null,"requestInfo":{"encrypted":true,"testUser":true,"failed":false,"messages":[]}}'`

    __(note the single quotes around the json, these are necessary or quotes get stripped out)__

    The output should be something like:

    `{"requestId":"9759a67f-61a7-10c6-0000-00000000008c","user":{"id":"30001273","primaryEmailAddress":"dslkjfsdlk@gu.com","firstName":"tstssdd","lastName":"ljsdlfkjsdflkj","country":"GB","state":null,"allowMembershipMail":false,"allowThirdPartyMail":false,"allowGURelatedMail":true,"isTestUser":false},"contribution":{"amount":5,"currency":"GBP","billingPeriod":"Monthly"},"paymentFields":{"stripeToken":"tok_BWg0DWRgTkyCY7"}}`

    By default the script will use the AWS encryption key ARN from the local support-workers.private.conf, this is fine
    for decrypting state from the CODE environment but if you want to decrypt state from PROD, you can pass the
    production AWS encryption key ARN as a second parameter to the script.
END
cd ..
minified_json="$(echo $1 | tr -d '\n\r\t ')"
sbt --error "run-main com.gu.support.workers.encoding.StateDecoder $minified_json $2"
