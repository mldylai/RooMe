import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { CreateATaskScreen } from "./CreateATaskScreen.main";
import { AssignATaskScreen } from "./AssignATaskScreen.main";
import { HomePage } from "./HomePage";
import { RoomateStatus } from "./RoomateStatus";
import {CalendarScreen} from "./CalendarScreen";
import {CodeScreen} from "./CodeScreen";

export type RootStackParamList = {
  CalendarScreen: undefined;
  CodeScreen:undefined;
AssignATaskScreen: undefined;
  HomePage: undefined
  CreateATaskScreen: undefined;
  RoomateStatus: undefined;
};

const RootStack = createStackNavigator<RootStackParamList>();

export function RootStackScreen() {
  const options = { headerShown: false };
  return (
    <NavigationContainer>
      <RootStack.Navigator initialRouteName="HomePage">
      <RootStack.Screen
          name="HomePage"
          options={options}
          component={HomePage}
        />
        <RootStack.Screen
          name="RoomateStatus"
          options={options}
          component={RoomateStatus}
        />
        <RootStack.Screen
          name="CodeScreen"
          options={options}
          component={CodeScreen}
        />
        <RootStack.Screen
          name="CalendarScreen"
          options={options}
          component={CalendarScreen}
        />
      <RootStack.Group screenOptions={{ presentation: 'modal' }}>
      <RootStack.Screen
          name="CreateATaskScreen"
          options={options}
          component={CreateATaskScreen}
        />
      </RootStack.Group>
      <RootStack.Group screenOptions={{ presentation: 'modal' }}>  
        <RootStack.Screen
          name="AssignATaskScreen"
          options={options}
          component={AssignATaskScreen}
        />
      </RootStack.Group>
         
      </RootStack.Navigator>
    </NavigationContainer>
  );
}