import React, { Component } from "react"

import { View, StyleSheet, StatusBar } from "react-native"
import {
  ProviderTypes,
  TranslatorConfiguration,
  TranslatorFactory
} from "react-native-power-translator"

import firebase from "react-native-firebase"
import ChatInput from "../../Components/Chat/chatInput"
import ChatHeader from "../../Components/Chat/chatHeader"
import ChatContainer from "../../Components/Chat/chatContainer"

export default class Conversas extends Component {
  static navigationOptions = {
    header: null
  }

  constructor(props) {
    super(props)
    this.scrollView = null
    this.state = {
      messageText: "",
      messages: [],
      user: firebase.auth().currentUser.uid
    }
    const { user } = this.state

    // Trecho de código apenas para auxiliar na seleção de pra quem vou enviar a msg
    // Deve ser retirado após a implementação de contatos
    if (user === "E6PMM9JOGYRBDKbDDdFWKiR2LVa2") {
      this.refDest = firebase
        .firestore()
        .collection("users")
        .doc("AC3Z5tAq29PBqaU6ax49jMhy1Kl1")
        .collection("Messages")
    } else if (user === "AC3Z5tAq29PBqaU6ax49jMhy1Kl1") {
      this.refDest = firebase
        .firestore()
        .collection("users")
        .doc("E6PMM9JOGYRBDKbDDdFWKiR2LVa2")
        .collection("Messages")
    }
    // Trecho termina aqui

    this.ref = firebase
      .firestore()
      .collection("users")
      .doc(user)
      .collection("Messages")

    TranslatorConfiguration.setConfig(
      ProviderTypes.Google,
      "AIzaSyC0j0BsAskqVIvaX2fcdvjsaw4fqGP5ut8",
      "en"
    )
  }

  componentDidMount() {
    this.unsubscribe = this.ref
      .orderBy("date", "asc")
      .onSnapshot(querySnapshot => {
        const messages = []
        querySnapshot.forEach(doc => {
          const { content, date, source } = doc.data()
          messages.push({
            key: doc.id,
            content,
            date: date.toDate(),
            source
          })
        })
        this.setState({ messages })
      })
  }

  onChangeHandler = text => {
    this.setState({ messageText: text })
  }

  sendMessage = () => {
    const { messageText } = this.state
    const newMessage = {
      content: messageText,
      date: new Date(),
      source: "1"
    }

    this.ref
      .add({
        content: newMessage.content,
        date: newMessage.date,
        source: newMessage.source
      })
      .then(() => true)
      .catch(error => error)

    const translator = TranslatorFactory.createTranslator()
    translator.translate(messageText, "en").then(translated => {
      this.refDest
        .add({
          content: newMessage.content,
          date: newMessage.date,
          contentTranslated: translated,
          source: "2"
        })
        .then(() => true)
        .catch(error => error)
    })

    this.setState({ messageText: "" })
  }

  render() {
    const { messages, messageText } = this.state
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="#fff" barStyle="dark-content" />
        <ChatHeader />
        <View style={styles.chatContainer}>
          <ChatContainer messages={messages} />
        </View>
        <View style={styles.input}>
          <ChatInput
            value={messageText}
            onPress={this.sendMessage}
            onChangeHandler={text => this.onChangeHandler(text)}
          />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8E3E3"
  },

  input: {
    alignContent: "center",
    flex: 0,
    justifyContent: "flex-end",
    marginBottom: 10
  },
  chatContainer: {
    flex: 1
  }
})
