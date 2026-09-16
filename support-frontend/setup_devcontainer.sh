#!/usr/bin/bash

set -e

install_nginx() {
  echo "Installing nginx..."

  sudo apt -y update
  sudo apt -y install nginx
  sudo apt -y install mkcert
  sudo apt -y install libnss3-tools

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
    # extra link required because dev-nginx makes an assumption about /etc/nginx/servers, which isn't a thing
    # on Linux
    sudo ln -fs /etc/nginx/servers/${config}.conf /etc/nginx/conf.d/${config}.conf
  done

  sudo env "PATH=$PATH" "HOME=$HOME" "JAVA_HOME=$JAVA_HOME" dev-nginx restart-nginx

  echo "Done setting up devnginx"
}

trust_mkcert_ca() {
  echo "Trusting mkcert CA for Chromium..."

  # setup-cert ran under sudo, so the CA (and any NSS db it created) are
  # root-owned; hand them back so mkcert can update the user's trust stores
  sudo chown -R "$USER:$USER" "$(mkcert -CAROOT)"
  [ -d "$HOME/.pki" ] && sudo chown -R "$USER:$USER" "$HOME/.pki"

  # Chromium/Playwright verify certs against ~/.pki/nssdb, which mkcert only
  # populates when certutil (libnss3-tools) is present.
  # mkcert only writes to an existing NSS db, so create an empty one first
  # (Playwright's Chromium never launches to create it itself)
  if [ ! -f "$HOME/.pki/nssdb/cert9.db" ]; then
    mkdir -p "$HOME/.pki/nssdb"
    certutil -d sql:"$HOME/.pki/nssdb" -N --empty-password
  fi

  mkcert -install

  echo "Done trusting mkcert CA"
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
  trust_mkcert_ca
  install_chromium
  print_next_steps
}

main
