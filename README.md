# How Bazaar - A Marketplaces App

A node.js and babel template repo.

## MongoDB

Get a MongoDB instance running in a container with dummy data.

```shell
docker run -d -p 27017:27017 --name node-babel-mongo \
  -v $(pwd)/data:/docker-entrypoint-initdb.d \
  mongo
```

## Getting Started

```
# start nodemon server
npm run dev
```

## JWT Signing Algorithms

Using the HS256 algorithm, you can use simple strings as the signing secret on the segnature.

It's possible to use RSA private/public keys to sign JWT's.

To create a RSA key, use the following commands in the terminal (on macOS and Linux):

```shell
ssh-keygen -t rsa -b 4096 -m PEM -f jwtRS256.key
# Don't add passphrase
openssl rsa -in jwtRS256.key -pubout -outform PEM -out jwtRS256.key.pub
cat jwtRS256.key
cat jwtRS256.key.pub
```

Note, you should never reveal the private key to anyone, or non-trusted users, and never commit private keys to GitHub.
