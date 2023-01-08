import React, { Component } from "react";

import { StyleSheet, Text, TouchableOpacity, Modal, View } from "react-native";
import VideoManger from './videoModalManager'
import VideoCall from "./videoCall";


export function showVideo(...args) {
    const ref = VideoManger.getDefault();
    if (!!ref) {
        ref.showVideo(...args);
        console.log("first", args)
    }
}

export function closeVideo() {
    const ref = VideoManger.getDefault();
    if (!!ref) {
        ref.closeVideo();
    }
}




export default class VideoModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            visible: false,
            modalHide: () => { },
            calledEmail: "",
            callBy: "",
            callid: null,
            call: false

        };
    }

    componentDidMount() {
        VideoManger.register(this);

    }
    componentWillUnmount() {
        VideoManger.unregister(this);

    }

    showVideo = ({ visible, modalHide, calledEmail, callBy, callid, call } = {}) => {
        this.setState({
            visible, modalHide, calledEmail, callBy, callid, call
        }, () => this.setState({ visible: true }));
    }

    closeVideo = () => {
        this.setState({ visible: false })
    }

    render() {
        const { visible, modalHide, calledEmail, callBy, callid, call } = this.state
        console.log(calledEmail, callBy, callid, call)
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={visible}
                onRequestClose={() => this.closeVideo()}

            >
                {/* <View style={styles.container}>
                    <View style={styles.halfScreen1}><Text>Hii</Text></View>
                    <View style={[styles.halfScreen2, styles.halfBg]}><Text>Hii</Text></View>
                </View> */}
                <VideoCall callBy={callBy} calledEmail={calledEmail} callid={callid} call={call} />

            </Modal>

        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "black",
        flexDirection: 'column'
    },
    halfScreen1: {
        flex: 0.6
    },
    halfScreen2: {
        flex: 0.4
    },
    halfBg: {
        backgroundColor: "black",
        borderTopRightRadius: 50,
        borderTopLeftRadius: 50
    }
})