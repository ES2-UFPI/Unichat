import React, { Component } from "react"

import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  Picker,
  StyleSheet,
  Dimensions,
  BackHandler,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native"
import { Icon } from "react-native-elements"
import firebase from "react-native-firebase"
import shortid from "shortid"
import LinearGradient from "react-native-linear-gradient"
import ImagePicker from "react-native-image-picker"
import languagelist from "../../assets/languages/languages"
import placeHolder from "../../assets/place_holder/placeHolder"

export default class PerfilSettings extends Component {
  constructor() {
    super()
    this.state = {
      language: [],
      code: "",
      img: placeHolder[0],
      userName: "",
      eMail: "",
      profileImageUrl: "",
      disabled: true,
      uploading: false,
    }
  }

  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.handleBackPress)
    this.setState({ language: languagelist })
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.handleBackPress)
  }

  handleBackPress = () => {
    return true
  }

  confirmPerfilSettings = () => {
    const { navigation } = this.props
    const user = firebase.auth().currentUser
    const { userName, eMail, code, profileImageUrl } = this.state
    firebase
      .firestore()
      .collection("users")
      .doc(user.uid)
      .set({
        phone: user.phoneNumber,
        username: userName,
        email: eMail,
        language_code: code,
        profile_img_url: profileImageUrl
      })
    navigation.navigate("Conversas")
  }

  uploadphotos = () => {
    const user = firebase.auth().currentUser
    const { img } = this.state
    this.setState({uploading: true})

    firebase
      .storage()
      .ref(`profile_pics/${user.uid}`)
      .putFile(img.path)
      .on(firebase.storage.TaskEvent.STATE_CHANGED, snapshot => {
        let state = {}
        state = {
          ...state,
        }
        if (snapshot.state === firebase.storage.TaskState.SUCCESS) {
          state = {
            disabled: false,
            uploading: false,
            profileImageUrl: snapshot.downloadURL
          }
        }

          this.setState(state)
        })
  }

  handleChooseImage = () => {
    const options = {
      noData: true,
      title: "Escolha uma foto",
      cancelButtonTitle: "Sair",
      takePhotoButtonTitle: "Tirar uma foto",
      chooseFromLibraryButtonTitle: "Escolha uma foto da galeria"
    }

    ImagePicker.showImagePicker(options, response => {
      if (response.uri) {
        this.setState({ img: response })
        this.uploadphotos()
      }
    })
  }

  previewImage = () => {
    const { navigation } = this.props
    const { img } = this.state
    navigation.navigate("PreviewImage", { img })
  }

  render() {
    const { language, code, img, disabled, uploading } = this.state

    return (
      <KeyboardAvoidingView style={styles.container} behavior="position">
        <Text style={styles.Titulo}>Configurações de Perfil</Text>
        <View style={styles.image}>
          <TouchableOpacity
            onPress={() => {
              this.previewImage()
            }}
          >
            {img && (
              <Image
                source={{ uri: img.uri }}
                style={styles.imagePlaceHolder}
                blurRadius={uploading ? 5 : 0}
              />
            )}
            {uploading && (
              <ActivityIndicator size={64} color="#6AC3FB" style={styles.loadingIcon} />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.roundbutton}
            onPress={this.handleChooseImage}
          >
            <Icon name="create" />
          </TouchableOpacity>
        </View>
        <Text style={styles.labeltext}>Nome:</Text>
        <TextInput
          style={styles.entrada}
          onChangeText={text => this.setState({ userName: text })}
          placeholder="Digite seu nome"
        />
        <Text style={styles.labeltext}>Email:</Text>
        <TextInput
          style={styles.entrada}
          onChangeText={text => this.setState({ eMail: text })}
          placeholder="Digite seu e-mail"
        />
        <Text style={styles.labeltext}>Idiomas:</Text>
        <View style={styles.languagePicker}>
          <Picker
            selectedValue={code}
            onValueChange={itemValue => this.setState({ code: itemValue })}
          >
            <Picker.Item label="Escolha seu idioma" value="" />
            {language.map(item => (
              <Picker.Item
                label={`${item.name}`}
                value={item.code}
                key={shortid.generate()}
              />
            ))}
          </Picker>
        </View>
        <TouchableOpacity 
          onPress={this.confirmPerfilSettings}
          disabled={disabled}>
          <LinearGradient 
            colors={disabled ? ["#9b9fa5", "#9b9fa5"] : ["#547BF0", "#6AC3FB"]} 
            style={styles.buttonEnable}>
            <Text style={styles.textButton}>Cadastrar</Text>
          </LinearGradient>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    )
  }
}

const screenWidth = Dimensions.get("window").width

const styles = StyleSheet.create({
  container: {
    flex: 1,
    fontFamily: "OpenSans"
  },
  Titulo: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
    alignSelf: "center",
    marginTop: 10
  },
  image: {
    justifyContent: "center",
    alignItems: "center",
    width: (screenWidth - 50) / 2,
    height: (screenWidth - 50) / 2,
    marginTop: 10,
    borderRadius: (screenWidth - 50) / 4,
    borderColor: "#6AC3FB",
    borderWidth: 2,
    alignSelf: "center"
  },
  imagePlaceHolder: {
    width: (screenWidth - 54) / 2,
    height: (screenWidth - 54) / 2,
    borderRadius: (screenWidth - 54) / 4
  },
  roundbutton: {
    borderWidth: 1,
    borderColor: "#6AC3FB",
    justifyContent: "center",
    height: 40,
    backgroundColor: "#6AC3FB",
    borderRadius: 20,
    width: 40,
    position: "absolute",
    right: 0,
    bottom: 0
  },
  languagePicker: {
    marginTop: 5,
    borderBottomWidth: 2,
    borderColor: "#6AC3FB",
    marginLeft: 40,
    marginRight: 40
  },
  buttonEnable: {
    borderRadius: 20,
    justifyContent: "center",
    height: 60,
    marginTop: 40,
    marginLeft: 40,
    marginRight: 40
  },
  textButton: {
    alignSelf: "center",
    fontSize: 20,
    color: "white"
  },
  labeltext: {
    marginTop: 20,
    fontWeight: "bold",
    color: "black",
    marginLeft: 40,
    marginRight: 40
  },
  entrada: {
    borderBottomWidth: 2,
    borderColor: "#6AC3FB",
    marginLeft: 40,
    marginRight: 40
  },
  loadingIcon: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center"
  }
})
