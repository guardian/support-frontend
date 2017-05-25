# support-models
Shared models used to interact with support step-functions.  Used by [support-workers](https://github.com/guardian/support-workers) and [support-frontend](https://github.com/guardian/support-frontend)

Releasing to local repo
==================

Run `sbt publishLocal`.


Releasing to maven
==================

We use sbt to release to Maven. Please check notes here to ensure you are set up to release to Maven:
https://docs.google.com/document/d/1M_MiE8qntdDn97QIRnIUci5wdVQ8_defCqpeAwoKY8g/edit#heading=h.r815791vmxv5

Then run `sbt release`.
