import React from 'react';
import { View, Text, Image , StyleSheet} from 'react-native';
import ButtonComponent from '@components/button/ButtonComponent';
import LinkTextComponent from '@components/link-text/LinkTextComponent';
import { colors } from '@theme/colors';

const AuthLoadingScreen = (props) => {
    const {appName, subTitle, onCreateAccountPress, onRedirectTextPress} = props;

    const authLoadingImage = require("@assets/authLoading.jpg");

    return (
        <View style={styles.authLoadingContainer}>
            <View style={styles.topSectionView}>
                <View style={styles.authloadingImageView}>
                    <Image style={styles.authLoadingImage} source={authLoadingImage}/>
                </View>
                <View>
                    <Text style={styles.appName}>{appName}</Text>
                </View>
                <View>
                    <Text style={styles.subTitle}>{subTitle}</Text>
                </View>                
            </View>
            <View style={styles.bottomSectionView}>
                <ButtonComponent title="Create An Account" onPress={onCreateAccountPress} buttonContainerStyle={styles.buttonComponent}/>
                <LinkTextComponent preText="Already have an account?" actionText="Login" onPress={onRedirectTextPress}/>
            </View>
        </View>
    )
}

export default AuthLoadingScreen;

const styles = StyleSheet.create({
    authLoadingContainer: {
        flex: 1,
        // justifyContent: 'space-between',
        paddingBottom: 30
    },
    topSectionView: {
        marginBottom: 30,
    },
    authloadingImageView: {
        marginBottom: 20,
        height: '80%',
    },
    authLoadingImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    appName: {
        textAlign: 'center',
        textTransform: 'uppercase',
        fontWeight: 'bold',
        fontSize: 25,
        color: colors.black,
        // marginTop: 30
    }, 
    subTitle: {
        color: colors.secondaryBlack,
        fontSize: 14,
        textAlign: 'center',
        marginTop: 10
    },
    bottomSectionView: {
        alignItems: 'center',
    },
    buttonComponent: {
        marginBottom: 15
    }
});