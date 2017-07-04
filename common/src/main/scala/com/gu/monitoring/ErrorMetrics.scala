import com.amazonaws.services.cloudwatch.model.Dimension
import com.gu.monitoring.CloudWatch

trait ErrorMetrics extends CloudWatch {

  lazy val errorDimension = new Dimension()
    .withName("StepName").withValue(stepName)
    .withName("ServiceName").withValue(serviceName)
    .withName("ErrorCode").withValue(errorCode)

  override def mandatoryDimensions: Seq[Dimension] = super.commonDimensions ++ errorDimension
}