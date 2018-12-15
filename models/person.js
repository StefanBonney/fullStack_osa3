const mongoose = require ('mongoose')

let url

if ( process.env.NODE.ENV === 'production'){
    url = process.env.MONGODB_PRODUCTION_URI
} else {
    require('dotenv').config()
 
    url = process.env.MONGODB_URI
}

mongoose.connect(url, { useNewUrlParser: true })
mongoose.Promise = global.Promise


const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})



personSchema.statics.format = function format(person) { //personSchema.methods.format
    return {
        name: person.name,
        number: person.number,
        id: person._id
    }
}

const Person = mongoose.model('Person', personSchema)

module.exports = Person