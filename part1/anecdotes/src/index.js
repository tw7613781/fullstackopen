import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const App = (props) => {
    const [selected, setSelected] = useState(0)
    const [vote, setVote] = useState(new Array(props.anecdotes.length).fill(0))

    const randomInt = () => {
        return Math.floor(Math.random() * Math.floor(props.anecdotes.length))
    }

    const handleVote = () => {
        vote[selected] += 1
        setVote([...vote])
    }

    const handleSelected = () => {
        setSelected(randomInt)
    }

    const indexOfMax = () => {
        return vote.indexOf(Math.max(...vote))
    }

    return (
        <div>
            <h1>Anecdote of the day</h1>
            <p>{props.anecdotes[selected]}</p>
            <p>has {vote[selected]} votes</p>
            <button onClick={handleVote}>vote</button>
            <button onClick={handleSelected}>next anecdote</button>
            <h1>Anecdote with most votes</h1>
            <p>{props.anecdotes[indexOfMax()]}</p> 
        </div>
    )
}

const anecdotes = [
    'If it hurts, do it more often',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

ReactDOM.render(
    <App anecdotes={anecdotes} />,
    document.getElementById('root')
)