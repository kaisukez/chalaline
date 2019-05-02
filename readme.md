## Setup
### Install serverless framework
```
npm install -g serverless
```

### Install all packages
```
npm install
```

### Setup account
You can get access-key-id and secret-access-key [here](https://console.aws.amazon.com/iam/home?region=ap-southeast-1#/security_credentials)

Then you can setup account with this method below or use [other method](https://serverless.com/framework/docs/providers/aws/cli-reference/config-credentials/)
```
serverless config credentials --provider aws --profile chalaline --key <your-access-key-id> --secret <your-secret-access-key>
```

## Test on localhost
```
serverless offline --port 5555
```

## Deploy
```
serverless deploy
```
