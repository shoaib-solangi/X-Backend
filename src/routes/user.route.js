import express from 'express';
import { getUserProfile } from '../controllers/user.controller.js'; 
import { protectedRoute } from '../middleware/auth.middleware.js';
import { updateProfile } from '../controllers/user.controller.js';
import { syncUser } from '../controllers/user.controller.js';
import { getCurrentUser } from '../controllers/user.controller.js';
import { followUser } from '../controllers/user.controller.js';
const router = express.Router();

router.get("/profile/:username" , getUserProfile);
router.post("/sync" , protectedRoute , syncUser);
router.post("/profile" , protectedRoute , getCurrentUser);
router.post("/follow/:targetUserId" , protectedRoute , followUser)

router.put("/proflie" , protectedRoute , updateProfile);
router.post("/follow/:targetUserId", protectedRoute, followUser);




export default router;
