import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const Person = ({person}) => {
	return (
		<p>{person.name} {person.phone}</p>
	)
}

const Filter = ({persons}) => {
	const [ searchedPersons, setSearchedPersons] = useState([])

	const handleSearchName = (event) => {
		const target = event.target.value.toLowerCase()
		setSearchedPersons(persons.filter( (person) => {
			const str = person.name.toLowerCase()
			return str.includes(target)
		}))
	}

	return (
		<div>
			filter shown with <input onChange={handleSearchName}/>
			{searchedPersons.map( (person) => 
				<Person key={person.name} person={person} />
			)}
		</div>
	)

}

const PersonForm = ({persons, onPersonsChange}) => {
	const [ newName, setNewName ] = useState('') 
	const [ newPhone, setNewPhone ] = useState('')
	const handleNameChange = (event) => {
		setNewName(event.target.value)
	}

	const handlePhoneChnage = (event) => {
		setNewPhone(event.target.value)
	}
	const addPerson = (event) => {
		event.preventDefault()
		if (persons.find( person => person.name === newName)) {
			return window.alert(`${newName} is already added to phonebook`)
		}
		const newPerson = {
			name: newName,
			phone: newPhone
		}
		onPersonsChange(persons.concat(newPerson))
	}
	return (
		<div>
			<form onSubmit={addPerson}>
				<div>
					name: <input value={newName} onChange={handleNameChange}/>
				</div>
				<div>
					number: <input value={newPhone} onChange={handlePhoneChnage}/>
				</div>
				<div>
					<button type="submit">add</button>
				</div>
			</form>
		</div>
	)
}

const Persons = ({persons}) => {
	return (
		<div>
			{persons.map( (person) => 
				<Person key={person.name} person={person} />
			)}
		</div>
	)
}

const App = () => {

	const [ persons, setPersons ] = useState([
		{ name: 'Arto Hellas', phone: '040-123456' },
		{ name: 'Ada Lovelace', phone: '39-44-5323523' },
		{ name: 'Dan Abramov', phone: '12-43-234345' },
		{ name: 'Mary Poppendieck', phone: '39-23-6423122' }
	  ])
	const handlePersonsChange = (persons) => {
		setPersons(persons)
	}
	return (
		<div>
			<h2>Phonebook</h2>
			<Filter persons={persons} />
			<h2>add a new</h2>
			<PersonForm persons={persons} onPersonsChange={handlePersonsChange} />
			<h2>Numbers</h2>
			<Persons persons={persons} />
		</div>
	)
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
)