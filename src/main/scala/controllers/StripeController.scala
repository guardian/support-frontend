package controllers

import play.api.mvc.{AbstractController, ControllerComponents}

class StripeController(controllerComponents: ControllerComponents) extends AbstractController(controllerComponents) {
  // Other considerations:
  // - CORS
  // - Test users
  // - Remember that API will change: no redirectUrl!
  def createCharge() = Action {
    // Deserialize POSTed JSON
    // stripe.Charge.create
    // if success:
    //   log
    //   save to DB
    //   send to Ophan
    //   return JSON
    // if fail:
    //   log
    //   return JSON

    Ok("hey")
  }
}
