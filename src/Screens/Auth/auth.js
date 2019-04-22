import React, { Component } from "react"
import { View, Text, TextInput, StyleSheet, Picker, Alert } from "react-native"
import LinearGradient from "react-native-linear-gradient"
import TextInputMask from "react-native-text-input-mask"
import firebase from "react-native-firebase"
import countryList from "../../assets/country_dials/dials"

export default class Auth extends Component {
  static navigationOptions = {}

  constructor() {
    super()
    this.state = {
      countries: [],
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
    this.setState({countries: countryList})
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
    // This is temporary (just hiding the warnings)
    console.disableYellowBox = true
    const { navigation } = this.props
    const { countries, countryCode, loading, authenticated } = this.state
    
    if (loading) return null
    if (!authenticated) {
      return (
        <View style={styles.container}>
          <View>
            <Text style={styles.textBig}>Insira seu número de telefone</Text>
            <Text style={styles.textSmall}> Digite o número do seu telefone junto com o DDD </Text>
          </View>
          <View>
            <View style={styles.countryPicker}>
              <Picker
                selectedValue={countryCode}
                onValueChange={itemValue =>
                  this.setState({ countryCode: itemValue })
                }
              >
                <Picker.Item label="Escolha seu País" value="" />
                {countries.map(item => (
                  <Picker.Item label={`${item.flag} ${item.name} (${item.dial_code})`} value={item.dial_code} />)
                )}
              </Picker>
            </View>
          </View>
          <View style={styles.textInputView}>
            <TextInput
              style={styles.countryTextInput}
              value={countryCode}
            />
            <TextInputMask
              style={styles.textInputStyle}
              refInput={ref => {
                this.input = ref
              }}
              onChangeText={extracted => {
                this.setState({ phoneNumber: `${countryCode}${extracted}` })
              }}
              mask="([00]) [00000]-[0000]"
              keyboardType="number-pad"
            />
          </View>
          <LinearGradient
            colors={["#547BF0", "#6AC3FB"]}
            style={styles.button}
          >
            <Text style={styles.textButton} onPress={() => this.signIn()}>
              Enviar
            </Text>
          </LinearGradient>
          <Text style={styles.textEnd}>
            Custos de SMS talvez possam ser aplicados
          </Text>
        </View>
      )
    }
    return navigation.navigate("ChatScreen")
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  countryPicker: {
    width: 330,
    borderBottomWidth: 2,
    borderColor: "#6AC3FB",
  },
  textInputView: {
    flexDirection: "row",
  },
  countryTextInput: {
    fontSize: 18,
    marginLeft: 40,
    marginRight: 40,
    marginTop: 10,
    marginBottom: 10,
    borderBottomWidth: 2,
    textAlign: "center",
    color: "gray",
    borderColor: "#6AC3FB",
  },
  textInputStyle: {
    flex:1,
    fontSize: 18,
    marginRight: 40,
    marginTop: 10,
    marginBottom: 10,
    borderBottomWidth: 2,
    textAlign: "center",
    borderColor: "#6AC3FB",
    color: "gray",
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
    justifyContent: "center",
    marginTop: 20
  }
})