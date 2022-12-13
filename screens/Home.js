import React, { useLayoutEffect, useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { onSnapshot, addDoc, removeDoc, updateDoc } from '../services/collections';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import Colors from '../constants/Colors';

/* 
instance of each item container button. Pass arguments:
- Title of item
- Color of item
- Pressing on item, deleting item, and edit buttons
*/
const ListButton = ({title, color, onPress, onDelete, onOptions}) => {
    return (

        // make item instance pressable: onPress -> transfer control to onPress
        <TouchableOpacity style={[styles.itemContainer, {backgroundColor: color}]} onPress={onPress}>

            <View>
                <Text style={styles.itemTitle}>{title}</Text>
            </View>

            {/* container consisting of delete and options button */}
            <View style={{flexDirection: 'row'}}>

                {/* Edit/options button: onPress -> transfer control to onOptions */}
                <TouchableOpacity onPress={onOptions}>
                    <Ionicons name='options-outline' size={24} color = 'white'/>
                </TouchableOpacity>

                {/* delete button: onPress -> transfer control to onDelete */}
                <TouchableOpacity onPress={onDelete}>
                    <Ionicons name='trash-outline' size={24} color = 'white'/>
                </TouchableOpacity>
            </View>

        </TouchableOpacity>
    ) 
}

// steadily render item instances. Pass list item and navigation arguments
const renderAddListIcon = (navigation, addItemToLists) => {
    return (

        // container consisting of settings and add new item button
        <View style={{flexDirection:'row'}}>

            {/* Settings button */}
            <TouchableOpacity style={{justifyContent:'center', marginRight:4}} onPress={() => 
                navigation.navigate("Settings")}>
                <Ionicons name='settings' size={20}/>
            </TouchableOpacity>

            {/* Add button */}
            <TouchableOpacity onPress={() => 
                navigation.navigate("Edit", {saveChanges: addItemToLists})}
                style={{justifyContent:'center', marginRight:20}}>
                <Text style={styles.icon}>+</Text>
            </TouchableOpacity>
        </View>

        
    )
}

export default ({navigation}) => {

    // list of item instances
    const [lists, setLists] = useState([]);

    // create list refrence collection in firebase for specific user
    const listsRef = firebase.firestore()
    .collection("users")
    .doc(firebase.auth().currentUser.uid)
    .collection("lists");

    // 
    useEffect(() => {
        onSnapshot(listsRef, (newLists) => {
            setLists(newLists);
        }, {    
            sort: (a,b) => {
                if (a.index < b.index) {
                    return -1;
                }

                if(a.index > b.index) {
                    return 1;
                }

                return 0;
            }
        })
    }, [])

    const addItemToLists = ({title, color}) => {
        const index = lists.length > 1 ? lists[lists.length-1].index+1 : 0;
        addDoc(listsRef, {title, color, index});
    }

    const removeItemFromLists = (id) => {
        removeDoc(listsRef, id);
    }

    const updateItemFromLists = (id, item) => {
        updateDoc(listsRef, id, item);
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => renderAddListIcon(navigation, addItemToLists)
        })
    })

    return (
        <View style={styles.container}> 
          <FlatList 
          data = {lists}
          renderItem = {({item: {title, color, id, index}}) => {
              return (
                  <ListButton 
                  title={title} 
                  color={color} 
                  navigation={navigation}

                  onPress={() => {navigation.navigate("ToDoList", {title,color,listID: id})}}

                  onOptions={() => {navigation.navigate("Edit", {
                      title,
                      color, 
                      saveChanges: (newItem) => updateItemFromLists(id, {index, ...newItem}),
                        });
                    }}

                  onDelete={() => removeItemFromLists(id)}
                  />
              );
          }}
          />
        </View>
      )
}

const styles = StyleSheet.create({

    // screen container
    container: {
        flex: 1,
        backgroundColor: Colors.black,
    },

    // item instance title
    itemTitle: { 
        fontSize: 24, 
        padding: 5, 
        color: "white" 
    },

    // list item container button
    itemContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        height: 100,
        flex: 1,
        borderRadius: 5,
        marginHorizontal: 20,
        marginVertical: 10,
        padding: 15,
    },

    // icon for adding an item button
    icon: {
        padding: 2,
        fontSize: 30,
        paddingBottom: 5,
    }
});