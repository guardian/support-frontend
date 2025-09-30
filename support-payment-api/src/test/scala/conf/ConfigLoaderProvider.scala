package conf

import org.scalatest.{BeforeAndAfterAll, Suite}

import scala.reflect.ClassTag
import aws.AWSClientBuilder
import conf.ConfigLoader.ParameterStoreLoadable
import conf.ConfigLoader._
import model.Environment
import software.amazon.awssdk.services.ssm.SsmClient

trait ConfigLoaderProvider extends BeforeAndAfterAll { self: Suite =>

  private val ssm: SsmClient = AWSClientBuilder.buildSsmClient()
  private val configLoader = new ConfigLoader(ssm)

  def configForTestEnvironment[A: ParameterStoreLoadable[Environment, *]: ClassTag](): A = {
    configLoader.loadConfig[Environment, A](Environment.Test).valueOr(throw _)
  }

  override protected def afterAll(): Unit = {
    ssm.close()
    super.afterAll()
  }
}
