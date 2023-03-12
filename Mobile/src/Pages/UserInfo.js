import React, {useEffect, useState} from 'react';
import {Button, ScrollView, StyleSheet, Text, TextInput, View} from "react-native";
import Header from '../AppHeader';
import {useGetUserQuery, usePostUserMutation} from "../services/user/user";

export default ({navigation}) => {

    const {data,isLoading,isFetching} = useGetUserQuery();
    const initState = {
        firstName: "",
        lastName: "",
        email:"",
    }
    const [firstName, setFirstName] = useState("");
    const [lastName,setLastName] = useState("");
    const [email,setEmail] = useState("");
    const [login,setLogin] = useState("");
    const [postUser] = usePostUserMutation();
    useEffect(() =>{
        if(!isLoading && !isFetching && data){
            setFirstName(data?.firstName);
            setLastName(data?.lastName);
            setEmail(data?.email);
            setLogin(data?.login);
        }
    },[data,isLoading,isFetching]);

    const handleSubmit = async () => {
        try {
            const body = {
                firstName,
                lastName,
                email,
                login,
            }
            console.log(body)
            await postUser(body).unwrap();
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <ScrollView>
            <Header title={""} navigation={navigation}/>
            <View>
                <Text style={styles.textName}>
                    Infomation
                </Text>

                <View style={styles.info}>
                    <View>
                        <Text style={styles.text}>
                            First Name
                        </Text>
                        <TextInput style={styles.inputText}
                                   placeholder="firstName"
                                   defaultValue={data?.firstName}
                                   onChangeText={(value) => setFirstName(value)}
                                   errorStyle={{color: "red"}}
                                   errorMessage="Not a valid"
                        />

                        <Text style={styles.text}>
                            Last Name
                        </Text>
                        <TextInput style={styles.inputText}
                                   placeholder="lastName"
                                   onChangeText={(value) => setLastName(value)}
                                   defaultValue={data?.lastName}
                                   errorStyle={{color: "red"}}
                                   errorMessage="Not a valid"
                        />

                        <Text style={styles.text}>
                            Email
                        </Text>
                        <TextInput style={styles.inputText}
                                   placeholder="Email"
                                   value={data?.email}
                                   editable={false}
                                   errorStyle={{color: "red"}}
                                   errorMessage="Not a valid"
                        />

                        <Text style={styles.text}>
                            Username
                        </Text>
                        <TextInput style={styles.inputText}
                                   placeholder="Username"
                                   editable={false}
                                   value={data?.login}
                                   errorStyle={{color: "red"}}
                                   errorMessage="Not a valid"
                        />
                        <View>
                            <Button title="Save" color="#9BC8D1" onPress={handleSubmit}/>
                        </View>
                    </View>
                </View>
            </View>

        </ScrollView>
    );

};

const styles = StyleSheet.create({
    inputText: {
        borderColor: "black",
        backgroundColor: "#FFF",
        width: 300,
        borderWidth: 0,
        borderStyle: "solid",
        fontSize: 15,
        borderRadius: 25,
        margin: 10,
        paddingLeft: 20,

    },
    textName: {
        marginBottom: 30,
        fontFamily: 'Roboto Mono',
        fontWeight: "bold",
        fontSize: 20,
        lineHeight: 50,
        color: '#9b7e67',
        alignItems: 'flex-start',
        textAlign: 'center',
    },

    info: {
        paddingTop: 20,
        justifyContent: "center",
        alignItems: "center",

    },
    text: {
        paddingLeft: 20,
        color: '#9b7e67',
        fontSize: 14,
        fontWeight: "bold",
    },
    headerContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#397af8',
        marginBottom: 20,
        width: '100%',
        paddingVertical: 15,
    },
    heading: {
        color: 'white',
        fontSize: 22,
        fontWeight: 'bold',
    },
    headerRight: {
        display: 'flex',
        flexDirection: 'row',
        marginTop: 5,
    },
    subheaderText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    buttonSave: {
        marginLeft: '40px',
        marginRight: '40px',
    }
});
