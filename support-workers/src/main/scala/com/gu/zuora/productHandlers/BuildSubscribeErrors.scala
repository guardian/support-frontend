package com.gu.zuora.productHandlers

import com.gu.support.promotions.PromoError
import com.gu.support.redemption.InvalidCode

case class BuildSubscribePromoError(cause: PromoError) extends RuntimeException

case class BuildSubscribeRedemptionError(cause: InvalidCode) extends RuntimeException
