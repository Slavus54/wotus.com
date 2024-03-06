import {AlertFunctionType} from '../../types/types'

export const UpdatePageWithAlert: AlertFunctionType = (text) => {
    alert(text)
    window.location.reload()
}