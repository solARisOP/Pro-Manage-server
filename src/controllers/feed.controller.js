import { ApiResponse } from '../utils/ApiResponse.js'
import { Member } from '../models/member.model.js';

const getDashboard = async(req, res) => {
    const {timeline} = req.params
    const now = new Date();

    let start, end
    if(timeline === 'week') {
        const dayOfWeek = now.getDay();

        start = new Date(now);
        start.setDate(now.getDate() - dayOfWeek);
        start.setHours(0, 0, 0, 0);

        end = new Date(start);
        end.setDate(start.getDate() + 7);        
    }
    else if(timeline === 'month') {
        start = new Date(now.getFullYear(), now.getMonth(), 1); 
        end = new Date(now.getFullYear(), now.getMonth() + 1, 1); 
    }
    else {
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        end = new Date(start);
        end.setDate(start.getDate() + 1);
    }

    const tasks = await Member.aggregate([
        {
            $match : {
                user : req.user._id
            }
        },
        {
            $lookup : {
                from: "tasks",
                localField: "task",
                foreignField: "_id",
                pipeline: [
                    {
                        $lookup : {
                            from: "todos",
                            localField: "_id",
                            foreignField: "task",
                            as: "checklist"
                        }
                    },
                ],
                as: "tasks"
            }
        },
        {
            $filter: {
                input: "$tasks",
                as: "task",
                cond: { 
                    $and: [
                        {$gte: [ "$$task.dueDate", start ]}, 
                        {$lt: [ "$$task.dueDate", end ]} 
                    ]
                }
            }
        },
        {
            $replaceRoot: {newRoot: "$tasks"}
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

const getAnalysis = async(req, res) => {
    const analysis = await Member.aggregate([
        {
            $match : {
                user : req.user._id
            }
        },
        {
            $lookup : {
                from: "tasks",
                localField: "task",
                foreignField: "_id",
                as: "tasks"
            }
        },
        {
            $replaceRoot: {newRoot: "$tasks"}
        },
        {
            $facet: {
                groupByCategory :[
                    {
                        $group : {
                            _id: "$tasks.category",
                            count: {$sum : 1}
                        }
                    }
                ],
                groupByPriority: [
                    {
                        $group : {
                            _id: "$tasks.priority",
                            count: {$sum : 1}
                        }
                    }
                ],
                dueDateCount: [
                    {
                        $filter : {
                            input: "$tasks.dueDate",
                            as: "date",
                            cond: {
                                $and: [
                                    {$ne : [$$date, null]},
                                    {$ne : [$$date, undefined]}
                                ]
                            }
                        }
                    },
                    {
                        $count: "count"
                    }
                ]
            }
        }
    ])

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        analysis,
        "analysis retrieved sucessfully"
    ))
}

export {
    getDashboard,
    getAnalysis
}