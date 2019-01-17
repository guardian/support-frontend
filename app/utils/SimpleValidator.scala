package utils

import com.gu.i18n.Country
import services.stepfunctions.CreateSupportWorkersRequest

object SimpleValidator {

  def validationPasses(request: CreateSupportWorkersRequest): Boolean = {
    val noEmptyNameFields = !request.firstName.isEmpty && !request.lastName.isEmpty

    def hasStateIfRequired: Boolean = {
      if (request.country == Country.US || request.country == Country.Canada) {
        request.state.isDefined
      } else true
    }

    noEmptyNameFields && hasStateIfRequired
  }
}
