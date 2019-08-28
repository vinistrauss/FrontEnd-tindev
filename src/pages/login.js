import React, {useState} from 'react';


import logo from '../assets/logo.svg';
import './login.css';
import api from '../services/api'

export default function Login({history}) {
    const [username, setUsername] = useState('');

    async function handleSubmit(e){
        e.preventDefault();

        //console.log(username);

        const response = await api.post('/devs', {
            username

        });

        const {_id} = response.data

        // console.log(response.data);

        localStorage.setItem('avatar_user', response.data.avatar);
        localStorage.setItem('username_user', response.data.user);

        history.push(`/dev/${_id}`);
    }

    return(
        <div className="login-container">
            <form onSubmit={handleSubmit}>
                <img src={logo} alt='Tindev Logo'/>
                <input 
                    placeholder='Digite seu usuário no Github'
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                />
                <button type="submit">Enviar</button>
            </form>
        </div>
    );
}

