package com.gu.support.workers.model

sealed trait Period

case object Monthly extends Period

case object Quarterly extends Period

case object Annual extends Period