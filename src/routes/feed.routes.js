import { Router } from "express";
import {
    getDashboard,
    getAnalysis
} from "../controllers/feed.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()

//routes
router.route('/analytics').get(verifyJWT, getAnalysis)

router.route('/:timeline').get(verifyJWT, getDashboard)

export default router
