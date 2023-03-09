import React from "react";
import {StyleSheet, Text, View} from "react-native";
import {Icon} from 'react-native-elements';


export default (prop) => {
    return (
        <View>
            <View style={styles.container}>
                <Icon name='add-circle-outline'
                      type='ionicon'
                      color='#9BC8D1'
                      size={40}
                      style={styles.icon}>
                </Icon>

            </View>
            <Text style={styles.text}>
                Add one
            </Text>
        </View>

    )
};

const styles = StyleSheet.create({
    container: {
        height: 100,
        width: 100,
        borderRadius: 100 / 5,
        alignContent: 'center',
        backgroundColor: '#FFF',
        justifyContent: "center"
    },
    icon: {
        alignSelf: 'center',
        alignItems: 'center'
        // backgroundColor: '#FD9A3F',


    },
    text: {
        paddingTop: 10,
        alignSelf: 'center',
        alignItems: 'center'
    }
})