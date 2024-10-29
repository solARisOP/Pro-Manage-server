import { Router } from "express";
import {
    getDashboard,
    getAnalysis
} from "../controllers/feed.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()

//routes
router.route('/').get(verifyJWT, getDashboard)

router.route('/analytics').get(verifyJWT, getAnalysis)

export default router
