#!/bin/bash

sudo -v

ENV_FILE="../.env"
NODE_MODULES_DIR="../node_modules"
CERT_DIR="../docker/dev/cert"
LOCAL_DOMAIN=127.0.0.1

# Load environment variables from .env file
if [ -f "$ENV_FILE" ]; then
  # shellcheck disable=SC2046
  export $(grep -E '^(PROXY_BASE_URL)' "$ENV_FILE" | xargs)
  if [ -z "$PROXY_BASE_URL" ]; then
    echo "Error: PROXY_BASE_URL is not set in $ENV_FILE"
    exit 1
  fi
else
  echo "Error: .env file not found at $ENV_FILE"
  exit 1
fi

# pre-checks
# Make sure the mkcert is installed
MKCERT_PATH=$(command -v mkcert 2>/dev/null)
if [ -z "$MKCERT_PATH" ]; then
  echo "Error: mkcert is not installed" >&2
  exit 1
fi

# Make sure the pnpm is installed
PNPM_PATH=$(command -v pnpm 2>/dev/null)
if [ -z "$PNPM_PATH" ]; then
  echo "Error: pnpm is not installed" >&2
  exit 1
fi

# cert folder existing and the cert files existing
if [ ! -d "$CERT_DIR" ] || [[ -z "$(ls "$CERT_DIR"/*.pem 2>/dev/null)" ]]; then
  mkdir -p "$CERT_DIR"
  echo "Generating self-signed certificate..."
  mkcert "$PROXY_BASE_URL" "*.$PROXY_BASE_URL"
  mv "./$PROXY_BASE_URL+1.pem" "$CERT_DIR"
  mv "./$PROXY_BASE_URL+1-key.pem" "$CERT_DIR"
  # TODO: chmod the cert files to be readable by nginx 644
else
  echo "Cert folder and cert files already exist. Skipping cert generation."
fi

# check if domaine exists - add domain to etc/host
mapfile -t DOMAIN_PREFIXES < <(grep -E '^[^=]+_PREFIX=' $ENV_FILE | grep -v '^#' | cut -d'=' -f2)
# root domain
if ! grep -q "$PROXY_BASE_URL" /etc/hosts; then
  echo "Adding $PROXY_BASE_URL to /etc/hosts"
  echo "$LOCAL_DOMAIN $PROXY_BASE_URL" | sudo tee -a /etc/hosts
fi
# subdomains
for PREFIX in "${DOMAIN_PREFIXES[@]}"; do
  DOMAIN="$PREFIX.$PROXY_BASE_URL"
  if ! grep -q "$DOMAIN" /etc/hosts; then
    echo "Adding $DOMAIN to /etc/hosts"
    echo "$LOCAL_DOMAIN $DOMAIN" | sudo tee -a /etc/hosts
  fi
done


# run pnpm install - if node modules do not exist
if [ ! -d "$NODE_MODULES_DIR" ]; then
  echo "Installing dependencies..."
  pnpm install
fi

# TODO: generate nginx.conf file for reverse proxy - use fastify reverse proxy config as template

# run docker compose
#docker compose -f docker/dev/docker-compose.dev.yaml --env-file .env watch