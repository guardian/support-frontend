package conf

import com.amazonaws.services.simplesystemsmanagement.AWSSimpleSystemsManagement
import org.scalatest.{BeforeAndAfterAll, Suite}

import scala.reflect.ClassTag

import aws.AWSClientBuilder
import conf.ConfigLoader.ParameterStoreLoadable
import conf.ConfigLoader._
import model.Environment

trait ConfigLoaderProvider extends BeforeAndAfterAll { self: Suite =>

  private val ssm: AWSSimpleSystemsManagement = AWSClientBuilder.buildAWSSimpleSystemsManagementClient()
  private val configLoader = new ConfigLoader(ssm)

  def configForTestEnvironment[A: ParameterStoreLoadable[Environment, ?]: ClassTag](): A =
    configLoader.loadConfig[Environment, A](Environment.Test).valueOr(throw _)

  override protected def afterAll(): Unit = {
    ssm.shutdown()
    super.afterAll()
  }
}
