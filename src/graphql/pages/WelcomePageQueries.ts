import {gql} from '@apollo/client'

export const sendFeedbackM = gql`
    mutation sendFeedback($nickname: String!, $category: String!, $msg: String!) {
        sendFeedback(nickname: $nickname, category: $category, msg: $msg)
    }
`