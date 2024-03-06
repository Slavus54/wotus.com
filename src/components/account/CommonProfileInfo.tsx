import {useState} from 'react'
import {useMutation} from '@apollo/client'
import {SERVERS, NATIONS} from '../../env/env'
import {UpdatePageWithAlert} from '../UI/UpdatePageWithAlert'
import {updateProfileCommonInfoM} from '../../graphql/profile/ProfileQueries'
import {AccountPageComponentProps} from '../../types/types'

const CommonProfileInfo = ({profile, context}: AccountPageComponentProps) => {   
    const [state, setState] = useState({
        server: profile.server, 
        nation: profile.nation
    })

    const {server, nation} = state    

    const [updateProfileCommonInfo] = useMutation(updateProfileCommonInfoM, {
        onCompleted(data) {
            UpdatePageWithAlert(data.updateProfileCommonInfo)
        }
    })


    const onUpdate = () => {
        updateProfileCommonInfo({
            variables: {
                account_id: context.account_id, server, nation
            }
        })
    }

    return (
        <>
            <h4 className='pale'>Game Server and Tank's Nation</h4>
            <div className='items small'>
                <select value={server} onChange={e => setState({...state, server: e.target.value})}>
                    {SERVERS.map(el => <option value={el}>{el}</option>)}
                </select>
                <select value={nation} onChange={e => setState({...state, nation: e.target.value})}>
                    {NATIONS.map(el => <option value={el}>{el}</option>)}
                </select>
            </div>
       
            <button onClick={onUpdate}>Update</button>

        </> 
    )
}

export default CommonProfileInfo