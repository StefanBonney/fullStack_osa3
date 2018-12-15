const mongoose = require ('mongoose')

const url = process.env.MONGODB_URI

mongoose.connect(url, { useNewUrlParser: true })
mongoose.Promise = global.Promise;


const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

personSchema.methods.format = function format(person) {
    return console.log('used method')
    /*
    return {
        name: person.name,
        number: person.number,
        id: person._id
    }
    */
}

const Person = mongoose.model('Person', personSchema);



Person.format = function format(person) { //personSchema.methods.format
    console.log('used method format')
    
    return {
        name: person.name,
        number: person.number,
        id: person._id
    }
     
}


const person = new Person({
    name: 'Jaska',
    number: '040-5566665'
})

console.log(Person)

Person.format(person)

console.log(person)


if(process.argv[2]!== undefined) {
    argv_name = process.argv[2]
    argv_number =  process.argv[3]

    console.log('lisättiin henkilö ' + argv_name + ' numero ' + argv_number)
    
    const person = new Person({
        name: argv_name,
        number: argv_number,
    })
    person.save()
}


if(process.argv[2] === undefined) {
    console.log('puhelinluettelo: ')
    Person
        .find({})
        .then(result => {
            result.forEach(person => {
                console.log(person.name + ' ' + person.number)
            })
            mongoose.connection.close()
        })
}
/*

const person = new Person({
    name: 'Jaska',
    number: '040-5566665'
})

person
    .save()
    .then(response => {
        console.log('person saved')
        mongoose.connection.close()
    })
*/
