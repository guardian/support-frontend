package com.gu.support.zuora.api

import com.gu.support.encoding.Codec
import com.gu.support.encoding.Codec._

object PreviewOptions {
  implicit val codec: Codec[PreviewOptions] = capitalizingCodec
}

case class PreviewOptions(enablePreviewMode: Boolean = true, numberOfPeriods: Int)
