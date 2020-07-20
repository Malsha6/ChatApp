import React, { useLayoutEffect, useState, useEffect ,useContext } from 'react';
import { View, Text, Alert } from 'react-native';
import { color } from '../../utility';
import SimpleLineIcon from 'react-native-vector-icons/SimpleLineIcons';
import { LogOutUser } from '../../network';
import { clearAsyncStorage } from '../../asyncStorage';
import { LOADING_START, LOADING_STOP } from '../../context/actions/type';
import firebase from '../../firebase/config';
import { Store } from "../../context/store";
import { uuid } from '../../utility/constants';
import { Profile, ShowUsers } from '../../component'

const Dashboard = ({ navigation }) => {
  const globalState = useContext(Store);
  const { dispatchLoaderAction } = globalState;
  const [userDetail,setUserDetail] = useState({
    id: '',
    name: '',
    profileImg: ''
  });

  const [allUsers,setAllUsers] = useState([]);


  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <SimpleLineIcon
          name="logout"
          size={25}
          color='rgb(255,255,255)'
          style={{ right: 10 }}
          onPress={() =>
            Alert.alert(
              'logout',
              'Are you sure to log out',
              [
                {
                  text: 'Yes',
                  onPress: () => logout(),
                },
                {
                  text: 'No'
                }
              ], {
              cancelabel: false
            }
            )}
        />
      ),
    });
  }, [navigation]);

  // useEffect(()=>{
  //   dispatchLoaderAction({
  //     type: LOADING_START,
  //   });
  //   try {
  //     firebase
  //     .database().ref
      
  //   } catch (error) {
  //     dispatchLoaderAction({
  //       type: LOADING_STOP,
  //     });
  //     alert(error)
  //   }
  // },[])

  const logout = () => {
    LogOutUser()
      .then(() => {
        clearAsyncStorage()
          .then(() => {
            navigation.replace("Login");
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => alert(err));
  };

  return (
    <View>
      <Text>Dashboard</Text>
    </View>

  );

};

export default Dashboard;