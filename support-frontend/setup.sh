#!/usr/bin/env bash
set -e

readonly SYSTEM=$(uname -s)
EXTRA_STEPS=()

linux() {
  [[ ${SYSTEM} == 'Linux' ]]
}

mac() {
  [[ ${SYSTEM} == 'Darwin' ]]
}

installed() {
  hash "$1" 2>/dev/null
}

check_encryption() {
  if linux; then
    EXTRA_STEPS+=("Sorry, can't check if your hard disk is encrypted - please ensure that it is! (applies to both portable and Desktop machines)")
  elif mac; then
    if [[ "$(fdesetup status)" != "FileVault is On." ]]; then
      EXTRA_STEPS+=("your hard disk is not encrypted! Encryption must be enabled on all guardian machines. Follow these instructions: https://support.apple.com/en-gb/HT204837")
    fi
  fi
}

create_aws_config() {
  local path="$HOME/.aws"
  local filename="config"

  if [[ ! -f "$path/$filename" ]]; then
    if [[ ! -d "$path" ]]; then
      mkdir "$path"
    fi

    echo "[profile membership]
region = eu-west-1" > "$path/$filename"
  fi
}

setup_nginx() {
  DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

  DOMAINS=(
    "support.thegulocal.com"
    "support-ui.thegulocal.com"
    "observer.thegulocal.com"
    "live.thegulocal.com"
  )

  for domain in ${DOMAINS[@]}; do
    sudo dev-nginx setup-cert $domain
  done

  dev-nginx link-config ${DIR}/nginx/support.conf
  dev-nginx link-config ${DIR}/nginx/observer.conf
  dev-nginx link-config ${DIR}/nginx/live.conf
  dev-nginx restart-nginx
}

corepack_enable() {
  corepack enable
}

install_js_deps() {
  pnpm install
}

install_brew_deps() {
  # Installs dependencies defined in Brewfile
  brew bundle
}

report() {
  if [[ ${#EXTRA_STEPS[@]} -gt 0 ]]; then
    for i in "${!EXTRA_STEPS[@]}"; do
      echo "  $((i+1)). ${EXTRA_STEPS[$i]}"
    done
  fi
}

main () {
  check_encryption
  create_aws_config
  install_brew_deps
  setup_nginx
  corepack_enable
  install_js_deps

  report
}

main
