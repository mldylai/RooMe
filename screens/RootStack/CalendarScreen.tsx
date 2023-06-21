import React, { useState, useEffect } from "react";
import { View, FlatList, Text, StyleSheet } from "react-native";
import { Appbar, Button } from "react-native-paper";
import { getFirestore, collection, query, onSnapshot, orderBy, deleteDoc, doc, updateDoc, getDocs } from "firebase/firestore";
import { getAuth, signOut } from "firebase/auth";
import {styles} from "./CalendarScreen.styles"
import { Card} from "react-native-cards";




export  function CalendarScreen({navigation, route}) {
  let groupCode = route.params.groupCode;
  const [calendarData, setCalendarData] = useState([]);
  const [isRendering, setIsRendering] = useState(true);


  const auth = getAuth();
  const currentUserId = auth.currentUser!.uid;
  const db = getFirestore();


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


     //set the upcoming data
    useEffect (() => {
        console.log("HELLO");
      //do only if groupCode is not empty

    
        let lst = [];
        let currDate = new Date();
        currDate.setDate(currDate.getDate());
        let todayDate = formatDate(currDate);
        const unsub = onSnapshot(doc(db, "groups", groupCode.toString()), async (doc) => {
            let dateCollection = collection(db, "groups", groupCode.toString(), todayDate);
            let querySnapshot = await getDocs(dateCollection);
            var dateObj ={date: todayDate, tasks: []};
            while (querySnapshot.docs.length > 0) {

                querySnapshot.forEach((doc) => {
                    if (typeof doc.data().task !== 'undefined') {
                        dateObj.tasks.push({taskName: doc.data().task, person: doc.data().person});
                    };
                  });
                  lst.push(dateObj)
                currDate.setDate(currDate.getDate() + 1);
                todayDate = formatDate(currDate);
                dateCollection = collection(db, "groups", groupCode.toString(), todayDate);
                querySnapshot = await getDocs(dateCollection);
                var dateObj ={date: todayDate, tasks: []};
            };
            setCalendarData(lst);
            console.log(lst);
            setIsRendering(false);
        }); 
      
        return unsub;
       

  }, []);


  const renderCalendar = ({item}) => {
    let stringToDisplay = "";
    for (var i = 0; i < item.tasks.length; i++) {
        stringToDisplay += item.tasks[i].taskName + " - " + item.tasks[i].person + "\n";
    }

      return (
        <Card style = {{
            width: 320,
            backgroundColor: "#fff",
            borderWidth: 1,
            borderRadius: 20,
            flexDirection: "column",
            flex: 1,
            transform: [{scale: 0.9}],
            marginTop: 5,
            marginBottom: 10,
            borderColor: "#D8C8FB",}}>
            <Text style = {styles1.titleText}>
             {item.date}
            </Text>
            <Text style = {styles1.contentText}>
             {stringToDisplay}
            </Text>
        </Card>
  
      );
 
    
  };

  


  const Bar = () => {
    return (
        <Appbar.Header style={{backgroundColor: "#7569be", justifyContent: "center"}}>
             <Appbar.BackAction onPress={() => {navigation.navigate('HomePage')}} />

            <Appbar.Content title= {"Calendar"} />
        </Appbar.Header>
    )
  };

  const ListEmptyComponent = () => {
    return (
      <View style = {{padding: 35}}>
        <Text style = {{color: "grey"}}>Welcome! To get started, Create and Assign Tasks!</Text>
        </View>
      );
      }


    if (isRendering){
        return(
        <View style={{flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#7569be"}}>
            <Text style = {{color: "white", fontSize: 50, fontWeight: "bold"}}>RooMe</Text>
        </View>);

    } else {
    return(
    <>
      <Bar />
      <View style={styles.container}>
        <FlatList
          data={calendarData}
          renderItem={renderCalendar}
          keyExtractor={(_: any, index: number) => "key-" + index}

          ListEmptyComponent={ListEmptyComponent}
        />
      </View>
    </>
  );
    };
}


const styles1 = StyleSheet.create({
    container: {
        width: 330,
        height: 150,
        backgroundColor: "#fff",
        paddingHorizontal: 15,
        borderColor: "#D8C8FB",
        borderWidth: 2,
        borderRadius: 15,
        marginTop: 15,
        marginLeft: 22.5
    },
    titleText: {
      fontSize: 20,
      fontWeight: 'bold',
      marginTop: 20,
      marginLeft: 20
    },
    contentText: {
        fontSize: 16,
        marginTop: 20,
        marginLeft: 20
      },
  });
