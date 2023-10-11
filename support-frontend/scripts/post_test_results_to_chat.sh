#!/bin/bash
echo "Tests have failed - calling webhook"
failedWorkflowRun="https://github.com/guardian/support-frontend/actions/runs/${RUN_ID}"

#curl -X POST -H 'Content-Type: application/json' "${GOOGLE_CHAT_WEB_HOOK}" -d '{"text": "❌ The post deployment tests for support frontend have failed! <users/all> \n \n 👉 <'"$failedWorkflowRun"'|Workflow run> \n 🤖 <https://automate.browserstack.com/dashboard/v2/builds/31f35a1d9bccc9d45360aa7bfd651fcd9e1499d0|Browser stack test results> \n \n 📖 <https://github.com/guardian/support-frontend/wiki/Post-deployment-test-runbook|Check the runbook for a step by step guide>"}'
