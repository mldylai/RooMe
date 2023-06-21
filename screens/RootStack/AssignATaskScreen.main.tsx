import React, { useEffect, useCallback, useState, useMemo, useRef  } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { View, Text, StyleSheet, TextInput, TouchableOpacity,  Animated,
  Image,
  Platform,
  Easing,
  Dimensions,FlatList , ScrollView} from "react-native";
import {Button} from "react-native-paper";
import { CheckBox, Icon } from '@rneui/themed';
import { getAuth, signOut } from "firebase/auth";
import {styles} from "../AuthStack/GroupScreen.styles";
import { getFirestore, collection, setDoc, query, onSnapshot, orderBy, deleteDoc, doc, updateDoc, getDoc, getDocs } from "firebase/firestore";
import SortableList  from "react-native-sortable-list";
import DropDownPicker from 'react-native-dropdown-picker';
import DraggableFlatList, {
  ScaleDecorator,
  RenderItemParams,
} from "react-native-draggable-flatlist";
import { ListItemSubtitle } from "@rneui/base/dist/ListItem/ListItem.Subtitle";


  



export function AssignATaskScreen({navigation, route}) {

  let groupName = route.params.groupName;
  let groupCode = route.params.groupCode;
  let name = route.params.name;



  const auth = getAuth();
  const currentUserId = auth.currentUser!.uid;
  const db = getFirestore();
  const peopleCollection = collection(db, "people");
  const groupsCollection = collection(db, "groups");
  //const groupRef = doc(groupsCollection, route.params.groupCode.toString());
  const groupRef = doc(groupsCollection,  groupCode.toString());
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isRendering, setIsRendering] = useState(true);


  useEffect( () => {
    //get the taskNames from the group
    const fetchData = async () => {
     
      const docSnap = await getDoc(groupRef);
      if (docSnap.exists()) {
        let lst = [];
        let taskNames = docSnap.data().taskNames;
        for (let i = 0; i < taskNames.length; i++) {
          let data = {label: taskNames[i], value: taskNames[i]};
          lst.push(data);
        }
        setTasks(lst);
      }

      const newDocSnap = await getDoc(groupRef);
      let initialData = [];
      if (newDocSnap.exists()) {
        let members = newDocSnap.data().members;
        for (let i = 0; i < members.length; i++) {
          const peopleRef = doc(peopleCollection, members[i]);
          let peopleDocSnap = await getDoc(peopleRef);
          let data = {};
          if (peopleDocSnap.exists()) {
            data = { text: peopleDocSnap.data().name, uid: peopleDocSnap.data().uid, selected: true};
          }
          initialData.push(data);
        }
        setData(initialData);
      }
     
      
    }
    
    fetchData().catch(console.error);
    console.log(tasks);
    setIsRendering(false);
  }, []);



  const [data, setData] = useState([]);

  const changeSelection = (text) => {
    let updated = [...data];
    updated = updated.map((item, index) => {
      if (text === item.text) {
        return { ...item, selected: !item.selected };
      }
      return item;
    });
    setData(updated);
  }
  
  const renderItem = ({ item,  drag, isActive }) => {
  
   
        return (
        
          <TouchableOpacity
          onPressIn={drag}
          disabled={isActive}
          style={styles.movieCell}
        >
      <View style = {{flexDirection: "row"}}>
        <Text style={{fontSize: 15, color: "black"}}>{item.text}</Text>
        <CheckBox
           checkedIcon={
            <Icon
              name="radio-button-checked"
              type="material"
              color="#7569BE"
              size={20}
              iconStyle={{ marginRight: 10 }}
            />
          }
          uncheckedIcon={
            <Icon
              name="radio-button-unchecked"
              type="material"
              color="grey"
              size={20}
              iconStyle={{ marginRight: 5 }}
            />
          }
          containerStyle = {{backgroundColor: "#ecf0f1"}}
          right = {true} 
          checked={item.selected}
          onPress={() => {changeSelection(item.text)}}
    />
      </View>
  
            
         
     
        </TouchableOpacity>
       
   
      );
      
   
  };

  function getDaysInMonth(date) {
    var days = [];
    let month = date.getMonth() + 1;
    let count = 0;
    while (count <= 10) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
      count ++
    }
    return days;
  }
  
  function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
  }
  
  function formatDate(date) {
    return [
      padTo2Digits(date.getDate()),
      padTo2Digits(date.getMonth() + 1),
      date.getFullYear(),
    ].join('-');
  }
  

  
  const assignTaskPressed = async () => {
    setLoading(true);
    const tasksCollection = collection(db, "groups", groupCode.toString(), "tasks");
    

    let taskRef = doc(tasksCollection, value);
    const docSnapshot = await getDoc(taskRef);
    let taskInfo = {};
    if (docSnapshot.exists()) {
       taskInfo = docSnapshot.data();
       let lst = [];
       let uid = [];
       //loop through the list data
        for (let i = 0; i < data.length; i++) {
          if (data[i].selected) {
            lst.push(data[i].text);
            uid.push(data[i].uid);
          }
        }
       taskInfo["people"] = lst;
       taskInfo["uid"] = uid;
       await updateDoc(taskRef, {people: lst, uid: uid});
       //update the ppl to the database
    }
    console.log(taskInfo);
    navigation.navigate("HomePage");
    let days = getDaysInMonth(new Date());
    for(let i = 0; i < days.length; i++){
      let date = formatDate(days[i]);
      console.log(date);
      
      const calendarCollection = collection(db, "groups",  groupCode.toString(), date)
      const calendarRef = doc(calendarCollection, value);
      let docSnap = await getDoc(calendarRef);
      if (!docSnap.exists()) {

        await setDoc(calendarRef, {day: date});
      }
        if(taskInfo.daysSelected.includes(days[i].getDay())){
          console.log(taskInfo.taskName + " - " + taskInfo.people[0]);
          await updateDoc(calendarRef, {task: taskInfo.taskName, person: taskInfo.people[0], personUID: taskInfo.uid[0], completed: false, order: taskInfo.people, orderUID: taskInfo.uid});

          //still need to update this to the taskInfo after all the people are shifted
          let person = taskInfo.people.shift();
          let uid = taskInfo.uid.shift();
          taskInfo.people.push(person);
          taskInfo.uid.push(uid);
          
        
      }
    
    }
    await updateDoc(taskRef, {people: taskInfo.people});
    let docSnap = await getDoc(groupRef)
    let dataChange = docSnap.data().dataChanged;
    dataChange = dataChange + 1;
    await updateDoc(groupRef, {dataChanged: dataChange})
    setLoading(false);
   
    
  }
  if (isRendering){
    return(
    <View style={{flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#7569be"}}>
        <Text style = {{color: "white", fontSize: 50, fontWeight: "bold"}}>RooMe</Text>
    </View>);

} else {

  return (
    <>
    
      <View style={styles.container}>
        <Text style={{marginTop: 90, fontWeight: "bold", fontSize: 35, textAlign:'center'}}> Assign a Task </Text>
        <Text style={{marginTop: 20, fontWeight: "bold", fontSize: 20}}> Pick a Task </Text>
        <View style = {{padding: 10, marginBottom: 10}}>
          <DropDownPicker
            style = {{padding: 30}}
            containerStyle={{width: 250, height: 100}}
            labelStyle={{fontSize: 14, color: '#000'}}
            open={open}
            value={value}
            items={tasks}
            placeholder="Select a task"
            placeholderStyle={{
              color: "grey",
              fontWeight: "bold"
            }}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setTasks}
        />
        <Text style={{ fontWeight: "bold", fontSize: 20, textAlign:'center'}}> Pick Roomates To Do The Task</Text>
        </View>
        
        

        <View  style={{ zIndex : -5, height: data.length * 80 }}>
        <ScrollView horizontal={true} style={{ width: "100%" }}>
        <DraggableFlatList
      
      data={data}
      keyExtractor={(item) => item.text}
       renderItem = {renderItem}
 
       onDragEnd={({ data }) => setData(data)}
      />
      </ScrollView>
      </View>
        <Button
          mode="contained"
          style={{backgroundColor: "#7569BE", width: 250, height: 60,  marginLeft: 25, marginRight: 25, padding: 10, borderRadius: 15, alignContent: "center" }}
          onPress = {() => {assignTaskPressed()}} 
          labelStyle = {{color: "white"}}
          loading = {loading}
        >
          Assign Task
        </Button>
      
      </View>
    </>
  );
          }
}