import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'

const Person = ({person}) => {
	return (
		<p>{person.name} {person.number}</p>
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
	const [ newNumber, setNewNumber ] = useState('')
	const handleNameChange = (event) => {
		setNewName(event.target.value)
	}

	const handleNumberChange = (event) => {
		setNewNumber(event.target.value)
	}
	const addPerson = (event) => {
		event.preventDefault()
		if (persons.find( person => person.name === newName)) {
			return window.alert(`${newName} is already added to phonebook`)
		}
		const newPerson = {
			name: newName,
			number: newNumber
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
					number: <input value={newNumber} onChange={handleNumberChange}/>
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

	const [ persons, setPersons ] = useState()
	const handlePersonsChange = (persons) => {
		setPersons(persons)
	}
	useEffect( ()=>{
		axios.get('http://localhost:3001/persons').
		then( (res) => {
			setPersons(res.data)
		})
	}, [])
	if (persons === undefined) {
		return (
			<div>
				<h2>Phonebook</h2>
				<p>loading</p>
			</div>
		)
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