package monitoring

import app.BuildInfo
import com.gu.support.config.Stages.DEV
import com.gu.tip.{Tip, TipConfig, TipFactory}
import config.Configuration

object TipFromConfig {

  def apply(config: Configuration): Tip = {

    val tipConfig = TipConfig(
      repo = "guardian/support-frontend",
      cloudEnabled = true,
      boardSha = BuildInfo.gitCommitId
    )

    if (config.stage == DEV) //todo - verify this works correctly
      TipFactory.create(tipConfig)
    else
      TipFactory.createDummy(tipConfig)
  }

}
