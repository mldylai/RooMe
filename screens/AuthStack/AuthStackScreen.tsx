import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import SignInScreen from "./SignInScreen";
import SignUpScreen from "./SignUpScreen";
import { CreateAGroupScreen} from "./CreateAGroupScreen.main";
import { GroupScreen } from "./GroupScreen.main";
import { GetName } from "./GetName";

export type AuthStackParamList = {
  SignInScreen: undefined;
  SignUpScreen: undefined;
};

const AuthStack = createStackNavigator<AuthStackParamList>();

export function AuthStackScreen() {
  const options = { headerShown: false };
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen
        name="SignInScreen"
        options={options}
        component={SignInScreen}
      />
        <AuthStack.Screen
        name="SignUpScreen"
        options={options}
        component={SignUpScreen}
      />
       <AuthStack.Screen
          name="GetName"
          component={GetName}
          options={options}
        />
        <AuthStack.Screen
          name="GroupScreen"
          component={GroupScreen}
          options={options}
        />
        <AuthStack.Screen
          name="CreateAGroupScreen"
          options={options}
          component={CreateAGroupScreen}
        />
      

    </AuthStack.Navigator>
  );
}
