import { Router } from "express";
import { 
    loginUser, 
    logoutUser, 
    registerUser,
    updateUser,
    getUser
} from "../controllers/user.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()

//routes
router.route('/register-user').post(registerUser)

router.route('/login-user').post(loginUser)

router.route('/logout-user').post(verifyJWT, logoutUser)

router.route('/update-user/:field').patch(verifyJWT, updateUser)

router.route('/get-user').get(verifyJWT, getUser)

export default router
