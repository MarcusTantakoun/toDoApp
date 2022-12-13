import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Colors from '../constants/Colors';
import Button from '../components/Button';
import LabeledInput from '../components/LabeledInput';
import validator from 'validator';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

// function to validate email and password text inputs from user
const validateFields = (email, password) => {
    const isValid = {
        email: validator.isEmail(email),
        password: validator.isStrongPassword(password, {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1
        })
    };
    return isValid
};

// function to create an account - pass email and password arguments
const createAccount = (email, password) => {

    // call create account function to firebase
    firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(({user}) => {
        console.log("Creating user...");

        // add user to 'user' collection
        firebase.firestore().collection("users").doc(user.uid).set({});
    });
}

// function to login account - pass email and password arguments
const login = (email, password) => {

    // call sign in function to firebase
    firebase.auth().signInWithEmailAndPassword(email, password)
    .then(() => {
        console.log("Logged in!")
    })
}

export default () => {

    // useState for setting create account mode
    const [isCreateMode, setCreateMode] = useState(false);

    // useState for setting email
    const [emailField, setEmailField] = useState({text:'', errorMessage:''});

    // useState for setting password
    const [passwordField, setPasswordField] = useState({text:'', errorMessage:''});

    // useState for setting password reentry
    const [passwordReentryField, setPasswordReentryField] = useState({text:'', errorMessage:''});

    return (
        <View style={styles.container}>
            {/* Header */}
            <Text style={styles.header}>{!isCreateMode ? 'Sign In' : 'Sign Up'}</Text>
            <View style={{flex: 1}}>
                {/* Email input */}
                <LabeledInput 
                    label='Email' 
                    text={emailField}
                    onChangeText={(text)=>{
                        setEmailField({ text });
                    }} 
                    errorMessage={emailField.errorMessage} 
                    labelStyle={styles.label}
                    autoCompleteType='email'
                />

                {/* Password input */}
                <LabeledInput 
                    label='Password' 
                    text={passwordField.text}
                    onChangeText={(text)=>{
                        setPasswordField({ text });
                    }} 
                    secureTextEntry={true}
                    errorMessage={passwordField.errorMessage} 
                    labelStyle={styles.label}
                    autoCompleteType='password'
                />

                {/* Password reentry input */}
                {isCreateMode && (
                    <LabeledInput 
                        label='Re-enter Password' 
                        text={passwordReentryField.text}
                        onChangeText={(text)=>{
                            setPasswordReentryField({ text });
                        }} 
                        secureTextEntry={true}
                        errorMessage={passwordReentryField.errorMessage} 
                        labelStyle={styles.label}
                    />
                )}

                {/* Login toggle between sign-in and sign-up */}
                <TouchableOpacity onPress={() => {setCreateMode(!isCreateMode)}}>
                    <Text style={{alignSelf: 'center', color: Colors.blue, fontSize:16, margin:4}}> 
                        {isCreateMode ? 'Already have an account?' : 'Create new account'}
                    </Text>
                </TouchableOpacity>

            </View>
            {/* Login/Create account button */}
            <Button 
                onPress={() => {
                    
                    // determine validity of email and password
                    const isValid = validateFields(emailField.text, passwordField.text);
                    let isAllValid = true;

                    // email invalid case
                    if (!isValid.email) {
                        emailField.errorMessage='Please enter a valid email';
                        setEmailField({...emailField})
                        isAllValid=false;
                    }

                    // passsword invalid case
                    if (!isValid.password) {
                        passwordField.errorMessage=
                        'Password must be at least 8 characters long w/ numbers, uppercase, lowercase, and symbol'
                        setPasswordField({...passwordField});
                        isAllValid=false;
                    }

                    // validate password with password reentry invalid case (in create account mode)
                    if(isCreateMode && passwordReentryField.text != passwordField.text) {
                        passwordReentryField.errorMessage='Passwords do not match';
                        setPasswordReentryField({...setPasswordReentryField});
                        isAllValid=false;
                    }

                    // valid email, password, and reentry case
                    if(isAllValid) {

                        // if inCreateMode == true, createAccount for user : else, login user
                        {isCreateMode ? 
                            createAccount(emailField.text,passwordField.text) :
                            login(emailField.text,passwordField.text)};
                    }

                }} 
                buttonStyle={{backgroundColor:Colors.red}} 

                // button view for user to toggle between CA and login
                text={isCreateMode ? 'Create Account' : 'Login'}
            />
        </View>
    )
}

const styles = StyleSheet.create ({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        justifyContent: "space-between",
        alignItems: "stretch",
    },
    label: { fontSize: 16, fontWeight: "bold", color: Colors.black },
    header: { fontSize: 72, color: Colors.red, alignSelf: "center" },
});