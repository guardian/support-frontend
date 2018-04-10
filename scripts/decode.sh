: <<'END'
This script allows you to decrypt the state from step function executions, it can be used as follows:

* Copy the json state from the AWS console

* Minify it (so that it can be passed in to the script on the command line)

* Call the script eg.

    `./decode.sh '{"state":"AQICAHjJHubNEB1WH+W22uvaeQCP8EVHJ9ho4gS436mo+W3QTgE38M5ynj5ZU+GbHVt5ZBnGAAACIjCCAh4GCSqGSIb3DQEHBqCCAg8wggILAgEAMIICBAYJKoZIhvcNAQcBMB4GCWCGSAFlAwQBLjARBAzZFWiO1E0uyop/6RUCARCAggHVDvHnH1QkR8VVnuPwRaNRAQoMkBE0yf9I5Kb0ugxirrfZqklswIhPWOGBktG9XWZ31mJDHJ6mb2H5PTJxmAA/64jqYvv0W5Q7yMhwHXTroTraa8+oawgaMipKDtMzfjVDYkHcUsfSHePVgXTCmdEkjthnTV+g10Y0TK3RximRLeBJ/Us9WW07gyg4ibBKdjDEAHYyLfx59nRNDL3f5NN0ZT1aYhhoxCle4d4QxsijQ9a2soZoRXNZ11CgCTrSB9bd08gBjfY0Y0kuA7Emv6oskBImGcLp6CXf3uZHU/pdT7L6PgcBw41hKk9aOXCpiPEPUyni8ePAv+qN74IjkrsXqwMVAzqtgewx1HwgShcYFnhLQ97b9KaoClAiSiYxF0CB2k/AgM6zHo2riaCnRje2bwjE065e8NJzz9wPfhKDLj95B06bpm/1eCOsF6bKGyqrfhZCk23880O58OQAVzzaTRTE3PIktbaICLdIVfLGSN4kF2GxV3Qako/E5W7BCKKt/GsV+pbraLh3WfuokFy4ABPgWqDBRfUKeYJMqKsKDiUzyp6xydMj9yf9ooJKmlqjiRT3QLvScsKCetvYsKTO9/bpgQkKp7iS1QIPTqlxu05MU5z9Gw==","error":null,"encrypted":true}'`

    __(note the single quotes around the json, these are necessary or quotes get stripped out)__

    The output should be something like:

    `{"requestId":"9759a67f-61a7-10c6-0000-00000000008c","user":{"id":"30001273","primaryEmailAddress":"dslkjfsdlk@gu.com","firstName":"tstssdd","lastName":"ljsdlfkjsdflkj","country":"GB","state":null,"allowMembershipMail":false,"allowThirdPartyMail":false,"allowGURelatedMail":true,"isTestUser":false},"contribution":{"amount":5,"currency":"GBP","billingPeriod":"Monthly"},"paymentFields":{"stripeToken":"tok_BWg0DWRgTkyCY7"}}`

    By default the script will use the AWS encryption key ARN from the local support-workers.private.conf, this is fine
    for decrypting state from the CODE environment but if you want to decrypt state from PROD, you can pass the
    production AWS encryption key ARN as a second parameter to the script.
END
cd ..
sbt --error "project monthly-contributions" "run-main com.gu.support.workers.encoding.StateDecoder $1 $2"
