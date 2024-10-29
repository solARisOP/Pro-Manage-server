import { ApiResponse } from '../utils/ApiResponse.js'
import { Member } from '../models/member.model.js';
import { ApiError } from '../utils/ApiError.js';

const getDashboard = async (req, res) => {
    const { timeline } = req.query
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    let start, end
    if (timeline === 'week') {
        const dayOfWeek = now.getDay();

        start = new Date(now);
        start.setDate(now.getDate() - dayOfWeek);

        end = new Date(start);
        end.setDate(start.getDate() + 7);
    }
    else if (timeline === 'month') {
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        end = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    }
    else if (timeline === 'today') {
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        end = new Date(start);
        end.setDate(start.getDate() + 1);
    }
    else {
        throw new ApiError(400, "invalid timeline param")
    }

    const tasks = await Member.aggregate([
        {
            $match: {
                user: req.user._id
            }
        },
        {
            $lookup: {
                from: "tasks",
                localField: "task",
                foreignField: "_id",
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $or: [
                                    { $not: { $gt: ["$dueDate", null] } },
                                    {
                                        $and: [
                                            { $gte: ["$dueDate", start] },
                                            { $lt: ["$dueDate", end] }
                                        ]
                                    }
                                ]
                            }
                        }
                    },
                    {
                        $lookup: {
                            from: "todos",
                            localField: "_id",
                            foreignField: "task",
                            as: "checklist"
                        }
                    },
                ],
                as: "task"
            }
        },
        {
            $addFields: {
                task: { $first: "$task" }
            }
        },
        {
            $match: {
                task: { $exists: true }
            }
        },
        {
            $replaceRoot: { newRoot: '$task' }
        }
    ])

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            tasks,
            "homepage retrieved sucessfully"
        ))
}

const getAnalysis = async (req, res) => {
    const analysis = await Member.aggregate([
        {
            $match: {
                user: req.user._id
            }
        },
        {
            $lookup: {
                from: "tasks",
                localField: "task",
                foreignField: "_id",
                as: "task"
            }
        },
        {
            $addFields: {
                task: { $first: '$task' }
            }
        },
        {
            $replaceRoot: { newRoot: "$task" }
        },
        {
            $facet: {
                groupByCategory: [
                    {
                        $group: {
                            _id: "$category",
                            count: { $sum: 1 }
                        }
                    }
                ],
                groupByPriority: [
                    {
                        $group: {
                            _id: "$priority",
                            count: { $sum : 1 }
                        }
                    }
                ],
                dueDateCount: [
                    {
                        $match: {
                            dueDate: { $ne : null }
                        }
                    },
                    {
                        $count : 'docsCount'
                    }
                ]
            }
        },
        {
            $project: {
                dueDate : { $first : '$dueDateCount.docsCount' },
                priority : {
                    $arrayToObject : {
                        $map : {
                            input : "$groupByPriority",
                            as : "priority",
                            in : {
                                k : '$$priority._id',
                                v : '$$priority.count'
                            }
                        }
                    }
                },
                category: {
                    $arrayToObject : {
                        $map : {
                            input : "$groupByCategory",
                            as : "category",
                            in : {
                                k : '$$category._id',
                                v : '$$category.count'
                            }
                        }
                    }
                }
            }
        }
    ])

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            analysis[0],
            "analysis retrieved sucessfully"
        ))
}

export {
    getDashboard,
    getAnalysis
}