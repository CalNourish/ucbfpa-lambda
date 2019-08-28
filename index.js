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

    messages.push(message);
  }

  let chunks = expo.chunkPushNotifications(messages);
  let tickets = [];
  for (let chunk of chunks) {
    try {
      let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      console.log(ticketChunk);
      tickets.push(...ticketChunk);
      // NOTE: If a ticket contains an error code in ticket.details.error, you
      // must handle it appropriately. The error codes are listed in the Expo
      // documentation:
      // https://docs.expo.io/versions/latest/guides/push-notifications#response-format
    } catch (error) {
      console.error(error);
    }
  }

  let receiptIds = [];
  for (let ticket of tickets) {
    if (ticket.id) {
      receiptIds.push(ticket.id);
    }
    console.log(ticket.status);
    if (ticket.status === 'error') {
      console.error(`There was an error sending a notification: ${ticket.message}`);
      if (ticket.details && tickets.details.error) {
        console.error(`Error code: ${tickets.details.error}`);
      }
    }
  }

  let receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);
  for (let chunk of receiptIdChunks) {
    try {
      let receipts = await expo.getPushNotificationReceiptsAsync(chunk);

      // The receipts specify whether Apple or Google successfully received the
      // notification and information about an error, if one occurred.
      for (const [receiptId, statusJson] of Object.entries(receipts)) {
        var status = statusJson['status'];
        if (status === 'error') {
          console.error(`There was an error sending a notification: ${statusJson['message']}`);
          var detailsJson = statusJson['details'];
          if (detailsJson && detailsJson['error']) {
            console.error(`Error code: ${detailsJson['error']}`);
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  const response = {
    statusCode: 200,
    body: JSON.stringify('Hello from Lambda!'),
  };
  return response;
};
