var admin = require('firebase-admin');
const { Expo } = require('expo-server-sdk')

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});

let expo = new Expo();

exports.handler = async (event) => {
  var db = admin.database();
  var pushTokens = await admin
      .database()
      .ref('expoNotificationToken')
      .once('value')
      .then((data) => {
        var expoNotificationTokens = [];
        data.forEach((childNode) => {
          var expoNotificationTokenObject = childNode.val();
          var expoNotificationToken = expoNotificationTokenObject['token'];
          expoNotificationTokens.push(expoNotificationToken);
        });
        return expoNotificationTokens;
      });

  let messages = [];
  for (let pushToken of pushTokens) {
    if (!Expo.isExpoPushToken(pushToken)) {
      console.error(`Push token ${pushToken} is not a valid Expo push token`);
      continue;
    }

    var message = {
      to: pushToken,
      sound: 'default',
      title: 'hello',
      body: 'This is a test notification',
    };

    console.log(message);
    messages.push(message);
  }

  console.log(messages);
  var tickets = await expo.sendPushNotificationsAsync(messages);
  console.log(tickets);

  const response = {
    statusCode: 200,
    body: JSON.stringify('Hello from Lambda!'),
  };
  return response;
};
