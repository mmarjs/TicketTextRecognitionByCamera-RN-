import React, { Component } from 'react';
import { StyleSheet, Dimensions, Text, View } from 'react-native';
import { RNCamera } from 'react-native-camera';
import Spinner from 'react-native-loading-spinner-overlay';

export default class CameraScreen extends Component {
  constructor(props){
    super(props);
    this.state = {
      showLoader: false
    }
    this.toggleLoader = this.toggleLoader.bind(this);
  };
  toggleLoader() {
    this.setState({
      showLoader: !this.state.showLoader
    })
  }
  takePicture = async function() {
    if (this.camera) {
      let self = this;
      this.toggleLoader();
      const options = { quality: 0.5, base64: true };
      const data = await this.camera.takePictureAsync(options)
      this.detectText(data.base64)
      console.log("starting capture jks");
    }
  };

  detectText(base64){
    fetch("https://vision.googleapis.com/v1/images:annotate?key=" + "AIzaSyCZFW6-DZy6NIcM-0z2oWRMU8qy4dcoJk8", {
        method: 'POST',
        body: JSON.stringify({
          "requests": [{
            "image": { "content": base64 },
            "features": [
                { "type": "TEXT_DETECTION" }
            ]}]
      })
    })
    .then(response => {
      this.toggleLoader();
      return response.json()})
    .then(jsonRes => {
      // self.toggleLoader();
      console.log("Success extract text");
      let text = jsonRes.responses[0].fullTextAnnotation.text
      this.props.navigation.navigate('ContactScreen', { text: text })
    }).catch(err => {
      // self.toggleLoader();
      console.log('Error', err)
    })
  }

  render() {
    console.log("in camera render");
    return (
      <View style={styles.container}>
        <Spinner visible={this.state.showLoader}/>
        <RNCamera
          ref={cam => { this.camera = cam }}
          style={styles.preview}
          >
            <Text style={styles.capture} onPress={this.takePicture.bind(this)}> [CAPTURE CARD]</Text>
        </RNCamera>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    color: '#000',
    padding: 10,
    margin: 40
  }
});
