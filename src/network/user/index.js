import firebase from '../../firebase/config'

const AddUser = async (name, email, uid, profileImg) => {
    try {
      return await firebase
        .database()
        .ref("users/" + uid)
        .set({
          name: name,
          email: email,
          uuid: uid,
          profileImg: profileImg,
        });
    } catch (error) {
      return error;
    }
  };
  

 export default AddUser;