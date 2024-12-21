import FormField from "@/components/Auth/FormField";
import VerificationPage from "@/components/Auth/VerificationPage";
import CustomButton from "@/components/ui/CustomButton";
import ErrorModal from "@/components/ui/ErrorModal";
import { isEmailExisting, isPhoneNumberExisting } from "@/lib/api";
import { UpdatePhoneNumberAndSendOTP } from "@/lib/UpdatePhoneNumberAndSendOTP";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  Switch,
  Text,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Toast from "react-native-toast-message";

export default function SignUp() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    passwordsure: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const showError = (message: string, isSuccess: boolean) => {
    setErrorMessage(message);
    setIsSuccess(isSuccess);
    setIsModalVisible(true);
  };

  const handleCloseErrorModal = () => {
    setIsModalVisible(false);
    setErrorMessage("");
  };

  const showToast = () => {
    Toast.show({
      type: "success",
      text1: "sign up",
      text2: " welcome to your app 👋",
    });
  };

  const handleChangeText = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async () => {
    const { name, phone, email, password, passwordsure } = form;

    if (!name || !phone || !email || !password || !passwordsure) {
      showError("يرجى ملء جميع الحقول.", false);
      return;
    }

    if (password !== passwordsure) {
      showError("كلمات المرور غير متطابقة.", false);
      return;
    }

    if (!email.includes("@")) {
      showError("تنسيق البريد الإلكتروني غير صحيح.", false);
      return;
    }

    try {
      setIsSubmitting(true);

      // Check if phone already exists
      const phoneExists = await isPhoneNumberExisting(`+966${phone}`);
      if (phoneExists) {
        showError("رقم الهاتف مسجل بالفعل. الرجاء استخدام رقم آخر.", false);
        return;
      }

      // Check if email already exists
      const emailExists = await isEmailExisting(email);
      if (emailExists) {
        showError(
          "البريد الإلكتروني مسجل بالفعل. الرجاء استخدام بريد آخر.",
          false
        );
        return;
      }

      // Send OTP
      await UpdatePhoneNumberAndSendOTP(form);
      setShowOtpModal(true);
    } catch (error: any) {
      console.error("Error during sign-up:", error.message || error);
      showError("حدث خطأ أثناء تسجيل الحساب. حاول مرة أخرى.", false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpSuccess = () => {
    setShowOtpModal(false);
    showToast();
    router.replace("/(tabs)");
  };

  const closeOtpModal = () => {
    setShowOtpModal(false);
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
        <View className="flex justify-center items-center">
          <FormField
            title="Name"
            placeholder="الاسم"
            value={form.name}
            handleChangeText={(value) => handleChangeText("name", value)}
          />
          <FormField
            title="Email"
            placeholder="البريد الإلكتروني"
            value={form.email}
            handleChangeText={(value) => handleChangeText("email", value)}
          />
          <FormField
            title="Phone"
            length={9}
            placeholder="رقم الجوال"
            value={form.phone}
            handleChangeText={(value) => handleChangeText("phone", value)}
          />
          <FormField
            title="Password"
            placeholder="كلمة المرور"
            value={form.password}
            handleChangeText={(value) => handleChangeText("password", value)}
          />
          <FormField
            title="Password"
            placeholder="تأكيد كلمة المرور"
            value={form.passwordsure}
            handleChangeText={(value) =>
              handleChangeText("passwordsure", value)
            }
          />

          <View className="flex-row-reverse justify-start items-center w-full px-6 ">
            <Switch
              value={isEnabled}
              onValueChange={setIsEnabled}
              trackColor={{ true: "#FF6E4E" }}
            />
            <Text>أوافق على الشروط والسياسات</Text>
          </View>

          <CustomButton
            title="تسجيل"
            isDisable={!isEnabled}
            handlePress={handleSubmit}
            isLoading={isSubmitting}
          />
        </View>

        {/* OTP Modal */}
        {showOtpModal && (
          <VerificationPage
            ismodal={showOtpModal}
            forcreat={true}
            isphone={true}
            form={form}
            close={closeOtpModal}
            onSuccess={handleOtpSuccess}
          />
        )}
        <ErrorModal
          isVisible={isModalVisible}
          message={errorMessage}
          onClose={handleCloseErrorModal}
          isSecuss={isSuccess}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
