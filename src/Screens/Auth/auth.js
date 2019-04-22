import React, { Component } from "react"
import { View, Text, StyleSheet, Picker, Alert } from "react-native"
import LinearGradient from "react-native-linear-gradient"
import TextInputMask from "react-native-text-input-mask"
import firebase from "react-native-firebase"
import Chat from "../Chat/chat"

export default class Auth extends Component {
  static navigationOptions = {}

  constructor() {
    super()
    this.state = {
      countryCode: "",
      phoneNumber: null,
      loading: true,
      authenticated: false
    }
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({ loading: false, authenticated: true })
      } else {
        this.setState({ loading: false, authenticated: false })
      }
    })
  }

  signIn = () => {
    const { phoneNumber } = this.state

    firebase
      .auth()
      .signInWithPhoneNumber(phoneNumber)
      .then(_confirmResult => {
        const { navigation } = this.props
        navigation.navigate("VerificationScreen", {
          confirmResultFirebase: _confirmResult,
          phoneNumber
        })
      })
      .catch(error => {
        Alert.alert("Erro na verificação", error.message)
      })
  }

  render() {
    const { countryCode, loading, authenticated } = this.state
    if (loading) return null
    if (!authenticated) {
      return (
        <View style={styles.container}>
          <View>
            <Text style={styles.textBig}>Insira seu número de telefone</Text>
          </View>
          <View>
            <Text style={styles.textSmall}>
              Digite o número do seu telefone junto com o DDD
            </Text>
            <Picker
              selectedValue={countryCode}
              onValueChange={itemValue =>
                this.setState({ countryCode: itemValue })
              }
            >
              <Picker.Item label="Selecione um ID do País" value="" />
              <Picker.Item label="+55 - Brasil" value="+55" />
              <Picker.Item label="+1 - Country" value="+1" />
            </Picker>
          </View>
          <View>
            <TextInputMask
              style={styles.textInputStyle}
              placeholder={countryCode}
              refInput={ref => {
                this.input = ref
              }}
              onChangeText={extracted => {
                this.setState({ phoneNumber: extracted })
              }}
              mask={`${countryCode} ([00]) [00000]-[0000]`}
              keyboardType="number-pad"
            />
            <LinearGradient
              colors={["#547BF0", "#6AC3FB"]}
              style={styles.button}
            >
              <Text style={styles.textButton} onPress={() => this.signIn()}>
                Enviar
              </Text>
            </LinearGradient>
          </View>
          <Text style={styles.textEnd}>
            Custos de SMS talvez possam ser aplicados
          </Text>
        </View>
      )
    }
    return <Chat />
  }
}

const styles = StyleSheet.create({
  container: {
    fontFamily: "OpenSans",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    padding: 5
  },
  textBig: {
    fontSize: 24,
    color: "black",
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 30
  },
  textSmall: {
    fontSize: 12,
    color: "gray",
    marginBottom: 10
  },
  textEnd: {
    fontSize: 12,
    color: "gray",
    marginTop: 50
  },
  textInputStyle: {
    textAlign: "center",
    fontSize: 20,
    width: 280,
    height: 50,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#6AC3FB",
    marginTop: 10,
    marginBottom: 10
  },
  textButton: {
    alignSelf: "center",
    fontSize: 20,
    color: "white"
  },
  button: {
    width: 280,
    height: 60,
    borderRadius: 20,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20
  }
})
