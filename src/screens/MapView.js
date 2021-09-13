import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Alert, PermissionsAndroid } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';

import ButtonComponent from '@components/button/ButtonComponent';
import IconButtonComponent from '@components/icon-button/IconButtonComponent';
import SearchBarComponent from '@components/search-bar/SearchBarComponent';
import { colors } from '@theme/colors';
import { isDefined } from '@utils/validation';

const MapViewScreen = (props) => {

    const [region, setRegion] = useState({
        latitude: 5.6890625,
        longitude: -0.2556875,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    const [userLocation, setUserLocation] = useState({
        longitude: '',
        latitude: ''
    });
    const [officeMarkerPosition, setOfficeMarkerPosition] = useState(null);
    const [officeSearchText, setOfficeSearchText] = useState('');
    const [hasLocationPermission, setHasLocationPermission] = useState(true);
    const mapRef = useRef(null);

    const saveOfficeLocation = () => {
        if(isDefined(officeMarkerPosition)) navigateCallingScreen();
        else handleMarkerPosition();
    }

    const navigateCallingScreen = () => {
        try {
            const callingScreen = props.route.params?.callingScreen || "SignupWithMap";
            if(callingScreen === 'JobHistory') {
                const currentJobProps = props.route.params?.currentJobProps;
                props.navigation.navigate(callingScreen, {
                    currentJobProps: {...currentJobProps, latitude: officeMarkerPosition.latitude.toString(), longitude: officeMarkerPosition.longitude.toString()}
                });
            } else {
            props.navigation.navigate(callingScreen, {
                officeMarkerPosition: {
                    latitude: officeMarkerPosition.latitude.toString(),
                    longitude: officeMarkerPosition.longitude.toString()
                }
            });
            }
        } catch(err) {
            console.warn("Error navigating back from map:", err);
        }
    }

    useEffect(() => {
        (async () => {
            try{
                PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
                .then(async(granted) => {
                    if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                        setHasLocationPermission(false);
                        await requestUserLocationPermission();
                    } else setHasLocationPermission(true);
                }).then(() => {
                    getUserCurrentLocation();
                });                
            }catch(err) {
                console.warn("Error setting up map:", err);
            }
        })();
    }, []);

    const requestUserLocationPermission = async() => {
        try {
            const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
                title: 'FELTP ALUMNI App Location',
                message: "FELTP ALUMNI App needs access to your location to record your office coordinates",
                buttonPositive: "OK",
                buttonNegative: "Cancel",
                buttonNeutral: "Ask Me Later"
            });
            if(granted  === PermissionsAndroid.RESULTS.GRANTED) {
                setHasLocationPermission(true);
            }
        } catch(err) {
            console.warn("Error requesting user location permission:", err);
        }
    }

    const getUserCurrentLocation = () => {
        if(hasLocationPermission) {
            Geolocation.getCurrentPosition(
                (position) => {
                    // console.log("current location:", position);
                    setUserLocation({latitude: position.coords.latitude, longitude: position.coords.longitude});
                    setRegion({...region, latitude: position.coords.latitude, longitude: position.coords.longitude});            
                },
                (error) => {
                    console.warn("Error getting user current location:", error.code, error.message);
                },
                { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
            )
        } else Alert.alert("Location permission is required to use map!");
    }

    const handleMarkerPosition = () => {
        setOfficeMarkerPosition(userLocation);
    }

    const animateToUserPosition = () => {
        getUserCurrentLocation();
        mapRef.current.animateCamera({center: userLocation, zoom: 18}, {duration: 2000});
    }

    return (
        <View style={styles.mapContainer}>
            <View style={[styles.optionButtonContainer, {bottom: 0, top: 30}]}>
                <IconButtonComponent iconButtonStyle={[styles.shadow, styles.iconButton]} color={colors.secondaryBlack} size={25} icon="arrow-back-sharp" onPress={() => props.navigation.goBack(null)}/>
                {/* <SearchBarComponent placeholder="Search for office" disabled handleChange={setOfficeSearchText} value={officeSearchText} searchContainerStyle={styles.shadow}/> */}
            </View>
            <MapView style={styles.map}
                ref={mapRef}
                provider={PROVIDER_GOOGLE}
                showsUserLocation
                region={region}
                followsUserLocation
                showsCompass={false}
                showsMyLocationButton={false}
                // onLongPress={handleMarkerPosition}
                // onRegionChange={handleRegionChange}
            >
                {
                    officeMarkerPosition &&
                    <Marker coordinate={officeMarkerPosition} key={0} title="office-marker" draggable/>     
                }
            </MapView>
            <View style={[styles.optionButtonContainer, {bottom: 30}]}>
                <ButtonComponent title={ !isDefined(officeMarkerPosition) ? "Set Office Marker" : "Save Office Location"} onPress={saveOfficeLocation} buttonContainerStyle={[styles.shadow, {width: '80%'}, isDefined(officeMarkerPosition) ? {backgroundColor: colors.primaryGreen} : {}]}/>
                <IconButtonComponent iconButtonStyle={[styles.shadow, styles.iconButton]} color={colors.secondaryBlack} size={25} icon="locate" onPress={animateToUserPosition}/>
            </View>
        </View>
    )
}

//TODO: Fix back navigation icon button

export default MapViewScreen;

const styles = StyleSheet.create({
    mapContainer: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center', 
    },
    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
    shadow: {
        elevation: 5
    },
    optionButtonContainer: {
        position: 'absolute', 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        width: '100%',
        height: 50,
        paddingHorizontal: 15
    }, 
    iconButton: {
        backgroundColor: colors.white, 
        borderRadius: 25
    }
});