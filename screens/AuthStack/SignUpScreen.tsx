import { createStackNavigator } from "@react-navigation/stack"; 
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { Snackbar, Button } from "react-native-paper";
import { AuthStackParamList } from "./AuthStackScreen";
import { User, getAuth, onAuthStateChanged, createUserWithEmailAndPassword } from "firebase/auth";
import firebase from "firebase/app";
import "firebase/firestore";
import {styles} from "./SignInScreen.styles";

interface Props {
  navigation: StackNavigationProp<AuthStackParamList, "SignUpScreen">;
}

export default function SignUpScreen({ navigation, route}) {
  /* Screen Requirements:
      - AppBar
      - Email & Password Text Input
      - Submit Button
      - Sign In Button (goes to Sign In Screen)
      - Snackbar for Error Messages
  
    All UI components on this screen can be found in:
      https://callstack.github.io/react-native-paper/

    All authentication logic can be found at:
      https://firebase.google.com/docs/auth/web/start
  */
      let token = route.params.token;
      console.log(token);
      const [loading, setLoading] = useState(false);
      const [email, setEmail] = useState("");
      const [password, setPassword] = useState("");
      const [visible, setVisible] = React.useState(false);
      const [snackBarText, setSnackBarText] = React.useState("");

      const Bar = () => {
        return (
          <Appbar.Header>
            <Appbar.Content title="Create an Account" />
          </Appbar.Header>
        );
      };
    const onDismissSnackBar = () => setVisible(false);
    const createUser = () => {
      console.log(email);
      console.log(password);
      navigation.navigate("GetName", { email: email, password: password, token: token });
      //setLoading(true);

    }
    
    
    return (
      <>  
        <View style={styles.container}>
        <Text style={{marginTop: 120, fontWeight: "bold", fontSize: 25, textAlign:'center'}}> Welcome to RooMe! </Text>
        <Text style={{marginTop: 45, fontWeight: "bold", fontSize: 18, textAlign:'center'}}> Create an account </Text>
        <TextInput
            placeholder = "Enter Email"
            value={email}
            onChangeText={(name) => setEmail(name)}
            style={styles.input}
          />
          <TextInput
            placeholder = "Enter Password"
            secureTextEntry={true}
            value={password}
            onChangeText={(location) => setPassword(location)}
            style={styles.input}
          />
          <Button
            mode="contained"
            style={{backgroundColor: "#D8C8FB", width: 230, height: 60, marginTop: 40, marginLeft: 30, marginRight: 25, padding: 10, borderRadius: 15, alignContent: "center" }}
            labelStyle = {{color: "black"}}
            onPress={createUser}
            loading={loading}
          >
            Sign-up
          </Button>
          <Button
            mode="text"
            style={{ marginTop: 20, marginLeft: 25, marginRight: 25, padding: 7 }}
            onPress = {() => navigation.navigate("SignInScreen")}
            labelStyle = {{color: "#7569BE"}}
          >
            OR, SIGN IN INSTEAD
          </Button>
          <Snackbar style = {{marginBottom: 20}} visible={visible} onDismiss={onDismissSnackBar}>{snackBarText} </Snackbar>
        </View>
      </>
    );
  }
