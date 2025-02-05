package com.gu.zuora.productHandlers

import com.gu.support.promotions.PromoError

case class BuildSubscribePromoError(cause: PromoError) extends RuntimeException
