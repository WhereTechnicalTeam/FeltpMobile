import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Text } from 'react-native';
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import IconButtonComponent from '@components/icon-button/IconButtonComponent';
import ProfileTextComponent from '@components/profile-text/ProfileTextComponent';
import { colors } from '@theme/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchUserJobHistory } from '@api/userApi';
import { isDefined } from '@utils/validation';
import ToastComponent from '@components/toast/ToastComponent';
import AddJobScreen from '@screens/AddJob';
import { getDistrictById, getLevelofHSById, getRegionById } from 'src/utils/helperFunctions';

const JobHistoryScreen = (props) => {
    const [user, setUser] = useState();
    const [token, setToken] = useState();
    const [showAddJob, setShowAddJob] = useState(false);
    const [jobHistory, setJobHistory] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [currentJobEdit, setCurrentJobEdit] = useState();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        try {
            (async() => {
                setLoading(true);
                AsyncStorage.getItem('userDetails').then(storedUser => {
                    AsyncStorage.getItem('authToken').then(async(authToken) => {
                        setUser(JSON.parse(storedUser));
                        setToken(authToken);
                    });
                });
            })();
        } catch(err) {
            console.warn("Error setting up job history screen", err);
        }
    }, []);

    useEffect(() => {
        (async() => {
            if(isDefined(user) && isDefined(token)) await fetchJobHistory();
            setLoading(false);
        })();
    }, [user])

    useEffect(() => {
        console.log("job history route params:", props.route.params);
        try{
            if(props.route.params?.currentJobProps) {
                setCurrentJobEdit(props.route.params?.currentJobProps);
                setShowAddJob(true);
            }
        } catch (err) {
            console.warn("Error retrieving office position", err);
        }
    }, [props.route.params?.currentJobProps]);

    const SkeletonLoader = () => (
        <SkeletonPlaceholder>
            <SkeletonPlaceholder.Item height={250} width='100%' marginTop={20}/>
            <SkeletonPlaceholder.Item height={250} width='100%' marginTop={20}/>
        </SkeletonPlaceholder>
        )
    


    const fetchJobHistory = async() => {
        const response = await fetchUserJobHistory(token, user.id);
        if(response.status  == 200) {
            setJobHistory(response.alldata.job_to_user);
        } else ToastComponent.show("Failed to fetch job history", {timeOut: 3500, level: 'failure'});
    }

    const renderJobDetails = ({item}) => (
        <View style={[styles.cardContainer, styles.shadow]}>
            <ProfileTextComponent label="Current Institution" text={item.current_institution} />
            <ProfileTextComponent label="Job Title" text={item.job_title} />
            <ProfileTextComponent label="Region" text={getRegionById(item.region)} />
            <ProfileTextComponent label="District" text={getDistrictById(item.district)} />
            <ProfileTextComponent label="Level of Health System" text={getLevelofHSById(item.level_of_health_system)} />
            <ProfileTextComponent label="Is Current Job" text={item.is_current} />
        </View>        
    );

    const renderListEmpty = () => (
        <View style={{marginTop: 20}}>
            <Text style={styles.emtyListText}>Your job history goes here</Text>
        </View>
    );

    const navigateMapView = (currentJobProps) => {
        setShowAddJob(false);
        props.navigation.navigate('MapView',
            {
                callingScreen: 'JobHistory',
                currentJobProps
            }
        );
    }

    const handleRefresh = async() => {
        try {
            setRefresh(true);
            await fetchJobHistory();
            setRefresh(false);
        } catch (err) {
            console.warn("Error refreshing job details:", err);
        }
    }

    return (
        <View style={styles.containerView}>
            {
                loading ?
                <SkeletonLoader /> :
                <FlatList 
                    renderItem={renderJobDetails} 
                    keyExtractor={item => item.id.toString()} 
                    data={jobHistory} 
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={renderListEmpty}
                    refreshing={refresh}
                    onRefresh={handleRefresh}
                />
            }
            <AddJobScreen 
            modalVisible={showAddJob} 
            user={user} 
            onCancel={() => setShowAddJob(false)} 
            token={token}
            onSubmit={() => setCurrentJobEdit(undefined)}
            navigateMapView={navigateMapView}
            currentJobProps={currentJobEdit}
            />
            <View style={styles.fabView}>
                <IconButtonComponent icon="add" size={24} color={colors.white} iconButtonStyle={{...styles.shadow, ...styles.fab}} onPress={() => {setShowAddJob(true)}} />
            </View>
        </View>
    );
}

export default JobHistoryScreen;

const styles = StyleSheet.create({
    containerView: {
        paddingVertical: 10,
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
    },
    emtyListText: {
        textAlign: 'center',
        color: colors.primary,
        fontSize: 15,
        fontWeight: '600'
    }
});