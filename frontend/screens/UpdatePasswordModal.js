import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';

export const UpdatePasswordModal = () => {
  const { updatePassword } = useAuth();
  const navigation = useNavigation();

  const [senhaAntiga, setSenhaAntiga] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdate = async () => {
    if (!senhaAntiga || !novaSenha) {
        Alert.alert('Erro', 'Preencha todos os campos.');
        return;
    }
    // (Validação de complexidade da novaSenha pode ser feita aqui)

    setIsLoading(true);
    const success = await updatePassword(senhaAntiga, novaSenha);
    setIsLoading(false);
    
    if (success) {
      Alert.alert('Sucesso', 'Senha alterada!');
      navigation.goBack(); // Volta para o modal de Perfil
    } else {
      Alert.alert('Erro', 'Senha antiga incorreta ou falha na alteração.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Alterar Senha</Text>
      
      <Text style={styles.label}>Senha Antiga:</Text>
      <TextInput style={styles.input} value={senhaAntiga} onChangeText={setSenhaAntiga} secureTextEntry />
      
      <Text style={styles.label}>Nova Senha:</Text>
      <TextInput style={styles.input} value={novaSenha} onChangeText={setNovaSenha} secureTextEntry placeholder="Mín. 8 caracteres, 1 maiúsc..." />
      
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <Button title="Salvar Nova Senha" onPress={handleUpdate} />
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