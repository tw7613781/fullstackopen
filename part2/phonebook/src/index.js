import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import personsService from './services/persons'

const Filter = ({persons}) => {
	const [ searchedPersons, setSearchedPersons] = useState([])

	const handleSearchName = (event) => {
		const target = event.target.value.toLowerCase()
		if(target === '') {
			setSearchedPersons([])
		} else
		setSearchedPersons(persons.filter( (person) => {
			const str = person.name.toLowerCase()
			return str.includes(target)
		}))
	}

	return (
		<div>
			filter shown with <input onChange={handleSearchName}/>
			{searchedPersons.map( (person) => 
				<p key={person.id}>{person.name} {person.number}</p>
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
		const newPerson = {
			name: newName,
			number: newNumber
		}
		const conflictedPerson = persons.find( person => person.name === newName)
		if (conflictedPerson) {
			if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
				personsService.update(conflictedPerson.id, newPerson)
				.then( (data) => {
					onPersonsChange(persons.map( person => person.id === data.id? data : person))
				})
				.catch( (e) => {
					window.alert(`error with update person: ${e}`)
				})
			}
		} else {
			personsService.create(newPerson)
			.then( (data) => {
				onPersonsChange(persons.concat(data))
			})
			.catch( (e)=> {
				window.alert(`error with create new person: ${e}`)
			})
		}
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

const Person = ({person, onPersonDelete}) => {

	const handleDelete = (event) => {
		const id = event.target.value
		const name = event.target.name
		if (window.confirm(`Do you really want to delete ${name}`)) {
			personsService.deletePerson(id)
			.then( () => {
				onPersonDelete(id)
			}).catch( (e) => {
				window.alert(`error withn delete ${name}: ${e}`)
			})
		}
	}
	return (
		<p>{person.name} {person.number} <button name={person.name} value={person.id} onClick={handleDelete}>delete</button></p>
	)
}

const Persons = ({persons, onPersonDelete}) => {
	return (
		<div>
			{persons.map( (person) => 
				<Person key={person.name} person={person} onPersonDelete={onPersonDelete}/>
			)}
		</div>
	)
}

const App = () => {

	const [ persons, setPersons ] = useState()
	const handlePersonsChange = (persons) => {
		setPersons(persons)
	}
	const handlePersonDelete = (id) => {
		setPersons(persons.filter( (person) => Number(id) !== person.id))
	}
	useEffect( ()=>{
		personsService.getAll()
		.then( data => setPersons(data))
		.catch( (e)=>{ window.alert(`error with getAll data: ${e}`)})
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
			<Persons persons={persons} onPersonDelete={handlePersonDelete}/>
		</div>
	)
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
)