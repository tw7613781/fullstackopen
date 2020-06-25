import axios from 'axios'

const baseUrl = 'http://localhost:3001/api/persons'
// const baseUrl = '/api/persons'

const getAll = () => {
    const req = axios.get(baseUrl)
    return req.then(res => res.data)
}

const create = (person) => {
    const req = axios.post(baseUrl, person)
    return req.then(res => res.data)
}

const update = (id, person) => {
    const req = axios.put(`${baseUrl}/${id}`, person)
    return req.then(res => res.data)
}

const deletePerson = (id) => {
    const req = axios.delete(`${baseUrl}/${id}`)
    return req.then(res => res.data)
}

const errorHandler = (err) => {
    if (err.response) {
        return err.response.data.error
    } else if (err.request) {
        return err.request
    } else {
        return err.message
    }
}

export default {
    getAll, create, update, deletePerson, errorHandler
}
