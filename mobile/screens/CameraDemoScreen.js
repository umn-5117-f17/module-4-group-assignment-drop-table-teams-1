import React from 'react';
import { Text, Button, StyleSheet, Image, View, Picker } from 'react-native';
import { ImagePicker, Constants, Speech  } from 'expo';
class CameraDemoScreen extends React.Component {
  state = {
    image_uri: null,
    image_base64: null,
    API_KEY: "dd154ce6f099dcdcf45319997621dc13601acf73",
    vision_req: null,
    english_word: "",
    dst_lang: "",
    translation: "",
    final_uri: null,
    inProgress: false,
  };

  render() {
    let { image_uri } = this.state;
    let ConditionalRender = null;
    if (image_uri) {
      ConditionalRender = (<View>
                <Image source={{uri: image_uri}} style={{ width: 300, height: 300, marginTop: 20 }} />
                <Text> {this.state.english_word} </Text>
                <Picker
                  selectedValue={this.state.dst_lang}
                  onValueChange={language=> {
                    let base_url = 'https://translation.googleapis.com/language/translate/v2';
                    let google_url = base_url + "?q=" + encodeURI(this.state.english_word) + "&target=" + language + "&source=en&key=AIzaSyAllxK-KhFvNMtTqkA59tfUkQCGAYNHi5I";
                    fetch(google_url, {
                      method:"POST"})
                      .then(res => res.json())
                      .then(json=> {
                        this.setState({translation: json.data.translations[0].translatedText, dst_lang: language});
                      })
                      .catch(err => {
                        console.log(err);
                      });
                  }}
                  style={{flex: 1}}
                  mode="dropdown">
                  <Picker.Item label="Choose A Language" value=""/>
                  <Picker.Item label="Chinese" value="zh-CN"/>
                  <Picker.Item label="Spanish" value="es"/>
                  <Picker.Item label="Hindi" value="hi"/>
                </Picker>
                <Text> {this.state.translation} </Text>
                <Button
                  disabled={this.state.inProgress}
                  onPress={this._speak}
                  title="Speak"
                />
                <Button
                  onPress={this._postNote}
                  title="Save"
                />
                </View>);
    } else {
    ConditionalRender = (<View>
            <Button
              title="Take a picture"
              onPress={this._pickImage}
            />
            <Button
              title="Choose Image"
              onPress={this._chooseImage}
            />
          </View>);
        }
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        {ConditionalRender}
      </View>
    );
  }

  _postNote = () => {
    console.log("post client side");
    console.log(this.state.english_word);
    var x = this.state.english_word;

    fetch('https://lit-chamber-54037.herokuapp.com/api/db/newNote', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          photo: this.state.image_base64,
          english: x,
          translated: this.state.translation
        })
      }) .then(
        this.props.navigation.navigate('CameraDemo')
      ).catch(function(error) {
    console.log('There has been a problem with your fetch operation: ' + error.message);
    });
  }

  _speak = () => {
    const start = () => {
      this.setState({ inProgress: true });
    };

    const complete = () => {
      this.state.inProgress && this.setState({ inProgress: false });
    };

    Speech.speak(this.state.translation, {
      language: this.state.dst_lang,
      pitch: 1,
      rate: 0.75,
      onStart: start,
      onDone: complete,
      onStopped: complete,
      onError: (err => { console.log(err)}),
    });
  };

  _pickImage = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      base64:true
    });
    if (!result.cancelled) {
      this.setState({ image_base64: result.base64 });
      this.setState({image_uri: result.uri});
      const new_req = {
        "requests": [{
          "image": {
            "content": this.state.image_base64 },
            "features": [{
                "type": "LABEL_DETECTION",
                "maxResults": 5
            }]
        }]
      };
      // const vision_uri = "https://vision.googleapis.com/v1/images:label?key=dd154ce6f099dcdcf45319997621dc13601acf73";
      // var temp = encodeURIComponent(JSON.stringify(new_req));
      // var x = vision_uri + temp;
      fetch("https://vision.googleapis.com/v1/images:annotate?key=AIzaSyC21ZnfUsGG1g5RGNNwWA6-6_tVfXu96sg", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(new_req)
      })
      .then(res =>
        JSON.parse(res._bodyInit))
      .then(body => {
        this.setState({english_word : body.responses[0].labelAnnotations[0].description});
      });
    }
  };


_chooseImage = async () => {
  let result = await ImagePicker.launchImageLibraryAsync({
    allowsEditing: true,
    aspect: [4, 3],
    base64:true
  });
  if (!result.cancelled) {
    this.setState({ image_base64: result.base64 });
    this.setState({image_uri: result.uri});
    const new_req = {
      "requests": [{
        "image": {
          "content": this.state.image_base64 },
          "features": [{
              "type": "LABEL_DETECTION",
              "maxResults": 5
          }]
      }]
    };
    // const vision_uri = "https://vision.googleapis.com/v1/images:label?key=dd154ce6f099dcdcf45319997621dc13601acf73";
    // var temp = encodeURIComponent(JSON.stringify(new_req));
    // var x = vision_uri + temp;
    fetch("https://vision.googleapis.com/v1/images:annotate?key=AIzaSyC21ZnfUsGG1g5RGNNwWA6-6_tVfXu96sg", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(new_req)
    })
    .then(res =>
      JSON.parse(res._bodyInit))
    .then(body => {
      this.setState({english_word : body.responses[0].labelAnnotations[0].description});
    });
  }
};
} // close class

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
  },
  Text : {
    flex: 1
  }
});

export default CameraDemoScreen;
