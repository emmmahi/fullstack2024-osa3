const express = require('express')
const morgan = require('morgan')
const app = express()


const cors = require('cors')
const Person = require('./models/person')
app.use(cors())
app.use(express.json())
//app.use(morgan('tiny'))

app.use(express.static('dist'))


morgan.token('body', (req, res) => JSON.stringify(req.body))

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))



app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
    })


app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        console.log('Fetched persons:', persons); // Log persons
        response.json(persons);
    }).catch(error => {
        console.error('Error fetching persons:', error);
        response.status(500).json({ error: 'Failed to fetch persons' });
    });
});


app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
  })


const generateId = () => {
    return Math.floor(Math.random() * 1000000)
}


app.post('/api/persons', (request, response) => {
    const body = request.body
  
    if (!body.name || !body.number) {
      return response.status(400).json({ 
        error: 'name or number is missing' 
      })
    }

    const nameExists = persons.some(person => person.name === body.name)
    if (nameExists) {
      return response.status(400).json({ 
        error: 'name must be unique' 
      })
    }

    const person = {
        id: generateId().toString(),
        name: body.name,
        number: body.number,
      }
    
      persons = persons.concat(person)
    
      response.json(person)
    })

app.get("/info", (request, response) => {
    const time = new Date();
    const info = `Phonebook has info for ${persons.length} people<br><br>${time}`
    response.send(info)
})

const PORT = process.env.PORT || 3002
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })