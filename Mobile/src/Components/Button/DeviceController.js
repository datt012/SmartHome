import React from "react";
import {StyleSheet, Text, View} from "react-native";
import {Icon} from 'react-native-elements';

export default (props) => {
    return (
        <View>
            <View style={styles.container}>
                <Icon name="ceiling-light"
                      type="material-community"
                      color="#9BC8D1"
                      size={100}
                      style={styles.icon}>
                </Icon>
            </View>
            <Text style={styles.text}>
                Light
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
        justifyContent: "center",
        alignSelf: 'center',
        alignItems: 'center'
    },
    icon: {
        alignSelf: 'center',
        alignItems: 'center'

    },
    text: {
        padding: 30,
        alignSelf: 'center',
        alignItems: 'center',
        fontSize: 50
    }
})