import React from "react"

import { View, Alert, StyleSheet } from "react-native"
import shortid from "shortid"
import { ScrollView } from "react-native-gesture-handler"
import {
  Menu,
  MenuProvider,
  MenuTrigger,
  MenuOption,
  MenuOptions
} from "react-native-popup-menu"
import getTime from "~/functions/getTime"

import Message from "../mensagem"

const Chat = props => {
  const { messages } = props
  let scrollView = null
  return (
    <View>
      <ScrollView
        ref={ref => {
          scrollView = ref
        }}
        onContentSizeChange={() => {
          scrollView.scrollToEnd({ animated: true })
        }}
      >
        {messages.map(message => {
          return (
            <MenuProvider>
              <Menu style={styles.menu}>
                <MenuTrigger triggerOnLongPress="true">
                  <Message
                    key={shortid.generate()}
                    content={
                      message.source === "1"
                        ? message.content
                        : message.contentTranslated
                    }
                    date={getTime(message.date)}
                    source={message.source}
                  />
                </MenuTrigger>
                <MenuOptions>
                  <MenuOption
                    onSelect={() => Alert.alert("Traduzir")}
                    text="Traduzir para idioma original"
                  />
                  <MenuOption
                    onSelect={() => Alert.alert("Excluir pro JP")}
                    text="Excluir"
                  />
                </MenuOptions>
              </Menu>
            </MenuProvider>
          )
        })}
      </ScrollView>
    </View>
  )
}

export default Chat
const styles = StyleSheet.create({
  menu: {
    marginLeft: 150,
    marginTop: 40
  }
})
