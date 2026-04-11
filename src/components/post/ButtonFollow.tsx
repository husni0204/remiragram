import {Text, TouchableOpacity, View} from "react-native";

const ButtonFollow = ({userId}: {userId:number}) => {
    return (
        <TouchableOpacity className="mx-5 p-5 rounded-full items-center bg-active">
            <Text className="font-semibold text-white">Follow</Text>
        </TouchableOpacity>
    )
}

export default ButtonFollow;