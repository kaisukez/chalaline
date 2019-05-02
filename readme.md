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
```
serverless config credentials --provider aws --profile chalaline --key <your-access-key-id> --secret <your-secret-access-key>
```

### Set default profile
You must set default profile every time you open terminal


on linux, mac, unix
```
export AWS_DEFAULT_PROFILE=chalaline
```

on windows cmd
```
setx AWS_DEFAULT_PROFILE chalaline
```

## Test on localhost
```
sls offline
```

## Deploy
```
serverless deploy
```
