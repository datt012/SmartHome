import React from "react";
import {StyleSheet, Text, View} from "react-native";
import {Icon} from 'react-native-elements';

export default (props) => {
    return (
        <View>

            {/*<View style={styles.container}>*/}
            {/*    <Icon name="fan"*/}
            {/*          type="material-community"*/}
            {/*          color="#FD9A3F"*/}
            {/*          size={100}*/}
            {/*          style={styles.icon}>*/}
            {/*    </Icon>*/}
            {/*</View>*/}
            {/*<Text style={styles.text}>*/}
            {/*    Fan*/}
            {/*</Text>*/}

            <View style={styles.container}>
                <Icon name="ceiling-light"
                      type="material-community"
                      color="#FD9A3F"
                      size={100}
                      style={styles.icon}>
                </Icon>
            </View>
            <Text style={styles.text}>
                Light
            </Text>

            {/*<View style={styles.container}>*/}
            {/*    <Icon name="door"*/}
            {/*          type="material-community"*/}
            {/*          color="#FD9A3F"*/}
            {/*          size={100}*/}
            {/*          style={styles.icon}>*/}
            {/*    </Icon>*/}
            {/*</View>*/}
            {/*<Text style={styles.text}>*/}
            {/*    Door*/}
            {/*</Text>*/}
        </View>

    )
};

const styles = StyleSheet.create({
    container: {
        height: 100,
        width: 100,
        borderRadius: 100 / 5,
        alignContent: 'center',
        // backgroundColor: '#FD9A3F',
        justifyContent: "center",
        alignSelf: 'center',
        alignItems: 'center'
    },
    icon: {
        alignSelf: 'center',
        alignItems: 'center'
        // backgroundColor: '#FD9A3F',


    },
    text: {
        padding: 30,
        alignSelf: 'center',
        alignItems: 'center',
        fontSize: 50
        // backgroundColor: '#FD9A3F',


    }
})