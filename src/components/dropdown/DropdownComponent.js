import React from 'react';
import { StyleSheet, View } from 'react-native';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '@theme/colors';


const DropdownComponent = (props) => {
    const {items, selectText, selectedItems, onSelectedItemsChange, ...restProps} = props;

    return (
        <View style={styles.dropdownView}>
            <SectionedMultiSelect
                items={items}
                uniqueKey="id"
                selectText={selectText}
                selectedItems = {selectedItems}
                onSelectedItemsChange={onSelectedItemsChange}
                IconRenderer={() => <Icon size={13} name="caret-down" color={colors.secondaryBlack} />}
                {...restProps}
            />
        </View>
    );
}

export default DropdownComponent;

const styles = StyleSheet.create({
    dropdownView: {
        borderRadius: 5,
        borderColor: colors.secondaryBlack,
        borderWidth: 1,  
    },
    dropdownContainer: {
        height: 50,
        justifyContent: 'center',
        paddingVertical: 5,
    }
});