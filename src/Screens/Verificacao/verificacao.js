/* eslint-disable react-native/no-inline-styles */
import React, { Component } from "react"

import {
  View, Text, StyleSheet, Linking
} from "react-native"
import LinearGradient from "react-native-linear-gradient"
import CodeInput from "react-native-confirmation-code-input"

const styles = StyleSheet.create({
  principal: {
    flex: 1,
    justifyContent: "center"
    // backgroundColor: "blue"
  },
  containerText1: {
    alignSelf: "center",
    marginBottom: 10
  },
  text1: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black"
  },
  containerText2: {
    // backgroundColor: "yellow",
    flexDirection: "row",
    alignSelf: "center",
    marginTop: 10
  },
  text2: {
    fontWeight: "bold",
    marginLeft: 1,
    color: "black"
  },
  button: {
    width: 300,
    height: 60,
    // elevation: 10,
    borderRadius: 20,
    alignSelf: "center",
    // backgroundColor: "blue",
    justifyContent: "center"
  },
  code: {
    // flex: 1,
    alignSelf: "center",
    height: 80,
    marginBottom: 30,
    paddingLeft: 20
  }
})

export default class Verificacao extends Component {
  constructor() {
    super()
    this.state = {}
  }

  confirmChoice = () => {}

  render() {
    return (
      <View style={styles.principal}>
        <View style={styles.containerText1}>
          <Text style={styles.text1}>Entre com seu número de verificação</Text>
        </View>
        <View style={styles.code}>
          <CodeInput
            codeLength={4}
            className="border-b"
            space={20}
            size={50}
            inactiveColor="gray"
            activeColor="gray"
            inputPosition="left"
            onFulfill={codigo => this.confirmChoice(codigo)}
          />
        </View>
        <View style={styles}>
          <LinearGradient colors={["#547BF0", "#6AC3FB"]} style={styles.button}>
            <Text
              style={{
                alignSelf: "center",
                fontSize: 25,
                color: "white"
              }}
            >
              Verificar
            </Text>
          </LinearGradient>
        </View>
        <View style={styles.containerText2}>
          <Text>Não recebeu o código de verificação?</Text>
          <Text style={styles.text2} onPress={() => Linking.openURL("#")}>
            Reenviar código
          </Text>
        </View>
      </View>
    )
  }
}
