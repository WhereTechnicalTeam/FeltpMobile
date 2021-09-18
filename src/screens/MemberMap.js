import React, {useState, useEffect} from 'react';
import { Text, View, StyleSheet, Dimensions, Pressable } from 'react-native';
import MapView, { Callout, Marker } from 'react-native-maps';
import { ClusterMap } from 'react-native-cluster-map';
import Modal from "react-native-modal";
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomCalloutComponent from '@components/custom-callout/CustomCalloutComponent';
import { colors } from '@theme/colors';
import SearchBarComponent from '@components/search-bar/SearchBarComponent';
import IconButtonComponent from '@components/icon-button/IconButtonComponent';
import HorizontalLineComponent from '@components/horizontal-line/HorizontalLine';
import ProfileSummaryComponent from '@components/profile-summary/ProfileSummaryComponent';
import { getDistrictById, getRegionById, safeConvertToString } from '@utils/helperFunctions';
import CustomMarkerComponent from '@components/custom-marker/CustomMarkerComponent';
import { includesIgnoreCase } from '@utils/helperFunctions';
import { isDefined } from '@utils/validation';

const MemberMapScreen = (props) => {
    const [memberList, setMemberList] = useState([]);
    const [membersWithLoc, setMembersWithLoc] = useState([]);
    const [filteredMembers, setFilteredMembers] = useState([]);
    const [levelFilter, setLevelFilter] = useState({
        frontline: false,
        intermediate: false,
        advanced: false
    }); 
    const [region, setRegion] = useState({
        latitude: 5.6890625,
        longitude: -0.2556875,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    const [memberSearchText, setMemberSearchText] = useState('');
    const [filterModalVisible, setFilterModalVisible] = useState(false);
    const [summaryModalVisible, setSummaryModalVisible] = useState(false);
    const [selectedMember, setSelectedMember] = useState();

    useEffect(() => {
        try{
            (async() => {
                AsyncStorage.getItem("memberList").then(members => {
                    const parsedMembers = JSON.parse(members);
                    const membersWithLoc = parsedMembers.filter(m => isLocationDefined(m)).map(m => {
                        let currentJob = m.job_to_user.filter(j => j.is_current === 'Yes')
                        if(currentJob.length == 0) currentJob = m.job_to_user
                        return {
                            id: m.id, 
                            firstname: safeConvertToString(m.main_user.firstname), 
                            email: m.email,
                            surname: safeConvertToString(m.main_user.surname), 
                            coordinate: {latitude: currentJob[0].latitude, longitude: currentJob[0].longitude},
                            is_trained_frontline: m.main_user.is_trained_frontline,
                            is_trained_intermediate: m.main_user.is_trained_intermediate,
                            is_trained_advanced: m.main_user.is_trained_advanced,
                            photo: m.photo,
                            region: getRegionById(currentJob[0].region),
                            district: getDistrictById(currentJob[0].district),
                            jobTitle: safeConvertToString(currentJob[0].jobTitle),
                            level: getFinalLevel(m)
                        };
                    })
                    console.log(membersWithLoc)
                    setMemberList(parsedMembers);
                    setFilteredMembers(membersWithLoc);
                    setMembersWithLoc(membersWithLoc);
                });                 
            })();
        } catch(err) {
            console.warn("Failed to fetch stored members");
        }
    }, []);

    useEffect(() => {
        toggleLevelFilter();
    }, [levelFilter]);

    const isLocationDefined = (member) => {
        let found = false;
        if (member.job_to_user.length > 0) {
            let currentJob = member.job_to_user.filter(j => j.is_current === "Yes")[0]
            if(!isDefined(currentJob)) currentJob = member.job_to_user[0] 
            found = isDefined(currentJob.latitude) && isDefined(currentJob.longitude)
        }
        return found;
    }

    const toggleLevelFilter = () => {
        const {frontline, intermediate, advanced} = levelFilter;
        if([frontline, intermediate, advanced].some(val => val)) {
            let filtered = membersWithLoc.filter(m => {
                if(frontline) return m.is_trained_frontline == 'Yes'
                else if (intermediate) return m.is_trained_intermediate == 'Yes'
                else if(advanced) return m.is_trained_advanced == 'Yes'
            });
            setFilteredMembers(filtered);
        } else setFilteredMembers(membersWithLoc)
    }

    const getFinalLevel = (member) => {
        if(member.main_user.is_trained_advanced == "Yes") return "Advanced"
        else if(member.main_user.is_trained_intermediate == "Yes") return "Intermediate"
        else return "Frontline"        
    }

    const handleUserSearch = (text) => {
        setMemberSearchText(text);
        setFilteredMembers(membersWithLoc.filter(m => includesIgnoreCase(m.email, text) || includesIgnoreCase(m.firstname, text) || includesIgnoreCase(m.surname, text)))
        //TODO: Handle user not found        
    }

    const FilterModal = () => {
        return (
        <Modal isVisible={filterModalVisible} onBackdropPress={() => setFilterModalVisible(false)} style={[styles.modalView, styles.shadow]}>
            <Text style={styles.modalTitle}>Filter by:</Text>
            <Pressable 
            android_ripple={{color: colors.ivory}} 
            style={styles.modalPressable} 
            onPress={() => {
                setLevelFilter({...levelFilter, frontline: true});
                setFilterModalVisible(false);
                }}>
                <Text style={styles.modalPressableText}>Frontline</Text>
            </Pressable>
            <HorizontalLineComponent hrWidth='70%'/>
            <Pressable 
            style={styles.modalPressable}  
            android_ripple={{color: colors.ivory}}
            onPress={() => {
                setLevelFilter({...levelFilter, intermediate: true});
                setFilterModalVisible(false);
                }}>
                    <Text style={styles.modalPressableText}>Intermediate</Text>
            </Pressable>
            <HorizontalLineComponent hrWidth='70%'/>
            <Pressable 
            style={styles.modalPressable}  
            android_ripple={{color: colors.ivory}}
            onPress={() => {
                setLevelFilter({...levelFilter, advanced: true});
                setFilterModalVisible(false);
                }}>
                <Text style={styles.modalPressableText}>Advanced</Text>
            </Pressable>
            <HorizontalLineComponent hrWidth='70%'/>
            <Pressable 
            style={styles.modalPressable}  
            android_ripple={{color: colors.ivory}}
            onPress={() => {
                setLevelFilter({frontline: false, intermediate: false, advanced: false});
                setFilterModalVisible(false);
                }}>
                <Text style={styles.modalPressableText}>All</Text>
            </Pressable>
        </Modal>
        )
    }

    const showMemberSummary = (id) => {
        setSummaryModalVisible(true);
        setSelectedMember(membersWithLoc.filter(m => m.id == id)[0]);
    }

    const navigateMemberProfile = () => {
        props.navigation.navigate('MemberListNavigator', {
            screen: 'MemberProfile', 
            params: {member: memberList.find(m => m.id == selectedMember.id)}
        });
    }

    return (
        <View style={styles.mapContainer}>
            <View style={[styles.optionButtonContainer, {bottom: 0, top: 30}]}>
                <SearchBarComponent placeholder="Search for member" handleChange={handleUserSearch} value={memberSearchText} searchContainerStyle={styles.shadow}/>
                <IconButtonComponent iconButtonStyle={[styles.shadow, styles.iconButton]} color={colors.secondaryBlack} size={25} icon="filter" onPress={() => setFilterModalVisible(true)}/>
            </View>
            <FilterModal />
            <Modal isVisible={summaryModalVisible} onBackdropPress={() => setSummaryModalVisible(false)}>
                <ProfileSummaryComponent member={selectedMember} onProfilePress={navigateMemberProfile}/>
            </Modal>
            <ClusterMap
            region={region}
            style={styles.map}
            >
                {
                    filteredMembers.map(m => {
                        return (
                        <Marker key={m.id} coordinate={m.coordinate} onPress={() => showMemberSummary(m.id)} isPreselected>
                            <CustomMarkerComponent calloutProps={{level: m.level.substr(0, 2).toUpperCase(), memberImage: m.photo}}/>
                        </Marker>
                    ) })
                }
            </ClusterMap>
        </View>
    );
}

export default MemberMapScreen;

const styles = StyleSheet.create({
    mapContainer: {
        flex: 1,
        backgroundColor: colors.white,
        alignItems: 'center',
        justifyContent: 'center', 
    },
    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
    optionButtonContainer: {
        position: 'absolute', 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        width: '100%',
        height: 50,
        paddingHorizontal: 15,
        zIndex: 99
    }, 
    iconButton: {
        backgroundColor: colors.white, 
        borderRadius: 25
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
    },
    modalView: {
        width: 200,
        maxHeight: '50%',
        borderRadius: 8,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'space-around',
        zIndex: 99,
        paddingVertical: 10
    },
    modalTitle: {
        fontSize: 15,
        marginBottom: 5,
        fontWeight: '600',
        textTransform: 'uppercase',
        color: colors.primary
    },
    modalPressable: {
        width:'100%', 
        height: 50, 
        alignItems: 'center',
        justifyContent: 'center'
    },
    modalPressableText: {
        fontSize: 18
    }
});