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
  },
  movieCell: {
    height:50,
    width: 200,
    backgroundColor: "#ecf0f1",
    flexDirection: "row",
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 3.84,
    elevation: 5,
    justifyContent: "center"
  },
  movieCellTitle: { fontFamily: "Avenir", fontSize: 22 },
  movieCellSubtitle: { fontFamily: "Avenir", fontSize: 14 },
  movieCellLeft: { height: 80, width: 54 },
  movieCellImage: { height: 80, width: 54, resizeMode: "contain" },
  movieCellRight: {
    flex: 1,
    marginLeft: 10,
    justifyContent: "center",
    alignItems: "baseline",
  },
});
