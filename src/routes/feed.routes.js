import { Router } from "express";
import {
    getDashboard,
    getAnalysis
} from "../controllers/feed.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()

//routes
router.route('/dashboard-tasks/:timeline').get(verifyJWT, getDashboard)

router.route('/tasks-analysis').get(verifyJWT, getAnalysis)

export default router
