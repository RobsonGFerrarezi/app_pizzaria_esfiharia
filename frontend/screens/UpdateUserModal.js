import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';

export const UpdateUserModal = () => {
  const { user, updateUser } = useAuth();
  const navigation = useNavigation();

  const [nome, setNome] = useState(user.nome || '');
  const [telefone, setTelefone] = useState(user.telefone || '');
  const [email, setEmail] = useState(user.email || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdate = async () => {
    setIsLoading(true);
    
    
    const dataToUpdate = {
        nome: nome,
        email: email,
        telefone: telefone
    };
    
    const success = await updateUser(dataToUpdate); 
    setIsLoading(false);
    
    if (success) {
      Alert.alert('Sucesso', 'Dados atualizados!');
      navigation.goBack(); // Volta para o modal de Perfil
    } else {
      Alert.alert('Erro', 'Não foi possível atualizar os dados.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meus Dados</Text>
      
      <Text style={styles.label}>Nome:</Text>
      <TextInput style={styles.input} value={nome} onChangeText={setNome} />
      
      <Text style={styles.label}>E-mail:</Text>
      <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />

      <Text style={styles.label}>Telefone:</Text>
      <TextInput style={styles.input} value={telefone} onChangeText={setTelefone} placeholder="(00) 00000-0000" keyboardType="phone-pad" />
      
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <Button title="Salvar Alterações" onPress={handleUpdate} />
      )}
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: 'gray'
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});