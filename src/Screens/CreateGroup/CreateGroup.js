import React from "react"

import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert
} from "react-native"
import { Avatar, Overlay } from "react-native-elements"
import ImagePicker from "react-native-image-picker"

export default class CreateGroup extends React.Component {
  state = {
    text: "",
    img: null
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
        if (response.fileSize <= 600000) {
          this.setState({ img: response })
        } else {
          Alert.alert(
            "Erro",
            "Selecione uma foto com tamanho inferior a 600 kB"
          )
        }
      }
    })
  }

  render() {
    const { text, img } = this.state
    const {
      isVisible,
      onBackGroundPress,
      onCancelPress,
      navigation
    } = this.props
    return (
      <Overlay
        isVisible={isVisible}
        width="auto"
        height="auto"
        containerStyle={styles.container}
        onBackdropPress={onBackGroundPress}
      >
        <>
          <View style={styles.groupInfo}>
            <Avatar
              onPress={this.handleChooseImage}
              containerStyle={styles.avatar}
              rounded
              icon={img === null ? { name: "photo-camera" } : null}
              source={
                img !== null
                  ? {
                      uri: img.uri
                    }
                  : null
              }
              activeOpacity={0.7}
              size="large"
            />
            <View style={styles.groupName}>
              <Text style={styles.label}>Nome do grupo</Text>
              <TextInput
                style={styles.input}
                value={text}
                onChangeText={value => this.setState({ text: value })}
                underlineColorAndroid="#007AFF"
              />
            </View>
          </View>
          <View style={styles.buttons}>
            <TouchableOpacity onPress={onCancelPress}>
              <Text style={styles.button}>CANCELAR</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("SelectContacts", { img, text })
              }
            >
              <Text style={styles.button}>PRÓXIMO</Text>
            </TouchableOpacity>
          </View>
        </>
      </Overlay>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  groupInfo: {
    marginTop: 20,
    marginLeft: 10,
    flexDirection: "row"
  },
  avatar: {
    borderWidth: 2,
    borderColor: "#007AFF"
  },
  groupName: {
    width: "70%",
    marginLeft: 10
  },
  label: {
    color: "#007AFF"
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 10
  },
  button: {
    color: "#007AFF",
    marginLeft: 10
  }
})
