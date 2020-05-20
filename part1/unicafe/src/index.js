import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const Statistics = ({good, neutral, bad}) => {
    let total = good + neutral + bad
    let average = (good - bad) / total
    let positive = (good / total) * 100
    if (total === 0) {
        return (
            <p>No feedback given</p>
        )
    }
    return (
        <table>
            <tbody>
                <Statistic text="good" value={good} />
                <Statistic text="neutral" value={neutral} />
                <Statistic text="bad" value={bad} />
                <Statistic text="all" value={total} />
                <Statistic text="average" value={average} />
                <Statistic text="positive" value={positive} />
            </tbody>
        </table>
    )
}

const Statistic = (props) => {
    return (
        <tr>
            <td>{props.text}</td>
            <td>{props.value}</td>
        </tr>
    )
}

const Button = (props) => {
    return (
        <button onClick={props.onClick}>{props.text}</button>
    )
}

const App = () => {
    const [good, setGood] = useState(0)
	const [neutral, setNeutral] = useState(0)
    const [bad, setBad] = useState(0)
    const handleGoodClick = () => {
        setGood(good+1)
    }
    const handleNeutralClick = () => {
        setNeutral(neutral+1)
    }
    const handleBadClick = () => {
        setBad(bad+1)
    }
    return (
        <div>
            <h1>give feedback</h1>
            <Button onClick={handleGoodClick} text="good" />
            <Button onClick={handleNeutralClick} text="neutral" />
            <Button onClick={handleBadClick} text="bad" />
            <h1>statistics</h1>
            <Statistics good={good} neutral={neutral} bad={bad} />
        </div>
    )
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
)