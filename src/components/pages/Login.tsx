import {useState, useEffect, useContext} from 'react'
import {useMutation} from '@apollo/client'
import {getNickname, updateNickname} from '../../store/localstorage'
import Centum from 'centum.js'
import {PROJECT_TITLE} from '../../env/env'
import {Context} from '../../context/WebProvider'
import {loginProfileM} from '../../graphql/profile/ProfileQueries'

const Login = () => {
    const {change_context} = useContext(Context)
    const [state, setState] = useState({
        nickname: getNickname(),
        password: ''
    })

    const centum = new Centum()

    const {nickname, password} = state   

    useEffect(() => {
        centum.title('Login to Account', PROJECT_TITLE)
    }, [])

    const [loginProfile] = useMutation(loginProfileM, {
        optimisticResponse: true,
        onCompleted(data) {
            console.log(data.loginProfile)
            change_context('update', data.loginProfile, 3)
            updateNickname(data.loginProfile.nickname)
        }
    })

    const onLogin = () => {
        loginProfile({
            variables: {
                nickname, password
            }
        })
    }

    return (
        <div className='main'>
            <h1>Enter to Account</h1>
            <input value={nickname} onChange={e => setState({...state, nickname: e.target.value})} placeholder='Nickname' type='text' /> 
            <input value={password} onChange={e => setState({...state, password: e.target.value})} placeholder='Password' type='text' />           

            <button onClick={onLogin}>Login</button>
        </div>
    )
}

export default Login