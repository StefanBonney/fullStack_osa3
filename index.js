const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require ('cors')
const app = express()

const Person = require('./models/person')

app.use(express.static('build'))// >>>> static build use
app.use(cors())
app.use(bodyParser.json())

morgan.token('object', function (req, res) { return JSON.stringify(req.body)})

app.use(morgan(':method :url :object :status :response-time'))



//_________________________________________________________________________


//##############################################################################[GET]

app.get('/info', (req, res) => {//____________________________________________[/info]
    const date = Date()
 

    Person
        .find({})
        .then(persons => {
            res.send('<p>puhelinluettelossa on ' + persons.length + ' henkilön tiedot' + '</p>' + '<p>' + date + '</p>')
        })
        .catch(error => {
            console.log(error)
        })

})

app.get('/api/persons', (request, response) => {//______________________[/api/persons]
    Person
        .find({})
        .then(persons => {
            response.json(persons.map(person => (Person.format(person)))) //persons.map(Person.format)//persons.map(formatPerson)//    response.json(persons.map(person => (Person.format(person))))
        })
        .catch(error => {
            console.log(error)
            response.status(404).end()
        })

})

app.get('/api/persons/:id', (request, response) => {//________________[/api/persons/:id]
    Person
        .findById(request.params.id)
        .then( person => {
            response.json(Person.format(person)) //Person.format(person)//formatPerson(person)
        })
        .catch(error => {
            console.log(error)
            response.status(404).end()
        })
})

//##############################################################################[POST]
app.post('/api/persons', (request, response) => {
    const body = request.body
    console.log(body)
    
    if (body.name === undefined) {
        return response.status(400).json({ error:'name missing' })
    }
    
    if (body.number === undefined) {
        return response.status(400).json({ error:'number missing' })
    }
    

    Person
        .findOne({ name: body.name })
        .then( object => {
            console.log(object)
            if(object){
                console.log('IN DB============')
                return response.status(400).json({ error:'person already in db' })
            }else{
                const person = new Person({
                    name: body.name,
                    number: body.number,
                })
            
                person
                    .save()
                    .then(savedPerson => {
                        response.json(Person.format(savedPerson))//Person.format(savedPerson)//formatPerson(savedPerson)
                    })
            }

        })
        .catch(err => {
            console.log(err)
            return response.status(400).json({ error: 'error' })
        })

}) 

//##############################################################################[PUT]
app.put('/api/persons/:id', (request, response) => {
    const body = request.body
    console.log('body / put request:', body)
    
    if (body.name === undefined) {
        return response.status(400).json({ error:'name missing'})
    }
    
    if (body.number === undefined) {
        return response.status(400).json({ error:'number missing'})
    }

    Person
        .findByIdAndRemove(request.params.id)
        .then(result => {
            console.log('removed')
        })
        .catch(err => {
            console.log(err)
            return  response.status(400).json({ error: 'something went wrong in changing the info' })
        })

    const person = new Person({
        name: body.name,
        number: body.number,
    })

    
    person
        .save()
        .then(savedPerson => {
            response.json(Person.format(savedPerson))//Person.format(savedPerson)//formatPerson(savedPerson)
        })
}) 


//##############################################################################[DELETE]

app.delete('/api/persons/:id', (request, response) => {
    Person
        .findByIdAndRemove(request.params.id)
        .then(result => {
            return response.status(204).end()
        })
        .catch(err => {
            console.log(err)
            return response.status(400).send({ error: 'malformated id'})
        })


})
//____________________________________________________________________________________

const error = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(error)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})






























