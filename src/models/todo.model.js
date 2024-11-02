import mongoose, { Schema } from "mongoose";

const TodoSchema = new mongoose.Schema({
    task: {
        type: Schema.Types.ObjectId,
        ref: 'Task',
        required: [true, "Task is required to create a todo"]
    },
    text: {
        type: String,
        trim: [true, "todo text is required"],
        required: [true, "text is required to create a todo"]
    },
    isDone: {
        type: Boolean,
        default: 0
    }
},{
    timestamps: true
});

export const Todo = mongoose.model('Todo', TodoSchema);
