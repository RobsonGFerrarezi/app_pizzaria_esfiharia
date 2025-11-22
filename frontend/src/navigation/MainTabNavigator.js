// Arquivo: frontend/src/navigation/MainTabNavigator.js (ATUALIZAR)

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ProductsScreen } from '../../screens/ProductsScreen';
import { CartScreen } from '../../screens/CartScreen';
import HeaderRightButton from '../components/HeaderRightButton';

// 1. IMPORTE O useAuth E useNavigation
import { useAuth } from '../../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';

const Tab = createBottomTabNavigator();

export const MainTabNavigator = () => {
  // 2. PEGUE O USUÁRIO E A NAVEGAÇÃO
  const { user } = useAuth();
  const navigation = useNavigation(); // Navegação raiz (Stack)

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        // ... (código do tabBarIcon, etc)
      })}
    >
      <Tab.Screen 
        name="Produtos" 
        component={ProductsScreen} 
        options={{
            headerTitle: "Pizzaria",
            headerRight: () => <HeaderRightButton />, 
        }}
      />
      <Tab.Screen 
        name="Carrinho" 
        component={CartScreen}
        // 3. ADICIONE O 'listeners'
        listeners={{
          tabPress: (e) => {
            // Se o usuário NÃO estiver logado
            if (!user) {
              e.preventDefault(); // Impede a ação de ir para a aba
              // Em vez disso, abre o modal de login
              navigation.navigate('LoginModal'); 
            }
            // Se o usuário estiver logado, não faz nada e deixa a navegação
          },
        }}
      />
    </Tab.Navigator>
  );
};