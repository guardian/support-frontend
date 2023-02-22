# support-internationalisation
Internationalisation classes for use by the various supporter sites such as [membership-frontend](https://github.com/guardian/membership-frontend) and [support-workers](https://github.com/guardian/support-workers)

Releasing to local repo
==================

Run `sbt +publishLocal`.


Releasing to maven
==================

We use sbt to release to Maven. This document describes the setup steps required to enable you to release:
https://docs.google.com/document/d/1rNXjoZDqZMsQblOVXPAIIOMWuwUKe3KzTCttuqS7AcY/edit#

1. You should run the release on your local branch not `main` - this is because the final release step updates the library versions then commits and pushes the changes and this will not work on main as it is protected.
2. Ensure that your branch is up to date with `main` in case of regressions - to do this you should run `git pull origin main` and fix any merge conflicts
3. Run ` sbt "project support-internationalisation" +release` and follow the instructions - you will have to enter the passphrase for your pgp key during the process
4. Make a PR and merge your branch to `main`
