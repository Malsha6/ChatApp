import React, { useLayoutEffect, useState, useEffect ,useContext } from 'react';
import { View, Text, Alert } from 'react-native';
import {globalStyle, color} from '../../utility';
import SimpleLineIcon from 'react-native-vector-icons/SimpleLineIcons';
import { LogOutUser } from '../../network';
import { clearAsyncStorage } from '../../asyncStorage';
import { LOADING_START, LOADING_STOP } from '../../context/actions/type';
import firebase from '../../firebase/config';
import { Store } from "../../context/store";
import { uuid } from '../../utility/constants';
import { Profile, ShowUsers } from '../../component'
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlatList } from 'react-native-gesture-handler';
import profile from '../../component/profile';
import ImagePicker from 'react-native-image-picker'
import { UpdateUser } from '../../network/user';

const Dashboard = ({ navigation }) => {
  const globalState = useContext(Store);
  const { dispatchLoaderAction } = globalState;
  const [userDetail,setUserDetail] = useState({
    id: '',
    name: '',
    profileImg: ''
  });

  const {name,profileImg} = userDetail;
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

  useEffect(() => {
    dispatchLoaderAction({
      type: LOADING_START,
    });
    try {
      firebase
        .database()
        .ref("users")
        .on("value", (dataSnapshot) => {
          let users = [];
          let currentUser = {
            id: "",
            name: "",
            profileImg: "",
          };
          dataSnapshot.forEach((child) => {
            if (uuid === child.val().uuid) {
              currentUser.id = uuid;
              currentUser.name = child.val().name;
              currentUser.profileImg = child.val().profileImg;
            } else {
              users.push({
                id: child.val().uuid,
                name: child.val().name,
                profileImg: child.val().profileImg,
              });
            }
          });
          setUserDetail(currentUser);
          setAllUsers(users);
          dispatchLoaderAction({
            type: LOADING_STOP,
          });
        });
    } catch (error) {
      alert(error);
      dispatchLoaderAction({
        type: LOADING_STOP,
      });
    }
  }, []);

  const selectPhotoTapped = () => {
    const options = {
      storageOptions: {
        skipBackup: true,
      },
    };

    ImagePicker.showImagePicker(options, (response) => {
      console.log("Response = ", response);

      if (response.didCancel) {
        console.log("User cancelled photo picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else if (response.customButton) {
        console.log("User tapped custom button: ", response.customButton);
      } else {
        // Base 64 image:
        let source = "data:image/jpeg;base64," + response.data;
        dispatchLoaderAction({
          type: LOADING_START,
        });
        UpdateUser(uuid, source)
          .then(() => {
            setUserDetail({
              ...userDetail,
              profileImg: source,
            });
            dispatchLoaderAction({
              type: LOADING_STOP,
            });
          })
          .catch(() => {
            alert(err);
            dispatchLoaderAction({
              type: LOADING_STOP,
            });
          });
      }
    });
  };

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
    <SafeAreaView style={[globalStyle.flex1, {backgroundColor: color.BLACK}]}>
      <FlatList
        alwaysBounceVertical={false}
        data={allUsers}
        keyExtractor={(_, index) => index.toString()}
        ListHeaderComponent={
          <Profile img={profileImg} name={name}
          onEditImgTap={()=>selectPhotoTapped()}
          />
        }
        renderItem={({item})=>(
          <ShowUsers
          name={item.name}
          img={item.profileImg}
          />
        )}
      />
    </SafeAreaView>

  );

};

export default Dashboard;