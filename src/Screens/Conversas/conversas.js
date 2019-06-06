/* eslint-disable camelcase */
import React, { Component } from "react"
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  BackHandler,
  Alert,
  AppState
} from "react-native"
import { ListItem, Icon } from "react-native-elements"
import { FAB, Portal, Provider } from "react-native-paper"
import LinearGradient from "react-native-linear-gradient"
import firebase from "react-native-firebase"
import AsyncStorage from "@react-native-community/async-storage"
import getTime from "~/functions/getTime"
import NetInfo from "@react-native-community/netinfo"
import SearchBar from "~/Components/SearchBar"
import CreateGroup from "~/Screens/CreateGroup/CreateGroup"

export default class Conversas extends Component {
  constructor() {
    super()
    this.state = {
      conversas: [],
      isSerchable: false,
      arrayholder: [],
      myName: "",
      myPicture: null,
      text: "",
      open: false,
      isModalVisible: false
    }

    this.appState = AppState.currentState

    this.ref = firebase
      .firestore()
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
  }

  async componentDidMount() {
    this.mounted = true
    this.listener = this.ref.onSnapshot(async () => {
      const username = await AsyncStorage.getItem("@username")
      const profileImageUrl = await AsyncStorage.getItem("@profileImageUrl")
      if (this.mounted)
        this.setState({ myName: username, myPicture: profileImageUrl })
    })

    const { navigation } = this.props

    const channel = new firebase.notifications.Android.Channel(
      "unichat",
      "Unichat channel",
      firebase.notifications.Android.Importance.Max
    )
      .setDescription("My app channel")
      .setVibrationPattern([500])
      .setLockScreenVisibility(firebase.notifications.Android.Visibility.Public)

    firebase.notifications().android.createChannel(channel)

    const notificationOpen = await firebase
      .notifications()
      .getInitialNotification()
    if (notificationOpen) {
      const { notification } = notificationOpen
      const { conversaId } = notification.data
      notification.android.setGroup("unichat")
      notification.android.setPriority(
        firebase.notifications.Android.Priority.High
      )
      notification.android.setChannelId("unichat")
      notification.android.setVibrate([500])
      this.ref
        .collection("conversas")
        .doc(conversaId)
        .get()
        .then(doc => {
          const key = doc.id
          const item = { key, ...doc.data() }
          navigation.navigate("ChatScreen", { item })
        })
    }
    this.ref.update({
      online: true
    })
    NetInfo.isConnected.addEventListener(
      "connectionChange",
      this.handleConnectivityChange
    )
    AppState.addEventListener("change", this.handleAppStateChange)
    BackHandler.addEventListener("hardwareBackPress", this.handleBackPress)
    this.getData()
    this.willBlur = navigation.addListener("willBlur", () => {
      this.setState(prevState => ({
        arrayholder: prevState.conversas,
        isSerchable: false,
        text: "",
        open: false
      }))
    })
  }

  componentWillUnmount() {
    this.mounted = false
    BackHandler.removeEventListener("hardwareBackPress", this.handleBackPress)
    this.unsubscribe()
    this.listener()
    this.willBlur.remove()
    this.setState(prevState => ({
      arrayholder: prevState.conversas,
      isSerchable: false,
      text: "",
      open: false
    }))
  }

  handleConnectivityChange = isConnected => {
    if (isConnected === true) {
      if (this.appState === "active") {
        this.ref.update({
          online: true
        })
      } else if (this.appState === "background") {
        this.ref.update({
          online: false,
          lastSeen: firebase.database().getServerTime()
        })
      }
    }
  }

  handleAppStateChange = nextAppState => {
    if (
      this.appState.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      this.ref.update({
        online: true
      })
    } else if (
      this.appState.match(/inative|active/) &&
      nextAppState === "background"
    ) {
      this.ref.update({
        online: false,
        lastSeen: firebase.database().getServerTime()
      })
    }
    this.appState = nextAppState
  }

  handleBackPress = () => {
    return true
  }

  getData = async () => {
    this.unsubscribe = this.ref
      .collection("conversas")
      .onSnapshot(querySnapshot => {
        AsyncStorage.getItem("@contacts").then(contactsResponse => {
          const contacts = JSON.parse(contactsResponse)
          const conversas = []
          querySnapshot.forEach(doc => {
            let find = false
            const {
              numUnreadMsgs,
              unreadMsgs,
              lastMessage,
              dateLastMessage,
              contactPhoto,
              contactName
            } = doc.data()
            contacts.forEach(contact => {
              if (contact.key === doc.id) {
                conversas.push({
                  contact,
                  key: doc.id,
                  contactPhoto,
                  contactName: contact.contactName,
                  unreadMsgs,
                  numUnreadMsgs,
                  lastMessage,
                  dateLastMessage
                })
                find = true
              }
            })
            if (find === false) {
              conversas.push({
                key: doc.id,
                contactPhoto,
                contactName,
                unreadMsgs,
                numUnreadMsgs,
                lastMessage,
                dateLastMessage
              })
            }
          })
          this.setState({ conversas, arrayholder: conversas })
        })
      })
  }

  goToChat = item => {
    const { navigation } = this.props
    navigation.navigate("ChatScreen", { item })
  }

  confirmDelete = item => {
    Alert.alert(
      "Apagar",
      "Deseja apagar a conversa?",
      [
        { text: "Sim", onPress: () => this.deleteChat(item) },
        {
          text: "Não",
          style: "cancel"
        }
      ],
      { cancelable: false }
    )
  }

  deleteChat = item => {
    const { conversas } = this.state

    conversas.map(conversa => {
      if (conversa.key === item.key) {
        this.ref
          .collection("conversas")
          .doc(item.key)
          .collection("messages")
          .get()
          .then(snapshot => {
            snapshot.docs.forEach(docs => {
              docs.ref.delete()
            })
          })
        this.ref
          .collection("conversas")
          .doc(item.key)
          .delete()
      }
      return true
    })
  }

  newConversa = () => {
    const { navigation } = this.props
    navigation.navigate("ContactsScreen")
  }

  parseTime = dateNanoScds => {
    const date = dateNanoScds.toDate()
    const atualDate = firebase.database().getServerTime()
    let textDate = ""
    if (atualDate.getDate() - date.getDate() === 0) {
      textDate = getTime(date)
    } else if (atualDate.getDate() - date.getDate() === 1) {
      textDate = "Ontem"
    } else if (atualDate.getDate() - date.getDate() >= 2) {
      textDate = `${date
        .getDate()
        .toString()}/${date
        .getMonth()
        .toString()}/${date.getFullYear().toString()}`
    }
    return textDate
  }

  searchFilterFunction = text => {
    this.setState({ text })
    const { conversas } = this.state
    const newConversas = conversas.filter(item => {
      const contact = `${item.contactName.toUpperCase()}`
      const textData = text.toUpperCase()
      return contact.indexOf(textData) > -1
    })
    this.setState({ arrayholder: newConversas })
  }

  backPressHandler = () => {
    this.setState(prevState => ({
      arrayholder: prevState.conversas,
      isSerchable: false,
      text: ""
    }))
  }

  render() {
    const {
      myName,
      myPicture,
      isSerchable,
      text,
      arrayholder,
      open,
      isModalVisible
    } = this.state
    let toolbar
    if (isSerchable)
      toolbar = (
        <SearchBar
          onChangeText={t => this.searchFilterFunction(t)}
          value={text}
          onBackPressHandler={this.backPressHandler}
        />
      )
    else
      toolbar = (
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Image source={{ uri: myPicture }} style={styles.myPicture} />
            <Text style={styles.conversasInfo}>{myName}</Text>
            <TouchableOpacity
              onPress={() => {
                this.setState({ isSerchable: true })
              }}
            >
              <View style={styles.searchIcon} on>
                <Icon name="search1" color="#00aced" type="antdesign" />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      )
    return (
      <View style={styles.container}>
        {toolbar}
        <CreateGroup
          isVisible={isModalVisible}
          onBackGroundPress={() => this.setState({ isModalVisible: false })}
          onCancelPress={() => this.setState({ isModalVisible: false })}
        />
        <FlatList
          data={arrayholder}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  this.goToChat(item)
                }}
                onLongPress={() => {
                  this.confirmDelete(item)
                }}
              >
                <ListItem
                  style={styles.conversa}
                  subtitle={
                    <View style={styles.containerSub}>
                      <Text style={styles.name}>{item.contactName}</Text>
                      <Text style={styles.lastMsg}>{item.lastMessage}</Text>
                      <View style={styles.rightInformation}>
                        <Text style={styles.data}>
                          {this.parseTime(item.dateLastMessage)}
                        </Text>
                        {item.unreadMsgs && (
                          <LinearGradient
                            colors={["#547BF0", "#6AC3FB"]}
                            style={styles.cont}
                          >
                            <Text style={styles.unread}>
                              {item.numUnreadMsgs}
                            </Text>
                          </LinearGradient>
                        )}
                      </View>
                    </View>
                  }
                  leftAvatar={{
                    source: { uri: item.contactPhoto },
                    size: "medium"
                  }}
                />
              </TouchableOpacity>
            )
          }}
          keyExtractor={i => i.key}
          keyboardShouldPersistTaps="always"
        />
        <Provider>
          <Portal>
            <FAB.Group
              open={open}
              icon={open ? "close" : "add"}
              actions={[
                {
                  icon: "chat",
                  label: "Nova conversa",
                  onPress: () => {
                    this.newConversa()
                  }
                },
                {
                  icon: "group",
                  label: "Novo grupo",
                  onPress: () => this.setState({ isModalVisible: true })
                }
              ]}
              onStateChange={() =>
                this.setState(prevState => ({ open: !prevState.open }))
              }
              fabStyle={styles.fab}
            />
          </Portal>
        </Provider>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    fontFamily: "OpenSans",
    backgroundColor: "#F4F5F8"
  },
  containerSub: {
    position: "absolute",
    width: "100%"
  },
  header: {
    backgroundColor: "#fff",
    elevation: 5,
    marginTop: 0,
    justifyContent: "center",
    alignContent: "center"
  },
  headerContent: {
    justifyContent: "space-between",
    alignContent: "center",
    alignItems: "center",
    marginBottom: 10,
    marginLeft: 20,
    marginTop: 10,
    marginRight: 20,
    flexDirection: "row"
  },
  conversasInfo: {
    fontSize: 18
  },
  searchIcon: {
    justifyContent: "center"
  },
  conversa: {
    width: "100%",
    backgroundColor: "#E8E3E3",
    marginBottom: 1
  },
  fab: {
    backgroundColor: "#007AFF"
  },
  cont: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    marginTop: 5
  },
  data: {
    fontSize: 8
  },
  unread: {
    fontWeight: "bold",
    fontSize: 8,
    alignSelf: "center",
    color: "white"
  },
  rightInformation: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    right: 0,
    top: "50%",
    bottom: "50%"
  },
  lastMsg: {
    marginTop: 10,
    color: "#a9a9a9",
    fontSize: 13
  },
  myPicture: {
    width: 40,
    height: 40,
    borderRadius: 20
  }
})
