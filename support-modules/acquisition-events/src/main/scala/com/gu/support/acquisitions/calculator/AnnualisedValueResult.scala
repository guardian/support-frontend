package com.gu.support.acquisitions.calculator

sealed trait AnnualisedValueResult

object AnnualisedValueResult {
  def fromResult(result: Either[String, Double]): AnnualisedValueResult = {
    result.fold(
      err => AVError(err),
      value => AnnualisedValueTwo(value),
    )
  }
}

case class AnnualisedValueTwo(amount: Double) extends AnnualisedValueResult
case class AVError(error: String) extends AnnualisedValueResult
