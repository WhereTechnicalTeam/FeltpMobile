import React from 'react';
import { StyleSheet, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '@theme/colors';
import CustomCalloutComponent from '../custom-callout/CustomCalloutComponent';

const CustomMarkerComponent = (props) => {
    const {showCircleRegion, invalid, calloutProps} = props;

    return (
        <View style={{alignItems: 'center'}}>
            <CustomCalloutComponent {...calloutProps}/>
            <Icon name="pin" color={colors.red} size={35} />
        </View>
    );
}

export default CustomMarkerComponent;

const styles = StyleSheet.create({
    markerCircle: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 50,
        height: 50,
        borderRadius: 20,
        backgroundColor: colors.lightPrimary
    }
});