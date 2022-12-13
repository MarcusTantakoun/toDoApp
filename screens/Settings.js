import React from 'react';
import { View } from 'react-native';
import Button from '../components/Button';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

// log out screen when user clicks on settings button
export default () => {
    return (
        <View style={{flex:1, backgroundColor:'white'}}>
            <Button 
                text='Log Out'
                // if user clicks log out, API call to firebase signing out
                onPress={() => {firebase.auth().signOut()}}
            />
        </View>
    )
}

