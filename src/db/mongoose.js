const mongoose = require(`mongoose`)
const validator = require(`validator`)
const path = require(`path`)
//config() -> loading .env file into process.env
require(`dotenv`).config({path: __dirname+`/.env`})


/**
 * useNewUrlParser for ->DeprecationWarning: current URL string parser is deprecated, and will be
 *removed in a future version. To use the new parser, pass option
 *{ useNewUrlParser: true } to MongoClient.connect.
 *
 * if throw err about craeteIndex use it as true-> useCreateIndex for ->DeprecationWarning: collection.ensureIndex is deprecated. Use createIndexes
 *instead
 * 
 */

 //connecting the database of mongoDB
mongoose.connect(process.env.URI,{
    useNewUrlParser:true
})


