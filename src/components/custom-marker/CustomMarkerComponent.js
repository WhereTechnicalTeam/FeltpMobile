import React from 'react';
import { StyleSheet, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '@theme/colors';

const CustomMarkerComponent = (props) => {
    const {showCircleRegion, invalid} = props;

    return (
        <View>
            <Icon name="pin" color={colors.red} size={35} />
        </View>
    );
}

export default CustomMarkerComponent;

const styles = StyleSheet.create({

});