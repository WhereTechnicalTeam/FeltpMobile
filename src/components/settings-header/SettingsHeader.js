import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, Alert, PermissionsAndroid, Image, Pressable } from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import Modal from "react-native-modal";
import Icon from 'react-native-vector-icons/Ionicons';

import { colors } from '@theme/colors';
import AvatarComponent from '@components/avatar/AvatarComponent';
import { isDefined } from '@utils/validation';
import { safeConvertToString } from '@utils/helperFunctions';
import { getRegionById, getDistrictById } from '@utils/helperFunctions';
import { updateUser } from '@api/userApi';
import ToastComponent from '@components/toast/ToastComponent';

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
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        (async () => {
            try{
                const storedUser = await AsyncStorage.getItem('userDetails');
                if(isDefined(storedUser))
                setUser(JSON.parse(storedUser));    
            } catch(err) {
                console.warn("Failed to retrieve user details from storage:", err);
            }
        })();
    }, []);

    const handleCameraPicker = async() => {
        const permissionGranted = await checkCameraPermissions();
        if(permissionGranted) {
            launchCamera({
                saveToPhotos: true,
                mediaType: 'photo'
            }, async({assets, didCancel, errorCode, errorMessage}) => {
                if(didCancel) {
                    console.log("User cancelled camera picker");
                } else if(errorCode) {
                    console.log("Error using camera picker", errorCode, errorMessage);
                } else {
                    await updateUserPhoto(assets[0])
                }
            })
        }
    }

    const updateUserPhoto = async(image) => {
        setSelectedImage({uri: image.uri});
        console.log("selected image:", image);
        setModalVisible(false);
    }

    const handleMediaPicker = async() => {
        const permissionGranted = await checkMediaPermissions();
        if(permissionGranted) {
            launchImageLibrary({
                mediaType: 'photo'
            }, async({assets, didCancel, errorCode, errorMessage}) => {
                if(didCancel) {
                    console.log("User cancelled camera picker");
                } else if(errorCode) {
                    console.log("Error using camera picker", errorCode, errorMessage);
                } else {
                    await updateUserPhoto(assets[0])
                }
            })
        }
    }

    const checkCameraPermissions = async() => {
        try{
            let granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA)
            if(granted !== PermissionsAndroid.RESULTS.GRANTED) {
                granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                    {
                        title: "FELTP ALUMNI App Camera Permission",
                        message: "FELTP Alumni App needs access to your camera",
                        buttonPositive: "OK",
                        buttonNegative: "Cancel",
                        buttonNeutral: "Not Now"
                    }
                );
                if(granted !== PermissionsAndroid.RESULTS.GRANTED) {
                    Alert.alert("FELTP Alumni App needs access to your camera to change your avatar!");
                    return false;
                }
            }
            return true;
        } catch (err) {
            console.warn("Failed to check camera permission:", err);
        }
        return false;
    }

    const checkMediaPermissions = async() => {
        try{
            let granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE)
            if(granted !== PermissionsAndroid.RESULTS.GRANTED) {
                granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    {
                        title: "FELTP ALUMNI App Media Permission",
                        message: "FELTP Alumni App needs access to your media library",
                        buttonPositive: "OK",
                        buttonNegative: "Cancel",
                        buttonNeutral: "Not Now"
                    }
                );
                if(granted !== PermissionsAndroid.RESULTS.GRANTED) {
                    Alert.alert("FELTP Alumni App needs access to your media library to change your avatar!");
                    return false;
                }
            }
            return true;
        } catch (err) {
            console.warn("Failed to check media permission:", err);
        }
        return false;
    }

    const navigateSettings = () => {
        props.navigation.navigate('SettingsNavigator');
    }

    const PickerModal = () => {
        return (
            <Modal isVisible={modalVisible} onBackdropPress={() => setModalVisible(false)}>
                <View style={[styles.modalContainer, styles.shadow]}>
                    <Pressable onPress={handleCameraPicker} style={styles.modalOptionView}>
                        <Image source={require("@assets/camera.png")} style={styles.modalOptionImage}/>
                        <Text style={styles.modalOptionText}>Take Picture</Text>
                    </Pressable>
                    <Pressable onPress={handleMediaPicker} style={styles.modalOptionView}>
                        <Image source={require("@assets/gallery.png")} style={styles.modalOptionImage}/>
                        <Text style={styles.modalOptionText}>From Gallery</Text>
                    </Pressable>
                </View>
            </Modal>
        )
    }

    return (
        <View style={styles.headerContainer}>
            <PickerModal />
            <View>
                <AvatarComponent src={selectedImage} icon="camera" onPress={() => setModalVisible(true)} avatarContainerStyle={styles.image}/>
            </View>
            <View style={styles.headerContentView}>
                <View style={styles.headerTextView}>
                <Text style={styles.headerNameText}>{`${safeConvertToString(user.main_user.firstname)} ${safeConvertToString(user.main_user.surname)}`}</Text>
                <Text style={styles.headerJobText}>{user.job_to_user[0].job_title}</Text>
                <Text style={styles.headerLocationText}>{isDefined(user.job_to_user[0].district) ? `${getDistrictById(user.job_to_user[0].district)}, ${getRegionById(user.job_to_user[0].region)}` : ''}</Text>
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
        paddingTop: 30,
        paddingHorizontal: 20,
        paddingBottom: 30,
        backgroundColor: colors.lightPrimary,
        flexDirection: 'row',
        alignContent: 'center'
    },
    headerContentView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '50%',
        marginLeft: '15%'
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
        fontSize: 15,
        color: colors.ivory,
        fontWeight: '700'
    },
    headerLocationText: {
        fontSize: 12,
        color: colors.primaryBlack
    },
    modalContainer: {
        backgroundColor: colors.white, 
        flexDirection: 'row', 
        justifyContent: 'space-around', 
        paddingVertical: 20, 
        width: '70%', 
        borderRadius: 5,
        alignSelf: 'center'
    },
    modalOptionView: {
        alignItems: 'center'
    },
    modalOptionText: {
        fontSize: 11
    },
    modalOptionImage: {
        height: 50, 
        width: 50, 
        borderRadius: 25, 
        resizeMode: 'cover'
    },
    shadow: {
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        backgroundColor: colors.white
    }
});