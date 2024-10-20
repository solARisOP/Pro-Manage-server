import { ApiError } from "../utils/ApiError.js"

const validateData = (title, priority, checklist, dueDate) => {
    if (!title || !title.trim()) {
        throw new ApiError(400, "task should contain a title")
    }
    else if(dueDate) {
        const date = new Date(dueDate)
        const currentDate = new Date()
        currentDate.setHours(0,0,0,0)
        
        if(date.toDateString() === 'Invalid Date' || currentDate > date) {
            throw new ApiError(400, `${date.toDateString()} is a invalid date`)
        }
    }
    else if (!priority || !['low', 'mid', 'high'].includes(priority.trim())) {
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
    validateData,
}