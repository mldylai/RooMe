import React, { useState, useEffect } from "react";
import { View, FlatList, Text, StyleSheet, SafeAreaView } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useAuthState } from "react-firebase-hooks/auth";
import { Provider, Portal, Appbar, Card, Button, Paragraph, Title, Modal, RadioButton } from "react-native-paper";
import { getAuth, signOut } from "firebase/auth";
import { getFirestore, collection, setDoc,where, query,getDocs, onSnapshot, orderBy, deleteDoc, doc, updateDoc, getDoc, getDocFromCache } from "firebase/firestore";
import { RollInRight } from "react-native-reanimated";

export  function RoomateStatus({navigation, route}) {
    let uid = route.params.uid;
    const db = getFirestore();
    const peopleCollection = collection(db, "people");

    const peopleRef = doc(peopleCollection, uid.toString());

    const groupsCollection = collection(db, "groups");

    const [name, setName] = useState(route.params.name);
    const [isRendering, setIsRendering] = useState(true);
    const [groupName, setGroupName] = useState(route.params.groupName);
    const [groupCode, setGroupCode] = useState(route.params.groupCode);
    const [todayData, setTodayData] = useState([]);
    const [upcomingData, setUpcomingData] = useState([]);
    const [roomateData, setRoomateData] = useState([]);

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

//set the today data
      useEffect (() => {
          //console.log("HELLO");
        //do only if groupCode is not empty
        let todayDate = formatDate(new Date());
          if (groupCode !== "") {
              const dateCollection = collection(db, "groups", groupCode.toString(), todayDate);
              const unsubscribe = onSnapshot(query(dateCollection), (querySnapshot) => {
                let lst = [];
                querySnapshot.forEach((doc: any) => {
                    if (doc.data().personUID === uid) {
                        lst.push({taskName: doc.data().task, completed: doc.data().completed, date: todayDate});
                    } 
                  });
                    setTodayData(lst);
                    //console.log(lst);
              return unsubscribe;
          }); 
      }; 

    }, []);

    //set the upcoming data
    useEffect (() => {
        console.log("HELLO");
      //do only if groupCode is not empty
    
      if (groupCode !== "") {
        let lst = [];
        let currDate = new Date();
        currDate.setDate(currDate.getDate() + 1);
        let todayDate = formatDate(currDate);
        let count = 0;
        const unsub = onSnapshot(doc(db, "groups", groupCode.toString()), async (doc) => {
            let dateCollection = collection(db, "groups", groupCode.toString(), todayDate);
            let querySnapshot = await getDocs(dateCollection);
            while (count < 3 && querySnapshot.docs.length > 1) {
               // console.log(todayDate);
                querySnapshot.forEach((doc) => {
                    if (doc.data().personUID === uid  && count < 3){
                        lst.push({taskName: doc.data().task, date: todayDate});
                        count++;
                    }
                  });
                currDate.setDate(currDate.getDate() + 1);
                todayDate = formatDate(currDate);
                dateCollection = collection(db, "groups", groupCode.toString(), todayDate);
                querySnapshot = await getDocs(dateCollection);
                
            };
            setIsRendering(false);

            setUpcomingData(lst);
            console.log(lst);
        }); 
      
        return unsub;
        }; 

  }, []);
    

      
    const Item = ({item}) => {
        console.log(item);
        return(
        <View style={styles.task}>
            <Text style={{fontSize: 20, fontWeight: "bold"}}>{item.taskName}</Text>
            <Button icon={item.completed ? "check-outline" : ""}> {item.completed ? "DONE" : "Incomplete"} </Button>
        </View>);
    };

      const UpcomingTaskItem = ({ task, date }) => (
        <View style={styles.task}>
            <Text style={{fontSize: 20, fontWeight: "bold"}}>{task}</Text>
            <Button  mode="contained" style={styles.doneButton} color="#7569BE" >{date}</Button>
        </View>
      );
    
      const renderUpcomingItem = ({ item }) => (
        <UpcomingTaskItem task={item.taskName} date = {item.date} />
      );

      const renderItem = ( {item} ) => {
        //console.log(item);
          return(
            <Item item= {item} />);
          };

      const ListEmptyComponent = () => {
        return (
          <View style = {{padding: 15, alignItems: "center", justifyContent: "center"}}>
            <Text style = {{color: "grey", fontSize: 20}}>{name + " Has No Tasks Today!"} </Text>
         </View>
          );
        }

    const SecondListEmptyComponent = () => {
            return (
              <View style = {{padding: 15, alignItems: "center", justifyContent: "center"}}>
                <Text style = {{color: "grey", fontSize: 20}}>No Upcoming Tasks!</Text>
             </View>
              );
    }

   


      const Header = () => {
        return (
            <Appbar.Header style={styles.header}>
                 <Appbar.BackAction onPress={() => {navigation.navigate('HomePage')}} />

                <Appbar.Content title= {name + "'s Status"} />
            </Appbar.Header>
        )
    }


    const TodaysTasks = () => { 
        return (  
            <View style={styles.taskBox}> 
                <FlatList
                style={styles.taskFlatListStyle}
                data={todayData}
                renderItem={renderItem}
                keyExtractor={item => item.date + item.taskName}
                ListEmptyComponent={ListEmptyComponent}
                />
            </View>  
        )
    }


    const UpcomingTasks = () => {
        return (  
            <View style={styles.taskBox}> 
                <FlatList
                style={styles.taskFlatListStyle}
                data={upcomingData}
                renderItem={renderUpcomingItem}
                keyExtractor={item => item.date + item.taskName}
                ListEmptyComponent = {SecondListEmptyComponent}
                />
            </View>  
        )
    }
    
    async function sendPushNotification() {
        const docSnap = await getDoc(peopleRef);
        let expoPushToken = docSnap.data().token;
        const message = {
          to: expoPushToken,
          sound: 'default',
          title: 'Reminder To Finish Your Tasks!',
          body: 'This is anonymous reminder to finish your tasks!',
          data: { someData: 'goes here' },
        };
      
        await fetch('https://exp.host/--/api/v2/push/send', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Accept-encoding': 'gzip, deflate',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(message),
        });
      }

    const styles = StyleSheet.create({
        container: {
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-between",
          backgroundColor: "#fff",
          padding: 10,
          marginBottom: 5,
          marginTop: 5,
          marginHorizontal: 3
        },
        header: {
            backgroundColor: "#7569be",
            justifyContent: "center",
        },
        titleText: {
            marginTop: 50,
            marginLeft: 10,
        },
        doneButton: {
            borderColor: "#000000",
            borderWidth: 1,
            borderRadius: 20,
            transform: [{scale: 0.75}],   
        },
        pushButton: {
            color: "#7569be",
            borderColor: "#000000",
            borderWidth: 1,
            borderRadius: 20,
            transform: [{scale: 0.75}],
            marginTop: 40,
        },
        taskBox: {
            borderColor: "#000000",
            borderWidth: 1,
            borderRadius: 20,
            flexDirection: "column",
            flex: 1,
            transform: [{scale: 0.9}],
            marginTop: 5,
            marginBottom: 10,
        },
        taskFlatListStyle: {
            marginTop: 10,

        },
        task: {
            flexDirection: "row",
            justifyContent: "space-between",    
            marginLeft: 20,
            marginTop: 10,
            marginBottom: 10,
        },
      });
      if (isRendering){
        return(
        <View style={{flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#7569be"}}>
            <Text style = {{color: "white", fontSize: 50, fontWeight: "bold"}}>RooMe</Text>
        </View>);

    } else {
    return (
        <>
        <Header/>
        <ScrollView contentContainerStyle={{justifyContent: "space-evenly"}}>
            <Title style={styles.titleText}>Today's Tasks</Title>
                <TodaysTasks/>
            <Title style={styles.titleText}>Upcoming Tasks</Title>
                <UpcomingTasks/>
            <Button icon="send" mode="contained" style={styles.pushButton} onPress = {() => {sendPushNotification()}}color="#7569be">Send Anonymous Notification</Button>
        </ScrollView>
        </>
    )
}
}