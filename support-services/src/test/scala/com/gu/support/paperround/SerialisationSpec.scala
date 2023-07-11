package com.gu.support.paperround

import com.gu.support.paperround.PaperRoundService.{AgentsEndpoint, ChargeBandsEndpoint, CoverageEndpoint}
import com.gu.support.paperround.PaperRoundService.CoverageEndpoint._
import com.typesafe.scalalogging.LazyLogging
import io.circe.{Decoder, Error}
import io.circe.parser.{decode}
import org.scalatest.Assertion
import org.scalatest.flatspec.AsyncFlatSpec

class SerialisationSpec extends AsyncFlatSpec with LazyLogging {
  "AgentsEndpoint.Response" should "deserialise correctly" in {
    testDecoding[AgentsEndpoint.Response](s"$agentsSuccessJson")
  }

  "ChargeBandsEndpoint.Response" should "deserialise correctly" in {
    testDecoding[ChargeBandsEndpoint.Response](s"$chargeBandsSuccessJson")
  }

  "CoverageEndpoint.Response" should "deserialise a Not Covered response correctly" in {
    testDecoding[CoverageEndpoint.Response](s"$coverageSuccessNotCoveredJson", r => assert(r.data.status == NC))
  }

  it should "deserialise an Input Problem response correctly" in {
    testDecoding[CoverageEndpoint.Response](s"$coverageSuccessInputProblemJson", r => assert(r.data.status == IP))
  }

  it should "deserialise a Missing Postcode response correctly" in {
    testDecoding[CoverageEndpoint.Response](s"$coverageSuccessMissingPostcodeJson", r => assert(r.data.status == MP))
  }

  it should "deserialise a Covered response correctly" in {
    testDecoding[CoverageEndpoint.Response](s"$coverageSuccessCoveredJson", r => assert(r.data.status == CO))
  }

  "PaperRoundService.Error" should "deserialise example value correctly" in {
    testDecoding[PaperRoundService.Error](s"$errorJson")
  }

  def testDecoding[T: Decoder](fixture: String, objectChecks: T => Assertion = (_: T) => succeed): Assertion = {
    val decodeResult = decode[T](fixture)
    assertDecodingSucceeded(decodeResult, objectChecks)
  }

  def assertDecodingSucceeded[T](
      decodeResult: Either[Error, T],
      objectChecks: T => Assertion = (_: T) => succeed,
  ): Assertion =
    decodeResult.fold(
      e => fail(e.getMessage),
      result => objectChecks(result),
    )

  val agentsSuccessJson =
    """
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
    """

  val chargeBandsSuccessJson =
    """
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
    """

  val coverageSuccessNotCoveredJson =
    """
      {
          "status_code": 200,
          "data": {
              "message": "Not Covered",
              "status": "NC",
              "agents": []
          },
          "message": ""
      }
    """

  val coverageSuccessInputProblemJson =
    """
      {
          "status_code": 200,
          "data": {
              "message": "Problem with input",
              "status": "IP",
              "agents": []
          },
          "message": "Problem with input"
      }
    """

  val coverageSuccessMissingPostcodeJson =
    """
      {
          "status_code": 200,
          "data": {
              "message": "Missing Postcode",
              "status": "MP",
              "agents": []
          },
          "message": ""
      }
    """

  val coverageSuccessCoveredJson =
    """
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
    """

  val errorJson =
    """
      {
        "error_code": "2023-07-25T10:21:41.754Z",
        "message": "string",
        "status_code": 0
      }
    """
}
