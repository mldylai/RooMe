import React, { useState, useEffect } from "react";
import { View, FlatList, Text, StyleSheet, SafeAreaView } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useAuthState } from "react-firebase-hooks/auth";
import { Provider, Portal, Appbar, Card, Button, Paragraph, Title, Modal, RadioButton } from "react-native-paper";
import { getAuth, signOut } from "firebase/auth";
import { getFirestore, collection, setDoc,where, query,getDocs, onSnapshot, orderBy, deleteDoc, doc, updateDoc, getDoc, getDocFromCache } from "firebase/firestore";
import { RollInRight } from "react-native-reanimated";
import App from "../../App";
 
export function CodeScreen({navigation, route}) {

    let groupCode = route.params.groupCode;


    const Header = () => {

        return (
            <Appbar.Header style={styles.header}>
                 <Appbar.BackAction onPress={() => {navigation.navigate('HomePage')}} />
                 <Appbar.Content title="" />
            </Appbar.Header>
        )
    }

    return(
        <>
        <Header/>
        <View style={styles.container}>
            <Text style = {{marginTop: 20, color: "white", fontSize: 45, fontWeight: "bold"}}>GROUP CODE</Text>
            <Text style = {{marginTop: 200, color: "white", fontSize: 50, fontWeight: "bold"}}>{groupCode}</Text>
        </View>
        </> );
  

}   

const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: "column",
      backgroundColor: "#7569be",
      alignItems: "center"

    },
    header: {
        backgroundColor: "#7569be",
        justifyContent: "center",
        textAlign: "center"
    },
   
   

  });