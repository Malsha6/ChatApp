import React, { useState, useContext } from 'react'
import { View, Text, Alert, KeyboardAvoidingView, Platform, Keyboard } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import { globalStyle, color } from '../../utility'
import { InputField, RoundCornerButton, Logo } from '../../component';
import { Store } from "../../context/store";
import { LOADING_START, LOADING_STOP } from "../../context/actions/type";
import { SendRequest } from '../../network'
import { setAsyncStorage, keys } from '../../asyncStorage';
import { setUniqueValue, uuid } from '../../utility/constants';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { keyboardVerticalOffset } from '../../utility/constants'
import firebase from '../../firebase/config'
//import {Logo} from '../../component'

const ForgotPasssword = ({ navigation }) => {

    const globalState = useContext(Store);
    const { dispatchLoaderAction } = globalState;
    const [credentials, setCredentials] = useState({
        email: "",
        password: "",
        currentPassword: "",
        newPassword: "",
        newEmail: "",
    });

    const { email, password } = credentials;

    const handleonChange = (name, value) => {
        setCredentials({
            ...credentials,
            [name]: value
        })
    }

    const SendRequest = async(email)=>{
        try {
            console.log(email);
            return await firebase.auth().sendPasswordResetEmail(email);
        } catch (error) {
            return error;
        }
    };
    
    const onSendPress = () => {
        if (!email) {
            alert('Email is required');
        }
        else {
            dispatchLoaderAction({
                type: LOADING_START,
            });
            console.log(keys.uuid);
            SendRequest(email)
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
                    navigation.replace('Login');
                })
                .catch((err) => {
                    dispatchLoaderAction({
                        type: LOADING_STOP,
                    });

                    Alert.alert(
                        'Reset email has been sent',
                        'Check your mails',
                        [
                            {
                                text: 'Ok',
                                onPress: () => navigation.navigate('Login'),
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

                <SafeAreaView style={[globalStyle.flex2, { backgroundColor: color.PURPLE }]}>

                    <View style={[globalStyle.sectionCentered]}>
                        <Logo />
                    </View>

                    <View style={[globalStyle.flex2, globalStyle.sectionCentered]}>
                    <Text style={{
                            fontSize: 18,
                            fontWeight: "bold",
                            color: color.WHITE
                        }}
                            onPress={() => navigation.navigate('SignUp')}
                        >
                            Enter password reset email

                        </Text>
                        <InputField
                            placeholder="Enter email"
                            value={email}
                            onChangeText={(text) => handleonChange('email', text)}
                        />
                        
                        <RoundCornerButton title="Send" onPress={() => onSendPress()} />

                    </View>
                </SafeAreaView>

        //     </TouchableWithoutFeedback>
        // </KeyboardAvoidingView>
    );
};


export default ForgotPasssword;