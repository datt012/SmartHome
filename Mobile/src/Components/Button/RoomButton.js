import React from "react";
import {StyleSheet, Text, View} from "react-native";
import {Icon} from 'react-native-elements';

export default (props) => {
    return (
        <View>
            <View style={styles.container}>
                <Icon name='door-open'
                      type='font-awesome-5'
                      color='#FFF'
                      size={30}
                      style={styles.icon}>
                </Icon>
            </View>
            <Text style={styles.text}>
                {props.name}
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
        backgroundColor: '#9BC8D1',
        justifyContent: "center"
    },
    icon: {
        alignSelf: 'center',
        alignItems: 'center'
    },
    text: {
        paddingTop: 10,
        alignSelf: 'center',
        alignItems: 'center'
    }
})