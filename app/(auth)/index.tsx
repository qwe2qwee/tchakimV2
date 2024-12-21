import { View, TouchableOpacity, Text, Image, Keyboard } from "react-native";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { icons } from "../../constants";
import SignIn from "./login";
import SignUp from "./signup";

export default function AuthIndex() {
  const [activePage, setActivePage] = useState<"sign-in" | "sign-up">(
    "sign-in"
  );

  const handlePageSwitch = (page: "sign-in" | "sign-up") => {
    Keyboard.dismiss(); // Close the keyboard
    setActivePage(page); // Update the active page
  };

  return (
    <SafeAreaView className="w-full h-full bg-secondary">
      {/* Logo Section */}
      <View className="h-[20vh] justify-center items-center">
        <Image source={icons.logo} resizeMode="contain" className="w-40 h-40" />
      </View>

      {/* Navigation Tabs */}
      <View className="flex-row-reverse justify-around px-7">
        {["sign-in", "sign-up"].map((type) => (
          <TouchableOpacity
            key={type}
            onPress={() => handlePageSwitch(type as "sign-in" | "sign-up")}
            className="py-2 px-2 w-2/5 items-center justify-center"
          >
            <Text
              className={`p-1 w-full text-center font-sans-arabic-medium ${
                activePage === type
                  ? "border-b-2 border-orange-500 text-orange-500"
                  : "text-gray-500"
              }`}
            >
              {type === "sign-in" ? "تسجيل الدخول" : "تسجيل"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Active Page */}
      <View className="flex-grow">
        {activePage === "sign-in" ? <SignIn /> : <SignUp />}
      </View>
    </SafeAreaView>
  );
}
