import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import firestore from "@react-native-firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showVideo } from '../components/videoCallModal/videoModal';

export default function Login({ navigation }) {
    const [email, setemail] = useState()
    return (
        <View>
            <Text>Login</Text>
            <TextInput
                value={email}
                onChangeText={(e) => setemail(e)}
                placeholder="Email"
                style={{
                    backgroundColor: 'white',
                }}
            />
            <TouchableOpacity onPress={async () => {
                // showVideo({ visible: true })
                firestore()
                    .collection("user")
                    .add({ email });
                await AsyncStorage.setItem("email", email)
                navigation.navigate('Home', { email: email })
            }}
                style={{ width: "100%", padding: 10, backgroundColor: "black" }}>
                <Text style={{ color: 'white' }}>Login</Text>
            </TouchableOpacity>
        </View>
    )
}