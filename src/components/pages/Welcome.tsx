import React, {useState, useEffect} from 'react'
import {useMutation} from '@apollo/client'
import Centum from 'centum.js'
import BackgroundImage from '../../assets/wot-background.jpg'
import {getNickname} from '../../store/localstorage'
import {FEEDBACK_TYPES, PROJECT_TITLE} from '../../env/env'
import NavigatorWrapper from '../router/NavigatorWrapper'
import ImageLook from '../UI/ImageLook'
import {sendFeedbackM} from '../../graphql/pages/WelcomePageQueries'
import features from '../../env/features.json'

const Welcome: React.FC = () => {
    const [state, setState] = useState({
        nickname: getNickname(),
        category: FEEDBACK_TYPES[0],
        msg: ''
    })

    const centum = new Centum()

    const {nickname, category, msg} = state

    const [sendFeedback] = useMutation(sendFeedbackM, {
        onCompleted(data) {
            setState({
                nickname: getNickname(),
                category: FEEDBACK_TYPES[0],
                msg: ''
            })
        }
    })

    useEffect(() => {
        centum.title('Welcome Page', PROJECT_TITLE)
    }, [])

    const onSend = () => {
        sendFeedback({
            variables: {
                nickname, category, msg
            }
        })
    }

    return (
        <>    
   
            <h1>Wotus.com</h1>
            <h4 className='pale'>Roll out!</h4>
           
            <ImageLook src={BackgroundImage} className='photo_item' />      

            <NavigatorWrapper isRedirect={false} url='/register'>
                <button className='light'>Start</button>
            </NavigatorWrapper>

            <h2>Features</h2>

            <div className='items half'>
                {features.map(el => 
                    <div className='item panel'>
                        {el.title}
                        <p className='pale'>{el.text}</p>
                    </div>    
                )}
            </div>

            <h2>Feedback</h2>
            <input value={nickname} onChange={e => setState({...state, nickname: e.target.value})} placeholder='Nickname' type='text' />

            <h4 className='pale'>Category</h4>
            <div className='items small'>
                {FEEDBACK_TYPES.map(el => <div onClick={() => setState({...state, category: el})} className={el === category ? 'item label active' : 'item label'}>{el}</div>)}
            </div>

            <textarea value={msg} onChange={e => setState({...state, msg: e.target.value})} placeholder='Text...' />

            <button onClick={onSend}>Send</button>
        </>
    )
}

export default Welcome