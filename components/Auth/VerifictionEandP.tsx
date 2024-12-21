import React, { useState } from "react";
import { Image, Text, TouchableOpacity, View, Alert } from "react-native";
import Modal from "react-native-modal";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";

import {
  completePasswordReset,
  getUserIdByPhoneOrEmail,
  sendOtpToEmail,
  sendOtpToPhone,
  verifyOtpAndResetPassword,
} from "@/lib/api";
import CustomOtpInputs from "./CustomOtpInputs";
import CustomButton from "../ui/CustomButton";
import ErrorModal from "../ui/ErrorModal";
import { icons } from "../../constants";
import { useUserStore } from "@/store/userStore";

interface VerificationProps {
  ismodal: boolean;
  form: {
    phone?: string;
    email?: string;
    [key: string]: any;
  };
  onSuccess?: () => void;
  isphone: boolean;
  close: () => void;
  userId?: string;
  navigateToReset?: string;
}

const VerifictionEandP: React.FC<VerificationProps> = ({
  ismodal,
  form,
  onSuccess,
  isphone,
  close,
  userId,
  navigateToReset = "/ResetPassword",
}) => {
  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasResentOtp, setHasResentOtp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { fetchBasicUserData } = useUserStore();

  // Identifier for OTP (email or phone)
  const identifier = isphone ? `+966${form?.value}` : form?.value;

  // Show error modal
  const showError = (message: string) => setError(message);

  // Clear error modal
  const clearError = () => setError(null);

  const handleResendOtp = async () => {
    if (hasResentOtp) return;

    try {
      if (isphone) {
        await sendOtpToPhone(identifier!);
      } else {
        await sendOtpToEmail(identifier!);
      }
      setHasResentOtp(true);
      showError("تم إرسال رمز التحقق مرة أخرى.");
    } catch (error) {
      console.error("Error resending OTP:", error);
      showError("حدث خطأ أثناء إعادة إرسال رمز التحقق.");
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length < 6) {
      showError("يرجى إدخال رمز التحقق الكامل.");
      return;
    }

    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      let userIdToVerify = userId as any;

      // Fetch user ID if not already provided
      if (!userIdToVerify) {
        userIdToVerify = await getUserIdByPhoneOrEmail(identifier!);
        if (!userIdToVerify) {
          showError("فشل في العثور على المستخدم.");
          return;
        }
      }

      // Verify OTP and reset password
      if (isphone) {
        await verifyOtpAndResetPassword(userIdToVerify, otp);
      } else {
        await completePasswordReset(userIdToVerify, otp);
      }

      showError("تم التحقق بنجاح.");
      await fetchBasicUserData();

      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error verifying OTP:", error);
      showError("فشل في التحقق من الرمز.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onClose = () => {
    clearError();
    setHasResentOtp(false);
    close();
  };

  return (
    <Modal
      isVisible={ismodal}
      animationIn="fadeIn"
      onBackdropPress={onClose}
      backdropTransitionOutTiming={0}
    >
      <View className="w-full h-3/4 justify-start items-center bg-white">
        {/* Close Button */}
        <View
          style={{
            width: "100%",
            alignItems: "flex-end",
            paddingHorizontal: 20,
            paddingBottom: 10,
            paddingTop: 20,
          }}
        >
          <TouchableOpacity onPress={onClose} disabled={isSubmitting}>
            <Image source={icons.close} className="w-6 h-6" />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <Image
          source={icons.sendpassLogo}
          resizeMode="contain"
          className="w-36 h-48"
        />
        <Text className="mb-5 mt-4 text-primary font-sans-arabic-semibold text-base">
          {isphone ? "التحقق من رقم الجوال" : "التحقق من البريد الإلكتروني"}
        </Text>
        <Text className="mb-5 text-textLight font-bold text-base">
          {isphone
            ? "ادخل رمز التحقق المرسل على رقمك"
            : "ادخل رمز التحقق المرسل على بريدك الإلكتروني"}
        </Text>
        <Text className="mb-5 text-textLight font-bold text-base">
          {identifier}
        </Text>

        {/* OTP Inputs */}
        <CustomOtpInputs
          numberOfInputs={6}
          onChangeOtp={(value) => setOtp(value)}
        />

        {/* Submit Button */}
        <CustomButton
          title="متابعة"
          containerStyles="w-40 my-4 py-1 bg-primary mb-5"
          handlePress={handleVerifyOtp}
          textStyles="text-white"
          isLoading={isSubmitting}
        />

        {/* Resend OTP */}
        <TouchableOpacity
          disabled={hasResentOtp}
          onPress={handleResendOtp}
          className="mt-2"
        >
          <Text className={hasResentOtp ? "text-red-500" : ""}>
            {hasResentOtp ? "تم إعادة إرسال الكود" : "إعادة إرسال الكود"}
          </Text>
        </TouchableOpacity>
      </View>
      <StatusBar backgroundColor="#fff" style="dark" />

      {/* Error Modal */}
      <ErrorModal
        isVisible={!!error}
        message={error || ""}
        onClose={clearError}
        isSecuss={false}
      />
    </Modal>
  );
};

export default VerifictionEandP;
