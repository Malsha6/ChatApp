import React, { useState, useContext } from 'react'
import { View, Text, Alert, KeyboardAvoidingView, Platform, Keyboard } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import { globalStyle, color } from '../../utility'
import { InputField, RoundCornerButton, Logo } from '../../component';
import { Store } from "../../context/store";
import { LOADING_START, LOADING_STOP } from "../../context/actions/type";
import { LoginRequest } from '../../network'
import { setAsyncStorage, keys } from '../../asyncStorage';
import { setUniqueValue } from '../../utility/constants';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { keyboardVerticalOffset } from '../../utility/constants'
import firebase from '../../firebase/config'
//import {Logo} from '../../component'

const Login = ({ navigation }) => {
    const globalState = useContext(Store);
    const { dispatchLoaderAction } = globalState;
    const [credentials, setCredentials] = useState({
        email: "",
        password: ""
    });

    const { email, password } = credentials;

    const handleonChange = (name, value) => {
        setCredentials({
            ...credentials,
            [name]: value
        })
    }

    const onLoginPress = () => {
        if (!email) {
            alert('Email is required');
        }
        else if (!password) {
            alert('Password is required');
        }
        else {
            dispatchLoaderAction({
                type: LOADING_START,
            });
            LoginRequest(email, password)
                .then((res) => {
                    if (!res.additionalUserInfo) {
                        dispatchLoaderAction({
                            type: LOADING_STOP,
                        });
                        alert(res);
                        return;
                    }
                    setAsyncStorage(keys.uuid, res.user.uid);
                    setUniqueValue(res.user.uid);
                    dispatchLoaderAction({
                        type: LOADING_STOP,
                    });
                    navigation.replace('Dashboard');
                })
                .catch((err) => {
                    dispatchLoaderAction({
                        type: LOADING_STOP,
                    });

                    Alert.alert(
                        'Incorrect',
                        'Wrong Email or Password',
                        [
                            {
                                text: 'Ok',

                            }
                        ], {
                        cancelabel: false
                    }
                    )

                })

        }

    };


    return (
        // <KeyboardAvoidingView style={[globalStyle.flex2, { backgroundColor: color.BLACK }]}
        //     behavior={Platform.OS === 'android' ? 'padding' : 'height'}
        //     keyboardVerticalOffset={keyboardVerticalOffset}>
        //     <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

                <SafeAreaView style={[globalStyle.flex2, { backgroundColor: color.BLACK }]}>

                    <View style={[globalStyle.sectionCentered]}>
                        <Logo />
                    </View>

                    <View style={[globalStyle.flex2, globalStyle.sectionCentered]}>
                        <InputField
                            placeholder="Enter email"
                            value={email}
                            onChangeText={(text) => handleonChange('email', text)}
                        />
                        <InputField
                            placeholder="Enter password"
                            value={password}
                            secureTextEntry={true}
                            onChangeText={(text) => handleonChange('password', text)}

                        />
                        <RoundCornerButton title="Login Here" onPress={() => onLoginPress()} />
                        <Text style={{
                            fontSize: 20,
                            fontWeight: "bold",
                            color: color.LIGHT_GREEN
                        }}
                            onPress={() => navigation.navigate('SignUp')}
                        >
                            Sign Up

                        </Text>
                    </View>
                </SafeAreaView>

        //     </TouchableWithoutFeedback>
        // </KeyboardAvoidingView>
    );
};


export default Login;