import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './screens/Home';
import ToDoList from './screens/ToDoList';
import EditList from './screens/EditList';
import Colors from './constants/Colors';
import Login from './screens/Login';
import Settings from './screens/Settings';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

// declare stack navigator containers
const Stack = createStackNavigator();
const AuthStack = createStackNavigator();

// authentication screen stack
const AuthScreens = () => {
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen name='Login' component={Login}/>
    </AuthStack.Navigator>
  )
}

/* 
Main screen stack (post-authentication). There are 4 stack screens: Home, Settings,
ToDoList, and EditList. By default, screen stack starts with Home screen. 
*/
const Screens = () => {
  return (
    // initialize stack navigator container
    <Stack.Navigator>

        {/* Home screen stack */}
        <Stack.Screen 
        name="Home" 
        component={Home}
        options={{
          title: "Your To Do\'s",
          headerStyle: {
            backgroundColor: '#ff9900ff',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
        />

        {/* Settings screen stack */}
        <Stack.Screen name='Settings' component={Settings}/> 

        {/* ToDoList screen stack */}
        <Stack.Screen 
        name='ToDoList' 
        component={ToDoList}

        /* Route to specific ToDoList screen */
        options={({route}) => {
          return ({
            title: route.params.title,
            headerStyle: {
              backgroundColor: route.params.color,
            },
            headerTintColor: 'white'
          }) 
        }}
        />

        {/* Edit/add screen stack */}
        <Stack.Screen 
          name="Edit"
          component={EditList}

          /* Route to specific ToDoList edit screen */
          options={({route}) => {
            return ({

              /* Check if there is a title */
              title: route.params.title ? `Edit ${route.params.title}` : 'Create new list',
              headerStyle: {
                backgroundColor: route.params.color || Colors.blue,
              },
              headerTintColor: 'white'
            })
        }}
        />
      </Stack.Navigator>
  )
}

export default function App() {

  // set authentication state
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {

    // if user is logged in, set authentication true
    if (firebase.auth().currentUser) {
      setIsAuth(true)
    }

    // steadily checks user auth state
    firebase.auth().onAuthStateChanged(user => {
      console.log('Checking with auth state...')

      if (user) {
        setIsAuth(true);
      } else {
        setIsAuth(false);
      }

    })

  }, [])

  return (

    // render screen toggle between authentication and logged in screen
    <NavigationContainer>
      {isAuth ? <Screens/> : <AuthScreens/>} 
    </NavigationContainer>
  );
}

// Firebase configuration -- API call to firebase
const firebaseConfig = {
  apiKey: "AIzaSyCpeSx8q4GVnUSOk66lg24sUj5xaUymje4",
  authDomain: "firetodoapp-d5a60.firebaseapp.com",
  projectId: "firetodoapp-d5a60",
  storageBucket: "firetodoapp-d5a60.appspot.com",
  messagingSenderId: "300859667489",
  appId: "1:300859667489:web:e5bd3696f3c1ce0b1c5f60",
  measurementId: "G-63BNSG1Q2B"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
