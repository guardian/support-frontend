#!/usr/bin/env bash

pnpm concurrently \
  --prefix-colors auto \
  --names webpack,storybook,sbt,express \
  --pad-prefix \
  "pnpm devrun" \
  "pnpm storybook" \
  "cd .. && sbt -mem 2048 'project support-frontend' devrun" \
  "cd .. && pnpm --filter support-backend start"
