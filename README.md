# ucbfpa-lambda

UC Berkeley Food Pantry: AWS Lambda Functions

## Setup Guide

Ideally, perform these sections in order, unless you know what you're doing.

### AWS IAM: Setting Up Your AWS CLI User

1. Sign in to the AWS Management Console and open the IAM console [here](https://console.aws.amazon.com/iam/).
2. Select "Users" -> Set User name -> Select "Programmatic access" -> Next: Permissions.
3. Select "Attach existing policies directly" -> Select "AWSLambdaFullAccess".
4. Next: Tags -> Next: Review -> Create user.
5. Download .csv (you will not be able to download it later). You will find your "Access Key ID" and your "Secret Access Key" in the .csv file (and also on the current page). You will need these two values later on!
6. Close.

### AWS IAM: Setting Up Your Lambda Execution Role

1. Sign in to the AWS Management Console and open the IAM console [here](https://console.aws.amazon.com/iam/).
2. Select "Roles" -> Select "Create Role" -> Select "AWS service" and pick "AWS Lambda" -> Next: Permissions
3. Select "AWSLambdaBasicExecutionRole" for this role -> Next: Tags -> Next: Review.
4. Set a Role Name -> Create role.
5. Back on the Roles page, click on your newly created role. Note your Role ARN. It should look something like this: ```arn:aws:iam::123456789012:role/role-name```. You will need this value later on!

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
8. On the AWS Lambda console, explore the use of environment variables to inject secrets into the app as well as the timeout settings.

### Setting up Amazon Cognito

1. The next few steps were taken from this guide: [Setting up Amazon Cognito and the Amazon SDK for Javascript](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/getting-started-browser.html).
2. Sign in to the AWS Management Console and open the Amazon Cognito console [here](https://console.aws.amazon.com/cognito/).
3. We selected "us-west-1 (Oregon)" as our region.
4. Choose "Manage Identity Pools" on the console opening page.
5. On the next page, choose "Create new identity pool". If you have no existing identity pools, skip this step. It will automatically go to the pool creation page.
6. In the Getting started wizard, type a name for your identity pool in Identity pool name. We picked ```CalNourish```.
7. Choose "Enable access to unauthenticated identities".
8. Choose "Create Pool".
9. On the next page, choose "View Details" to see the names of the two IAM roles created for your identity pool. Make a note of the name of both roles.
10. Choose "Allow".
11. For the platform, select "Javascript".
12. Under "Get AWS Credentials", remember this piece of code. You'll be adding it to the webapp.
13. To reiterate, remember the names of the two IAM roles you created for your identity pool as well as the code snippet above.
14. Go back to the IAM console [here](https://console.aws.amazon.com/iam/).
15. In the navigation panel on the left of the page, choose Roles.
16. In the list of IAM roles, click on the link for the unauthenticated identities role previously created by Amazon Cognito.
17. In the "Summary" page for this role, choose "Attach policies".
18. In the "Attach Permissions" page for this role, search for "Lambda" and then select the check box for AWSLambdaRole.
19. Choose "Attach policy".
20. Repeat for the authenticated identities role.

### Setting up Amazon SDK in Browser

1. Visit [this page](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/) to get the code snippet needed to use the Amazon SDK in your browser. Add this snippet to your html file. In our case, this code resides in our [ucbfpa-webapp](https://github.com/CalNourish/ucbfpa-webapp) repository.
2. Add the code snippet that authenticates the user to the webapp. Again, this code resides [here](https://github.com/CalNourish/ucbfpa-webapp).
3. The next steps were taken from this guide:[Setting up Amazon Lambda for Javascript](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/browser-invoke-lambda-function-example.html)
4. Scroll to the "Creating the Lambda Service Object" section and copy this code snippet so that it resides after you authenticate with Amazon Cognito.
5. Update the region to the region your Lambda function resides in (this may or may not be the same as the region where your Amazon Cognito resides. For us, the Lambda function resides in us-west-1.).
6. Update the API version to a more recent date.
7. Inside the params variable, change the function name to our function name.
8. Scroll to the "Invoking the Lambda Function" section and copy this code snippet to execute the lambda function.
9. Execute your Lambda function!

## Dependencies

This repository relies on the Node.js implementation of the Expo Server SDK as well as Firebase. To install, either run ```npm install``` or install separately with:

- ```npm install --save firebase```
- ```npm install --save expo-server-sdk```
