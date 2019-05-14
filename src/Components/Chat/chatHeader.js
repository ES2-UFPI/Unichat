import React from "react"

import { View, StyleSheet, Text, TouchableOpacity } from "react-native"
import { Avatar, Icon } from "react-native-elements"

const chatHeader = props => {
  const { userName, userPhoto, navigation } = props
  return (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
          <Icon name="ios-arrow-back" color="#00aced" type="ionicon" />
        </TouchableOpacity>
        <Avatar
          containerStyle={styles.avatar}
          rounded
          source={{ uri: userPhoto }}
          size={40}
        />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{userName}</Text>
          <Text style={styles.lastSeen}>Visto por ultimos às 8:10pm</Text>
        </View>
        <Icon
          containerStyle={styles.moreInfo}
          name="dots-vertical"
          type="material-community"
        />
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  header: {
    backgroundColor: "#fff",
    elevation: 5
  },
  headerContent: {
    justifyContent: "space-between",
    alignContent: "center",
    marginBottom: 10,
    marginLeft: 10,
    marginTop: 10,
    marginRight: 10,
    flexDirection: "row"
  },
  userInfo: {
    flex: 1,
    marginLeft: 10
  },
  userName: {
    fontSize: 18
  },
  lastSeen: {
    fontSize: 10
  },
  moreInfo: {
    marginTop: 10,
    right: 0
  },
  avatar: {
    marginLeft: 10
  },
  back: {
    justifyContent: "center"
  }
})

export default chatHeader
