import React, {useState} from 'react';
import {StatusBar, StyleSheet, Text, View,} from 'react-native';
import {Header, Icon, Overlay} from 'react-native-elements';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {color} from "react-native-elements/dist/helpers";
import {logOut, setCredentials} from "./services/auth/authSlice";
import {useDispatch} from "react-redux";


// type HeaderComponentProps = {
//     title: string;
//     view?: string;
// };

// type ParamList = {
//     Detail: {
//         openDrawer: void;
//     };
// };

const AppHeader = (props) => {

    const [toggle, setToggle] = useState(false);
    const [color,setColor] = useState("red");
    const dispatch = useDispatch();
    const handleToggle = () => {
        setToggle(prev => !prev)
    };
    const backOption = (typeof props.back !== 'undefined') ? props.back :true ;

    const handleBack = () => {
        console.log("back");
        props.navigation.goBack();
    };

    const openUserInfo = () => {
        props.navigation.navigate("User_info");
    };

    const openChangePassword = () => {
        props.navigation.navigate("Change_password");
    };

    const handleLogOut = () => {
        dispatch(logOut())
    };

    return (
        <View>
            <StatusBar barStyle="light-content" hidden={false} backgroundColor="#B5F7D3" translucent={true}/>
            <Header backgroundColor='#696969'
                    leftComponent={
                        <TouchableOpacity >
                            {
                                backOption ?
                                    <Icon name='chevron-left'
                                          onPress={handleBack}
                                          type='font-awesome'
                                          color='#fff'>
                                    </Icon>:null
                            }

                        </TouchableOpacity>
                    }
                    rightComponent={
                        <>
                            <TouchableOpacity style={styles.headerItem}>
                                <Icon name="menu" color="white" onPress={handleToggle}/>
                            </TouchableOpacity>
                            <Overlay isVisible={toggle}
                                     overlayStyle={styles.overlay}
                                     onBackdropPress={handleToggle}
                                     backdropStyle={styles.backdrop}
                            >
                                <TouchableOpacity style={styles.button} >
                                    <Text onPress= {openUserInfo} style={{fontSize:20}}>User Info</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.button} >
                                    <Text onPress= {openChangePassword} style={{fontSize:20}}>Change Password</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.button}>
                                    <Text onPress={handleLogOut} style={{fontSize:20}}>Log Out</Text>
                                </TouchableOpacity>
                            </Overlay>
                        </>
                    }
                    centerComponent={{text: `${props.title}`, style: styles.heading}}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FD9A3F',
        marginBottom: 20,
        width: '100%',
        paddingVertical: 15,
    },
    heading: {
        color: 'white',
        fontSize: 22,
        fontWeight: 'bold',
    },
    headerItem: {
        display: 'flex',
        flexDirection: 'row',
        marginTop: 5,
    },
    subheaderText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    overlay: {
        backgroundColor: "white",
        top: 30,
        right: 20,
        position: "absolute",

    },
    backdrop: {
        opacity: 0
    },
    button: {
        fontWeight: "100",
    },
});

export default AppHeader;