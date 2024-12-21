import React, { useState } from "react";
import { Alert, Text, View, StyleSheet } from "react-native";
import { router } from "expo-router"; // For navigation
import { ResetPasswordN } from "@/lib/api";
import FormField from "@/components/Auth/FormField";
import CustomButton from "@/components/ui/CustomButton";
import ErrorModal from "@/components/ui/ErrorModal"; // For better error handling UI
import { useUserStore } from "@/store/userStore";
import Toast from "react-native-toast-message";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { user, updateUserData } = useUserStore(); // Access user and updater function

  const showToast = () => {
    Toast.show({
      type: "success",
      text1: "تم",
      text2: "تم تغيير كلمة المرور بنجاح.👋",
    });
  };

  const showError = (message: string) => {
    setErrorMessage(message);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setErrorMessage("");
  };

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      showError("يرجى إدخال كلمة المرور وكلمة المرور الجديدة.");
      return;
    }

    if (newPassword !== confirmPassword) {
      showError("كلمات المرور غير متطابقة.");
      return;
    }

    if (newPassword.length < 6) {
      showError("كلمة المرور يجب أن تكون أطول من 6 أحرف.");
      return;
    }

    setIsLoading(true);

    try {
      const oldPassword = user?.Details?.password;
      if (!oldPassword) {
        throw new Error(
          "كلمة المرور القديمة غير موجودة. الرجاء المحاولة لاحقًا."
        );
      }

      await ResetPasswordN(newPassword, oldPassword);

      // Update the password in the Zustand store
      await updateUserData({ password: newPassword });

      showToast();

      router.replace("/(tabs)");
    } catch (error: any) {
      console.error("Password reset failed:", error.message || error);
      showError(error.message || "فشل في تغيير كلمة المرور. حاول مرة أخرى.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>إعادة تعيين كلمة المرور</Text>
      <FormField
        title="Password"
        placeholder="كلمة المرور الجديدة"
        value={newPassword}
        handleChangeText={(text) => setNewPassword(text.trim())}
      />

      <FormField
        title="Password"
        placeholder="تأكيد كلمة المرور"
        value={confirmPassword}
        handleChangeText={(text) => setConfirmPassword(text.trim())}
      />

      <CustomButton
        title="تأكيد"
        handlePress={handleResetPassword}
        isLoading={isLoading}
      />

      <ErrorModal
        isVisible={isModalVisible}
        message={errorMessage}
        onClose={handleCloseModal}
        isSecuss={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f8f8f8",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
  },
});

export default ResetPassword;
