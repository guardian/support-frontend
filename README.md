# support-models

[![Maven Central](https://maven-badges.herokuapp.com/maven-central/com.gu/support-models_2.11/badge.svg)](https://maven-badges.herokuapp.com/maven-central/com.gu/support-models_2.11)

Shared models used to interact with support step-functions.  Used by [support-workers](https://github.com/guardian/support-workers) and [support-frontend](https://github.com/guardian/support-frontend)

Releasing to local repo
==================

Run `sbt publishLocal`.


Releasing to maven
==================

We use sbt to release to Maven. Please check notes here to ensure you are set up to release to Maven:
https://docs.google.com/document/d/1rNXjoZDqZMsQblOVXPAIIOMWuwUKe3KzTCttuqS7AcY/edit?usp=sharing

Then run `sbt release`.
