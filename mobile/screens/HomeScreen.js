import React from 'react';
import {
  Button,
  StyleSheet,
  Text,
  View,
} from 'react-native';

// example of using an expo Component
// https://docs.expo.io/versions/latest/sdk/keep-awake.html
import { KeepAwake } from 'expo';


class HomeScreen extends React.Component {

  render() {
    // console.log('HomeScreen props!', this.props)

    return (
      <View style={styles.container}>

        <View style={styles.spaced}>
          <Button
            onPress={() => this.props.navigation.navigate('CameraDemo')}
            title="Camera"
            style={styles.spaced}
          />
        </View>

        <Text style={styles.spaced}>(staying awake)</Text>
        <KeepAwake />
      </View>
    )
  }

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

export default HomeScreen;
