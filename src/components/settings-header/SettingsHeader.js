import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, Alert, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
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
            const storedUser = await AsyncStorage.getItem('userDetails');
            setUser(JSON.parse(storedUser));
        })();
    }, []);

    useEffect(() => {
        (async () => {
            if (Platform.OS != 'web') {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    alert('Permissions are required to access media library!');
                }
            }
        })();
    }, []);

    const handleAvatarChange = async() => {
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
                onPress: launchMediaLibrary
            }
        ]);
    }

    const launchMediaLibrary = async() => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 4],
            quality: 1
        });

        console.log("Image picker result", result);
        if (!result.cancelled) {
            setSelectedImage({uri: result.uri});
            // Alert.alert("Change profile image",
            // "Update profile image?",
            // {
            //     text: 'Cancel',
            //     onPress: () => console.log("Image picker cancelled"),
            //     style: 'cancel'
            // }, 
            // {
            //     text: "OK",
            //     onPress: () => handleSelectedImage({uri: result.uri})
            // }
            // );            
        }
    }

    const handleSelectedImage = (image) => {
        //save locally
        //make API call to save path
        setSelectedImage({uri: result.uri});
    }

    const navigateSettings = () => {
        props.navigation.navigate('SettingsNavigator');
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