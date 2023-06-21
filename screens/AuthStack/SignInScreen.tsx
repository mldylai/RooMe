import { StackNavigationProp } from "@react-navigation/stack";
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Platform } from "react-native";
import { Snackbar, Button } from "react-native-paper";
import { AuthStackParamList } from "./AuthStackScreen";
import { getAuth, signInWithEmailAndPassword , sendPasswordResetEmail} from "firebase/auth"; 
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import * as Device from 'expo-device';
import { getFirestore, collection, setDoc, query, where, getDocs, deleteDoc, doc, updateDoc, ref } from "firebase/firestore";
import {styles} from "./SignInScreen.styles"

interface Props {
  navigation: StackNavigationProp<AuthStackParamList, "SignInScreen">;
}

export default function SignInScreen({ navigation }) {
  /* Screen Requirements:
      - AppBar
      - Email & Password Text Input
      - Submit Button
      - Sign Up Button (goes to Sign Up screen)
      - Reset Password Button
      - Snackbar for Error Messages
  
    All UI components on this screen can be found in:
      https://callstack.github.io/react-native-paper/

    All authentication logic can be found at:
      https://firebase.google.com/docs/auth/web/starts
  */

  
  const [loading, setLoading] = useState(false);
  const [expoPushToken, setExpoPushToken] = useState('');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [snackBarText, setSnackBarText] = useState("");
  const db = getFirestore();
  const peopleCollection = collection(db, "people");

  const onDismissSnackBar = () => setVisible(false);
  const Bar = () => {
    return (
      <Appbar.Header>
        <Appbar.Content title="Sign In" />
      </Appbar.Header>
    );
  };

  const resetPassword = () => {
    const auth = getAuth();
    sendPasswordResetEmail(auth, email)
      .then(() => {
        console.log("Password reset email sent!");
        setVisible(true)
        setSnackBarText("Password reset email sent!");
      })
      .catch(error => {
        setVisible(true);
        if (error.code === "auth/user-not-found") {
          console.log("User not found!");
          setSnackBarText("User not found!");
        }
      });
  }

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));
    console.log(expoPushToken);
  }, []);

  async function registerForPushNotificationsAsync() {
    let token;
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
    } else {
      alert('Must use physical device for Push Notifications');
    }
  
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  
    return token;
  }
  

  const signIn = () => {
    setLoading(true);
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
    .then(async () => {
      setLoading(false);
      const currentUserId = auth.currentUser!.uid;
      console.log(currentUserId);
      console.log('User account created & signed in!');
      const peopleRef = doc(peopleCollection,currentUserId);
      await updateDoc(peopleRef, {token: expoPushToken});
    })
    .catch(error => {
      setLoading(false);
      setVisible(true);
      if (error.code ===  'auth/invalid-email') {
        console.log('Email not found! Please create an account!');
        setSnackBarText('Email not found! Please create an account!!');
      }
  
      if (error.code === 'auth/wrong-password') {
        console.log('Wrong password!');
        setSnackBarText('Wrong password! Please try again.');
      }
      console.log(error)
   
    });
  }

  return (
    <>

      <View style = {styles.container}>
      <Text style={{marginTop: 110, fontWeight: "bold", fontSize: 25, textAlign:'center'}}> Welcome to RooMe! </Text>
      <Text style={{marginTop: 45, fontWeight: "bold", fontSize: 18, textAlign:'center'}}> Sign-in </Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Email"
          value={email}
          onChangeText={(name) => setEmail(name)}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter Password"
          value={password}
          secureTextEntry={true}
          onChangeText={(location) => setPassword(location)}
        />
        <Button
          mode="text"
          color="grey"
          onPress = {resetPassword}
          style={{ marginLeft: 40, marginRight: 25, marginTop: 5}}
          labelStyle = {{color: "#7569BE"}}
        >
          Forgot Password?
        </Button>
        <Button
          mode="contained"
          style={{backgroundColor: "#D8C8FB", width: 230, height: 60, marginTop: 10, marginLeft: 25, marginRight: 25, padding: 10, borderRadius: 15, alignItems: "center" }}
          labelStyle = {{color: "black"}}
          loading={loading}
          onPress = {signIn}
        > 
          SIGN IN
        </Button>
        <Text style={{marginTop: 30, fontWeight: "bold", fontSize: 16, textAlign:'center'}}> - or - </Text>
        <Button
          mode="contained"
          style={{backgroundColor: "#7569BE", width: 230, height: 60, marginTop: 30, marginLeft: 25, marginRight: 25, padding: 10, borderRadius: 15, alignContent: "center" }}
          labelStyle = {{color: "white"}}
          onPress={() => navigation.navigate("SignUpScreen", {token: expoPushToken})}
        > 
          Create an account
        </Button>
        <Snackbar style = {{marginBottom: 30}} visible={visible} onDismiss={onDismissSnackBar}>{snackBarText} </Snackbar>
      </View>
    </>
  );
}
