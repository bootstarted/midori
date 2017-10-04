#!/usr/bin/env bash

ROOT=`dirname "$0"`
NODE_ENV=production node "${ROOT}/server" &
pid=$!

sleep 2

wrk "http://127.0.0.1:8000$1" \
  -d 20s \
  -c 400 \
  -t 12

kill $pid
