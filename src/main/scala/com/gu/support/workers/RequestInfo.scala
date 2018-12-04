package com.gu.support.workers

case class RequestInfo(encrypted: Boolean, testUser: Boolean, failed: Boolean, messages: List[String]){
  def appendMessage(message: String) = copy(messages = messages :+ message)
}
