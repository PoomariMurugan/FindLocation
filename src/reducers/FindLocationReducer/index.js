import { SET_SEARCH_PLACES_LIST } from '../../constant/FindLocation'

const initialState = {
    locationList: []
}
const locationReducers = (state = initialState, action) => {
    switch (action.type) {
        case SET_SEARCH_PLACES_LIST: {
            return {
                ...state,
                locationList: [...action.payload] || []
            }
        }
        default:
            return state
    }
}

export default locationReducers