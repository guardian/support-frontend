#!/usr/bin/bash

set -e

install_nginx() {
  sudo apt -y update
  sudo apt -y install nginx
  sudo apt -y install mkcert
}

install_devnginx() {
  # The parenthesis scope the cd to this block
  (
    cd ~/.
    wget -q https://github.com/guardian/dev-nginx/releases/latest/download/dev-nginx.tar.gz
    mkdir -p dev-nginx && tar -xzf dev-nginx.tar.gz -C dev-nginx
    rm dev-nginx.tar.gz
  )
  local line='export PATH="$PATH:$HOME/dev-nginx/bin"'
  grep -qxF "$line" ~/.bashrc || echo "$line" >> ~/.bashrc
}

install_chromium() {
  pnpm --filter support-e2e exec playwright install chromium --with-deps
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
  install_chromium
  print_next_steps
}

main
