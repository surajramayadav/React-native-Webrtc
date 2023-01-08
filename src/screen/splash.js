import { View, Text } from 'react-native'
import React, { useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from "@react-native-firebase/firestore";
import { useVideoContext } from '../context/videoContext';
import { showVideo } from '../components/videoCallModal/videoModal';
export default function Splash({ navigation }) {

    const [email, setemail] = useState("")
    const videoCall = useVideoContext()
    React.useEffect(() => {
        AsyncStorage.getItem("email").then((value) => {
            console.log(value)
            firestore().collection("call").where("calledEmail", "==", value).onSnapshot((querySnap) => {
                const allmsg = querySnap.docs.map(async (docSanp) => {
                    const data = docSanp.data();
                    console.log("calling data firbase", data)
                    showVideo({ visible: true, callid: data.channelId, call: false })
                });
            })
        })


    }, [])

    React.useEffect(() => {
        setTimeout(async () => {
            if (await AsyncStorage.getItem("email")) {
                navigation.replace("Home")
            }
            navigation.replace("Login")
        }, 3000);
    }, [])

    return (
        <View>
            <Text>Splash</Text>
        </View>
    )
}