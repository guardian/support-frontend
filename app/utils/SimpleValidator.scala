package utils

import services.stepfunctions.CreateSupportWorkersRequest

object SimpleValidator {

  def validationPasses(request: CreateSupportWorkersRequest): Boolean = {
    !request.firstName.isEmpty && !request.lastName.isEmpty
  }
}
