// import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, Alert, Platform, PermissionsAndroid } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '@theme/colors';
import AvatarComponent from '@components/avatar/AvatarComponent';
import { isDefined } from '@utils/validation';
import { safeConvertToString } from '@utils/helperFunctions';

const SettingsHeader = (props) => {
    const [selectedImage, setSelectedImage] = useState(require('@assets/man.jpg'));
    const [user, setUser] = useState({
        main_user: {
            firstname: '',
            surname: ''
        },
        job_to_user: [
            {
                region: null,
                district: null
            }
        ]
    });

    useEffect(() => {
        (async () => {
            // const storedUser = await AsyncStorage.getItem('userDetails');
            // setUser(JSON.parse(storedUser));
        })();
    }, []);

    const handleAvatarChange = async() => {
        let permissionGranted = await checkUserPermissions();
        if(!permissionGranted) {
            permissionGranted = await requestUserPermissions();
        } 
        if(permissionGranted) {
            Alert.alert("Change profile image", 
            "Are you sure you want to change your avatar?",
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log("Image picker cancelled"),
                    style: 'cancel'
                }, 
                {
                    text: "OK",
                    onPress: changeUserAvatar
                }
            ]);
        }        
    }

    const changeUserAvatar = async() => {
        launchImageLibrary({
            mediaType: 'photo',
            maxWidth: '150',
            quality: 0.8
        }, ({assets}) => {
            //show option to launch camera
            console.log("selected image:", assets[0]);
            handleSelectedImage(assets[0]);

        });
    }

    const requestUserPermissions = async() => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                {
                    title: "FELTP ALUMNI App Media Permission",
                    message: "FELTP Alumni App needs access to your media library so you can change your user avatar",
                    buttonPositive: "OK",
                    buttonNegative: "Cancel",
                    buttonNeutral: "Not Now"
                }
            );
            if(!granted === PermissionsAndroid.RESULTS.GRANTED) {
                Alert.alert("FELTP Alumni App needs access to your media library to change user avatar!");
                return false;
            }
            return true;
        } catch (err) {
            console.warn("Failed to request media permission:", err);
            return false;
        }
    }

    const checkUserPermissions = async() => {
        try{
            const granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE)
            if(granted === PermissionsAndroid.RESULTS.GRANTED) {
                return true;
            } 
        } catch (err) {
            console.warn("Failed to check media permission:", err);
        }
        return false;
    }

    const handleSelectedImage = (image) => {
        //save locally to app images folder
        //make API call to save path
        setSelectedImage({uri: image.uri});
    }

    const navigateSettings = () => {
        // props.navigation.navigate('SettingsNavigator');
    }

    return (
        <View style={styles.headerContainer}>
            <View>
                <AvatarComponent src={selectedImage} icon="camera" onPress={handleAvatarChange} avatarContainerStyle={styles.image}/>
            </View>
            <View style={styles.headerContentView}>
                <View style={styles.headerTextView}>
                <Text style={styles.headerNameText}>{`${safeConvertToString(user.main_user.firstname)} ${safeConvertToString(user.main_user.surname)}`}</Text>
                <Text style={styles.headerJobText}>{user.job_to_user[0].job_title}</Text>
                <Text style={styles.headerLocationText}>{isDefined(user.job_to_user[0].district) ? `${user.job_to_user[0].region}, ${user.job_to_user[0].district}` : ''}</Text>
                </View>
                <View>
                <Icon name="settings" size={24} color={colors.white} onPress={navigateSettings}/>
                </View>
            </View>
        </View>
    )
}

export default SettingsHeader;

const styles = StyleSheet.create({
    headerContainer: {
        paddingTop: 40,
        paddingHorizontal: 20,
        paddingBottom: 30,
        backgroundColor: colors.primary,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignContent: 'center'
    },
    headerContentView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '50%',
    },
    headerTextView: {
        alignSelf: 'center',
    },
    headerNameText: {
        fontWeight: 'bold',
        fontSize: 20,
        color: colors.white
    },
    headerJobText: {
        fontSize: 17,
        color: colors.ivory
    },
    headerLocationText: {
        fontSize: 15,
        color: colors.pearl
    }
});