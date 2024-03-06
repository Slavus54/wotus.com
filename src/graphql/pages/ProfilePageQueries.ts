import {gql} from '@apollo/client'

export const getProfilesQ = gql`
    query {
        getProfiles {
            account_id
            nickname
            password
            telegram
            server
            nation
            region
            cords {
                lat
                long
            }
            main_photo
            missions {
                shortid
                title
                category
                volume
                status
                image
                dateUp
                supports
            }
            account_components {
                shortid
                title
                path
            }
        }
    }
`

export const getProfileM = gql`
    mutation getProfile($account_id: String!) {
        getProfile(account_id: $account_id) {
            account_id
            nickname
            password
            telegram
            server
            nation
            region
            cords {
                lat
                long
            }
            main_photo
            missions {
                shortid
                title
                category
                volume
                status
                image
                dateUp
                supports
            }
            account_components {
                shortid
                title
                path
            }
        }
    }
`