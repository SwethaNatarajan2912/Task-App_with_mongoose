const express = require(`express`)
const router = new express.Router()
const auth = require(`../middleware/auth.js`)
const Task = require(`../models/tasks.js`)

router.post(`/tasks`, auth, async (req, res) => {

    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send()
    }

})

router.delete(`/tasks/:id`, auth, async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete({ _id: req.params.id, owner: req.user._id })
        if (!task) {
            return res.status(404).send(`Task not found`)
        }
        res.status(200).send(task)
    } catch (e) {
        res.status(500).send()
    }
})


router.patch(`/tasks/:id`, auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = [`description`, `completed`]
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
        res.status(400).send({ error: `Invalid updates` })
    }
    try {
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })

        if (!task) {
            return res.status(404).send(`task not found`)
        }
        res.status(201).send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})



router.get(`/tasks/:id`, auth, async (req, res) => {
    const _id = req.params.id
    try {
        const task = await Task.findOne({ _id, owner: req.user._id })
        if (!task) {
            res.status(404).send(`Task not found`)
        }
        res.status(200).send(task)
    } catch (e) {
        res.status(500).send()
    }
})



router.get(`/tasks`, auth, async (req, res) => {
    const match = {}
    const sort = {}
    if (req.query.completed) {
        match.completed = req.query.completed === `true`
    }
    if(req.query.sortBy){
        const parts = req.query.sortBy.split(`:`)
        sort[parts[0]]=parts[1]===`desc`?-1:1
    }
    try {
        // const tasks = await Task.find({owner:req.user._id}).then((tasks)
        await req.user.populate({
            path: `tasks`,
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        })
        res.status(200).send(req.user.tasks)``
    } catch (e) {
        res.status(500).send()
    }

})


module.exports = router