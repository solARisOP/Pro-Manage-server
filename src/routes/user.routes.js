import { Router } from "express";
import { 
    loginUser, 
    logoutUser, 
    registerUser,
    updateUser,
    getUser,
    getAllUsers
} from "../controllers/user.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()

//routes
router.route('/').post(registerUser).get(verifyJWT, getUser)

router.route('/login').put(loginUser)

router.route('/logout').patch(verifyJWT, logoutUser)

router.route('/:field').patch(verifyJWT, updateUser)

router.route('/all').get(verifyJWT, getAllUsers)

export default router
