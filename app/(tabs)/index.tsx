import CustomButton from "@/components/ui/CustomButton";
import { useUserStore } from "@/store/userStore";
import { router } from "expo-router";
import { View } from "react-native";

export default function HomeScreen() {
  const { signOutUser } = useUserStore();

  const logUot = async () => {
    await signOutUser();
    router.push("/(auth)");
  };
  return (
    <View className="flex-1 items-center justify-center">
      <CustomButton
        title="logout"
        handlePress={logUot}
        containerStyles={"w-full"}
      />
    </View>
  );
}
