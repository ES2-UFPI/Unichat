import React, { Component } from "react"

import { View, StyleSheet, StatusBar, BackHandler } from "react-native"
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
    const { navigation } = this.props
    this.scrollView = null
    this.state = {
      messageText: "",
      messages: [],
      user: firebase.auth().currentUser.uid,
      isValueNull: true,
      destUser: navigation.getParam("item")
    }
    const { user, destUser } = this.state
    this.ref = firebase
      .firestore()
      .collection("users")
      .doc(user)
      .collection("conversas")
      .doc(destUser.key)

    TranslatorConfiguration.setConfig(
      ProviderTypes.Google,
      "AIzaSyC0j0BsAskqVIvaX2fcdvjsaw4fqGP5ut8",
      "en"
    )
  }

  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.handleBackPress)
    this.unsubscribe = this.ref
      .collection("messages")
      .orderBy("date", "asc")
      .onSnapshot(querySnapshot => {
        const messages = []
        querySnapshot.forEach(doc => {
          const { content, contentTranslated, date, source } = doc.data()
          messages.push({
            key: doc.id,
            content,
            contentTranslated,
            date: date.toDate(),
            source
          })
        })
        this.setState({ messages })
      })
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.handleBackPress)
  }

  handleBackPress = () => {
    const { navigation } = this.props
    navigation.goBack()
    return true
  }

  onChangeHandler = text => {
    this.setState({ messageText: text, isValueNull: false })
  }

  sendMessage = () => {
    const { destUser, user } = this.state
    this.ref.set({
      contactName: destUser.contactName,
      profileImgUrl: destUser.profile_img_url
    })

    const refDest = firebase
      .firestore()
      .collection("users")
      .doc(destUser.key)
      .collection("conversas")
      .doc(user)
      .collection("messages")

    const { messageText } = this.state
    if (messageText === "") this.setState({ isValueNull: true })
    const newMessage = {
      content: messageText,
      date: firebase.database().getServerTime(),
      source: "1"
    }

    this.ref
      .collection("messages")
      .add({
        content: newMessage.content,
        date: newMessage.date,
        source: newMessage.source
      })
      .then(() => true)
      .catch(error => error)

    const translator = TranslatorFactory.createTranslator()
    translator.translate(messageText, "en").then(translated => {
      refDest
        .add({
          content: newMessage.content,
          date: newMessage.date,
          contentTranslated: translated,
          source: "2"
        })
        .then(() => true)
        .catch(error => error)
    })

    this.setState({ messageText: "", isValueNull: true })
  }

  render() {
    const { messages, messageText, isValueNull, destUser } = this.state
    // firebase.auth().signOut()
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="#fff" barStyle="dark-content" />
        <ChatHeader
          userName={destUser.contactName}
          userPhoto={destUser.profile_img_url}
        />
        <View style={styles.chatContainer}>
          <ChatContainer messages={messages} />
        </View>
        <View style={styles.input}>
          <ChatInput
            value={messageText}
            onPress={this.sendMessage}
            onChangeHandler={text => this.onChangeHandler(text)}
            isValueNull={isValueNull}
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
