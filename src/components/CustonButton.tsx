import { Text, TouchableOpacity } from "react-native";

interface ISellButtonProps {
  title: string;
  children?: React.ReactNode;
  onPress: () => void;
}

export const CustonButton = (props: ISellButtonProps) => {
  return (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        flexWrap:"wrap",
        backgroundColor: "white",
        padding: 12,
        marginHorizontal: 20,
        marginTop:12,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        gap:4,
        elevation: 3,
      }}
      onPress={props.onPress}
    >
      <Text style={{ fontWeight: "600" }}>{props.title}</Text>
      <Text style={{ fontWeight: "600" }}>{props.children}</Text>
    </TouchableOpacity>
  );
};
