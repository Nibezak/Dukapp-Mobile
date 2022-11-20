import React, { useState } from "react";
import { Modal, StyleSheet, Text, Pressable, View } from "react-native";
import CheckBox from "./InputCheckBox";

export default function ModalWindow() {
  const [modalVisible, setModalVisible] = useState(false);
  const [checked, setChecked] = useState(false);
  return (
    <View
      style={[
        styles.centeredView,
        { backgroundColor: modalVisible ? "rgba(0,0,0,0.2)" : "transparent" },
      ]}
    >
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Hello World!</Text>

            <CheckBox
              label={"MPesa"}
              value={checked}
              onValueChange={() => {
                setChecked(!checked);
              }}
            />
            <CheckBox
              label={"Mobile Money"}
              value={!checked}
              onValueChange={() => {
                setChecked(!checked);
              }}
            />
            <CheckBox
              label={"Another One"}
              value={!checked}
              onValueChange={() => {
                setChecked(!checked);
              }}
            />
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.textStyle}>Hide Modal</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <Pressable
        style={[styles.button, styles.buttonOpen]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.textStyle}>Show Modal</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 2,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});
