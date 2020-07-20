import Firebase from 'firebase';

const firebaseConfig = {
    apiKey:'AIzaSyDeFZI3_md5f-a70Rqwyp8MrIkaSkdRNJE',
    databaseURL:'https://mychat-1a6ad.firebaseio.com/',
    projectId:'mychat-1a6ad',
    appId:'1:599274372067:android:d636d2641a828afe41bed6',
}

export default Firebase.initializeApp(firebaseConfig);