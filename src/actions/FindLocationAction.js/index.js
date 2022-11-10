import { SET_SEARCH_PLACES_LIST } from '../../constant/FindLocation'

export const setSearchPlaceList = payload => {
    return {
        type: SET_SEARCH_PLACES_LIST,
        payload
    }
}