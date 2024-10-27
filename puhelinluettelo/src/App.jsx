import { useState, useEffect } from 'react'
import axios from 'axios'
import Personslist from './services/personslist'


// Komponentti hakulomakkeelle
const FilterForm = ({ searchName, handleSearchChange }) => {
  return (
    <div>
      filter shown with: <input 
        value={searchName}
        onChange={handleSearchChange} // Muutoksen käsittelijä
      />
    </div>
  )
}

// Komponentti uuden henkilön lisäämistä varten
const PersonForm = ({ newName, newNumber, handleNameChange, handleNumberChange, handleSubmit }) => {
  return (
    <form onSubmit={handleSubmit}>
      <div>
        name: <input 
          value={newName}
          onChange={handleNameChange} // Muutoksen käsittelijä
        />
      </div>
      <div>
        number: <input 
          value={newNumber}
          onChange={handleNumberChange} // Muutoksen käsittelijä
        />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

// Komponentti, joka näyttää listan henkilöistä
const Persons = ({ personsToShow, deleteOption }) => {
  return (
    <ul>
      {personsToShow.map(person => 
        <li key={person.name}>{person.name} - {person.number}
        <button onClick={() => deleteOption(person.id, person.name)}>Delete</button>
        </li>
      )}
    </ul>
  )
}

const Notification = ({ message, type }) => {
  if (message === null) {
    return null
  }

  const notificationStyle = {
    color: type === 'success' ? 'green' : 'red',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  }

  return (
    <div style={notificationStyle}>
      {message}
    </div>
  )
}

const App = () => {
  // Tilat sovellukselle
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchName, setSearchName] = useState('') // Tila hakukentälle
  const [message, setMessage] = useState(null) // Ilmoitusviesti
  const [messageType, setMessageType] = useState('success') // Ilmoituksen tyyppi



 // Palvelimen kanssa kommunikoinnin asetus
  useEffect(() => {
    Personslist
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

    // Näytä ilmoitus ja piilota se hetken kuluttua
  const showNotification = (message, type = 'success') => {
    setMessage(message)
    setMessageType(type)
    setTimeout(() => {
      setMessage(null)
    }, 5000) // Näytetään ilmoitus 5 sekunnin ajan
  }

  const deleteOption = (id, name)  => {
    if (window.confirm(`Delete ${name}?`)) {
      Personslist
        .remove(id)  // poistetaan serveriltä
        .then(() => {
          setPersons(persons.filter(person => person.id !== id)) // asetetaan uudelleen persons data
          showNotification(`${name} deleted successfully.`, 'success')
        })
        .catch(error => {
          showNotification(`Failed to delete ${name}.`, 'error')
        })
    }
  }

  const addPerson = (event) => {
    event.preventDefault()
  
    // Etsi, onko henkilö jo olemassa puhelinluettelossa
    const existingPerson = persons.find(person => person.name === newName)
  
    // Jos henkilö on jo olemassa, kysy varmistus numeron päivittämisestä
    if (existingPerson) {
      if (window.confirm(`${newName} is already added to the phonebook, replace the old number with a new one?`)) {
        const updatedPerson = { ...existingPerson, number: newNumber }
  
        // Päivitetään henkilön numero PUT-pyynnöllä
        Personslist
          .update(existingPerson.id, updatedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.id !== existingPerson.id ? person : returnedPerson))
            setNewName('')
            setNewNumber('')
            showNotification(`${newName}'s number updated successfully!`, 'success')
          })
          .catch(error => {
            showNotification(`Failed to update ${newName}'s number.`, 'error')
          })
      }
      return
    }
    // Jos henkilö ei ole olemassa, lisätään uusi henkilö
    const newPerson = {
      name: newName,
      number: newNumber
    }
  
    Personslist
      .create(newPerson)
      .then(addedPerson => {
        setPersons(persons.concat(addedPerson))
        setNewName('')
        setNewNumber('')
        showNotification(`${newName} added successfully!`, 'success')
      })
      .catch(error => {
        showNotification(`Failed to add ${newName}.`, 'error')
      })
  }
  
  // Henkilöiden suodattaminen hakukentän perusteella
  const personsToShow = persons.filter(person => 
    person.name.toLowerCase().includes(searchName.toLowerCase())
  )

  return (
    <div>
      <h1>Phonebook</h1>
      {/* Ilmoitusviestin näyttäminen */}
      <Notification message={message} type={messageType} />

      {/* Hakukenttä (FilterForm-komponentti) */}
      <FilterForm 
        searchName={searchName} 
        handleSearchChange={(e) => setSearchName(e.target.value)}
      />

      <h2>Add a new</h2>

      {/* Lomake henkilön lisäämistä varten (PersonForm-komponentti) */}
      <PersonForm 
        newName={newName} 
        newNumber={newNumber}
        handleNameChange={(e) => setNewName(e.target.value)}
        handleNumberChange={(e) => setNewNumber(e.target.value)}
        handleSubmit={addPerson}
      />

      <h2>Numbers</h2>

      {/* Henkilölistan renderöinti (Persons-komponentti) */}
      <Persons personsToShow={personsToShow} 
      deleteOption={deleteOption}
      />
    </div>
  )
}

export default App
