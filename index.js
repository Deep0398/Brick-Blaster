import express, { response } from "express";
import session  from 'express-session';
import morgan from "morgan";
import cors from "cors";
import connectDB from "./src/config/configDB.js";
import dotenv from "dotenv";
import achievementRouter from "./src/routers/AchievementRouter.js";
import userRouter from "./src/routers/UserRouter.js";
import levelRouter from "./src/routers/LevelRouter.js";
import adminRouter from "./src/routers/AdminRouter.js";
import versionRouter from "./src/routers/versionRouter.js";
import challengeRouter from "./src/routers/user.challenge.router.js";
import progressamountRouter from "./src/routers/progressamount.router.js";
import path from 'path'
import { fileURLToPath } from 'url';
import { createServer } from 'http';
import { Server } from 'socket.io';
// import { checkAdminLogin } from "./src/middleware/middlewares.js";
//import { generateUniqueReferralCode } from "./src/services/generateReferalCode.js";




const app = express();



dotenv.config();
connectDB();
app.use(morgan("common"));
app.use(cors());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/public/images', express.static(path.join(__dirname, 'public/images')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({resave: false,saveUninitialized: true,secret: 'SECRET'}));


  

app.use('/achievement',achievementRouter);
app.use('/user',userRouter);
app.use('/level',levelRouter);
app.use('/admin',adminRouter);
app.use('/version',versionRouter);
app.use('/challenge',challengeRouter)
app.use('/progressamount',progressamountRouter)

const server = createServer(app);

// Initialize Socket.IO on top of the HTTP server
const io = new Server(server, {
    cors: {
        origin: "*", // Adjust this to match your client's origin
        methods: ["GET", "POST","PUT"]
    }
});

// Real-time challenge data storage (in-memory, replace with a database in production)
const challenges = {};

// Socket.IO logic
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Join room based on user's Facebook ID
    socket.on('join', ({ facebook_id }) => {
        socket.join(facebook_id);
        console.log(`User with Facebook ID ${facebook_id} joined`);
    });

    // Handle challenge initiation
    socket.on('initiateChallenge', ({ facebook_id_1, username_1, facebook_id_2, username_2, level_id }) => {
        const challengeId = `${facebook_id_1}_${facebook_id_2}_${level_id}`.trim(); // Ensure the challengeId is trimmed

        challenges[challengeId] = {
            facebook_id_1,
            username_1,
            facebook_id_2,
            username_2,
            level_id,
            challenge_status: 'pending',
            scores: {}
        };

        // Notify the second user about the challenge
        io.emit('receiveChallenge', {
            challengeId,
            from: username_1,
            to: username_2,
            FaceBookID1:  facebook_id_1,
            FaceBookID2: facebook_id_2,
            level_id
        });

        console.log(`Challenge initiated from ${username_1} to ${username_2} for level ${level_id}, challengeId: ${challengeId}`);
    });

    // Handle challenge acceptance
    socket.on('acceptChallenge', ({ challengeId }) => {
        const trimmedChallengeId = challengeId.trim(); // Trim the challengeId to avoid any extra spaces or newlines
        console.log(`acceptChallenge event received for challengeId: ${trimmedChallengeId}`);
        
        if (challenges[trimmedChallengeId]) {
            challenges[trimmedChallengeId].challenge_status = 'in_progress';
            io.emit('challengeAccepted', {
                challengeId: trimmedChallengeId,
                status: 'in_progress'
            });
            console.log(`Challenge ${trimmedChallengeId} accepted.`);
        } else {
            console.log(`No challenge found with ID: ${trimmedChallengeId}`);
        }
    });

    // Handle score submission
    socket.on('submitScore', ({ facebook_id, challengeId, score }) => {
        const trimmedChallengeId = challengeId.trim(); // Ensure the challengeId is trimmed
        console.log(`submitScore event received for challengeId: ${trimmedChallengeId}, facebook_id: ${facebook_id}, score: ${score}`);
    
        // Check if the challenge exists and is in progress
        if (challenges[trimmedChallengeId] && challenges[trimmedChallengeId].challenge_status === 'in_progress') {
            challenges[trimmedChallengeId].scores[facebook_id] = score; // Store the score for the player
    
            // Check if both players have submitted their scores
            if (Object.keys(challenges[trimmedChallengeId].scores).length === 2) {
                const [facebook_id_1, facebook_id_2] = Object.keys(challenges[trimmedChallengeId].scores);
                const score_1 = challenges[trimmedChallengeId].scores[facebook_id_1];
                const score_2 = challenges[trimmedChallengeId].scores[facebook_id_2];
                
                let winner;
                if (score_1 > score_2) {
                    winner = facebook_id_1;
                } else if (score_2 > score_1) {
                    winner = facebook_id_2;
                } else {
                    winner = "Draw"; // Handle tie case
                }
    
                // Notify both users about the challenge result
                io.emit('challengeCompleted', {
                    challengeId: trimmedChallengeId,
                    winner,
                });
    
                challenges[trimmedChallengeId].challenge_status = 'completed';
                challenges[trimmedChallengeId].winner = winner;
                console.log(`Challenge ${trimmedChallengeId} completed. Winner: ${winner}`);
            }
        } else {
            console.error(`No in-progress challenge found with ID: ${trimmedChallengeId}`);
        }
    });

    // Handle challenge rejection
    socket.on('rejectChallenge', ({ challengeId }) => {
        const trimmedChallengeId = challengeId.trim(); // Ensure the challengeId is trimmed
        console.log(`rejectChallenge event received for challengeId: ${trimmedChallengeId}`);
        if (challenges[trimmedChallengeId] && challenges[trimmedChallengeId].challenge_status === 'pending') {
            challenges[trimmedChallengeId].challenge_status = 'rejected';

            // Notify both users about the rejection
            io.emit('challengeRejected', { challengeId: trimmedChallengeId });

            console.log(`Challenge ${trimmedChallengeId} rejected.`);
        } else {
            console.log(`No challenge found or challenge not pending for ID: ${trimmedChallengeId}`);
        }
    });
    // Handle disconnection
    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});
// Start server
const port = process.env.PORT || 3000;
server.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on port ${port}`);
});

// Helper function to compare scores and determine the winner
function compareScores(challenge) {
    const { facebook_id_1, facebook_id_2, scores } = challenge;
    return {
        facebook_id_1,
        score_1: scores[facebook_id_1] || 0,
        facebook_id_2,
        score_2: scores[facebook_id_2] || 0,
    };
}