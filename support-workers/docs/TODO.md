TODO
====

Step-functions is a very new AWS product and is missing some features that we have had to work around.  When new features
are released we should remove our workarounds.

Workarounds
-----------

1. Tagging not available so state machine discovery in support-frontend is based on name
2. Name is not a field in cloudformation, so cfn uses conditional-creation to append CODE or PROD to state machine name
