#!/usr/bin/env bash

# source NVM inside script before invoking it
nvm_available() {
  type -t nvm > /dev/null
}

source_nvm() {
  if ! nvm_available; then
    [ -e "/usr/local/opt/nvm/nvm.sh" ] && source /usr/local/opt/nvm/nvm.sh
  fi
  if ! nvm_available; then
    [ -e "$HOME/.nvm/nvm.sh" ] && source $HOME/.nvm/nvm.sh
  fi
}

source_nvm

nvm use
yarn devrun &
yarn storybook &
cd ..; sbt -mem 2048 "project support-frontend" devrun
