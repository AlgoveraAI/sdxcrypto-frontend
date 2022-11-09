# SDxCrypto Frontend

Frontend NextJS app and serverless Firebase functions for the SDxCrypto project.

Hosted app: https://sdxcrypto-algovera.web.app

Firebase project: https://console.firebase.google.com/project/sdxcrypto-algovera/

## Structure

`/frontend`: NextJS app

`/functions`: Serverless Firebase functions to interface with Coinbase Commerce

`/extensions`: Configuration for Moralis Firebase extension

## Integrations

It uses a Moralis extension to authenticate users with Firebase, Coinbase Commerce to receive payments, and a Firestore Database to track users' credit balance.

Images are retrieved from a Firebase Cloud Storage bucket.

## Install
`npm i`

## Run app
```
cd frontend
npm run dev
```

## Coinbase Setup
Add the Coinbase Commerce api key and webhook secret to `functions/.env` as per `/functions/.env.example`.

## Run firebase functions locally
`firebase serve`

## Deploy app
`firebase deploy`

## Deploy functions
`firebase deploy --only functions`

## Deploy extensions
`firebase deploy --only extensions`