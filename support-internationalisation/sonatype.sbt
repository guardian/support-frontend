sonatypeProfileName := "com.gu"
publishMavenStyle := true
licenses := Seq("APL2" -> url("http://www.apache.org/licenses/LICENSE-2.0.txt"))
homepage := Some(url("https://github.com/guardian/support-frontend/tree/master/support-internationalisation"))
scmInfo := Some(ScmInfo(url("https://github.com/guardian/support-frontend/tree/master/support-internationalisation"), "scm:git@github.com:guardian/support-frontend.git"))
developers := List(
  Developer(id="rbates", name="Rupert Bates", email="", url=url("https://github.com/rupertbates")),
)
publishTo := sonatypePublishToBundle.value



