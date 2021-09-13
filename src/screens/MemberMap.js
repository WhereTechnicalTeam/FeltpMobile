import React, {useState, useEffect} from 'react';
import { Text, View, StyleSheet, Dimensions } from 'react-native';
import { Marker } from 'react-native-maps';
import { ClusterMap } from 'react-native-cluster-map';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomCalloutComponent from '@components/custom-callout/CustomCalloutComponent';
import { colors } from '@theme/colors';
import SearchBarComponent from '@components/search-bar/SearchBarComponent';
import IconButtonComponent from '@components/icon-button/IconButtonComponent';

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

    useEffect(() => {
        try{
            (async() => {
                AsyncStorage.getItem("memberList").then(members => {
                    const parsedMembers = JSON.parse(members);
                    const membersWithLoc = parsedMembers.filter(m => m.job_to_user.length > 0).map(m => {
                        let currentJob = m.job_to_user.filter(j => j.is_current === 'Yes')
                        if(currentJob.length == 0) currentJob = m.job_to_user
                        return {
                            id: m.id, 
                            firstname: m.firstname, 
                            surname: m.surname, 
                            coordinate: {latitude: region.latitude, longitude: region.longitude},
                            photo: m.photo,
                            level: getFinalLevel(m)
                        };
                    })
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

    const toggleLevelFilter = () => {
        const {frontline, intermediate, advanced} = levelFilter;
        if([frontline, intermediate, advanced].some(val => val)) {
            let filtered = memberList.filter(m => {
                if(frontline) return m.main_user.is_trained_frontline == 'Yes'
                else if (intermediate) return m.main_user.is_trained_intermediate == 'Yes'
                else if(advanced) return m.main_user.is_trained_advanced == 'Yes'
            });
            setFilteredMembers(filtered);
        } else setFilteredMembers(membersWithLoc)
    }

    const getFinalLevel = (member) => {
        if(member.is_trained_advanced == "Yes") return "AD"
        else if(member.is_trained_intermediate == "Yes") return "IM"
        else return "FL"        
    }

    return (
        <View style={styles.mapContainer}>
            <View style={[styles.optionButtonContainer, {bottom: 0, top: 30}]}>
                <SearchBarComponent placeholder="Search for member" disabled handleChange={setMemberSearchText} value={memberSearchText} searchContainerStyle={styles.shadow}/>
                <IconButtonComponent iconButtonStyle={[styles.shadow, styles.iconButton]} color={colors.secondaryBlack} size={25} icon="filter" />
            </View>
            <ClusterMap
            region={region}
            style={styles.map}
            >
                {
                    filteredMembers.map(m => {
                        return (
                        <Marker key={m.id} coordinate={m.coordinate}>
                            <CustomCalloutComponent level={m.level} memberImage={m.photo}/>
                        </Marker>
                    ) })
                }
            {/* <Marker coordinate={{ latitude: 37.78725, longitude: -122.434 }}>
                <CustomCalloutComponent level="FL"/>
            </Marker>
            <Marker coordinate={{ latitude: 37.789, longitude: -122.431 }} />
            <Marker coordinate={{ latitude: 37.78825, longitude: -122.4324 }} /> */}
            </ClusterMap>
        </View>
    );
}

export default MemberMapScreen;

const styles = StyleSheet.create({
    mapContainer: {
        flex: 1,
        backgroundColor: '#fff',
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
        paddingHorizontal: 15
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
});