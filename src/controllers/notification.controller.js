import admin from "firebase-admin";
import serviceAccount from "../config/serviceAccountKey.json" assert { type: "json" };

import { facebookModel } from "../models/User.js";

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });


async function getOnlineFriends(userID) {
  const user = await facebookModel.findOne({ facebookID: userID });
  if (!user) throw new Error("User not found");

  const onlineFriends = user.friends.filter((friend) => friend.isOnline);
  return onlineFriends;
}

async function sendNotification(fcmTokens, message) {
  try {
    if (!fcmTokens || fcmTokens.length === 0) {
      console.error("No FCM tokens provided");
      return;
    }

    // Prepare the notification payload
    const messagePayload = {
      notification: message.notification,
    };

    // Send notification to each device using the FCM tokens array
    const promises = fcmTokens.map(async (token) => {
      try {
        const response = await admin.messaging().send({
          token: token,
          ...messagePayload,
        });
        console.log(`Successfully ${token}: ${response}`);
      } catch (err) {
        console.error(`Error sending notification to ${token}: ${err.message}`);
      }
    });

    // Wait for all notifications to be sent
    await Promise.all(promises);
    console.log(`Notifications`);
  } catch (err) {
    console.error("Error sending notification:", err);
  }
} 

async function notifyFriends(userId) {
  try {
    console.log("Notifying friends for userId:", userId);

    // Step 1: Find the user by their facebookID
    const user = await facebookModel.findOne({ facebookID: userId });
    if (!user) {
      console.error("User not found for ID:", userId);
      return;
    }

    console.log("User data:", user);

    // Step 2: Get the list of friends' facebookIDs
    const userFriends = user.friends || [];
    console.log("User's friends list:", userFriends);

    if (userFriends.length === 0) {
      console.log("No friends found for user:", userId);
      return;
    }

    // Step 3: Find the friends by their facebookID and get their fcmToken
    const friends = await facebookModel.find(
      { facebookID: { $in: userFriends } },
      "facebookID fcmToken name"
    ).exec();

    console.log("Friends query result:", friends);

    // Step 4: Extract valid FCM tokens from the friends
    const tokens = friends
      .flatMap((friend) => friend.fcmToken || []) // Ensure all tokens are included
      .filter((token) => !!token); // Remove null or undefined tokens

    console.log("Extracted FCM tokens:", tokens);

    // Step 5: If valid tokens are found, send notifications
    if (tokens.length > 0) {
      const message = {
        notification: {
          title: "New",
          body: `${user.name} is online, challenge them now!`,
        },
      };

      // Send notification to the list of tokens
      await sendNotification(tokens, message); // Pass tokens as an array of strings
    } else {
      console.warn("No valid FCM tokens found for friends.");
    }
  } catch (err) {
    console.error("Error notifying friends:", err);
  }
}

export async function updateOnlineStatusController(req, res) {
  try {
    const { facebookID, isOnline } = req.body;

    const user = await facebookModel.findOne({ facebookID });
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    user.isOnline = isOnline;
    user.lastActive = new Date();
    await user.save();

    // Optionally: Notify friends if going online
    if (isOnline) {
      await notifyFriends(user.facebookID);
    }

    return res.status(200).send({ success: true, message: "Status updated" });
  } catch (err) {
    console.error("Error updating status:", err.message);
    return res.status(500).send({ error: err.message });
  }
}