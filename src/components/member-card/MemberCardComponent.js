import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions, Pressable } from 'react-native';
import { colors } from '@theme/colors';
import BadgeComponent from '@components/badge/BadgeComponent';

const MemberCardComponent = (props) => {

    const {name, memberImage, level, monthComp, yearComp, onPress} = props;
    
    return (
        <View style={[styles.memberCardView, styles.shadow]}>
            <Pressable onPress={onPress} style={styles.pressable}>
            <View style={styles.cardImageView}>
                <Image style={styles.memberImage} source={require("@assets/man.jpg")}/>
            </View>
            <View>
                <Text style={styles.nameText}>{name}</Text>
            </View>
            <View style={styles.cardTextRow}>
                <BadgeComponent text={level} />
                {/* <View style={styles.cardTextView}>
                    <Text>{`${monthComp}.`}</Text>
                    <Text>{yearComp}</Text>
                </View> */}
            </View>
            </Pressable>
        </View>
    );
}

export default MemberCardComponent;

const styles = StyleSheet.create({
    memberCardView: {
        width: '100%',
        height: 150,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,
        borderRadius: 5
    },
    memberImage: {
        width: 70,
        height: 70,
        borderRadius: 40,
        resizeMode: 'cover',
        alignSelf: 'center'
    },
    nameText: {
        fontSize: 15,
        fontWeight: '700',
        textAlign: 'center',
        textTransform: 'capitalize'
    },
    cardTextRow: {
        flexDirection: 'row',
    },
    cardTextView: {
       flexDirection: 'row',
       alignItems: 'center',
       marginLeft: 5
   },
   pressable: {
       justifyContent: 'center',
       alignItems: 'center',
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