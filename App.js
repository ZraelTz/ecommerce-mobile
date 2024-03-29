import { StatusBar } from 'expo-status-bar';
import MainStack from './app/routing/MainStack';
import {Provider} from 'react-redux';
// import {StatusBar} from 'react-native';
import storePre from './app/redux/store';
import DropdownAlert from 'react-native-dropdownalert';
import {AlertHelper} from './app/utils/AlertHelper';
import {PersistGate} from 'redux-persist/integration/react';
import React from 'react';

export default function App() {
  const { persistor, store } = storePre;

  return (
    React.createElement(Provider, { store: store },
      React.createElement(PersistGate, { loading: null, persistor: persistor },
        React.createElement(MainStack, null),
        React.createElement(DropdownAlert, {
          defaultContainer: {
            padding: 8,
            paddingTop: StatusBar.currentHeight,
            flexDirection: 'row',
          },
          ref: (ref) => AlertHelper.setDropDown(ref),
          onClose: () => AlertHelper.invokeOnClose(),
        })
      )
    )
  );
}

