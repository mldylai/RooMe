import React, { useEffect, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { View, Text, StyleSheet, TextInput } from "react-native";
import {Button} from "react-native-paper";
import {styles} from "./GroupScreen.styles";
import { getAuth, signOut, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, setDoc, query, onSnapshot, orderBy, deleteDoc, doc, updateDoc } from "firebase/firestore";

//create a function that can generate a random 4 digit number
function generateRandomNumber() {
  //generate a random number between 1000 and 9999
  let randomNumber = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
  return randomNumber;

}
  




export function CreateAGroupScreen({navigation, route}) {
  let name = route.params.name;
  let email = route.params.email;
  let password = route.params.password;
  let token = route.params.token;

  console.log(email);
  console.log(password);

  const [text, setText] = useState('');
  const auth = getAuth();
  const db = getFirestore();
  const peopleCollection = collection(db, "people");
  

  const createGroupPressed = async () => {
    const groupNumber = generateRandomNumber()
    const groupsCollection = collection(db, "groups");
    const groupRef = doc(groupsCollection, groupNumber.toString());
    console.log(email);
    console.log(password);
    createUserWithEmailAndPassword(auth, email, password).then(async () => {
    console.log('User account created & signed in!');
    const currentUserId = auth.currentUser!.uid;
    const peopleRef = doc(peopleCollection, currentUserId);
    await setDoc(peopleRef, {uid: currentUserId, name: name, groupName: text, groupCode: groupNumber, token: token});
    await setDoc(groupRef, {groupName: text, groupCode: groupNumber, members: [currentUserId], memberNames: [name], taskNames: [], dataChanged: 0});
  }) .catch(error => {
    console.log(error)
    });
  }
   
    
  

  return (
    <>
      <View style={styles.container}>
        <Text style={{marginTop: 90, fontWeight: "bold", fontSize: 35, textAlign:'center'}}> Create a Group </Text>
        <Text style={{marginTop: 20,  fontSize: 20, textAlign:'center'}}> Group Name </Text>
        <TextInput style={styles.input} placeholder="Type Group Name"  onChangeText={newText => setText(newText)}/>
  
        <Button
          mode="contained"
          style={{backgroundColor: "#7569BE", width: 250, height: 60, marginTop: 20, marginLeft: 25, marginRight: 25, padding: 10, borderRadius: 15, alignContent: "center" }}
          onPress = {() => {createGroupPressed()}}
          labelStyle = {{color: "white"}}
        >
          Create 
        </Button>
      </View>
    </>
  );
}

