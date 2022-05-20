import React from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Button,
  Alert,
  TextInput,
} from "react-native";
import { useState, useEffect, useCallback } from "react";
//using db reference
import { db, Auth } from "./firebase/firebase-config";
import {
  doc,
  addDoc,
  setDoc,
  collection,
  onSnapshot,
  query,
  orderBy,
  where,
} from "firebase/firestore";
import { signInAnonymously, onAuthStateChanged, signOut } from "firebase/auth";

export default function App() {
  const [list, setList] = useState([]);
  const [loggedUser, setLoggedUser] = useState([]);

  const anonLogin = async () => {
    try {
      //When a signed-out user uses an app feature that requires authentication with Firebase,
      //sign in the user anonymously
      const user = await signInAnonymously(Auth, loggedUser);
      console.log(user);
    } catch (e) {
      console.log(e.message);
    }
  };

  onAuthStateChanged(Auth, (currentUser) => {
    setLoggedUser(currentUser);
  });

  const myReference = collection(db, "ShoppingList");
  // Create a query against the collection.
  //const q = query(myReference, where("uid", "==", user));

  useEffect(() => {
    let isMounted = true;
    // onSnapshot returns an unsubscriber, listening for updates to the messages collection
    //if user is logged in and their collection is empty (default, users are anonymous and can't log back in)
    if (loggedUser) {
      // const q = query(myReference, where("uid", "==", loggedUser.uid));
      const unsubscribeListUser = onSnapshot(myReference, onCollectionUpdate);
      return () => {
        //unsubscribe to onSnapshot and auth
        isMounted = false;
        unsubscribeListUser();
      };
      //if user is logged out and main collection is empty (collection q will be empty, main collection could have docs)
    } else if (!loggedUser && !myReference) {
      Alert.alert("not logged in and no docs");
      console.log("not logged in or no documents");
      return () => {
        //unsubscribe to onSnapshot and auth
        isMounted = false;
      };
      //if no user is signed in but there is a main collection
    } else if (!loggedUser && myReference) {
      const unsubscribeList = onSnapshot(myReference, onCollectionUpdate);
      Alert.alert("not logged in and no docs");
      console.log("not logged in or no documents");
      return () => {
        //unsubscribe to onSnapshot and auth
        isMounted = false;
        unsubscribeList();
      };
    }
  }, []);

  const logOut = async () => {
    await signOut(Auth);
  };

  onCollectionUpdate = (snap) => {
    //setting the list
    setList(
      snap.docs.map((doc) => ({
        items: doc.data().items,
        name: doc.data().name,
      }))
    );
  };

  ///need something to fix where the documents are beign added, and if no user is signed in then i want to only display documents that have no id
  const addItem = () => {
    addDoc(myReference, {
      name: "TestList",
      items: ["eggs", "onion", "veggies"],
      uid: loggedUser.uid,
    })
      .then(() => {
        console.log("Doc created");
      })
      .catch((e) => console.log(e.message));
  };

  return (
    <View style={styles.container}>
      <Button title="create new doc" onPress={addItem}></Button>
      {!loggedUser && <Button title="login" onPress={anonLogin}></Button>}
      {loggedUser && <Button title="logout" onPress={logOut}></Button>}

      {loggedUser && <Text>User logged in {loggedUser.uid}</Text>}

      <Text>Hello</Text>
      {loggedUser && (
        <FlatList
          data={list}
          renderItem={({ item }) => (
            <Text style={styles.text}>
              {item.name}: {item.items}
            </Text>
          )}
        />
      )}
      {!loggedUser && (
        <Text>No collections here, login to start adding some </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingTop: 40,
  },
  item: {
    fontSize: 20,
    color: "blue",
  },
  text: {
    fontSize: 30,
  },
});
