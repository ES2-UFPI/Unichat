import React, { Component } from "react"

import {View,
        Text,
        TextInput,
        Image,
        Picker,
        StyleSheet} from "react-native"
import LinearGradient from "react-native-linear-gradient"
import nouser from  "../../assets/imgs/nouser.png"

export default class PerfilSettings extends Component{
    static navigationoptions = {}
    
    constructor() {
        super()
        this.state = {
            language: ""
        }
      }
      
    render(){
        const {language} = this.state

        return(
            <View style={styles.container}>
                <Text style={styles.Titulo}>Configurações de Perfil</Text>

                <View>
                    <Image source={nouser}  style={styles.imagem}/>
                </View>
                
                <View style={styles.viewtext}>
                    <View>
                        <Text style={styles.labeltext}>
                        Nome:
                        </Text>
                        <TextInput style={styles.entrada}>
                    
                        </TextInput>
                    </View>

                    <View>
                        <Text style={styles.labeltext}>
                            Email:
                        </Text>
                        <TextInput style={styles.entrada}>
                    
                        </TextInput>
                    </View>

                    <View>
                        <Text style={styles.labeltext}>
                        Idiomas:
                        </Text>
                        <View style={styles.languagePicker}>
                        <Picker 
                            
                            selectedValue={language}
                            onValueChange={itemValue =>
                            this.setState({ language: itemValue })}>

                        </Picker>
                        </View>
                    </View>


                  
                </View>
		            

                    <View>
                    <LinearGradient
                        colors={["#547BF0", "#6AC3FB"]}
                        style={styles.button}
                    >
                        <Text style={styles.textButton}>
                            Avançar
                        </Text>
                    </LinearGradient>
                    </View>

                

            </View>






        );
    }
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        alignItems: "center",
        backgroundColor: "white"

    },
    viewtext:{
        justifyContent: "center",
        alignItems: "center",
    },
    imagem:{
        marginTop: 30,
        width: 150,
        height: 150,
        borderRadius: 50,
        borderBottomRightRadius: 50,
        borderBottomLeftRadius: 50,
        borderTopRightRadius: 50,
        borderTopLeftRadius: 50,
        borderColor:"#547BF0"

    },
    Titulo:{
        alignContent: "center",
        fontSize: 20,
        fontWeight: "bold",
        color: "black",
        marginTop: 40
    },
    languagePicker: {
        width: 250,
        borderBottomWidth: 2,
        borderColor: "#6AC3FB"
      },
    button: {
        width: 280,
        height: 0,
        borderRadius: 20,
        justifyContent: "center",
        marginTop: 40,
        color: "#547BF0"
      },
      textButton: {
        alignSelf: "center",
        fontSize: 20,
        color: "white",
      },
      labeltext:{
        fontSize: 16,
        fontWeight: "bold",
        color: "black" 
      },
      entrada: {
          width: 250,
          height: 40,
          marginRight: 40,
          marginTop: 10,
          marginBottom: 10,
          borderBottomWidth: 2,
          textAlign: "center",
          fontSize: 18,
          borderColor: "#6AC3FB"
      }

})
