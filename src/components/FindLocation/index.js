import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { SET_SEARCH_PLACES_LIST } from '../../constant/FindLocation'
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

const google = window.google

const FindLocationComponent = () => {
    const [selfMap, setSelfMap] = useState('')
    const [selfMarker, setselfMarker] = useState('')
    const [selfinfowindowContent, setselfinfowindowContent] = useState('')
    const [selfInfoWindow, setselfInfoWindow] = useState('')
    const locationList = useSelector((state) => state.locationReducers.locationList || [])
    const dispatch = useDispatch()

    useEffect(() => {
        const map = new google.maps.Map(document.getElementById("map"), {
            center: { lat: -34.397, lng: 150.644 },
            zoom: 8,
        });
        setSelfMap(map);
        const infowindow = new google.maps.InfoWindow();
        const infowindowContent = document.getElementById(
            "infowindow-content"
        );
        infowindow.setContent(infowindowContent);
        setselfInfoWindow(infowindow);
        setselfinfowindowContent(infowindowContent);

        const marker = new google.maps.Marker({
            map,
            anchorPoint: new google.maps.Point(0, -29),
        });
        setselfMarker(marker);

    }, []);


    const onSearchLocations = event => {
        if (!event.target.value) {
            dispatch({ type: SET_SEARCH_PLACES_LIST, payload: [] })
        } else {
            var service = new google.maps.places.AutocompleteService();
            service.getQueryPredictions({ input: event.target.value }, function (predictions, status) {
                if (status == google.maps.places.PlacesServiceStatus.OK) {
                    if (predictions.length > 0) {
                        dispatch({ type: SET_SEARCH_PLACES_LIST, payload: predictions })
                    } else {
                        dispatch({ type: SET_SEARCH_PLACES_LIST, payload: [] })
                    }
                }
            })
        }
    }
    function debounce(func, wait) {
        let timeout;
        return function (...args) {
            const context = this;
            if (timeout) clearTimeout(timeout);
            timeout = setTimeout(() => {
                timeout = null;
                func.apply(context, args);
            }, wait);
        };
    }
    const debounceOnChange = debounce(onSearchLocations, 400)

    const onSelectLocation = (event, newValue) => {
        var service = new google.maps.places.PlacesService(selfMap);
        service.getDetails({
            placeId: newValue.place_id
        }, function (place, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                if (!place.geometry || !place.geometry.location) {
                    // User entered the name of a Place that was not suggested and
                    // pressed the Enter key, or the Place Details request failed.
                    window.alert("No details available for input: '" + place.name + "'");
                    return;
                }

                // If the place has a geometry, then present it on a map.
                if (place.geometry.viewport) {
                    selfMap.fitBounds(place.geometry.viewport);
                } else {
                    selfMap.setCenter(place.geometry.location);
                    selfMap.setZoom(17);
                }

                selfMarker.setPosition(place.geometry.location);
                selfMarker.setVisible(true);

                selfinfowindowContent.children["place-name"].textContent = place.name;
                selfinfowindowContent.children["place-address"].textContent = place.formatted_address;
                selfInfoWindow.open(selfMap, selfMarker);
            }
        });
    }
    return (
        <section className="locationBox">
            <div className="placeDropdownBox">
                <p className="placeLabel">Find Place</p>
                <Autocomplete
                    id="combo-box-demo"
                    className="autoCompleteBox"
                    options={locationList || []}
                    onChange={(event, newValue) => onSelectLocation(event, newValue)}
                    getOptionLabel={(option) => option.description || ""}
                    onInputChange={debounceOnChange}
                    renderInput={(params) => <TextField {...params} label="Find Location" />}
                />
            </div>
            <div>
                <div id="map"></div>
                <div id="infowindow-content">
                    <span id="place-name" className="title"></span><br />
                    <span id="place-address"></span>
                </div>
            </div>
        </section>
    )
}

export default FindLocationComponent