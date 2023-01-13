# support-internationalisation
Internationalisation classes for use by the various supporter sites such as [membership-frontend](https://github.com/guardian/membership-frontend) and [support-workers](https://github.com/guardian/support-workers)

Releasing to local repo
==================

Run `sbt +publishLocal`.


Releasing to maven
==================

We use sbt to release to Maven. This document describes the setup steps required to enable you to release:
https://docs.google.com/document/d/1rNXjoZDqZMsQblOVXPAIIOMWuwUKe3KzTCttuqS7AcY/edit#

Then run `sbt +release`.
