import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { ProductProvider } from './contexts/ProductContext';
import { CartProvider } from './contexts/CartContext';

import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';

import { View, Text, ActivityIndicator } from 'react-native';

import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <AuthProvider>
      <ProductProvider>
        <CartProvider>
          <NavigationContainer>
            <StatusBar style="auto" />

            <AppNavigator />

          </NavigationContainer>
        </CartProvider>
      </ProductProvider>
    </AuthProvider>
  );
}