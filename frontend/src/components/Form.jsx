import {useState} from 'react'
import api from '../api'
import { useNavigate } from 'react-router-dom'
import {ACCESS_TOKEN, REFRESH_TOKEN} from '../constants'


function Form({ route, method}){
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()

    
    return <form>
        <h1>{name}</h1>
        <input
            type="text"
            value={username}
            onChange={(e)=>setUsername(e.target.value)}
        />

    </form>
    
}