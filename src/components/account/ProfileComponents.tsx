import {useState} from 'react'
import Centum from 'centum.js'
import components from '../../env/components.json'
import NavigatorWrapper from '../router/NavigatorWrapper'
import DataPagination from '../UI/DataPagination'
import Exit from '../UI/Exit'
import {AccountPageComponentProps} from '../../types/types'

const ProfileComponents = ({profile, context}: AccountPageComponentProps) => {
    const [items, setItems] = useState<any[]>([])

    const centum = new Centum()

    return (
        <>
            
            <div className='items small'>
                {components.map(el => 
                    <div className='item'>
                        <NavigatorWrapper id='' isRedirect={false} url={`/create-${el.path}/${context.account_id}`}>
                            <h4>{el.title}</h4>
                        </NavigatorWrapper>   
                    </div>     
                )}
            </div>

            <DataPagination initialItems={profile.account_components} setItems={setItems} label='My Components:' />
            <div className='items half'>
                {items.map(el =>
                    <div className='item panel'>
                        <NavigatorWrapper id='' isRedirect={false} url={`/${el.path}/${el.shortid}`}>
                            {centum.shorter(el.title, 2)}
                            <h5 className='pale'>{el.path}</h5>
                        </NavigatorWrapper>    
                    </div>
                )}
            </div>

            <Exit /> 
        </> 
    )
}

export default ProfileComponents