import messaging from '@react-native-firebase/messaging';
import { useNavigation } from '@react-navigation/native';

import { Alert } from 'react-native';

export const requestUserPermission = async () => {

    const authStatus = await messaging().requestPermission();
 
    const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  
    if (enabled) {
        // useNavigation.navigate("Setting")/
        await messaging().onNotificationOpenedApp((p) => {
            console.log("p is checing ", p)
        });
        await messaging().setBackgroundMessageHandler(remoteMessage => {
            console.log('Message handled in the background!', remoteMessage);
        });
    
    }
}

export  async function onDisplayNotification({title,body}) {
    // Request permissions (required for iOS)
    await notifee.requestPermission()
  
    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
    });
  
    // Display a notification
    await notifee.displayNotification({
      title,
      body,
      android: {
        channelId,
       
      },
    });
      
  }