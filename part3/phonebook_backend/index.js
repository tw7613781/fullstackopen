const express = require('express')
const morgan = require('morgan')
const app = express()

morgan.token('body', (req) => {
    return JSON.stringify(req.body)
})

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

const port = 3001

let persons = [
        { 
            "name": "Arto Hellas", 
            "number": "040-123456",
            "id": 1
        },
        { 
            "name": "Ada Lovelace", 
            "number": "39-44-5323523",
            "id": 2
        },
        { 
            "name": "Dan Abramov", 
            "number": "12-43-234345",
            "id": 3
        },
        { 
            "name": "Mary Poppendieck", 
            "number": "39-23-6423122",
            "id": 4
        }
    ]

const randomInt = (max) => {
    return Math.floor(Math.random() * Math.floor(max) )
}

app.get('/info', (req, res) => {
    const personNum = persons.length
    const date = new Date()
    const output = `Phonebook has info for ${personNum} people`
    res.send(
        `
        <p>${output}</p>
        <p>${date.toString()}</p>
        `
    )
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find( (person) => person.id === id)
    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
    
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter( (person) => person.id !== id)
    res.status(204).end()
})

app.post('/api/persons', (req, res) => {
    const body = req.body
    if (!body.name) {
        return res.status(400).json({
            error: 'name missing'
        })
    }
    if (!body.number) {
        return res.status(400).json({
            error: 'number missing'
        })
    }
    if (persons.find( person => person.name === body.name)) {
        return res.status(400).json({
            error: 'name must be unique'
        })
    }
    const id = randomInt(100000000)
    const person = {
        name: body.name,
        number: body.number,
        id
    }
    persons = persons.concat(person)
    res.json(persons)
})

app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`)
})