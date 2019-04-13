/* eslint-disable object-curly-newline */
import React, { Component } from "react"

import { View, StyleSheet, Dimensions, StatusBar, Text } from "react-native"
import { Avatar, Icon } from "react-native-elements"
import { ScrollView } from "react-native-gesture-handler"
import shortid from "shortid"

import MessageInput from "../../Components/MessageInput"
import Message from "../../Components/mensagem"

const { width: WIDTH, height: HEIGHT } = Dimensions.get("window")

export default class Conversas extends Component {
  constructor() {
    super()
    this.scrollView = null
    this.state = {
      messageText: "",
      messages: []
    }
  }

  onChangeHandler = text => {
    this.setState({ messageText: text })
  }

  getTime = () => {
    const date = new Date()
    let TimeType
    let hour
    let minutes

    hour = date.getHours()
    if (hour <= 11) {
      TimeType = "AM"
    } else {
      TimeType = "PM"
    }
    if (hour > 12) {
      hour -= 12
    }
    if (hour === 0) {
      hour = 12
    }
    minutes = date.getMinutes()
    if (minutes < 10) {
      minutes = 0 + minutes.toString()
    }
    return `${hour.toString()} : ${minutes.toString()} ${TimeType.toString()}`
  }

  sendMessage = () => {
    const { messageText, messages } = this.state
    const hour = this.getTime()

    const newMessage = {
      content: messageText,
      date: hour,
      source: "1"
    }
    this.setState({ messages: [...messages, newMessage] })
  }

  render() {
    const { messages } = this.state
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="#fff" barStyle="dark-content" />
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Avatar rounded title="NC" size={40} />
            <View style={styles.userInfo}>
              <Text style={styles.userName}>Neto Chaves</Text>
              <Text style={styles.lastSeen}>Visto por ultimos às 8:10pm</Text>
            </View>
            <Icon
              containerStyle={styles.moreInfo}
              name="dots-vertical"
              type="material-community"
            />
          </View>
        </View>
        <View style={styles.messageContainer}>
          <ScrollView
            ref={ref => {
              this.scrollView = ref
            }}
            onContentSizeChange={() => {
              this.scrollView.scrollToEnd({ animated: true })
            }}
          >
            {messages.map(message => (
              <Message
                key={shortid.generate()}
                content={message.content}
                date={message.date}
                source={message.source}
              />
            ))}
          </ScrollView>
        </View>
        <View style={styles.input}>
          <MessageInput
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
  header: {
    width: WIDTH,
    height: HEIGHT - 600,
    backgroundColor: "#fff",
    elevation: 5
  },
  input: {
    alignContent: "center",
    flex: 0,
    justifyContent: "flex-end",
    marginBottom: 10
  },
  headerContent: {
    flex: 1,
    left: 40,
    top: 20,
    flexDirection: "row"
  },
  userInfo: {
    marginLeft: 10
  },
  userName: {
    fontSize: 18
  },
  lastSeen: {
    fontSize: 10
  },
  moreInfo: {
    flex: 1,
    top: 5,
    left: 60
  },
  messageContainer: {
    flex: 1
  }
})
