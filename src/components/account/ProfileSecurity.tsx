import {useState, useMemo} from 'react'
import {useMutation} from '@apollo/client'
import uniqid from 'uniqid'
import {UpdatePageWithAlert} from '../UI/UpdatePageWithAlert'
import {updateProfilePasswordM} from '../../graphql/profile/ProfileQueries'
import {AccountPageComponentProps} from '../../types/types'

const ProfileSecurity = ({profile, context}: AccountPageComponentProps) => {
    const [percent, setPercent] = useState<number>(50)
    const [state, setState] = useState({
        current_password: '',
        new_password: ''
    })

    const {current_password, new_password} = state

    const [updateProfilePassword] = useMutation(updateProfilePasswordM, {
        onCompleted(data) {
            UpdatePageWithAlert(data.updateProfilePassword)
        }
    })

    useMemo(() => {
        let length: number = Math.floor(percent / 10)
        let salt: string = profile.nickname.split(' ').join('').toLowerCase().slice(0, length)

        setState({...state, new_password: uniqid(salt)})
        
    }, [percent])

    const onUpdate = () => {
        updateProfilePassword({
            variables: {
                account_id: context.account_id, current_password, new_password
            }
        })
    }
    
    return (
        <>
            <h4 className='pale'>Current and New Password</h4>
            <div className='items small'>
                <input value={current_password} onChange={e => setState({...state, current_password: e.target.value})} placeholder='Enter password' type='text' />
                <input value={new_password} onChange={e => setState({...state, new_password: e.target.value})} placeholder='New password' type='text' />
            </div>

            <h4 className='pale'>Level of Defense: <b>{percent}%</b></h4>
            <input value={percent} onChange={e => setPercent(parseInt(e.target.value))} type='range' step={1} />
        
            <button onClick={onUpdate}>Update</button>
        </> 
    )
}

export default ProfileSecurity