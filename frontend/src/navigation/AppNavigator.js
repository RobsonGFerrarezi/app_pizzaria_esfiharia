import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../../contexts/AuthContext';

import { MainTabNavigator } from './MainTabNavigator';

import { LoginModal } from '../../screens/LoginModal';
import { RegisterModal } from '../../screens/RegisterModal';

import { UserProfileModal } from '../../screens/UserProfileModal';
import { UpdateUserModal } from '../../screens/UpdateUserModal';
import { UpdatePasswordModal } from '../../screens/UpdatePasswordModal';

import { OrdersScreen } from '../../screens/OrdersScreen';

import { View, ActivityIndicator } from 'react-native';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator>
        <Stack.Screen
          name="MainApp"
          component={MainTabNavigator}
          options={{ headerShown: false }}
        />
        
        <Stack.Group screenOptions={{ presentation: 'modal' }}>
          <Stack.Screen
            name="LoginModal"
            component={LoginModal}
            options={{ title: 'Login' }}
          />
          <Stack.Screen
            name="RegisterModal"
            component={RegisterModal}
            options={{ title: 'Cadastro' }}
          />
          
          <Stack.Screen
            name="UserProfileModal"
            component={UserProfileModal}
            options={{ title: 'Meu Perfil' }}
          />
           <Stack.Screen
            name="UpdateUserModal"
            component={UpdateUserModal}
            options={{ title: 'Meus Dados' }}
          />
           <Stack.Screen
            name="UpdatePasswordModal"
            component={UpdatePasswordModal}
            options={{ title: 'Mudar Senha' }}
          />

          <Stack.Screen
            name="OrdersScreen"
            component={OrdersScreen}
            options={{ title: 'Meus Pedidos' }}
          />
        </Stack.Group>
    </Stack.Navigator>
  );
};

export default AppNavigator;