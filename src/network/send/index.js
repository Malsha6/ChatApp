import firebase from '../../firebase/config'

const SendRequest = async(email,password)=>{
    try {
        console.log(email);
        return await firebase.auth().sendPasswordResetEmail(email);
    } catch (error) {
        return error;
    }
};

export default SendRequest;