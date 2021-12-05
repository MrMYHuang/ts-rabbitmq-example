#!/bin/sh
git clone https://github.com/michaelklishin/tls-gen tls-gen
cd tls-gen/basic
# private key password
make PASSWORD=test
mv result certs
mv certs ../../config
