const express = require(`express`)
require(`./db/mongoose.js`)
const userRouter = require(`./routers/user.js`)
const taskRouter = require(`./routers/task.js`)

const app = express()

//It automatically parse the incoming json into object
app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`Server is running...`)
})

//const Task = require(`./models/tasks.js`)
// const User = require(`./models/users.js`)
// const main = async () => {
//     //const task = await Task.findById(`62871e0dd983dbfc5c716a4e`)
//     const user = await User.findById(`62871e09d983dbfc5c716a49`)
//     //const result = await task.populate('owner').execPopulate()
//     //const data = await result.populate()
//     await user.populate(`tasks`).then((data) => {
//         console.log(data.tasks)
//     }).catch((error) => {
//         console.log(error)
//     })
//     // console.log(task.owner)
//     // console.log(task)
// }
// main()