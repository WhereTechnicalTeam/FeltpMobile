import React from 'react';
import { StyleSheet, View } from 'react-native';
import AvatarComponent from '../avatar/AvatarComponent';
import BadgeComponent from '../badge/BadgeComponent';
import IconButtonComponent from '../icon-button/IconButtonComponent';

const ProfileSummaryComponent = (props) => {

    const { member: {photo, firstname, surname, region, district, jobTitle, level}, onChatPress, onProfilePress } = props;
    return (
        <View>
            <View>
                <AvatarComponent />
                <BadgeComponent />
            </View>
            <View>
                <View>
                    <Text></Text>
                    <Text></Text>
                    <Text></Text>
                </View>                
                <View>
                    <IconButtonComponent />
                    <IconButtonComponent />
                </View>
            </View>
        </View>
    );
}

export default ProfileSummaryComponent;

const styles = StyleSheet.create({

});