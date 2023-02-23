import {AsyncStorage} from 'react-native';


const _getToken = async () => {
    try {
        return await AsyncStorage.getItem("token")
    } catch (error) {
        console.log(error);
    }
}

export { _getToken};