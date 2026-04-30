#!/bin/sh

DEVENV_ROOT_FILE="$(mktemp)"
trap 'rm -f "$DEVENV_ROOT_FILE"' EXIT
printf %s "$PWD" > "$DEVENV_ROOT_FILE"

nix develop --override-input devenv-root "file+file://$DEVENV_ROOT_FILE"
