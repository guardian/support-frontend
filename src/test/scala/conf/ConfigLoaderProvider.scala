package conf

import com.amazonaws.services.simplesystemsmanagement.AWSSimpleSystemsManagement
import org.scalatest.{BeforeAndAfterAll, Suite}

import scala.reflect.ClassTag

import aws.AWSClientBuilder
import conf.ConfigLoader.ParameterStoreLoadableByEnvironment
import model.Environment

trait ConfigLoaderProvider extends BeforeAndAfterAll { self: Suite =>

  private val ssm: AWSSimpleSystemsManagement = AWSClientBuilder.buildAWSSimpleSystemsManagementClient()
  private val configLoader = new ConfigLoader(ssm)

  def testConfigForEnvironment[A : ParameterStoreLoadableByEnvironment : ClassTag](): A =
    configLoader.configForEnvironment[A](Environment.Test).valueOr(throw _)

  override protected def afterAll(): Unit = {
    ssm.shutdown()
    super.afterAll()
  }
}
