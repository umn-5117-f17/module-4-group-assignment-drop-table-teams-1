import React from 'react';
import { Button, StyleSheet, Image, View } from 'react-native';
import { ImagePicker } from 'expo';
import vision from "react-cloud-vision-api";


class CameraDemoScreen extends React.Component {
  state = {
    image_uri: null,
    image_base64: null,
    API_KEY: "dd154ce6f099dcdcf45319997621dc13601acf73",
    vision_req: null,

    english_word: "hi"
  };

  render() {
    let { image } = this.state;
    let ConditionalRender = null;
    if (image) {
      ConditionalRender = (<View>
                <Image source={{ uri: image }} style={{ width: 300, height: 300, marginTop: 20 }} />
                <Text> this.state.english_word </Text>
                <Button
                  onPress={() => this.props.navigation.navigate('Translation')}
                  title="Translate Image"
                  style={styles.spaced}
                />
                </View>);
    } else {
    ConditionalRender = (<View>
            <Button
              title="Take a picture"
              onPress={this._pickImage}
            />
          </View>);
        }
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        {ConditionalRender}
      </View>
    );
  }

  _pickImage = async () => {
    let result = await ImagePicker.launchCameraAsync({

      allowsEditing: true,
      aspect: [4, 3],
      base64:true
    });

    console.log(result);

    if (!result.cancelled) {
      this.setState({ image_base64: result.base64 });
      this.setState({image_uri: result.uri});

vision.init({auth: this.state.API_KEY})
const req = new vision.Request({
  image: new vision.Image({
    base64: this.state.image_base64,
  }),
  features: [
    new vision.Feature('LABEL_DETECTION', 10)
  ]
})

this.setState(vision_req: req);

      // this is where we call google api
    }
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 40,
  },
  spaced: {
    marginTop: 20,
  }
});

export default CameraDemoScreen;
