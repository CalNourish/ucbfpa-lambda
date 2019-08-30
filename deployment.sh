#!/bin/bash

if [[ $1 = "prod" ]]
then
  function="prodSendNotification"
else
  function="testSendNotification"
fi

zip -r function.zip .

aws lambda update-function-code --cli-connect-timeout 6000 --function-name $function --zip-file fileb://function.zip

rm -rf function.zip