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
        const challengeId = `${facebook_id_1}_${facebook_id_2}_${level_id}`;
        
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
        io.to(facebook_id_2).emit('receiveChallenge', {
            challengeId,
            from: username_1,
            level_id
        });

        console.log(`Challenge initiated from ${username_1} to ${username_2} for level ${level_id}, challengeId: ${challengeId}`);
    });

    // Handle challenge acceptance
    socket.on('acceptChallenge', ({ challengeId }) => {
        console.log(`acceptChallenge event received for challengeId: ${challengeId}`);
        if (challenges[challengeId]) {
            challenges[challengeId].challenge_status = 'in_progress';
            io.emit('challengeAccepted', {
                challengeId,
                status: 'in_progress'
            });
            console.log(`Challenge ${challengeId} accepted.`);
        } else {
            console.log(`No challenge found with ID: ${challengeId}`);
        }
    });

        // Handle score submission
        socket.on('submitScore', ({ facebook_id, challengeId, score }) => {
            console.log(`submitScore event received for challengeId: ${challengeId}, facebook_id: ${facebook_id}, score: ${score}`);
    
            // Check if the challenge exists and is in progress
            if (challenges[challengeId] && challenges[challengeId].challenge_status === 'in_progress') {
                challenges[challengeId].scores[facebook_id] = score; // Store the score for the player
    
                // Check if both players have submitted their scores
                if (Object.keys(challenges[challengeId].scores).length === 2) {
                    const [facebook_id_1, facebook_id_2] = Object.keys(challenges[challengeId].scores);
                    const score_1 = challenges[challengeId].scores[facebook_id_1];
                    const score_2 = challenges[challengeId].scores[facebook_id_2];
                    
                    let winner;
                    if (score_1 > score_2) {
                        winner = facebook_id_1;
                    } else if (score_2 > score_1) {
                        winner = facebook_id_2;
                    } else {
                        winner = "Draw"; // Handle tie case
                    }
    
                    // Notify both users about the challenge result
                    io.to(facebook_id_1).emit('challengeCompleted', {
                        challengeId,
                        winner,
                    });
                    io.to(facebook_id_2).emit('challengeCompleted', {
                        challengeId,
                        winner,
                    });
    
                    challenges[challengeId].challenge_status = 'completed';
                    challenges[challengeId].winner = winner;
                    console.log(`Challenge ${challengeId} completed. Winner: ${winner}`);
                }
            } else {
                console.error(`No in-progress challenge found with ID: ${challengeId}`);
            }
        });
    
    
    // Handle challenge rejection
    socket.on('rejectChallenge', ({ challengeId }) => {
        console.log(`rejectChallenge event received for challengeId: ${challengeId}`);
        if (challenges[challengeId] && challenges[challengeId].challenge_status === 'pending') {
            challenges[challengeId].challenge_status = 'rejected';

            // Notify both users about the rejection
            io.to(challenges[challengeId].facebook_id_1).emit('challengeRejected', { challengeId });
            io.to(challenges[challengeId].facebook_id_2).emit('challengeRejected', { challengeId });

            console.log(`Challenge ${challengeId} rejected.`);
        } else {
            console.log(`No challenge found or challenge not pending for ID: ${challengeId}`);
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