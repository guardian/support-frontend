package controllers

import play.api.mvc.{Controller, Action}

class Application extends Controller {

	def helloWorld = Action {
		Ok(views.html.index())
	}
	
}
