package services

import cats.data.EitherT
import com.gu.supporterdata.model.{ContributionAmount, SupporterRatePlanItem}
import com.gu.supporterdata.model.Stage.{CODE, PROD}
import com.gu.supporterdata.services.SupporterDataDynamoService
import com.typesafe.scalalogging.StrictLogging
import model.db.ContributionData
import model.Environment
import model.Environment.Live

import java.time.LocalDate
import scala.concurrent.{ExecutionContext, Future}

class SupporterProductDataService(environment: Environment) extends StrictLogging {
  val dynamoService = SupporterDataDynamoService(environment match {
    case Live => PROD
    case _ => CODE
  })
  def insertContributionData(
      contributionData: ContributionData,
  )(implicit executionContext: ExecutionContext): EitherT[Future, String, Unit] =
    for {
      item <- EitherT.fromEither[Future](
        contributionData.identityId
          .map(idAsLong =>
            SupporterRatePlanItem(
              subscriptionName = s"${contributionData.paymentProvider.entryName} - ${contributionData.paymentId}",
              identityId = idAsLong.toString,
              gifteeIdentityId = None,
              productRatePlanId = "single_contribution",
              productRatePlanName = "Single Contribution",
              termEndDate = contributionData.created.toLocalDate
                .plusYears(8)
                .plusMonths(1), // 8 years and 1 month is our standard data retention period. As there are no benefits attached to a single contribution we don't need to remove them sooner
              contractEffectiveDate = contributionData.created.toLocalDate,
              contributionAmount = Some(
                ContributionAmount(contributionData.amount, contributionData.currency.toString),
              ),
            ),
          )
          .toRight(
            s"Missing identity id for contribution $contributionData this is a primary key of the data store so we can't continue",
          ),
      )
      response <- EitherT(
        dynamoService
          .writeItem(item)
          .map { _ =>
            logger.info(s"Successfully wrote supporter product information for user ${item.identityId}")
            Right(())
          }
          .recover { case err: Throwable =>
            Left(
              s"An error occurred while writing to the supporter product data dynamo store: ${err.getMessage}",
            )
          },
      )
    } yield response

}
