import React, { useEffect, useRef, useState } from 'react'
import {
    RTCPeerConnection,
    RTCIceCandidate,
    RTCSessionDescription,
    RTCView,
    MediaStream,
    mediaDevices,
} from 'react-native-webrtc';
import firestore from '@react-native-firebase/firestore';


export const VideoContext = React.createContext({
    remoteStream: null,
    webcamStarted: false,
    localStream: null,
    channelId: null,
    currentTrack: null,
    pc: null,
    servers: null,
    startWebcam: () => null,
    startCall: () => null,
    joinCall: () => null,


})

export const VideoContextProvider = ({ children }) => {
    const [remoteStream, setRemoteStream] = useState(null);
    const [webcamStarted, setWebcamStarted] = useState(false);
    const [localStream, setLocalStream] = useState(null);
    const [channelId, setChannelId] = useState(null);

    const pc = useRef();

    const servers = {
        iceServers: [
            {
                urls: [
                    'stun:stun1.l.google.com:19302',
                    'stun:stun2.l.google.com:19302',
                ],
            },
        ],
        iceCandidatePoolSize: 10,
    };

    const startWebcam = async () => {

        pc.current = new RTCPeerConnection(servers);
        const local = await mediaDevices.getUserMedia({
            video: true,
            audio: true,
        });
        pc.current.addStream(local);
        setLocalStream(local);
        const remote = new MediaStream();
        setRemoteStream(remote);

        // Push tracks from local stream to peer connection
        local.getTracks().forEach(track => {
            console.log("local stream", pc.current.getLocalStreams());
            pc.current.getLocalStreams()[0].addTrack(track);
        });

        // Pull tracks from remote stream, add to video stream
        pc.current.ontrack = event => {
            event.streams[0].getTracks().forEach(track => {
                console.log("remote stream");
                remote.addTrack(track);
            });
        };

        pc.current.onaddstream = event => {
            setRemoteStream(event.stream);
        };

        setWebcamStarted(true);
    };


    const startCall = async (calledEmail, callBy) => {

        const channelDoc = firestore().collection('channels').doc();
        const offerCandidates = channelDoc.collection('offerCandidates');
        const answerCandidates = channelDoc.collection('answerCandidates');

        setChannelId(channelDoc.id);
        console.log("context ChannelId: " + channelDoc.id, calledEmail, callBy);

        firestore()
            .collection("call")
            .add({ calledEmail, callBy, channelId: channelDoc.id });

        pc.current.onicecandidate = async event => {
            if (event.candidate) {
                await offerCandidates.add(event.candidate.toJSON());
            }
        };

        //create offer
        const offerDescription = await pc.current.createOffer();
        await pc.current.setLocalDescription(offerDescription);

        const offer = {
            sdp: offerDescription.sdp,
            type: offerDescription.type,
        };

        await channelDoc.set({ offer });

        // Listen for remote answer
        channelDoc.onSnapshot(snapshot => {
            const data = snapshot.data();
            if (!pc.current.currentRemoteDescription && data?.answer) {
                const answerDescription = new RTCSessionDescription(data.answer);
                pc.current.setRemoteDescription(answerDescription);
            }
        });

        // When answered, add candidate to peer connection
        answerCandidates.onSnapshot(snapshot => {
            snapshot.docChanges().forEach(change => {
                if (change.type === 'added') {
                    const data = change.doc.data();
                    pc.current.addIceCandidate(new RTCIceCandidate(data));
                }
            });
        });


    }



    const joinCall = async (channelId) => {

        const channelDoc = firestore().collection('channels').doc(channelId);
        const offerCandidates = channelDoc.collection('offerCandidates');
        const answerCandidates = channelDoc.collection('answerCandidates');

        pc.current.onicecandidate = async event => {
            if (event.candidate) {
                await answerCandidates.add(event.candidate.toJSON());
            }
        };

        const channelDocument = await channelDoc.get();
        const channelData = channelDocument.data();

        const offerDescription = channelData.offer;

        await pc.current.setRemoteDescription(
            new RTCSessionDescription(offerDescription),
        );

        const answerDescription = await pc.current.createAnswer();
        await pc.current.setLocalDescription(answerDescription);

        const answer = {
            type: answerDescription.type,
            sdp: answerDescription.sdp,
        };

        await channelDoc.update({ answer });

        offerCandidates.onSnapshot(snapshot => {
            snapshot.docChanges().forEach(change => {
                if (change.type === 'added') {
                    const data = change.doc.data();
                    pc.current.addIceCandidate(new RTCIceCandidate(data));
                }
            });
        });
    };



    const value = {
        remoteStream,
        webcamStarted,
        localStream,
        channelId,
        pc,
        servers,
        startWebcam,
        startCall,
        joinCall

    }




    return (
        <VideoContext.Provider value={value}>
            {children}
        </VideoContext.Provider>
    )
}

export const useVideoContext = () => React.useContext(VideoContext)