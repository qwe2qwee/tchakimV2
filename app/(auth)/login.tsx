import {
  View,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { router } from "expo-router";
import { useUserStore } from "../../store/userStore";
import { getEmailByPhoneNumber, signIn } from "@/lib/api";
import FormField from "@/components/Auth/FormField";
import CustomButton from "@/components/ui/CustomButton";
import ErrorModal from "@/components/ui/ErrorModal";
import Toast from "react-native-toast-message";

const SignIn = () => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ phone: "", password: "" });
  const [fieldError, setFieldError] = useState({
    phone: false,
    password: false,
  });

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const { fetchBasicUserData } = useUserStore();

  const showToast = () => {
    Toast.show({
      type: "success",
      text1: "login",
      text2: " welcome to your app 👋",
    });
  };

  // Show error modal
  const showError = (message: string, isSuccess: boolean = false) => {
    setErrorMessage(message);
    setIsSuccess(isSuccess);
    setIsModalVisible(true);
  };

  // Close error modal
  const handleClose = () => {
    setIsModalVisible(false);
    setErrorMessage("");
  };

  // Handle input changes
  const handleChangeText = (field: string, value: string) => {
    setForm((prevForm) => ({ ...prevForm, [field]: value }));
    setFieldError((prevError) => ({ ...prevError, [field]: false }));
  };

  // Handle form submission
  const handleSubmit = async () => {
    const { phone, password } = form;

    // Validate input fields
    if (!phone.trim() || !password.trim()) {
      setFieldError({
        phone: !phone.trim(),
        password: !password.trim(),
      });
      showError("الرجاء تعبئة جميع الحقول", false);
      return;
    }

    setLoading(true);
    try {
      // Validate phone number format
      const phoneRegex = /^[0-9]{9}$/;
      if (!phoneRegex.test(phone)) {
        setFieldError((prev) => ({ ...prev, phone: true }));
        showError("رقم الجوال غير صالح", false);
        return;
      }

      // Fetch email by phone number
      const email = await getEmailByPhoneNumber(`+966${phone.trim()}`);
      if (!email) {
        setFieldError((prev) => ({ ...prev, phone: true }));
        showError("لم يتم العثور على مستخدم لهذا الرقم", false);
        return;
      }

      // Sign in
      await signIn(email, password.trim());

      // Fetch user data only if sign-in is successful
      await fetchBasicUserData();

      // Navigate to home page
      showToast();
      router.replace("/(tabs)");
    } catch (error: any) {
      console.error("Error during sign-in:", error.message);
      showError(
        error.message || "حدث خطأ أثناء تسجيل الدخول، حاول مرة أخرى",
        false
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="bg-secondary flex-1 w-full px-4 py-2 justify-start items-center">
          <View className="w-full items-center py-10">
            <FormField
              title="Phone"
              placeholder="رقم الجوال"
              value={form.phone}
              handleChangeText={(value) => handleChangeText("phone", value)}
              length={9}
            />
            <FormField
              title="Password"
              placeholder="كلمة المرور"
              value={form.password}
              handleChangeText={(value) => handleChangeText("password", value)}
            />
            <View className="w-full px-2 flex-row-reverse justify-start items-center">
              <TouchableOpacity
                className="flex-row px-3"
                onPress={() => router.push("/(auth)/reset/email")}
              >
                <Text className="text-[#F61F1F] text-xs underline">
                  هل نسيت كلمة السر؟
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View className="w-full items-center flex-grow pt-2">
            <CustomButton
              title="تسجيل الدخول"
              handlePress={handleSubmit}
              containerStyles="my-2"
              isLoading={loading}
            />
            <CustomButton
              title="الدخول كزائر"
              handlePress={() => router.push("/(tabs)")}
              containerStyles="bg-[#E4E4E4] my-2"
              textStyles="text-textDark"
              con
            />
          </View>
        </View>
        <ErrorModal
          isVisible={isModalVisible}
          message={errorMessage}
          onClose={handleClose}
          isSecuss={isSuccess}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignIn;
