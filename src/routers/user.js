const express = require(`express`)
const router = new express.Router()
const User = require(`../models/users`)
const auth = require(`../middleware/auth`)
const req = require("express/lib/request")



//SignUp
router.post(`/users`, async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (error) {
        res.status(400).send(error)
    }

    // try {
    //     user.save().then(() => {
    //         res.status(201).send(user)
    //     }).catch((error) => {
    //         res.status(400).send()
    //     })
    // } catch (e) {
    //     res.status(500).send()
    // }
})

router.post(`/users/login`, async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
        //res.send({ user: user.getPublicProfile(), token })
    } catch (e) {
        res.status(400).send()
    }
})


router.post(`/users/logout`, auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    }
    catch (e) {
        res.status(500).send()
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

//GET Add Middleware to authenticate
router.get(`/users/me`, auth, async (req, res) => {

    res.send(req.user)
})
// //GET Add Middleware to authenticate
// router.get(`/users`,auth, async (req, res) => {
//     try {
//         const users = await User.find({})
//         res.status(200).send(users)
//     } catch (error) {
//         res.status(500).send()
//     }

// User.find({}).then((users) => {
//     res.status(200).send(users)
// }).catch((error) => {
//     res.status(500).send()
// })





// router.get(`/users/:id`, async (req, res) => {
//     const _id = req.params.id
//     try {
//         const user = await User.findById(_id)
//         if (!user) {
//             res.status(404).send(`User not found`)
//         }
//         res.status(200).send(user)
//     } catch (e) {
//         res.status(500).send()
//     }
// })


router.patch(`/users/me`, auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = [`name`, `age`, `email`, `password`]

    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
        res.status(400).send({ error: `Invalid updates` })
    }
    try {
        //const user = await User.findById(req.params.id)


        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.status(201).send(req.user)
    } catch (e) {
        res.status(500).send(e)
    }
})
/**
 * new :true for return the new user oppposed to the existing user which we found before the update
 * runValidators for validating all the conditions which we provided in the schema
 * */
// router.patch(`/users/:id`,async (req, res) => {
//     const updates = Object.keys(req.body)
//     const allowedUpdates = [`name`, `age`, `email`, `password`]

//     const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
//     if (!isValidOperation) {
//         res.status(400).send({ error: `Invalid updates` })
//     }
//     try {
//         const user = await User.findById(req.params.id)

//         updates.forEach((update) => user[update] = req.body[update])
//         await user.save()

//         //const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
//         if (!user) {
//             return res.status(404).send(`user not found`)
//         }
//         res.status(201).send(user)
//     } catch (e) {
//         res.status(500).send(e)
//     }
// })

// router.delete(`/users/:id`,async (req, res) => {
//     try {
//         const user = await User.findByIdAndDelete(req.params.id)
//         if (!user) {
//             return res.status(404).send(`User not found`)
//         }
//         res.status(200).send(user)
//     } catch (e) {
//         res.status(500).send()
//     }
// })
router.delete(`/users/me`, auth, async (req, res) => {
    try {
        //const user = await User.findByIdAndDelete(req.user._id)
        await req.user.remove()
        res.status(200).send(req.user)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router