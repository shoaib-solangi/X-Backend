import express from 'express';
import {ENV}  from './config/env.js';
import {connectdb} from './config/db.js';
import cors from 'cors';
import { clerkMiddleware } from '@clerk/express';
import userRoutes from './routes/user.route.js';
import postRoutes from './routes/post.route.js';
import commentRoutes from './routes/comment.route.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(clerkMiddleware());


const PORT =  3000;  
const startServer = async () => {
  try {
   await connectdb();
app.get('/', (req, res) => {
  res.send('Hello, World!');
}); 
app.use("/api/users" , userRoutes);
app.use("/api/post" , postRoutes);
app.use("/api/comments" , commentRoutes)
app.use((err, req, res, next) => {
  console.error(err.stack); 
  res.status(500).send('Something broke!');
});
app.listen(ENV.PORT, () => {
  console.log(`Server is running on http://localhost:${ENV.PORT}`);
})
  }
  catch (error) {
    console.error('Error starting the server:', error);
    process.exit(1);
  }
}
startServer();
