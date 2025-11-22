import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';

export const HeaderRightButton = () => {
  const { user } = useAuth();
  const navigation = useNavigation();

  const getFirstName = () => {
    if (!user || !user.nome) return '';
    return user.nome.split(' ')[0];
  };

  if (user) {
    // ---- Logado ----
    return (
      <Pressable 
        style={styles.container} 
        onPress={() => navigation.navigate('UserProfileModal')}
      >
        <Text style={styles.text}>Olá, {getFirstName()}</Text>
      </Pressable>
    );
  }

  // ---- Deslogado ----
  return (
    <View style={styles.containerRow}>
      <Pressable 
        style={styles.container} 
        onPress={() => navigation.navigate('LoginModal')}
      >
        <Text style={styles.text}>Login</Text>
      </Pressable>
      <Pressable 
        style={styles.registerButton}
        onPress={() => navigation.navigate('RegisterModal')}
      >
        <Text style={styles.registerText}>Cadastrar</Text> 
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginRight: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  containerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    color: '#007AFF',
  },
});

styles.registerButton = {
    ...styles.container,
    backgroundColor: '#007AFF',
    marginLeft: 5,
    paddingHorizontal: 10,
};
styles.registerText = {
    ...styles.text,
    color: '#FFFFFF', 
};

export default HeaderRightButton;