import { StyleSheet } from "react-native";
import { AppStyles } from "../../AppStyles";

export const styles = StyleSheet.create({
  ...AppStyles,
  input: {
    width: 250,
    height: 60,
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderColor: "#7569BE",
    borderWidth: 2,
    borderRadius: 15,
    fontSize: 16,
    marginTop: 30,
    alignItems: "center"
  }
});