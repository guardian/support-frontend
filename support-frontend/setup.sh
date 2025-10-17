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

nvm_installed() {
  if [ -d '/usr/local/opt/nvm' ] || [ -d "$HOME/.nvm" ]; then
    true
  else
    false
  fi
}

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

install_homebrew_if_mac() {
  if mac && ! installed brew; then
    ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
  fi
}

install_jdk() {
  if ! installed javac; then
    if linux; then
      sudo apt-get install -y openjdk-8-jdk
    elif mac; then
      EXTRA_STEPS+=("Download the JDK from https://adoptopenjdk.net")
    fi
  fi
}

install_nvm() {
  if linux && ! installed curl; then
    sudo apt-get install -y curl
  fi
  curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.8/install.sh | bash
  EXTRA_STEPS+=("Add https://git.io/vKTnK to your .bash_profile")
}

install_node() {
  if ! nvm_installed; then
    install_nvm
  elif ! nvm_available; then
    source_nvm
  fi
  nvm install
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
  install_node
  install_homebrew_if_mac
  install_brew_deps
  setup_nginx
  install_jdk
  corepack_enable
  install_js_deps

  report
}

main
