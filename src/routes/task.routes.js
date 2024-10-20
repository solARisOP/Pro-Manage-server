import { Router } from "express";
import {
    createTask,
    deleteTask,
    getTaskforView,
    getTaskforEdit,
    updateTask,
    getAllUsers
} from "../controllers/task.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()

//routes
router.route('/create-task').post(verifyJWT, createTask)

router.route('/delete-task/:key').delete(verifyJWT, deleteTask)

router.route('/update-task/:key').patch(verifyJWT, updateTask)

router.route('/get-task-view').get(getTaskforView)

router.route('/get-task-edit').get(verifyJWT, getTaskforEdit)

router.route('/get-all-users').get(verifyJWT, getAllUsers)

export default router
