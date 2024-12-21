import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { Text, View, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { useUserStore } from "@/store/userStore";
import CustomButton from "@/components/ui/CustomButton";

const App: React.FC = () => {
  const user = useUserStore((state) => state.user); // Get user state from Zustand
  const loading = useUserStore((state) => state.loading); // Get loading state from Zustand
  const { fetchUserDetails } = useUserStore();

  useEffect(() => {
    // Fetch user details on mount
    const fetchUserDetails = async () => {
      await fetchUserDetails();
    };

    fetchUserDetails();
  }, []);

  // Loading Screen
  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-secondary">
        <ActivityIndicator size="large" color="#FF6E4E" />
      </View>
    );
  }

  // Redirect to Login Screen if no user is logged in
  if (!user) {
    return (
      <View className="flex-1 items-center justify-center bg-secondary">
        <Text className="font-sans-arabic-bold text-lg text-center">
          الرجاء تسجيل الدخول
        </Text>
        <CustomButton
          handlePress={() => router.push("/(auth)")}
          title="تسجيل الدخول"
        />
        <StatusBar style="auto" />
      </View>
    );
  }

  // Main App Screen when user is logged in
  return (
    <View className="flex-1 items-center justify-center bg-secondary">
      <Text className="font-sans-arabic-bold text-xl text-center">
        مرحباً، {user?.Details?.name || user?.userName || "المستخدم"}
      </Text>
      <CustomButton
        handlePress={() => router.push("/(tabs)")}
        title="الانتقال إلى الصفحة الرئيسية"
      />
      <StatusBar style="auto" />
    </View>
  );
};

export default App;
