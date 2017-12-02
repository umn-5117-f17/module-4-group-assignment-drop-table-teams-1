import React from 'react';
import { Text, Button, StyleSheet, Image, View, Picker } from 'react-native';
import { ImagePicker } from 'expo';
class CameraDemoScreen extends React.Component {
  state = {
    image_uri: null,
    image_base64: null,
    API_KEY: "dd154ce6f099dcdcf45319997621dc13601acf73",
    vision_req: null,
    english_word: "",
    dst_lang: "",
    translation: "",
    final_uri: null
  };

  // <Button
  //   onPress={() => this.props.navigation.navigate('Translation')}
  //   title="Translate Image"
  //   style={styles.spaced}
  // />

  render() {
    let { image_uri } = this.state;
    let ConditionalRender = null;
    if (image_uri) {
      ConditionalRender = (<View>
                <Image source={{uri: image_uri}} style={{ width: 300, height: 300, marginTop: 20 }} />
                <Text> {this.state.english_word} </Text>
                <Picker
                  selectedValue={this.state.dst_lang}
                  onValueChange={dst_lang => {
                    let base_url = 'https://translation.googleapis.com/language/translate/v2';
                    let google_url = base_url + "?q=" + encodeURI(this.state.english_word) + "&target=" + dst_lang + "&source=en&key=AIzaSyAllxK-KhFvNMtTqkA59tfUkQCGAYNHi5I";
                    fetch(google_url, {
                      method:"POST"})
                      .then(res => res.json())
                      .then(json => {
                        console.log(json.data.translations[0].translatedText);
                        this.setState({translation: json.data.translations[0].translatedText, dst_lang: dst_lang});
                      })
                      .catch(err => {
                        console.log(err);
                      });
                  }}
                  style={{ width: 160 }}
                  mode="dropdown">
                  <Picker.Item label="Chinese-Simplified" value="zh-CN"/>
                  <Picker.Item label="Spanish" value="es"/>
                  <Picker.Item label="Hindi" value="hi"/>
                </Picker>
                <Text> {this.state.translation} </Text>
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
      const vision_uri = "https://vision.googleapis.com/v1/images:label?key=dd154ce6f099dcdcf45319997621dc13601acf73";
      var temp = encodeURIComponent(JSON.stringify(new_req));
      var x = vision_uri + temp;
      fetch("https://vision.googleapis.com/v1/images:annotate?key=AIzaSyC21ZnfUsGG1g5RGNNwWA6-6_tVfXu96sg", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(new_req)
      })
      .then(res => JSON.parse(res._bodyInit))
      .then(body => {
        this.setState({english_word : body.responses[0].labelAnnotations[0].description});
      });
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
