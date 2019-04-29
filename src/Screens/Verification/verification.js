import React, { Component } from "react"

import { View, Text, StyleSheet, Linking } from "react-native"
import LinearGradient from "react-native-linear-gradient"
import CodeInput from "react-native-confirmation-code-input"
import firebase from "react-native-firebase"

const styles = StyleSheet.create({
  principal: {
    flex: 1,
    fontFamily: "OpenSans",
    justifyContent: "center"
  },
  containerText1: {
    marginBottom: 10,
    alignSelf: "center"
  },
  text1: {
    fontSize: 18,
    color: "black",
    fontWeight: "bold"
  },
  containerText2: {
    marginTop: 10,
    alignSelf: "center",
    flexDirection: "row"
  },
  text2: {
    marginLeft: 1,
    color: "black",
    fontWeight: "bold"
  },
  button: {
    marginLeft: 20,
    marginRight: 20,
    height: 60,
    borderRadius: 20,
    justifyContent: "center"
  },
  code: {
    paddingLeft: 10,
    paddingRight: 10,
    height: 80,
    marginBottom: 30,
  },
  text3: {
    alignSelf: "center",
    fontSize: 25,
    color: "white"
  }
})

export default class Verificacao extends Component {
  constructor() {
    super()
    this.state = {}
  }

  confirmChoice = code => {
    const { navigation } = this.props
    const confirmResult = navigation.getParam("confirmResultFirebase")
    const phoneNumber = navigation.getParam("phoneNumber")

    if (confirmResult && code.length) {
      confirmResult
        .confirm(code)
        // Continuar as rotas se a confirmação ocorrer com sucesso aqui
        .then(user => {
          firebase
            .firestore()
            .collection("users")
            .doc(user.uid)
            .set({
              phone: phoneNumber
            })
          navigation.navigate("ChatScreen")
        })
        // Caso dê algum erro, o tratamento é feito aqui
        .catch(() => {})
    }
  }

  render() {
    return (
      <View style={styles.principal}>
        <View style={styles.containerText1}>
          <Text style={styles.text1}>Entre com seu número de verificação</Text>
        </View>
        <View style={styles.code}>
          <CodeInput
            codeLength={6}
            className="border-b"
            space={20}
            size={40}
            inactiveColor="gray"
            activeColor="gray"
            inputPosition="left"
            keyboardType="number-pad"
            onFulfill={code => this.confirmChoice(code)}
          />
        </View>
        <View style={styles}>
          <LinearGradient colors={["#547BF0", "#6AC3FB"]} style={styles.button}>
            <Text style={styles.text3}>Verificar</Text>
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
