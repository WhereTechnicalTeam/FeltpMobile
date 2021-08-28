import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import IconButtonComponent from '@components/icon-button/IconButtonComponent';
import ProfileTextComponent from '@components/profile-text/ProfileTextComponent';
import { colors } from '@theme/colors';

const JobHistoryScreen = () => {

    return (
        <View style={styles.containerView}>
        <ScrollView showsVerticalScrollIndicator={false} >
            <View style={[styles.cardContainer, styles.shadow]}>
                <ProfileTextComponent label="Current Institution" text={"Ghana Health Service"} />
                <ProfileTextComponent label="Job Title" text={"Junior Leader"} />
                <ProfileTextComponent label="Region" text={"Bono"} />
                <ProfileTextComponent label="District" text={"Ada West"} />
                <ProfileTextComponent label="Level of Health System" text={"Regional"} />
                <ProfileTextComponent label="Is Current Job" text={"Yes"} />
            </View>
            
        </ScrollView>
            <View style={styles.fabView}>
                <IconButtonComponent icon="add" size={24} color={colors.white} iconButtonStyle={{...styles.shadow, ...styles.fab}}/>
            </View>
        </View>
    );
}

export default JobHistoryScreen;

const styles = StyleSheet.create({
    containerView: {
        paddingVertical: 20,
        position: 'relative',
        flex: 1
    },
    cardContainer: {
        paddingVertical: 15,
        paddingHorizontal: 20,
        marginTop: 20,
        backgroundColor: colors.white,
    },
    shadow: {
        shadowColor: "#000",
        shadowOffset: {
        width: 0,
        height: 2
        },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 5,
    },
    fabView: {
        bottom: 10,
        alignSelf: 'flex-end',
        right: 10,
        position: 'absolute'
    },
    fab: {
        backgroundColor: colors.primary,
        borderRadius: 25,
    }
});