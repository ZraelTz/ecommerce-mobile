import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { scale } from 'react-native-size-matters';
import Container from '../../components/Container';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import Label from '../../components/Label';
import { appColors, shadow } from '../../utils/appColors';
import Feather from 'react-native-vector-icons/Feather';
import auth from '@react-native-firebase/auth';
import { AlertHelper } from '../../utils/AlertHelper'
import axios from 'axios';
import { BASE_URL } from '../../utils/ApiList';

export default function index({ navigation }) {
  const [userInfo, setUserInfo] = useState({});
  const onChange = (name, text) => {
    setUserInfo({ ...userInfo, [name]: text });
  };

  const onSignUp = async () => {
    const { email, password, name, phone } = userInfo;
    try {
      const firebaseUser = await auth().createUserWithEmailAndPassword(email, password);
      if (firebaseUser.user.uid) {
        // Call the register endpoint with the user info
        const response = await axios.post(`${BASE_URL}auth/register`, {
          username: name,
          email,
          phone,
          password_confirmation: password,
          password
        });

        if (response.status === 201) {
          AlertHelper.alert('Signup Successful', 'You have been registered.');
          navigation.navigate('Home');
        } else {
          throw new Error('Failed to register user on the server');
        }
      }
    } catch (error) {
      Alert.alert('Signup Failed', 'Please Retry');
      // If the Firebase user was created but the register endpoint failed, delete the Firebase user
      if (firebaseUser?.user?.uid) {
        await auth().currentUser.delete();
      }
    }
  };

  return (
    <Container isScrollable>
      <Pressable
        onPress={() => navigation.goBack()}
        style={{ marginTop: scale(30) }}>
        <Feather name={'chevron-left'} size={scale(25)} />
      </Pressable>
      <View
        style={{
          marginTop: scale(70),
          backgroundColor: appColors.white,
          ...shadow,
          padding: scale(15),
          borderRadius: scale(5),
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
          }}>
          <Label
            text="Sign Up"
            style={{ fontSize: scale(30), fontWeight: '700' }}
          />
        </View>
        <View style={{ paddingVertical: scale(15) }}>
          <Label
            text="Sign in to Continue"
            style={{
              fontSize: scale(16),
              //fontWeight: '500',
              color: appColors.darkGray,
            }}
          />
        </View>
        <View style={{ paddingVertical: scale(10) }}>
          <CustomInput
            onChangeText={(text) => onChange('name', text)}
            label="Username"
            placeholder="johndoe"
          />
        </View>
        <View style={{ paddingVertical: scale(10) }}>
          <CustomInput
            onChangeText={(text) => onChange('email', text)}
            keyboardType="email-address"
            label="Email"
            placeholder="john@doe.com"
          />
        </View>
        <View style={{ paddingVertical: scale(10) }}>
          <CustomInput
            onChangeText={(text) => onChange('phone', text)}
            keyboardType="phone"
            label="Phone"
            placeholder="2349072910943"
          />
        </View>
        <View style={{ paddingVertical: scale(10) }}>
          <CustomInput
            onChangeText={(text) => onChange('password', text)}
            secureTextEntry
            label="Password"
            placeholder="Password"
          />
        </View>
        <CustomButton onPress={onSignUp} label="Sign up" />
      </View>
    </Container>
  );
}
