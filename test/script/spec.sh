#!/bin/sh

OPTS="-r test/helpers/chai.js -r adana-dump --compilers js:babel-core/register -R spec"
SPECS="test/spec/**/*.spec.js"

# Check for stupid HAPI
echo '"use strict"; const i = 1;' | node > /dev/null 2>&1
if [ $? -ne 0 ]; then
  SPECS="test/spec/**/!(*hapi*).spec.js"
fi

set -x
./node_modules/.bin/_mocha ${OPTS} ${SPECS}
