import {Text, View} from "react-native";

type UserInfoProps = {
    fullname: string;
    username: string;
    bio?: string | null;
}

const UserInfo = ({fullname, username, bio} : UserInfoProps) => {
    return (
        <View className="px-4 pb-3 items-center">
            <Text className="font-semibold text-base">{fullname}</Text>
            <Text className="text-gray-500">{username}</Text>
            {bio ? <Text className="mt-1 text-gray-700">{bio}</Text> : null}
        </View>
    )
}

export default UserInfo;