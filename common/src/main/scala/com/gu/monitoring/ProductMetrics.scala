import com.amazonaws.services.cloudwatch.model.Dimension
import com.gu.monitoring.CloudWatch

trait ProductMetrics extends CloudWatch {

  //Product's Dimensions
  val productName: String
  val paymentMethod: String
  val subscriptionPeriod: String

  lazy val productDimensions = new Dimension()
    .withName("ProductName").withValue(productName)
    .withName("PaymentMethod").withValue(paymentMethod)
    .withName("SubscriptionPeriod").withValue(subscriptionPeriod)

  override def mandatoryDimensions: Seq[Dimension] = super.commonDimensions ++ productDimensions
}