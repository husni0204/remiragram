import { colors } from "@/src/utils/color";
import { Feather } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { FC } from "react";
import { Dimensions, View } from "react-native";

const TabsLayout: FC = () => {
  const { width, height } = Dimensions.get("window");

  const buttonSize = width * 0.18;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.active,
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          backgroundColor: colors.background,
          paddingTop: height * 0.01,
          height: height * 0.04,
          marginHorizontal: width * 0.05,
          bottom: height * 0.04,
          borderRadius: buttonSize / 2,
          position: "absolute",
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "",
          tabBarIcon: ({ color, size }) => (
            <Feather name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "",
          tabBarIcon: ({ color, size }) => (
            <Feather name="search" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: "",
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                width: width * 0.14,
                height: width * 0.14,
                borderRadius: buttonSize / 2,
                backgroundColor: colors.active,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Feather name="plus" size={28} color={"black"} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="update"
        options={{
          title: "",
          tabBarIcon: ({ color, size }) => (
            <Feather name="settings" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "",
          tabBarIcon: ({ color, size }) => (
            <Feather name="user" size={size} color={color} />
          ),
        }}
      />
    </Tabs>

    // <NativeTabs>
    //   <NativeTabs.Trigger name="index">
    //     <Label>Home</Label>
    //     <Icon sf={"house.fill"} drawable="ic_menu_home" />
    //   </NativeTabs.Trigger>
    //   <NativeTabs.Trigger name="search">
    //     <Label>Search</Label>
    //     <Icon sf={"magnifyingglass"} drawable="ic_menu_search" />
    //   </NativeTabs.Trigger>
    //   <NativeTabs.Trigger name="create">
    //     <Label>Create</Label>
    //     <Icon sf={"plus.app.fill"} drawable="ic_menu_add" />
    //   </NativeTabs.Trigger>
    //   <NativeTabs.Trigger name="update">
    //     <Label>Update</Label>
    //     <Icon sf={"gearshape.fill"} drawable="ic_menu_edit" />
    //   </NativeTabs.Trigger>
    //   <NativeTabs.Trigger name="profile">
    //     <Label>Profile</Label>
    //     <Icon sf={"person.2.circle.fill"} drawable="ic_menu_info_details" />
    //   </NativeTabs.Trigger>
    // </NativeTabs>
  );
};

export default TabsLayout;
