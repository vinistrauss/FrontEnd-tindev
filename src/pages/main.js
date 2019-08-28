import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import io from 'socket.io-client';
import './main.css'
import api from '../services/api'
import logo from '../assets/logo.svg';
import like from '../assets/like.svg';
import dislike from '../assets/dislike.svg';
import superLike from '../assets/superLike.png';
import itsamatch from '../assets/itsamatch.png';

export default function Main({match}){
    const[users, setUsers] = useState([]);
    const[matchDev, setMatchDev] = useState(null);
    const[avatar, setAvatar] = useState(null);
    const[username, setUsername] = useState(null);


    useEffect(() => {
        async function loadUsers(){
            const response = await api.get('/devs', {
                headers:{
                    user: match.params.id,
                }
            })
 
            
            const avatar = await localStorage.getItem('avatar_user');
            const username = await localStorage.getItem('username_user');
            setAvatar(avatar);
            setUsername(username);
            setUsers(response.data);
            console.log(response.data); 
        }
        loadUsers();

    }, [match.params.id])

    useEffect(() => {
        const socket = io('http://localhost:3333', {
            query:{
                user: match.params.id,

            },

        });


        // socket.on('world', message => {
        //     console.log(message);
        // }, 3000);

        // setTimeout(() => {
        //     socket.emit('hello', {
        //         message:'hello world'
        //     })
        // }, 3000);

        socket.on('match', dev => {
            setMatchDev(dev);

        })

    }, [match.params.id]);


    async function handleLike(id){
        await api.post(`/devs/${id}/likes`, null, {
            headers: {user: match.params.id},
        })

        setUsers(users.filter(user => user._id !== id));
    }

    async function handleDislike(id){
        await api.post(`/devs/${id}/dislikes`, null, {
            headers: {user: match.params.id},
        })

        setUsers(users.filter(user => user._id !== id));
    }

    async function handleSuperlike(id){
        await api.post(`/devs/${id}/superlikes`, null, {
            headers: {user: match.params.id},
        })

        setUsers(users.filter(user => user._id !== id));
    }

    return(
        <div className="main-container">
        <header>
                <div className="imgHeader">
                <img src={avatar} alt="Imagem usuario"/>
                <p>Seja Bem-vindo, {username}.</p>
            </div>
        </header>
        <Link to="/">
            <img src={logo} alt="Imagem tindev" className="imgLogo"/>
        </Link>
                {users.length > 0 ? (
                    <ul>
                        {users.map(user => (
                                <li key={user._id}>
                                    <img src={user.avatar} alt={user.name}/>
                                    <footer className={user.superlikes.includes(match.params.id) === true ? "teste": ""}>
                                        <strong>{user.name}</strong>
                                        <p>{user.bio}</p>
                                    </footer>
            
                                    <div className="buttons">
                                        <button type="button" className="dislike" onClick={() => handleDislike(user._id)}><img src={dislike} alt="dislike"/></button>
                                        <button type="button" className="superLike" onClick={() => handleSuperlike(user._id)}><img src={superLike} alt="superlike"/></button>
                                        <button type="button" className="like" onClick={() => handleLike(user._id)}><img src={like} alt="like"/></button>
                                    </div>
                                </li>                         
                            ))}

                    </ul>
                ) : (<div className="empty">Acabou :(</div>)}

                {matchDev && (
                    <div className="match-container">
                        <img src={itsamatch} alt="It's a match" /> 

                        <img className="avatar" src={matchDev.avatar} alt="It's a match" />
                        <strong>{matchDev.name}</strong> 
                        <p>{matchDev.bio}</p>


                        <button type="button" onClick={() => setMatchDev(null)}>FECHAR</button>
                    </div>
                )}
                            
        </div>
    );
}