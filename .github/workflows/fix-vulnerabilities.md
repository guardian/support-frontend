---
on: push

permissions:
  contents: read
  copilot-requests: write
  vulnerability-alerts: read
  issues: read
  pull-requests: read

network: defaults

tools:
  github:
    toolsets: [default]

safe-outputs:
  create-issue:
---

# Daily vulnerability report

Read high and critical vulnerabilities in the repo using dependabot
vulnerability alerts.

Log the packages with vulnerabilities in the workflow output including the
vulnerable version and the recommended version to upgrade to.
