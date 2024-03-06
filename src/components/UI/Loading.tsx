import React from 'react'
import {LoadingPropsType} from '../../types/types'

const Loading: React.FC<LoadingPropsType> = ({loadLabel = ''}) => 
<>
    <img src='../loading.gif' className='loader' alt='Loading' />
    {loadLabel} loading...
</>

export default Loading