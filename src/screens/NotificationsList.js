import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { colors } from '@theme/colors';

const NotificationsListScreen = () => {

    return (
        <ScrollView contentContainerStyle={styles.containerView} showsVerticalScrollIndicator={false}>
            <Text style={{color: colors.primary, marginLeft: 20}}>Notifications will be displayed here</Text>
        </ScrollView>
    );
}

export default NotificationsListScreen;

const styles = StyleSheet.create({
    containerView: {
        paddingVertical: 20
    },
});
