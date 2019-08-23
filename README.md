# ucbfpa-lambda
UC Berkeley Food Pantry: AWS Lambda Functions

## Setup Guide

1. Go to [the AWS Lambda homepage](https://us-west-1.console.aws.amazon.com/lambda/home?region=us-west-1#/begin).
2. Click on "Create a function".
3. Select "Author from scratch" and enter a function name and runtime (we picked ```sendNotification``` and ```Node.js```).
4. Click on "Choose or create an execution role". For execution role, select "Create a new role with basic Lambda permissions".
5. The next few steps were taken from this guide: [Setting up Amazon Cognito and the Amazon SDK for Javascript](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/getting-started-browser.html).
6. Sign in to the AWS Management Console and open the Amazon Cognito console [here](https://console.aws.amazon.com/cognito/).
7. We selected "us-west-1 (Oregon)" as our region.
8. Choose "Manage Identity Pools" on the console opening page.
9. On the next page, choose "Create new identity pool". If you have no existing identity pools, skip this step. It will automatically go to the pool creation page.
10. In the Getting started wizard, type a name for your identity pool in Identity pool name. We picked ```CalNourish```.
11. Choose "Enable access to unauthenticated identities".
12. Choose "Create Pool".
13. On the next page, choose "View Details" to see the names of the two IAM roles created for your identity pool. Make a note of the name of both roles.
14. Choose "Allow".
15. For the platform, select "Javascript".
16. Under "Get AWS Credentials", copy this piece of code. You'll be adding it to the webapp.
17. To reiterate, remember the names of the two IAM roles you created for your identity pool as well as the code snippet above.
18. Sign in to the AWS Management Console and open the IAM console [here](https://console.aws.amazon.com/iam/).
19. In the navigation panel on the left of the page, choose Roles.
20. In the list of IAM roles, click on the link for the unauthenticated identities role previously created by Amazon Cognito.
21. In the "Summary" page for this role, choose "Attach policies".
22. In the "Attach Permissions" page for this role, search for "Lambda" and then select the check box for AWSLambdaRole.
23. Choose "Attach policy".
24. Repeat for the authenticated identities role.
25. Visit [this page](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/) to get the code snippet needed to use the Amazon SDK in your browser. Add this snippet to your html file. In our case, this code resides in our [ucbfpa-webapp](https://github.com/CalNourish/ucbfpa-webapp) repository.
26. Add the code snippet that authenticates the user to the webapp. Again, this code resides [here](https://github.com/CalNourish/ucbfpa-webapp).
27. The next steps were taken from this guide:[Setting up Amazon Lambda for Javascript](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/browser-invoke-lambda-function-example.html)
28. Scroll to the "Creating the Lambda Service Object" section and copy this code snippet so that it resides after you authenticate with Amazon Cognito.
29. Update the region to the region your Lambda function resides in (this may or may not be the same as the region where your Amazon Cognito resides. For us, the Lambda function resides in us-west-1.).
30. Update the API version to a more recent date.
31. Inside the params variable, change the function name to our function name (```sendNotification```).
32. Scroll to the "Invoking the Lambda Function" section and copy this code snippet to execute the lambda function.
33. Execute your Lambda function!
34. Go back to [your AWS Lambda function](https://us-west-1.console.aws.amazon.com/lambda/home?region=us-west-1#/functions/sendNotification?newFunction=true&tab=graph) and write your code!
