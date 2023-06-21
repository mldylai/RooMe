import React, { useEffect, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import {Button} from "react-native-paper";
import {styles} from "../AuthStack/GroupScreen.styles";
import { getAuth, signOut } from "firebase/auth";
import { getFirestore, collection, setDoc, query, onSnapshot, orderBy, deleteDoc, doc, updateDoc, getDoc } from "firebase/firestore";

//create a function that can generate a random 4 digit number
function generateRandomNumber() {
  //generate a random number between 1000 and 9999
  let randomNumber = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
  return randomNumber;

}
  



export function CreateATaskScreen({navigation, route}) { 

    let name = route.params.name;
      let groupCode = route.params.groupCode;
      let groupName =  route.params.groupName;
      

  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const [sunSelected, setSunSelected] = useState(false);
  const [monSelected, setMonSelected] = useState(false);
  const [tueSelected, setTueSelected] = useState(false);
  const [wedSelected, setWedSelected] = useState(false);
  const [thuSelected, setThuSelected] = useState(false);
  const [friSelected, setFriSelected] = useState(false);
  const [satSelected, setSatSelected] = useState(false);

  const auth = getAuth();
  const currentUserId = auth.currentUser!.uid;

  const db = getFirestore();
  const peopleCollection = collection(db, "people");
  const peopleRef = doc(peopleCollection, currentUserId);

  //get Name from people ref
 /*
  useEffect(() => {
    const fetchData = async () => {
      let docSnapshot = await getDoc(peopleRef);
      let name = docSnapshot.data().name;
      let groupCode = docSnapshot.data().groupCode;
      let groupName =  docSnapshot.data().groupName;
      
    }
    fetchData().catch(console.error);
  }, []);
  */

  const DayButton = (props) => {
    return (
      <View style={{   width: 50, alignItems: "center", marginTop: 20 }}>
        <TouchableOpacity onPress={() => props.setSelection(!props.selected)} style={{  width: 40,height: 40, justifyContent: 'center',alignItems: 'center',padding: 10,borderRadius: 35,backgroundColor: props.selected ? "#7569BE" : "#D8C8FB" }}>
          <Text  style = {{fontWeight: "bold",alignItems: "center", fontSize: 8, color: "white"}}>{props.day}</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  

  const createTaskPressed = async () => {
    setLoading(true);
    const groupsCollection = collection(db, "groups");
    const groupRef = doc(groupsCollection, groupCode.toString());
    const docSnap = await getDoc(groupRef);
    if (docSnap.exists()) {
      await updateDoc(groupRef, {taskNames: [...docSnap.data().taskNames, text]});
    }
    //create a tasksCollection inside of groupsCollection
    const tasksCollection = collection(db, "groups", groupCode.toString(), "tasks");
    const taskRef = doc(tasksCollection, text);
    let daysSelected = []
    if (sunSelected) {
      daysSelected.push(0)
    } 
    if (monSelected) {
      daysSelected.push(1)
    } 
     if (tueSelected) {
      daysSelected.push(2)
    } 
    if (wedSelected) {
      daysSelected.push(3)
    }
     if (thuSelected) {
      daysSelected.push(4)
    } 
     if (friSelected) {
      daysSelected.push(5)
    } 
     if (satSelected) {
      daysSelected.push(6)
    } 
    await setDoc(taskRef, {taskName: text, daysSelected: daysSelected});
    setLoading(false);
    navigation.navigate("HomePage");
    
  }

  return (
    <>
      <View style={styles.container}>
        <Text style={{marginTop: 90, fontWeight: "bold", fontSize: 35, textAlign:'center'}}> Create a Task </Text>
        <Text style={{marginTop: 30, fontWeight: "bold", fontSize: 20, textAlign:'center'}}> Task Name </Text>
        <TextInput style={styles.input} placeholder="Enter Task Name"  onChangeText={newText => setText(newText)}/>
        <Text style={{marginTop: 50,  fontWeight: "bold", fontSize: 20, textAlign:'center'}}> Task Frequency </Text>
        <Text style={{marginTop: 20,  fontSize: 15, textAlign:'center'}}> Select Days For Rotation </Text>
        <View style={{ flexDirection:"row" }}> 
          <DayButton day = "Sun" selected = {sunSelected} setSelection = {setSunSelected}/>
          <DayButton day = "Mon" selected = {monSelected} setSelection = {setMonSelected}/>
          <DayButton day = "Tue" selected = {tueSelected} setSelection = {setTueSelected}/>
          <DayButton day = "Wed" selected = {wedSelected} setSelection = {setWedSelected}/>
          <DayButton day = "Thu" selected = {thuSelected} setSelection = {setThuSelected}/>
          <DayButton day = "Fri" selected = {friSelected} setSelection = {setFriSelected}/>
          <DayButton day = "Sat" selected = {satSelected} setSelection = {setSatSelected}/>
        </View>
        <Button
          mode="contained"
          style={{backgroundColor: "#7569BE", width: 250, height: 60, marginTop: 40, marginLeft: 25, marginRight: 25, padding: 10, borderRadius: 15, alignContent: "center" }}
          onPress = {() => {createTaskPressed()}}
          labelStyle = {{color: "white"}}
          loading={loading}
        >
          Create Task 
        </Button>
        {/*
        <Button
          mode="contained"
          style={{backgroundColor: "#7569BE", width: 250, height: 60, marginTop: 40, marginLeft: 25, marginRight: 25, padding: 10, borderRadius: 15, alignContent: "center" }}
          onPress = {() => {navigation.navigate("AssignATaskScreen", {groupName: groupName, groupCode: groupCode, name: name})}} 
          labelStyle = {{color: "white"}}
        >
          Assign A Task
        </Button>
  */}

      </View>
    </>
  );

}




