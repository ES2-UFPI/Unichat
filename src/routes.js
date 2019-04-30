import { createAppContainer, createStackNavigator } from "react-navigation"

import PerfilSettings from "~/Screens/PerfilSettings/perfilsettings"
import Auth from "~/Screens/Auth/auth"
import Verification from "~/Screens/Verification/verification"
import Chat from "~/Screens/Chat/chat"

const appStackNavigator = createStackNavigator(
  {
    PerfilSettings:{
      screen: PerfilSettings,
      navigationOptions: {
        header: null
      }
    }, 
    AuthScreen: {
      screen: Auth,
      navigationOptions: {
        header: null
      }
    },
    VerificationScreen: {
      screen: Verification,
      navigationOptions: {
        header: null
      }
    },
    ChatScreen: {
      screen: Chat,
      navigationOptions: {
        header: null
      }
    }
  },
  {
    initialRouteName: "PerfilSettings"
  },
  { header: null }
)

const Routes = createAppContainer(appStackNavigator)

export default Routes
