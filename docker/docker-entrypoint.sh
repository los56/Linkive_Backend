#!/bin/sh

echo "Wait Database..."
dockerize -wait tcp://db:5432 -timeout 20s

node index.js