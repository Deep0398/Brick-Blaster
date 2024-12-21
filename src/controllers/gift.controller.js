import { userModel } from "../models/User.js";
import { facebookModel } from "../models/User.js"; 
import mongoose from "mongoose";
import { sendNotification } from "./notification.controller.js";

const generateRandomCoins = (min = 10, max = 50) =>
    Math.floor(Math.random() * (max - min + 1)) + min;




export const sendGift = async (req, res) => {
    const { senderFacebookID, receiverFacebookID } = req.body;

    if (!senderFacebookID || !receiverFacebookID) {
        return res.status(400).json({ message: "Sender and receiver IDs are required." });
    }

    try {
        const sender = await facebookModel.findOne({ facebookID: senderFacebookID });
        const receiver = await facebookModel.findOne({ facebookID: receiverFacebookID });

        if (!sender || !receiver) {
            return res.status(404).json({ message: "Sender or receiver not found." });
        }

        if (!sender.friends.includes(receiverFacebookID)) {
            return res.status(400).json({ message: "Receiver is not a friend of the sender." });
        }

        const lastGiftSent = sender.lastGiftSent?.[receiverFacebookID];
        const now = new Date();

        if (lastGiftSent && now.getTime() - new Date(lastGiftSent).getTime() < 24 * 60 * 60 * 1000) {
            return res.status(400).json({ message: "Gift already sent to this friend in the last 24 hours." });
        }

        const giftCoins = generateRandomCoins();

        const gift = {
            _id: new mongoose.Types.ObjectId(),
            senderFacebookID,
            senderName: sender.name,
            receiverFacebookID,
            receiverName: receiver.name,
            coins: giftCoins,
            sentAt: now,
            status: "pending",
        };

        receiver.gifts.push(gift);

        sender.lastGiftSent = {
            ...sender.lastGiftSent,
            [receiverFacebookID]: now,
        };

        await sender.save();
        await receiver.save();


        const fcmTokens = receiver.fcmToken; // Get receiver's FCM tokens
        if (fcmTokens && fcmTokens.length > 0) {
            const notificationMessage = {
                notification: {
                    title: "You Received a Gift!",
                    body: `${sender.name} has sent you ${giftCoins} coins as a gift.`,
                },
            };
            await sendNotification(fcmTokens, notificationMessage);
        }
        
        res.status(200).json({
            message: "Gift sent successfully.",
            gift,
        });
    } catch (error) {
        console.error("Error sending gift:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};


export const getGifts = async (req, res) => {
    const { receiverFacebookID } = req.params;

    if (!receiverFacebookID) {
        return res.status(400).json({ message: "Receiver Facebook ID is required." });
    }

    try {
        const receiver = await facebookModel.findOne({ facebookID: receiverFacebookID });

        if (!receiver) {
            return res.status(404).json({ message: "Receiver not found." });
        }

        const gifts = receiver.gifts.map((gift) => ({
            giftID: gift._id,
            senderFacebookID: gift.senderFacebookID,
            senderName: gift.senderName,
            receiverFacebookID: gift.receiverFacebookID,
            receiverName: gift.receiverName,
            coins: gift.coins,
            sentAt: gift.sentAt,
            status: gift.status,
        }));

        res.status(200).json({
            message: "Gifts retrieved successfully.",
            gifts,
        });
    } catch (error) {
        console.error("Error fetching gifts:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};



export const receiveGift = async (req, res) => {
    const { receiverFacebookID, senderFacebookID, giftID } = req.body;

    if (!receiverFacebookID || !senderFacebookID || !giftID) {
        return res.status(400).json({ message: "Receiver ID, sender ID, and gift ID are required." });
    }

    try {
        const receiver = await facebookModel.findOne({ facebookID: receiverFacebookID });
        const sender = await facebookModel.findOne({ facebookID: senderFacebookID });

        if (!receiver || !sender) {
            return res.status(404).json({ message: "Receiver or sender not found." });
        }

        // Convert giftID to ObjectId for comparison
        const giftObjectId = new mongoose.Types.ObjectId(giftID);

        const giftIndex = receiver.gifts.findIndex((g) => g._id.equals(giftObjectId));

        if (giftIndex === -1) {
            return res.status(404).json({ message: "Gift not found." });
        }

        const gift = receiver.gifts[giftIndex];

        if (gift.status === "received") {
            return res.status(400).json({ message: "Gift has already been received." });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set time to start of the day

        // Check if a return gift has already been sent today
        const lastGiftSentToSender = sender.lastGiftSent?.[receiverFacebookID] || null;

        if (lastGiftSentToSender && new Date(lastGiftSentToSender).getTime() === today.getTime()) {
            // Mark the original gift as received without sending another return gift
            gift.status = "received";
            receiver.gifts.splice(giftIndex, 1);

            await receiver.save();

            return res.status(200).json({
                message: "Gift received successfully. No return gift sent as one has already been sent today.",
                receivedGift: gift,
            });
        }

        // Mark gift as received
        gift.status = "received";

        const returnGiftCoins = generateRandomCoins();

        // Create a new return gift entry for the sender
        const returnGift = {
            _id: new mongoose.Types.ObjectId(),
            senderFacebookID: receiverFacebookID,
            senderName: receiver.name,
            receiverFacebookID: senderFacebookID,
            receiverName: sender.name,
            coins: returnGiftCoins,
            sentAt: new Date(),
            status: "pending",
        };

        sender.gifts.push(returnGift);

        // Update sender's lastGiftSent map to prevent further return gifts today
        sender.lastGiftSent = {
            ...sender.lastGiftSent,
            [receiverFacebookID]: today,
        };

        // Remove the gift from the receiver's gift array
        receiver.gifts.splice(giftIndex, 1);

        await sender.save();
        await receiver.save();

        res.status(200).json({
            message: "Gift received successfully.",
            receivedGift: gift,
            returnGift,
        });
    } catch (error) {
        console.error("Error receiving gift:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};



// export const receiveGift = async (req, res) => {
//     const { receiverFacebookID, senderFacebookID, giftID } = req.body;

//     if (!receiverFacebookID || !senderFacebookID || !giftID) {
//         return res.status(400).json({ message: "Receiver ID, sender ID, and gift ID are required." });
//     }

//     try {
//         const receiver = await facebookModel.findOne({ facebookID: receiverFacebookID });
//         const sender = await facebookModel.findOne({ facebookID: senderFacebookID });

//         if (!receiver || !sender) {
//             return res.status(404).json({ message: "Receiver or sender not found." });
//         }

//         // Convert giftID to ObjectId for comparison
//         const giftObjectId = new mongoose.Types.ObjectId(giftID);

//         const giftIndex = receiver.gifts.findIndex((g) => g._id.equals(giftObjectId));

//         if (giftIndex === -1) {
//             return res.status(404).json({ message: "Gift not found." });
//         }

//         const gift = receiver.gifts[giftIndex];

//         if (gift.status === "received") {
//             return res.status(400).json({ message: "Gift has already been received." });
//         }

//         const returnGiftCoins = generateRandomCoins();

//         gift.status = "received";

//         const returnGift = {
//             _id: new mongoose.Types.ObjectId(),
//             senderFacebookID: receiverFacebookID,
//             senderName: receiver.name,
//             receiverFacebookID: senderFacebookID,
//             receiverName: sender.name,
//             coins: returnGiftCoins,
//             sentAt: new Date(),
//             status: "pending",
//         };

//         sender.gifts.push(returnGift);
//         receiver.gifts.splice(giftIndex, 1);

//         await sender.save();
//         await receiver.save();

//         res.status(200).json({
//             message: "Gift received successfully.",
//             receivedGift: gift,
//             returnGift,
//         });
//     } catch (error) {
//         console.error("Error receiving gift:", error);
//         res.status(500).json({ message: "Internal server error." });
//     }
// };


//     if (!receiverFacebookID || !senderFacebookID || !giftID) {
//         return res.status(400).json({ message: "Receiver ID, sender ID, and gift ID are required." });
//     }

//     try {
//         const receiver = await facebookModel.findOne({ facebookID: receiverFacebookID });
//         const sender = await facebookModel.findOne({ facebookID: senderFacebookID });

//         if (!receiver || !sender) {
//             return res.status(404).json({ message: "Receiver or sender not found." });
//         }

//         const gift = receiver.gifts.find((g) => g._id.toString() === giftID);

//         if (!gift) {
//             return res.status(404).json({ message: "Gift not found." });
//         }

//         if (gift.status === "received") {
//             return res.status(400).json({ message: "Gift has already been received." });
//         }

//         const returnGiftCoins = generateRandomCoins();

//         gift.status = "received";

//         const returnGift = {
//             _id: new mongoose.Types.ObjectId(),
//             senderFacebookID: receiverFacebookID,
//             senderName: receiver.name,
//             receiverFacebookID: senderFacebookID,
//             receiverName: sender.name,
//             coins: returnGiftCoins,
//             sentAt: new Date(),
//             status: "pending",
//         };

//         sender.gifts.push(returnGift);

//         await sender.save();
//         await receiver.save();

//         res.status(200).json({
//             message: "Gift received successfully.",
//             receivedGift: gift,
//             returnGift,
//         });
//     } catch (error) {
//         console.error("Error receiving gift:", error);
//         res.status(500).json({ message: "Internal server error." });
//     }
// };