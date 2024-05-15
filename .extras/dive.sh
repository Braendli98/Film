#!/bin/bash


# Aufruf:   .\dive.sh [distroless|wolfi|bookworm]

base=${1}

# Titel setzen
echo -en "\033]1; dive \007"

diveVersion='v0.12.0'
imagePrefix='juergenzimmermann/'
imageBase='film'
imageTag="2024.04.0-$base"

image="$imagePrefix${imageBase}:$imageTag"
# image='gcr.io/distroless/nodejs20-debian12:nonroot'
# image='node:20.7.0-bookworm-slim'
# image='cgr.dev/chainguard/node:latest'

# https://github.com/wagoodman/dive#installation
docker run --rm --interactive --tty \
  --mount type='bind,source=/var/run/docker.sock,destination=/var/run/docker.sock' \
  --hostname dive --name dive \
  --read-only --cap-drop ALL \
  wagoodman/dive:$diveVersion $image
