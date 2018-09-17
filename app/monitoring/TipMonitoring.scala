package monitoring

import app.BuildInfo
import com.gu.tip.{Tip, TipConfig, TipFactory}
import config.Configuration

object TipMonitoring {

  def init(config: Configuration): Tip = {

    val tipConfig = TipConfig(
      "guardian",
      "support-frontend",
      true,
      BuildInfo.gitCommitId,
      config.tipPersonalAccessToken,
      "Verified in PROD"
    )

    if (config.stage.toString == "PROD") //todo - verify this works correctly
      TipFactory.create(tipConfig)
    else
      //TipFactory.createDummy(tipConfig)
      TipFactory.create(tipConfig) // todo - replace with createDummy line (commented above) after local testing
  }

}
