require('dotenv').config()
const API_KEY = process.env.API_KEY

const argv = require('minimist')(process.argv.slice(2)); // remove 'node' and the script name
console.log(argv)

// Set up API and authorization
const axios = require('axios')
const todoist = axios.create({
    baseURL: 'https://beta.todoist.com/API/v8',
    timeout: 3000,
    headers: {
        'Authorization': `Bearer ${API_KEY}`
    }
})

function closeTask(task) {
    // console.log(`Closing task with ID: ${taskId}`)
    todoist.post(`/tasks/${task.id}/close`).then( response => {console.log(`Closed task: ${task.content} (${task.id})`)})
}

function closeTasks(taskArray) {
    taskArray.forEach( task => {
        closeTask(task)
    })
}

function close(label) {
    todoist.get(`/tasks?filter=${encodeURIComponent(`(overdue | today) & @${label}`)}`)
        .then( (response) => {
            console.log(response.data)
            let recurringWorkTasks = response.data
            closeTasks(recurringWorkTasks)
        })
}

if (argv.close) { // If any --close args have been passed. Multiple --close will become an array of values
    let closeLabels = argv.close
    if (closeLabels.constructor !== Array) { // if it's not an array, encapsulate it in one
        closeLabels = [closeLabels]
    }
    
    closeLabels.forEach( (label) => {
        close(label)
    })
} 