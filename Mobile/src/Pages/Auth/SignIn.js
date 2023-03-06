import React, {useState} from 'react';
import {Button} from 'react-native-elements';
import {Image, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import {useSignInMutation} from "../../services/auth/auth";
import {useGetHomeByIdQuery, useGetHomesQuery} from "../../services/home/home";
import { AsyncStorage } from 'react-native';
import {useDispatch} from "react-redux";
import {setCredentials} from "../../services/auth/authSlice";



export default  ({navigation}) => {
    const initState = {
        username: "",
        password: "",
    }
    const [inputState, setInputState] = useState(initState);
    const [signIn, {isLoading,data}] = useSignInMutation();
    const dispatch = useDispatch();

    const _storeData = async () =>{
        try {
            if(data){
                await AsyncStorage.setItem("loginInfo",data);
            }
        }catch (e) {
            console.log(e)
        }
    }
    if(data){
         dispatch(setCredentials(data))
    }
    const _retrieveData = async () => {
        try {
            const value = await AsyncStorage.getItem('token');
            if (value !== null) {
                // We have data!!
                console.log(value);
            }
        } catch (error) {
            // Error retrieving data
        }
    };
    const handleInput = (type, value) => {
        setInputState({
            ...inputState,
            [type]: value,
        })
    };
    const deleteInput = (type) => {
        setInputState({
            ...inputState,
            [type]: "",
        })
    }

    const handleSignIn = async () => {
        try {
            await signIn(inputState).unwrap();
            await _storeData();
            navigation.navigate("Home");
        } catch (err) {
            console.log(err)
        }
    }
    return (
        <View style={styles.container}>
            <View style={styles.container}>
                <View>
                    <Text style={styles.textName}>SmartHome</Text>
                    <View style={styles.inputWrapper}>
                        <TextInput style={styles.inputText}
                                   onChangeText={(value) => handleInput("username", value)}
                                   placeholder="Username"
                                   value={inputState.username}
                                   errorStyle={{color: "red"}}
                                   errorMessage="ENTER A VALID ERROR HERE"
                        />
                        {
                            inputState.username ?
                                <TouchableOpacity style={styles.closeButtonParent}
                                                  onPress={() => deleteInput("username")}>
                                    <Image style={styles.closeButton} source={require("../../../assets/close.png")}/>
                                </TouchableOpacity> : null
                        }
                    </View>
                    <View style={styles.inputWrapper}>
                        <TextInput placeholder="Password" secureTextEntry={true}
                                   value={inputState.password}
                                   onChangeText={(value) => handleInput("password", value)}
                                   style={styles.inputText}
                        />
                        {
                            inputState.password ?
                                <TouchableOpacity style={styles.closeButtonParent}
                                                  onPress={() => deleteInput("password")}>
                                    <Image style={styles.closeButton} source={require("../../../assets/close.png")}/>
                                </TouchableOpacity> : null
                        }
                    </View>
                    <View style={{
                        flexDirection: "row",
                    }}>
                        <Button
                            title="Log in"
                            containerStyle={{
                                flex: 1,
                                height: 40,
                                width: 100,
                                marginHorizontal: 20,
                                marginVertical: 20,
                            }}
                            buttonStyle={{
                                backgroundColor: '#9b7e67',
                                borderRadius: 100 / 2
                            }}
                            titleStyle={{
                                color: 'white',
                                marginHorizontal: 20,
                            }}
                            onPress={() => handleSignIn()}

                        />
                        <Button
                            containerStyle={{
                                flex: 1,
                                width: 100,
                                marginHorizontal: 20,
                                marginVertical: 20,
                            }}
                            title="Sign up"
                            type="clear"
                            titleStyle={{color: '#9b7e67'}}
                            onPress={() => navigation.navigate("Sign_up")}
                        />
                    </View>
                </View>
            </View>
        </View>


    );

};

const styles = StyleSheet.create({
    textName: {
        marginBottom: 30,
        fontFamily: 'Roboto Mono',
        fontWeight: "bold",
        fontSize: 38,
        lineHeight: 50,
        color: '#9b7e67',
        alignItems: 'flex-end',
        marginLeft: 20,
        textAlign: 'center',
    },
    container: {
        flex: 1,
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
        backgroundColor: "#9BC8D1"
    },
    inputWrapper: {
        display: "flex",
        flexDirection: "row",
        borderColor: "black",
        backgroundColor: "#FFFFFF",
        width: 300,
        borderRadius: 25,
        borderWidth: 0,
        borderStyle: "solid",
        fontSize: 15,
        margin: 10,
        paddingLeft: 20,
    },
    inputText: {
        flexGrow: 1,
    },
    closeButtonParent: {
        marginRight: 15,
        justifyContent: "center",
    },
    closeButton: {
        height: 12,
        width: 12,
    },
});

