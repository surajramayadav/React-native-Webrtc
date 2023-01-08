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
import { useVideoContext } from '../../context/videoContext';

import firestore from '@react-native-firebase/firestore';

export default function VideoCall({ calledEmail, callBy, callid, call }) {
    const videoCall = useVideoContext()

    const startCall = async () => {

        await videoCall.startWebcam()
        await videoCall.startCall(calledEmail, callBy)

    }

    const joinCall = async () => {
        await videoCall.startWebcam()
        await videoCall.joinCall(callid)
    }
    React.useEffect(() => {
        if (call) {
            console.log(callBy, "is calling ", calledEmail)
            startCall()

        } else {
            console.log("reciving call")
            joinCall()
        }
    }, [])


    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView style={styles.body} behavior="position">
                {videoCall.localStream && (
                    <RTCView
                        streamURL={videoCall.localStream?.toURL()}
                        style={styles.stream}
                        objectFit="cover"
                        mirror
                    />
                )}

                {videoCall.remoteStream && (
                    <RTCView
                        streamURL={videoCall.remoteStream?.toURL()}
                        style={styles.stream}
                        objectFit="cover"
                        mirror
                    />
                )}

            </KeyboardAvoidingView>
        </SafeAreaView>

    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "red"
    },
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
