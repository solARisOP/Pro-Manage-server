import { Router } from "express";
import {
    createTask,
    deleteTask,
    getTaskforView,
    getTaskforEdit,
    updateTask
} from "../controllers/task.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()

//routes
router.route('/').post(verifyJWT, createTask).get(getTaskforView)

router.route('/:key').delete(verifyJWT, deleteTask).patch(verifyJWT, updateTask)

router.route('/edit').get(verifyJWT, getTaskforEdit)

export default router
