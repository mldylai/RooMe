import React, { useEffect, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { View, Text, StyleSheet, TextInput } from "react-native";
import {Button} from "react-native-paper";
import {styles} from "./GroupScreen.styles";
import { NavigationContainer } from "@react-navigation/native";
import { getFirestore, collection, setDoc, query, where, getDocs, deleteDoc, doc, updateDoc, ref } from "firebase/firestore";
import { getAuth, signOut, createUserWithEmailAndPassword } from "firebase/auth";



export function GroupScreen({ navigation, route }) {
  const [text, setText] = useState('');
  let name = route.params.name;
  let email = route.params.email;
  let password = route.params.password;
  let token = route.params.token;

  const db = getFirestore();
  const peopleCollection = collection(db, "people");

  const joinPressed = async () => {
    //Update data fields after join button pressed
    const groupsCollection = collection(db, "groups");
    const groupRef = doc(groupsCollection, text);
    //see if groupNumber in firebase database with collection groups
    //convert text to an integer
    const groupNumber = parseInt(text);
    const q =  query(groupsCollection, where("groupCode", "==", groupNumber));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.size > 0) {
        //if groupNumber exists, add currentUserId to members array
        const auth = getAuth();
        createUserWithEmailAndPassword(auth, email, password)
        .then(async () => {
          let currentUserId = auth.currentUser!.uid;
        let peopleRef = doc(peopleCollection, currentUserId);
        await setDoc(peopleRef, {uid: currentUserId, name: name,  groupName: querySnapshot.docs[0].data().groupName, groupCode: groupNumber, token: token});
        await updateDoc(groupRef, {members: [...querySnapshot.docs[0].data().members, currentUserId], memberNames: [...querySnapshot.docs[0].data().memberNames, name]});

        console.log('User account created & signed in!');
      })
      .catch(error => {
        console.log(error)
        });
      }
      else {
        console.log("Group does not exist");
      }

  }
  return (
    <>
      <View style={styles.container}>
        <Text style={{marginTop: 90, fontWeight: "bold", fontSize: 35, textAlign:'center'}}> Groups </Text>
        <Text style={{marginTop: 20,  fontSize: 20, textAlign:'center'}}> To start, join or create a group! </Text>
        <Text style={{marginTop: 60,  fontWeight: "bold", fontSize: 20, textAlign:'center'}}> Join With Group Code</Text>
        <TextInput style={styles.input} placeholder="Type Group Code" onChangeText={newText => setText(newText)} />
        <Button
          mode="contained"
          style={{backgroundColor: "#D8C8FB", width: 250, height: 60, marginTop: 20, marginLeft: 25, marginRight: 25, padding: 10, borderRadius: 15, alignContent: "center" }}
          onPress = {() => {joinPressed()}}
          labelStyle = {{color: "black"}}
        >
          Join
        </Button>

        <Text style={{marginTop: 70,  fontWeight: "bold", fontSize: 20, textAlign:'center'}}> - or - </Text>
        <Button
          mode="contained"
          style={{backgroundColor: "#7569BE", width: 250, height: 60, marginTop: 20, marginLeft: 25, marginRight: 25, padding: 10, borderRadius: 15, alignContent: "center" }}
          onPress = {() => {navigation.navigate("CreateAGroupScreen", {name: name, email: email, password: password, token: token})}}
          labelStyle = {{color: "white"}}
        >
          Create a Group
        </Button>
      </View>
    </>
  );
}

