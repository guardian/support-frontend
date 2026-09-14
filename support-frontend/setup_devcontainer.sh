#!/usr/bin/bash

set -e

install_nginx() {
  echo "Installing nginx..."

  sudo apt -y update
  sudo apt -y install nginx
  sudo apt -y install mkcert

  echo "Done installing nginx"
}

install_devnginx() {
  echo "Installing devnginx..."

  # The parenthesis scope the cd to this block
  (
    cd ~/.
    wget -q https://github.com/guardian/dev-nginx/releases/latest/download/dev-nginx.tar.gz
    mkdir -p dev-nginx && tar -xzf dev-nginx.tar.gz -C dev-nginx
    rm dev-nginx.tar.gz
  )

  local line='export PATH="$PATH:$HOME/dev-nginx/bin"'
  grep -qxF "$line" ~/.bashrc || echo "$line" >> ~/.bashrc

  # Also apply it now so later steps in this script can find dev-nginx
  export PATH="$PATH:$HOME/dev-nginx/bin"

  echo "Done installing devnginx"
}

setup_nginx() {
  echo "Setting up devnginx..."

  DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

  DOMAINS=(
    "support.thegulocal.com"
    "support-ui.thegulocal.com"
    "observer.thegulocal.com"
    "live.thegulocal.com"
  )

  # dev-nginx's setup-cert requires JAVA_HOME when java is on PATH; mise doesn't
  # export it, so derive it and forward it through sudo below
  JAVA_HOME="${JAVA_HOME:-$(mise where java 2>/dev/null)}"

  for domain in ${DOMAINS[@]}; do
    # sudo resets PATH so pass our PATH via env. Also override HOME so that
    # certs are installed into ~/. (and not root's home)
    sudo env "PATH=$PATH" "HOME=$HOME" "JAVA_HOME=$JAVA_HOME" dev-nginx setup-cert "$domain"
  done

  CONFIGS=(
    "support"
    "observer"
    "live"
  )

  for config in ${CONFIGS[@]}; do
    # link-config mkdirs into nginx's root-owned install dir, so needs sudo (+PATH)
    sudo env "PATH=$PATH" "HOME=$HOME" "JAVA_HOME=$JAVA_HOME" dev-nginx link-config ${DIR}/nginx/${config}.conf
    # extra link required because dev-nginx makes an assumption about /etc/nginx/servers, which isn't a think
    # on Linux
    sudo ln -s /etc/nginx/servers/${config}.conf /etc/nginx/conf.d/${config}.conf
  done

  sudo env "PATH=$PATH" "HOME=$HOME" "JAVA_HOME=$JAVA_HOME" dev-nginx restart-nginx

  echo "Done setting up devnginx"
}

install_chromium() {
  echo "Installing Chromium..."

  pnpm --filter support-e2e exec playwright install chromium --with-deps

  echo "Done installing Chromium"
}

print_next_steps() {
  echo "╔════════════════════════════════════════════════════════╗"
  echo "║ Setup complete!                                        ║"
  echo "║                                                        ║"
  echo "║ Open a new terminal (or run 'source ~/.bashrc') to add ║"
  echo "║ dev-nginx to your PATH.                                ║"
  echo "╚════════════════════════════════════════════════════════╝"
}

main () {
  install_nginx
  install_devnginx
  setup_nginx
  install_chromium
  print_next_steps
}

main
