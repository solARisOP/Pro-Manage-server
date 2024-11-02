import { ApiError } from "../utils/ApiError.js"
import { getMidnightTime } from "../utils/dateHelpers.js"

const validateData = (title, priority, checklist, dueDate) => {
    if (!title || !title.trim()) {
        throw new ApiError(400, "task should contain a title")
    }
    else if(dueDate) {
        const currentDate = getMidnightTime(new Date())
        const date = getMidnightTime(dueDate)
        if(currentDate > date) {
            throw new ApiError(400, `${date.toDateString()} is a invalid date`)
        }
    }
    else if (!priority || !['low', 'moderate', 'high'].includes(priority.trim())) {
        throw new ApiError(400, `${priority} is a invalid priority type`)
    }
    else if (!checklist || !checklist.length) {
        throw new ApiError(400, "task should contain atleast one todo")
    }

    checklist.forEach(todo=>{
        if (!todo.text.trim()) {
            throw new ApiError(400, "question feild of question object cannot be empty or undefined")
        }
    }) 
}

export {
    validateData
}