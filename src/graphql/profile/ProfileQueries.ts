import {gql} from '@apollo/client'

export const updateProfilePersonalInfoM = gql`
    mutation updateProfilePersonalInfo($account_id: String!, $main_photo: String!) {
        updateProfilePersonalInfo(account_id: $account_id, main_photo: $main_photo) 
    }
`

export const updateProfileGeoInfoM = gql`
    mutation updateProfileGeoInfo($account_id: String!, $region: String!, $cords: ICord!) {
        updateProfileGeoInfo(account_id: $account_id, region: $region, cords: $cords) 
    }
`

export const updateProfileCommonInfoM = gql`
    mutation updateProfileCommonInfo($account_id: String!, $server: String!, $nation: String!) {
        updateProfileCommonInfo(account_id: $account_id, server: $server, nation: $nation) 
    }
`

export const updateProfilePasswordM = gql`
    mutation updateProfilePassword($account_id: String!, $current_password: String!, $new_password: String!) {
        updateProfilePassword(account_id: $account_id, current_password: $current_password, new_password: $new_password)
    }
`

export const manageProfileMissionM = gql`
    mutation manageProfileMission($account_id: String!, $option: String!, $title: String!, $category: String!, $volume: Float!, $time: String!, $weekday: String!, $status: String!, $image: String!, $coll_id: String!) {
        manageProfileMission(account_id: $account_id, option: $option, title: $title, category: $category, volume: $volume, time: $time, weekday: $weekday, status: $status, image: $image, coll_id: $coll_id)
    }
`

export const createProfileM = gql`
    mutation createProfile($nickname: String!, $password: String!, $telegram: String!, $server: String!, $nation: String!, $region: String!, $cords: ICord!, $main_photo: String!) {
        createProfile(nickname: $nickname, password: $password, telegram: $telegram, server: $server, nation: $nation, region: $region, cords: $cords, main_photo: $main_photo) {
            account_id
            nickname
            server
            nation
        }
    }
`

export const loginProfileM = gql`
    mutation loginProfile($nickname: String!, $password: String!) {
        loginProfile(nickname: $nickname, password: $password) {
            account_id
            nickname
            server
            nation
        }
    }
`
