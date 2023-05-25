import { Tabs } from "expo-router";
import { Text } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';


const TabsLayout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: () => <Ionicons name="home-outline" size={28} color="black" />,
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: "Add",
          tabBarIcon: () => <Ionicons name="add-outline" size={28} color="black" />,
        }}
      />
      {/* <Tabs.Screen
        name="sale"
        options={{
          title: "Sale",
          tabBarIcon: () => <Ionicons name="reader-outline" size={24} color="black" />,
        }}
      /> */}
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: () => <Ionicons name="person-outline" size={28} color="black" />,
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
