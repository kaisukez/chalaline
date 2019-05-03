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

Then set your key every time you open terminal (for working with dynamodb)


for linux, macOS
```
export AWS_ACCESS_KEY_ID=<your-access-key-id>
export AWS_SECRET_ACCESS_KEY=<your-secret-access-key>
```

for windows
```
set AWS_ACCESS_KEY_ID=<your-access-key-id>
set AWS_SECRET_ACCESS_KEY=<your-secret-access-key>
```

## Test on localhost
```
serverless offline --port 5555
```

## Deploy
```
serverless deploy
```

## Remove all lambda
```
serverless remove
```