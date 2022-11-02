import React from 'react';
//import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, FlatList } from 'react-native';
//import { Firestore } from 'firebase/compat/firestore';
//import { initializeApp } from 'firebase/compat/app';
//import firebase from 'firebase/compat/app';
//import "firebase/compat/auth";

const firebase = require('firebase');
require('firebase/firestore');

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      lists: [],
      uid: 0,
      loggedInText: 'Please wait, you are getting logged in',
    };

    const firebaseConfig = {
      apiKey: "AIzaSyBzijO5iafmIJ6iED0JodQt3Fw9ooLsPJM",
      authDomain: "chat-app-1bb9e.firebaseapp.com",
      projectId: "chat-app-1bb9e",
      storageBucket: "chat-app-1bb9e.appspot.com",
      messagingSenderId: "470601175876",
      appId: "1:470601175876:web:affa41aca67d3bf812bd11"
    }

    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
  }

  componentDidMount() {
    this.referenceShoppingLists = firebase.firestore().collection("shoppinglists");

    this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
      if (!user) {
        await firebase.auth().signInAnonymously();
      }
      //update user state with currently active user data
      this.setState({
        uid: user.uid,
        loggedInText: 'Hello there',
      });

      // create a reference to the active user's documents (shopping lists)
      this.referenceShoppinglistUser =
        firebase.firestore().collection('shoppinglists').where('uid', '==', this.state.uid);

      // listen for collection changes for current user
      this.unsubscribeListUser = this.referenceShoppinglistUser.onSnapshot(this.onCollectionUpdate);
    });
  }

  componentWillUnmount() {
    // stop listening to authentication
    this.authUnsubscribe();
    // stop listening for changes
    this.unsubscribeListUser();
  }

  onCollectionUpdate = (querySnapshot) => {
    const lists = [];
    //go through each document
    querySnapshot.forEach((doc) => {
      //get the QueryDocumentSnapshot's data
      var data = doc.data();
      lists.push({
        name: data.name,
        items: data.items.toString(),
      });
    });
    this.setState({
      lists,
    });
  };

  // add a new list to the collection
  addList() {
    this.referenceShoppingLists.add({
      name: 'TestList',
      items: ['eggs', 'pasta', 'veggies'],
      uid: this.state.uid,
    });
  }

  //const app = initializeApp(firebaseConfig);

  render() {
    return (
      <View style={[styles.container, styles.text]} >

        <Text>{this.state.loggedInText}</Text>

        <Text style={styles.text} >All Shopping Lists</Text>
        <FlatList
          data={this.state.lists}
          renderItem={({ item }) =>
            <Text style={styles.item} >{item.name}: {item.items}</Text>}
        />

        <Button onPress={() => {
          this.addList();
        }}
          title='Add something'
        />
      </View >
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 40,
  },
  item: {
    fontSize: 20,
    color: 'blue',
  },
  text: {
    fontSize: 30,
  }
});

export default App;
