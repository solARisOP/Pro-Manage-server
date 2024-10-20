import { ApiResponse } from "../utils/ApiResponse.js"
import { ApiError } from "../utils/ApiError.js";
import mongoose from "mongoose";
import { validateData } from "../validators/data.validator.js";
import { Todo } from "../models/todo.model.js";
import { Task } from "../models/task.model.js";
import { Member } from "../models/member.model.js";
import { User } from "../models/user.model.js";

const createTask = async (req, res) => {

    const { title, priority, dueDate, checklist, members } = req.body;
    validateData(title, priority, checklist, dueDate)

    const task = await Task.create({ title, priority, ...(dueDate && {dueDate : new Date(dueDate)}) });

    const newChecklist = await Promise.all(checklist.map(todo=>Todo.create({
        text: todo.text,
        task: task._id,
        isDone: todo._isDone
    })))

    await Promise.all([...members.map(member => Member.create({
        assignedBy: req.user._id,
        user: new mongoose.Types.ObjectId(member),
        task: task._id
    })), Member.create({
        assignedBy: req.user._id,
        user: req.user._id,
        task: task._id
    })])

    const createdTask = {
        _id : task._id,
        title : task.title,
        priority: task.priority,
        category: task.category,
        dueDate: task.dueDate,
        checklist : newChecklist
    }

    return res
        .status(200)
        .json(new ApiResponse(
            201,
            createdTask,
            "task created succcessfully"
        ))
}

const getTaskforEdit = async (req, res) => {
    const { key } = req.query;

    const task = await Task.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(key)
            }
        },
        {
            $lookup: {
                from: "todos",
                localField: "_id",
                foreignField: "task",
                pipeline: [
                    {
                        $project:{
                            task: 0
                        }
                    }
                ],
                as: "checklist"
            }
        },
        {
            $lookup: {
                from: "members",
                localField: "_id",
                foreignField: "task",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "user",
                            foreignField: "_id",
                            pipeline: [
                                {
                                    $project:{
                                        email : 1
                                    }
                                }
                            ],
                            as: 'user'
                        }
                    },
                    {
                        $addFields: {
                            canUnassign: {
                                $cond: [{$and:[{$eq : [req.user._id, "$assignedBy"]},{$ne: [req.user._id, "$user._id"]}]}, 1, 0]
                            }
                        }
                    }
                ],
                as: "members"
            }
        },
    ])
    
    if (!task.length) {
        throw new ApiError(404, "task does not exists")
    }

    const assignedUsers = task.members.map(mem=>mem.user._id)

    const unassignedUsers = await User.find({
        _id: {
            $nin: [...assignedUsers, req.user._id]
        }
    })

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            {
                task: task[0],
                unassignedUsers
            },
            "task retreived successfully"
        ))
}

const getTaskforView = async (req, res) => {
    const { key } = req.query;

    const task = await Task.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(key)
            }
        },
        {
            $lookup: {
                from: "todos",
                localField: "_id",
                foreignField: "task",
                pipeline: [
                    {
                        $project:{
                            task: 0
                        }
                    }
                ],
                as: "checklist"
            }
        },
    ])
    
    if (!task.length) {
        throw new ApiError(404, "task does not exists")
    }

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            task[0],
            "task retreived successfully"
        ))
}

const deleteTask = async (req, res) => {
    const { key } = req.params;
    
    const task = await Task.findById(key);

    if (!task) {
        throw new ApiError(404, "No task exists for this particular id");
    }
    else if (!task.owner.equals(req.user._id)) {
        throw new ApiError(403, "task does not belong to the particular user");
    }

    await Promise.all([Todo.deleteMany({task : task._id}), Member.deleteMany({task : task._id}), Quiz.findByIdAndDelete(task._id)])

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            {},
            "task deleted successfully"
        ))
}

const updateTask = async (req, res) => {
    const { key } = req.params;

    const { title, priority, dueDate, checklist, assign, unassign } = req.body;
    validateData(title, priority, checklist, dueDate)

    const task = await Task.findById(key)
    task.title = title
    task.priority = priority
    task.dueDate = dueDate

    const todoPromises = [];
    for(const todo of checklist) {
        let newTodo = Todo({});
        if(todo._id) {
            newTodo = await Todo.findById(todo._id);
        }
        newTodo.title = todo.text
        newTodo.task = task._id
        newTodo.isDone = todo.isDone
        todoPromises.push(newTodo)
    }

    const newChecklist = await Promise.all(todoPromises)
    const checkListIds = newChecklist.map(Id => Id._id.toString())

    const taskChecklist = await Todo.find({task: task._id})
    const promises = [];
    taskChecklist.forEach(todo => {
        const id = todo._id.toString()
        if(!checkListIds.includes(id)) {
            promises.push(Todo.findByIdAndDelete(todo._id))
        }
    });

    const newMembers = assign.map(id=>Member.create({task : task._id, assignedBy: req.user._id, user: new mongoose.Types.ObjectId(id)}));
    const removeMembers = unassign.map(id=>Member.deleteMany({user : new mongoose.Types.ObjectId(id), task: task._id}));

    await Promise.all([...deleteTodos, ...newMembers, ...removeMembers, task.save({new: true})])

    const updateTask = {
        ...task,
        checklist : newChecklist
    }

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            updateTask,
            "task updated sucessfully"
        ))
}

const getAllUsers = async(req, res) => {
    const users = await User.find({}).select("-password -name -createdAt -updatedAt -refreshToken")
    return res
    .status(200)
    .json(new ApiResponse(
        200,
        users,
        "all users fetched successfully"
    ))
}

export {
    createTask,
    getTaskforEdit,
    getTaskforView,
    deleteTask,
    updateTask,
    getAllUsers
}