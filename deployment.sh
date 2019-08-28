#!/bin/bash

zip -r function.zip .
aws lambda update-function-code --cli-connect-timeout 6000 --function-name sendNotification --zip-file fileb://function.zip
rm -rf function.zip