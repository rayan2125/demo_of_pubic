import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View, Permission, Alert } from 'react-native'
import React, { useEffect } from 'react'

import { useState } from 'react'
import notifee, { EventType } from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import { requestUserPermission } from '../message';
import { useNavigation } from '@react-navigation/native';
const Tester = () => {
    const navigation = useNavigation()
    const [opt, setOtp] = useState('0000');
    const newopt = opt.split('').map(Number);
    const refs = newopt.map(() => React.createRef());










    // useEffect(() => {
    //     requestUserPermission()
    //     messaging().getToken(async token => console.log(token))
    //     messaging().setBackgroundMessageHandler(async remoteMessage => {
    //         console.log('Message handled in the background!', remoteMessage);

    //     });
    // }, []);
    useEffect(() => {
        onDisplayNotification()
        onDisplayNotification()
        messaging().getToken().then(token => {
            console.log('FCM Token:', token);
        }).catch(error => {
            console.log('Error getting FCM token:', error);
        });
    
        // return unsubscribe;
      }, []);
    messaging().onNotificationOpenedApp(remoteMessage => {
        console.log('Notification opened in the foreground:', remoteMessage);

    });
    messaging().getInitialNotification()
        .then(remoteMessage => {
            if (remoteMessage) {
                console.log('Initial notification:', remoteMessage);

            }
        });
    messaging().onNotificationOpenedApp(remoteMessage => {
        console.log('Notification opened in the foreground:', remoteMessage);
        const link = remoteMessage.data.link;

    });

    const hndleNotification = () => {
        onDisplayNotification({
            title: `This is Lead Assign by data`, body: `data is  `
        })
    }


    notifee.onBackgroundEvent(async ({ type, detail }) => {


        if (type === EventType.PRESS) {
            navigation.navigate("Setting")
            messaging().getInitialNotification().then(p => console.log("Message handled in the inintial Notifiations!", p))
                .catch(p => console.log("error", p))
            console.log('Notification opened in the background:', detail.notification);

        }
    });
    notifee.onForegroundEvent(({ type, detail }) => {
        if (type === EventType.PRESS) {


            // Handle notification actions here
        }
    });
    messaging().setBackgroundMessageHandler(p => console.log("set back ground handler ", p))





    const handleChange = (text, index) => {
        if (text.length === 1) {
            setOtp((prevOtp) => {
                const updatedOtp = prevOtp.split('');
                updatedOtp[index] = text;
                return updatedOtp.join('');
            });

            // Move focus to the next input
            if (index < newopt.length - 1 && refs[index + 1].current) {
                refs[index + 1].current.focus();
            }
        } else if (text.length === 0) {
            setOtp((prevOtp) => {
                const updatedOtp = prevOtp.split('');
                updatedOtp[index] = ''; // Update the character to an empty string
                return updatedOtp.join('');
            });

            // Move focus to the previous input
            if (index > 0 && refs[index - 1].current) {
                refs[index - 1].current.focus();
            }
        }
    };


    return (
        <View style={{ flex: 1, justifyContent: 'center', }}>
            <Text style={{ textAlign: 'center' }}>Otp</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>

                {newopt.map((item, index) => (
                    <View
                        key={index}
                        style={{
                            alignItems: 'center',
                            borderRadius: 10,
                            height: 40,
                            width: 40,
                            justifyContent: 'center',
                            borderColor: 'black',
                            margin: 10,
                            borderWidth: 1,
                        }}
                    >
                        <TextInput
                            ref={refs[index]}
                            style={{ textAlign: 'center' }}
                            maxLength={1}
                            keyboardType="numeric"
                            value={item.toString()}
                            onChangeText={(text) => handleChange(text, index)}
                        />
                    </View>
                ))}

            </View>
            <View style={{ margin: 10 }}>
                <TouchableOpacity
                    onPress={hndleNotification}
                    style={{
                        backgroundColor: "green",
                        borderRadius: 10,
                        paddingVertical: 10, paddingHorizontal: 10, justifyContent: 'center', alignItems: 'center'
                    }}>
                    <Text style={{ color: 'white' }}>Verify Your Opt</Text>

                </TouchableOpacity>
            </View>

        </View>
    );
};

export default Tester;



const styles = StyleSheet.create({})
export async function onDisplayNotification({ title, body }) {

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