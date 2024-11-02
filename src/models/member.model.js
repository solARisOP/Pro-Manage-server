import mongoose, { Schema } from "mongoose";

const memberSchema = new mongoose.Schema({
    assignedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "assignedBy field cannot be empty for Members"]
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "user field cannot be empty for Members"]
    },
    task: {
        type: Schema.Types.ObjectId,
        ref: "Task",
        required: [true, "task field cannot be empty for Members"]
    }
}, {
    timestamps: true
});

memberSchema.index({ user: 1, task: 1}, { unique: true });

export const Member = mongoose.model("Member", memberSchema)