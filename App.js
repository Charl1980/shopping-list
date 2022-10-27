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
    this.unsubcribe = this.referenceShoppingLists.onSnapshot(this.onCollectionUpdate)
  }

  componentWillUnmount() {
    this.unsubcribe();
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

  //const app = initializeApp(firebaseConfig);

  render() {
    return (
      <View style={[styles.container, styles.text]} >
        <FlatList
          data={this.state.lists}
          renderItem={({ item }) =>
            <Text style={styles.item} >{item.name}: {item.items}</Text>}
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
