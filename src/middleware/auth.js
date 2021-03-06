const jwt = require(`jsonwebtoken`)
const User = require(`../models/users`)

const auth = async (req, res, next) => {
    try {
        console.log(`auth middleware`)
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token,'userauthenticationSettimgs')
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })
        if (!user) {
            throw new Error()
        }
        req.user = user
        req.token=token
        next()
        //console.log(token)
        //next()
    } catch (e) {
        res.status(401).send({ error: `Please authenticate` })
    }
}

module.exports = auth