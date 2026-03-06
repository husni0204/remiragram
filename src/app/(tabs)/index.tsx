import ListPost from "@/src/components/ListPost";
import React from "react";
import { FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const index = () => {
  const posts = [
    {
      id: 1,
      username: "husni_dev",
      avatar: "https://i.pravatar.cc/150?img=1",
      image: "https://picsum.photos/600/400?random=1",
      caption: "Exploring new stacks today 🚀",
    },
    {
      id: 2,
      username: "tech_guru",
      avatar: "https://i.pravatar.cc/150?img=2",
      image: "https://picsum.photos/600/400?random=2",
      caption: "Debugging is like detective work 🔍",
    },
    {
      id: 3,
      username: "frontend_master",
      avatar: "https://i.pravatar.cc/150?img=3",
      image: "https://picsum.photos/600/400?random=3",
      caption: "CSS can be both art and chaos 🎨",
    },
    {
      id: 4,
      username: "backend_builder",
      avatar: "https://i.pravatar.cc/150?img=4",
      image: "https://picsum.photos/600/400?random=4",
      caption: "Database tuning night 🌙",
    },
    {
      id: 5,
      username: "react_native_fan",
      avatar: "https://i.pravatar.cc/150?img=5",
      image: "https://picsum.photos/600/400?random=5",
      caption: "Expo makes life easier 📱",
    },
    {
      id: 6,
      username: "nextjs_ninja",
      avatar: "https://i.pravatar.cc/150?img=6",
      image: "https://picsum.photos/600/400?random=6",
      caption: "SSR vs SSG, which one today?",
    },
    {
      id: 7,
      username: "tailwind_artist",
      avatar: "https://i.pravatar.cc/150?img=7",
      image: "https://picsum.photos/600/400?random=7",
      caption: "Utility-first styling FTW 💡",
    },
    {
      id: 8,
      username: "db_explorer",
      avatar: "https://i.pravatar.cc/150?img=8",
      image: "https://picsum.photos/600/400?random=8",
      caption: "MariaDB config done ✅",
    },
    {
      id: 9,
      username: "bug_hunter",
      avatar: "https://i.pravatar.cc/150?img=9",
      image: "https://picsum.photos/600/400?random=9",
      caption: "Found the root cause finally 🕵️",
    },
    {
      id: 10,
      username: "ui_scaler",
      avatar: "https://i.pravatar.cc/150?img=10",
      image: "https://picsum.photos/600/400?random=10",
      caption: "Responsive design is satisfying 📐",
    },
  ];

  return (
    <SafeAreaView>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <ListPost item={item} />}
      />
    </SafeAreaView>
  );
};

export default index;
