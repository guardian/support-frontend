package com.gu

import scala.io.Source

//noinspection SourceNotClosed
object Fixtures {
  def loadQueryResults: String = Source.fromURL(getClass.getResource("/query-results.csv")).mkString

  def sqsEventJson = """
  {
    "Records": [
        {
            "messageId": "0b95d941-5578-42f2-99e1-e34ca2a299f8",
            "receiptHandle": "AQEBqXr64BI4ZXgT4ww4tTJr6b++0Y8j0LgD10zR3Ijizf2r6Uqo4KlezjvWLxMcGqGGWAghPj7ZYtcjPEy95ehZXK0zLtX8wUSBqV7GECU3lUm81N0QywJbi7IoOnedepavJ45qC3SXP8kxc5ZAcRvPOimTSresg75d/8fk+c2ORGilVmWDC0esn2+vviegfeAsktvtT7BEFsct2LFKqEteKblxw9PQDbB80vlzCllzLgnXSl8k/pfl14MIJz3E4+Qx6fsbUKO4R/CCOeqGpSv8fIiaAUX+W7mcALGZnPyT+rsKC8Xd3X05IqMSXopFlvA8WgLO3deJuINxn8Hf1iCZHaYTCqOyIdmwm/NfVpBkStwotRvWKt+oTXZNZg6DkUOUZqB3lNNrqByRgCaxXOPmCg==",
            "body": "Hello World",
            "attributes": {
                "ApproximateReceiveCount": "2",
                "SentTimestamp": "1661359105646",
                "SenderId": "AROAJ2472JG7IDEUTKPNU:rupert.bates",
                "ApproximateFirstReceiveTimestamp": "1661359105653"
            },
            "messageAttributes": {},
            "md5OfBody": "b10a8db164e0754105b7a99be72e3fe5",
            "eventSource": "aws:sqs",
            "eventSourceARN": "arn:aws:sqs:eu-west-1:865473395570:supporter-product-data-DEV",
            "awsRegion": "eu-west-1"
        }
    ]
}
  """
}
