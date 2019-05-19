import React from "react"

import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions
} from "react-native"
import { Icon } from "react-native-elements"

const contactsHeader = props => {
  const { syncronize, onPressSearch } = props
  return (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <Text style={styles.contactsInfo}>Contatos</Text>
        <View style={styles.Icon}>
          <TouchableOpacity onPress={onPressSearch}>
            <Icon name="search1" color="#00aced" type="antdesign" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity>
          <Icon
            containerStyle={styles.syncIcon}
            name="sync"
            color="#00aced"
            type="material"
            onPress={syncronize}
          />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const comprimento = Dimensions.get("window").width

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#fff",
    elevation: 5,
    marginTop: 0,
    fontFamily: "OpenSans"
  },
  headerContent: {
    backgroundColor: "#fff",
    marginBottom: 15,
    marginTop: 15,
    marginLeft: comprimento / 6,
    marginRight: 10,
    flexDirection: "row"
  },
  contactsInfo: {
    flex: 1,
    fontSize: 22,
    textAlign: "center",
    backgroundColor: "#fff"
  },
  Icon: {
    justifyContent: "center",
    marginRight: 10,
    marginLeft: 10
  },
  syncIcon: {
    justifyContent: "center"
  }
})

export default contactsHeader
