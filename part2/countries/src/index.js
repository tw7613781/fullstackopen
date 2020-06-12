import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'

const CountryAlone = ({country}) => {
	return (
		<div>
			<h1>{country.name}</h1>
			<p>capital {country.capital}</p>
			<p>population {country.population}</p>
			<h2>languages</h2>
			<ul>
				{country.languages.map( (language) => 
					<li key={language.name}>{language.name}</li>)
				}
			</ul>
			<img src={country.flag} alt="country flag" width="100"></img>
		</div>
	)
}

const Weather = ({weather}) => {
	if (weather.error) {
		return (
			<div>
				<h2>Weather</h2>
				{weather.error.info}
			</div>
		)
	}
	return (
		<div>
			<h2>Weather in {weather.location.name}</h2>
			<p>temperature: {weather.current.temperature} Celcius</p>
			<img src={weather.current.weather_icons[0]} alt="weather_icons" width="100"></img>
			<p>wind: {weather.current.wind_speed} mph direction {weather.current.wind_dir}</p>
		</div>
	)
}

const Country = ({country}) => {
	const api_key = process.env.REACT_APP_API_KEY
	const [weather, setWeather] = useState()
	useEffect( () => {
		axios.get(`http://api.weatherstack.com/current?access_key=${api_key}&query=${country.capital}`)
		.then( (res)=> {
			setWeather(res.data)
		}).catch( (e)=> {
			console.log(e)
		})
	}, [])
	if (weather === undefined) {
		return (
			<CountryAlone country={country} />
		)
	}
	return (
		<div>
			<CountryAlone country={country} />
			<Weather weather={weather} />
		</div>
	)
}

const Countries10 = ({countries}) => {
	const [output, setOutput] = useState()
	const handleClick = (e) => {
		setOutput(countries.filter( country => country.name === e.target.value))
	}
	if(output !== undefined) {
		return (
			<Country country={output[0]}/>
		)
	}
	return (
		<div>
			<ul>
				{countries.map( country => 
					<li key={country.name}>{country.name} 
						<button value={country.name} onClick={handleClick}>show</button>
					</li>)}
			</ul>
		</div>
	)
}

const Countries = ({countries}) => {
	if (countries.length > 10) {
		return (
			<p>Too many matches, specify another filter</p>
		)
	} else if (countries.length < 10 && countries.length > 1) {
		return (
			<Countries10 countries={countries}/>
		)
	} else if (countries.length === 1) {
		return (
			<Country country={countries[0]}/>
		)
	} else {
		return (
			<div>
				<p>no match</p>
			</div>
		)
	}
}

const App = () => {

	const [ countries, setCountries ] = useState()
	const [ searchItem, setSearchItem] = useState('')
	const [ matched, setMatched] = useState([])
	const handleSearchItem = (e) => {
		setSearchItem(e.target.value)
		const str = e.target.value.toLowerCase()
		setMatched( countries.filter( country => country.name.toLowerCase().includes(str)) )
	}
	useEffect( ()=>{
		axios.get('https://restcountries.eu/rest/v2/all')
		.then( (res) => {
			setCountries(res.data)
		})
	}, [])
	if (countries === undefined) {
		return (
			<div>
				<p>loading</p>
			</div>
		)
	}
	return (
		<div>
			<div>
				find countries <input value={searchItem} onChange={handleSearchItem}></input> 
			</div>
			<Countries countries={matched} />
		</div>
	)
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
)