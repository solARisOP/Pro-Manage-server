import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
    title:{
        type: String,
        trim: true,
        required: [true, "title of a task is required to create a title"]
    },
    priority:{
        type: String,
        trim: true,
        enum: ['low', 'moderate', 'high'],
        required: [true, "priority of a task is required to create a task"]
    },
    category:{
        type: String,
        trim: true,
        enum: ['backlog', 'todo', 'progress', 'done'],
        default: 'todo',
        required: [true, "category of a task is required to create a task"]
    },
    dueDate:{
        type: Date,
    }
},{
    timestamps: true
});

export const Task = mongoose.model('Task', TaskSchema);