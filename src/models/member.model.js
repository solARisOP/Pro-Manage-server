import mongoose, { Schema } from "mongoose";

const memberSchema = new mongoose.Schema({
    assignedBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    task: {
        type: Schema.Types.ObjectId,
        ref: "Task"
    }
}, {
    timestamps: true
});

memberSchema.index({ user: 1, task: 1}, { unique: true });

export const Member = mongoose.model("Member", memberSchema)