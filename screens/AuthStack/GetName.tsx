import React, { useEffect, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { View, Text, StyleSheet, TextInput } from "react-native";
import {Button} from "react-native-paper";
import {styles} from "./GroupScreen.styles";
import { NavigationContainer } from "@react-navigation/native";
import { getFirestore, collection, setDoc, query, where, getDocs, deleteDoc, doc, updateDoc, ref } from "firebase/firestore";
import { getAuth, signOut } from "firebase/auth";



export function GetName({ navigation, route }) {
  const [text, setText] = useState('');
  let email = route.params.email;
  let password = route.params.password;
  let token = route.params.token;
  
  return (
    <>
      <View style={styles.container}>
        <Text style={{marginTop: 90, fontWeight: "bold", fontSize: 35, textAlign:'center'}}> What's Your Name </Text>
        <Text style={{marginTop: 60,  fontWeight: "bold", fontSize: 20, textAlign:'center'}}> Enter Name</Text>
        <TextInput style={styles.input} placeholder="Enter Name" onChangeText={newText => setText(newText)} />
        <Button
          mode="contained"
          style={{backgroundColor: "#D8C8FB", width: 250, height: 60, marginTop: 20, marginLeft: 25, marginRight: 25, padding: 10, borderRadius: 15, alignContent: "center" }}
          onPress = {() => {navigation.navigate("GroupScreen", {name: text, email: email, password: password, token: token})}}
          labelStyle = {{color: "black"}}
        >
          Next
        </Button>

      </View>
    </>
  );
}

