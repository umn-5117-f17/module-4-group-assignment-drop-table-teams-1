import React from 'react';
import { Button, StyleSheet, Image, View } from 'react-native';
import { ImagePicker } from 'expo';

class CameraDemoScreen extends React.Component {
  state = {
    image: null,
  };

  render() {
    let { image } = this.state;
    let ConditionalRender = null;
    if (image) {
      ConditionalRender = (<View>
                <Image source={{ uri: image }} style={{ width: 300, height: 300, marginTop: 20 }} />
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
    });

    console.log(result);

    if (!result.cancelled) {
      this.setState({ image: result.uri });
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
