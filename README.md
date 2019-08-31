# ucbfpa-lambda

UC Berkeley Food Pantry: AWS Lambda Functions

## Dependencies

This repository relies on the Node.js implementation of the Expo Server SDK as well as Firebase. To install, either run ```npm install``` or install separately with:

- ```npm install --save firebase```
- ```npm install --save expo-server-sdk```

## Setup Guide

These sections should be performed in order. If you are taking over this project, most of this work has been configured for you. Nevertheless, this guide is here as a step-by-step on recreating the Firebase and AWS Lambda integration from scratch.

### AWS IAM: Setting Up Your Lambda Execution Role

1. Sign in to the AWS Management Console and open the IAM console [here](https://console.aws.amazon.com/iam/).
2. Select "Roles" -> Select "Create Role" -> Select "AWS service" and pick "AWS Lambda" -> Next: Permissions
3. Select "AWSLambdaBasicExecutionRole" for this role -> Next: Tags -> Next: Review.
4. Set a Role Name -> Create role.
5. Back on the Roles page, click on your newly created role. Note your Role ARN. It should look something like this: ```arn:aws:iam::123456789012:role/role-name```. You will need this value later on!

### AWS IAM: Setting Up Your AWS CLI User

1. Sign in to the AWS Management Console and open the IAM console [here](https://console.aws.amazon.com/iam/).
2. Select "Users" -> Set User name -> Select "Programmatic access" -> Next: Permissions.
3. Select "Attach existing policies directly" -> Select "AWSLambdaFullAccess".
4. Next: Tags -> Next: Review -> Create user.
5. Download .csv (you will not be able to download it later). You will find your "Access Key ID" and your "Secret Access Key" in the .csv file (and also on the current page). You will need these two values later on!
6. Close.

### AWS CLI: Setting Up AWS CLI

1. Refer to [this guide](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html) to install. Personally, I prefer the virtualenv + pip installation on my MacBook -- this is the cleanest and easiest method.
2. Run ```aws help``` to check if your AWS CLI has been installed correctly.
3. Run ```aws configure```. You will need your "Access Key ID" and your "Secret Access Key" from the previous section to finish configuration.

### AWS CLI: Deploying a Function

Note: Deploying our function via AWS CLI is the only option. We cannot use the browser code editor because our functions have external dependencies.

1. Run ```aws lambda list-functions``` to see if you can reach AWS Lambda.
2. Within the ```ucbfpa-lambda``` directory, run: ```find . -type d -exec chmod 755 {} \; && find . -type f -exec chmod 644 {} \;```. This is just a safety check to make sure all your files are readable by Lambda.
3. To create a compressed upload file, run ```zip -r function.zip .```.
4. Run ```aws lambda create-function --cli-connect-timeout 6000 --function-name FUNCTION_NAME_HERE --runtime nodejs10.x --role ROLE_HERE --handler index.handler --zip-file fileb://function.zip```, filling in the function name and role (this is the Role ARN you received from the earlier section).
5. Run ```aws lambda list-functions``` to confirm that your function is there.
6. To update a function, run ```aws lambda update-function-code --cli-connect-timeout 6000 --function-name FUNCTION_NAME_HERE --zip-file fileb://function.zip```.
7. To help automate the process, the script ```deployment.sh``` is available in this repo that will take care of generating the zip file, deploying to AWS Lambda and cleaning up the zip file after.
8. If you do not provide command line arguments to ```deployment.sh``` it will deploy the test function. You must specify ```prod``` as the first argument to deploy to the prod function.
9. On the AWS Lambda console, explore the use of environment variables to inject secrets into the app as well as the timeout settings.

### Our Functions

This repo deploys two AWS functions, ```testSendNotification``` and ```prodSendNotification```. The code for both functions is the same. On the AWS Lambda console, you will need to set environment variables depending on the function. Both functions will have the same environment variable keys, but will have different values.

GOOGLE_APPLICATION_CREDENTIALS should be set to the relative file-path of your service account JSON file.

FIREBASE_CONFIG is a JSON that looks like the following:

```json
{
    "authDomain": <INSERT VALUE HERE>,
    "databaseURL": <INSERT VALUE HERE>,
    "storageBucket": <INSERT VALUE HERE>
}
```

Finally, FIREBASE_DATABASE_URL should be set to the same URL as the ```databaseURL``` value in FIREBASE_CONFIG.

Finally, the timeout settings may need adjustment. The default timeout (3 seconds) is usually not enough for even one notification request. Currently, the timeout is at 5 seconds.

## Notifications: Resources

- [Expo Push Notifications](https://docs.expo.io/versions/v34.0.0/guides/push-notifications/)
- [Expo Push Notifications for Android Using FCM](https://docs.expo.io/versions/v34.0.0/guides/using-fcm/)
- [Notification Channels](https://docs.expo.io/versions/latest/guides/notification-channels/)
