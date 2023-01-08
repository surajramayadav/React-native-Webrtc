import React, { useEffect, useRef } from 'react';

import {
    Button,
    KeyboardAvoidingView,
    SafeAreaView,
    StyleSheet,
    TextInput,
    View,
} from 'react-native';

import {
    RTCPeerConnection,
    RTCIceCandidate,
    RTCSessionDescription,
    RTCView,
    MediaStream,
    mediaDevices,
} from 'react-native-webrtc';
import { useState } from 'react';

import firestore from '@react-native-firebase/firestore';
import { useVideoContext } from '../context/videoContext';
import { showVideo } from '../components/videoCallModal/videoModal';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Home = ({ navigation, route }) => {

    const [calledEmail, setcalledEmail] = useState()
    const videoCall = useVideoContext()

    const handleCall = async () => {
        const callBy = await AsyncStorage.getItem("email")
        showVideo({ visible: true, calledEmail, callBy, call: true })
    }


    return (
        <SafeAreaView>

            <View style={{ flexDirection: 'row' }}>

                <TextInput
                    value={calledEmail}
                    placeholder="callId"
                    minLength={45}
                    style={{ borderWidth: 1, padding: 5 }}
                    onChangeText={newText => setcalledEmail(newText)}
                />
                <Button title="Call" onPress={handleCall} />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    body: {
        backgroundColor: '#fff',

        justifyContent: 'center',
        alignItems: 'center',
        ...StyleSheet.absoluteFill,
    },
    stream: {
        flex: 2,
        width: 200,
        height: 200,
    },
    buttons: {
        alignItems: 'flex-start',
        flexDirection: 'column',
    },
});

export default Home;
