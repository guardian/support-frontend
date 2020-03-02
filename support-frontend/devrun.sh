#!/usr/bin/env bash

# source NVM inside script before invoking it
. ~/.nvm/nvm.sh

nvm use &
yarn devrun &
yarn storybook &
cd ..; sbt -mem 2048 "project support-frontend" devrun
