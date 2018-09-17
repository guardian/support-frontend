package actions

import admin.{Settings, SettingsProvider}
import play.api.mvc._

import scala.concurrent.{ExecutionContext, Future}

// Since settings can change over the application lifecycle (see SettingsProvider)
// this action function can be used to ensure that the latest settings are attached to any request that requires them for handling.
// It mitigates against initialising val settings: Settings = settingsProvider.settings()
// as a class level variable (which wouldn't change over the application lifecycle).
// It also ensures that the response to any request which requires settings to handle, contains the Fastly Surrogate-Key header,
// so that if the settings do change over the application life-cycle, we can restrict the routes that need to be purged.
// See https://docs.fastly.com/api/purge#purge_d8b8e8be84c350dd92492453a3df3230 for more details.

// Using the higher-kinded type parameter R[_] lets us compose this action with action functions that return wrapped requests
// - e.g. AuthRequest, OptionalAuthRequest - in addition to regular requests.
// The syntax SettingsRequest[R, ?] is available via the kind-projector plugin https://github.com/non/kind-projector
class SettingsActionFunction[R[_] <: Request[_]](
    settingsProvider: SettingsProvider
)(implicit override val executionContext: ExecutionContext) extends ActionFunction[R, SettingsRequest[R, ?]] {

  override def invokeBlock[A](request: R[A], block: SettingsRequest[R, A] => Future[Result]): Future[Result] =
    block(SettingsRequest(settingsProvider.settings(), request)).map(_.withHeaders("Surrogate-Key" -> "settings"))
}

// Utility class used to provide the current settings for a request which requires them.
// Should only ever be created using a SettingsActionFunction.
case class SettingsRequest[R[_] <: Request[_], A] private[actions] (_settings: Settings, withoutSettings: R[A])
  extends WrappedRequest[A](withoutSettings.asInstanceOf[Request[A]]) { // TODO: why do we need to cast type here?
  implicit val settings: Settings = _settings
}

// Utility class for composing a SettingsActionFunction with other action functions.
// Motivated by the fact that compiler needs you to provide an explicit type parameter for the andThen method,
// which starts to become a bit verbose, when used over the whole code base.
class SettingsSyntax(settingsProvider: SettingsProvider)(implicit ec: ExecutionContext) {

  def addSettingsTo[R[_] <: Request[_]](actionBuilder: ActionBuilder[R, AnyContent]): ActionBuilder[SettingsRequest[R, ?], AnyContent] =
    actionBuilder.andThen[SettingsRequest[R, ?]](new SettingsActionFunction[R](settingsProvider))

  implicit def toSettings[R[_] <: Request[_]](implicit request: SettingsRequest[R, AnyContent]): Settings = request.settings
}

//object Test extends App {
//
//  type Settings = String
//
//  trait Request[A]
//
//  class WrappedRequest[A](request: Request[A]) extends Request[A]
//
//  case class UserRequest[A](user: A) extends Request[A]
//
//  case class RequestWithSettings[R[_] <: Request[_], A](settings: Settings, request: R[A])
//    extends WrappedRequest[A](request.asInstanceOf[Request[A]])
//
//  val request = RequestWithSettings("some settings", UserRequest("guy"))
//}