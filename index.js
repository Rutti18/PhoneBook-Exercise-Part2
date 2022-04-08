const { Router } = require('express');
const express = require('express')
// var bodyParser = require('body-parser');
const app = express()

const morgan = require ('morgan');

// app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json())

morgan.token('body', (req) => JSON.stringify(req.body));     

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


//3.1: Phonebook backend step1

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
];


app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
});

app.get('/api/persons', morgan('tiny'), (req, res) => {
  res.json(persons);

});

app.get('/api/persons/:id', (req, res) => {
   const id = Number(req.params.id) 
   //console.log(id)

   const person = persons.find(obj => obj.id === id)

    if (person) {
         res.json(person)
    } else {
        res.status(404).end()
    } 
});

//3.2: Phonebook backend step2
app.get('/api/info', (request, response) => {
    response.json("Phonebook has info for "+persons.length+" people")
});

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id) //converting sting to number
    persons = persons.filter(note => note.id !== id)

    response.json(persons)
    
    response.status(204).end()
});

// 3.5: Phonebook backend step5
app.post('/api/persons/', (request, response) => {

    //3.6: Phonebook backend step6

    if(request.body.name === undefined || request.body.name ==''){
        response.status(500).json({ 
        error: 'name is missing' 
        }).end()
        return false;
    }
 
    if(request.body.number === undefined || request.body.number ==''){
        response.status(500).json({ 
        error: 'number is missing' 
        }).end()
        return false;
    }

    const person = persons.find(obj => obj.name === request.body.name)

    if (person) {
        response.status(500).json({ 
            error: ' The name already exists in the phonebook ! ' 
        }).end()
        return false;
    } else {
        let newPerson = { 
            id : Math.random(),
            name:request.body.name ,
            number : request.body.number
        }

        persons = persons.concat(newPerson)
    } 

    
});
  
const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
