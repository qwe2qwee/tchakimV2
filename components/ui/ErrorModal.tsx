import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Modal from "react-native-modal";

interface ErrorModalProps {
  isVisible: boolean; // Control the visibility of the modal
  message: string; // Error message to display
  isSecuss?: boolean;
  onClose: () => void; // Callback to close the modal
}

const ErrorModal: React.FC<ErrorModalProps> = ({
  isVisible,
  message,
  isSecuss,
  onClose,
}) => {
  console.log(isSecuss);

  return (
    <Modal
      isVisible={isVisible}
      animationIn="fadeIn"
      animationOut="fadeOut"
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      useNativeDriver
    >
      <View style={styles.modalContainer}>
        <Text style={[isSecuss ? styles.title2 : styles.title]}>
          {isSecuss ? "نجاح" : "خطاء"}
        </Text>
        <Text style={styles.message}>{message}</Text>
        <TouchableOpacity style={styles.button} onPress={onClose}>
          <Text style={styles.buttonText}>موافق</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "red",
    marginBottom: 10,
  },
  title2: {
    fontSize: 18,
    fontWeight: "bold",
    color: "green",
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#FF6E4E",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ErrorModal;
