import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { colors } from '@theme/colors';

const NotificationsListScreen = () => {

    return (
        <ScrollView contentContainerStyle={styles.containerView} showsVerticalScrollIndicator={false}>
            <Text style={styles.emtyListText}>Notifications will be displayed here</Text>
        </ScrollView>
    );
}

export default NotificationsListScreen;

const styles = StyleSheet.create({
    containerView: {
        paddingVertical: 30
    },
    emtyListText: {
        textAlign: 'center',
        color: colors.primary,
        fontSize: 15,
        fontWeight: '600'
    }
});
