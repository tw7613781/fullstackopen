import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import personsService from './services/persons'
import './index.css'

const Notification = ({msg}) => {
	if (msg === undefined) return null
	else {
		return (
			<div className="Notification">
				{msg}
			</div>
		)
	}
}

const Error = ({e}) => {
	if (e === undefined) return null
	else {
		return (
			<div className="Error">
				{e}
			</div>
		)
	}
}

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

const PersonForm = ({persons, onPersonsChange, onMsgChange, onErrorChange}) => {
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
					onMsgChange(`${data.name}'s number is uplated`)
					setTimeout( ()=> {
						onMsgChange(undefined)
					}, 5000)
				})
				.catch( (e) => {
					onErrorChange(`error with update person: ${JSON.stringify(e.response.data)}`)
					setTimeout( ()=> {
						onErrorChange(undefined)
					}, 5000)
				})
			}
		} else {
			personsService.create(newPerson)
			.then( (data) => {
				onPersonsChange(persons.concat(data))
				onMsgChange(`${data.name} is created`)
				setTimeout( ()=> {
					onMsgChange(undefined)
				}, 5000)
			})
			.catch( (e)=> {
				onErrorChange(`error with create new person: ${JSON.stringify(e.response.data)}`)
				setTimeout( ()=> {
					onErrorChange(undefined)
				}, 5000)
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

const Person = ({person, onPersonDelete, onMsgChange, onErrorChange}) => {

	const handleDelete = (event) => {
		const id = event.target.value
		const name = event.target.name
		if (window.confirm(`Do you really want to delete ${name}`)) {
			personsService.deletePerson(id)
			.then( () => {
				onPersonDelete(id)
				onMsgChange(`${name} has been deleted`)
				setTimeout( ()=> {
					onMsgChange(undefined)
				}, 5000)
			}).catch( (e) => {
				onErrorChange(`error withn delete ${name}: ${e}`)
				setTimeout( ()=> {
					onErrorChange(undefined)
				}, 5000)
			})
		}
	}
	return (
		<p>{person.name} {person.number} <button name={person.name} value={person.id} onClick={handleDelete}>delete</button></p>
	)
}

const Persons = ({persons, onPersonDelete, onMsgChange, onErrorChange}) => {
	return (
		<div>
			{persons.map( (person) => 
				<Person key={person.name} person={person} onPersonDelete={onPersonDelete} onMsgChange={onMsgChange} onErrorChange={onErrorChange} />
			)}
		</div>
	)
}

const App = () => {
	const [ msg, setMsg ] = useState() 
	const [ persons, setPersons ] = useState()
	const [ error, setError ] = useState()
	const handlePersonsChange = (persons) => {
		setPersons(persons)
	}
	const handleMsgChange = (msg) => {
		setMsg(msg)
	}
	const handleErrorChange = (e) => {
		setError(e)
	}
	const handlePersonDelete = (id) => {
		setPersons(persons.filter( (person) => id !== person.id))
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
			<Notification msg={msg} />
			<Error e={error} />
			<Filter persons={persons} />
			<h2>add a new</h2>
			<PersonForm persons={persons} onPersonsChange={handlePersonsChange} onMsgChange={handleMsgChange} onErrorChange={handleErrorChange}/>
			<h2>Numbers</h2>
			<Persons persons={persons} onPersonDelete={handlePersonDelete} onMsgChange={handleMsgChange} onErrorChange={handleErrorChange}/>
		</div>
	)
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
)