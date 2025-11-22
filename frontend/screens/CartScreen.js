import React from 'react';
import { View, Text, StyleSheet, FlatList, Button, ActivityIndicator, Alert } from 'react-native';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { CartItem } from '../src/components/CartItem'; // (Ajuste o caminho se necessário)

export const CartScreen = () => {
  const { 
    cart, 
    isLoadingCart, 
    totalFormatted, 
    createOrder,
    clearCart
  } = useCart();
  
  const { user } = useAuth();
  const navigation = useNavigation();

  const handleCreateOrder = async () => {
    // A lógica de "carrinho vazio" já está no Context, mas é bom checar
    if (!cart || !cart.itens.length) {
      Alert.alert("Carrinho Vazio", "Adicione itens antes de finalizar.");
      return;
    }
    
    const success = await createOrder();
    if (success) {
      // Se deu certo, talvez navegar para uma tela de "Pedidos" (futuro)
      // Por agora, apenas levamos de volta aos produtos
      navigation.navigate('Produtos');
    }
  };

  // Se o usuário não estiver logado
  if (!user) {
    return (
      <View style={styles.centered}>
        <Text style={styles.infoText}>Você precisa fazer login para ver seu carrinho.</Text>
        <Button 
          title="Fazer Login" 
          onPress={() => navigation.navigate('LoginModal')} 
        />
      </View>
    );
  }

  // Se estiver carregando (ex: ao adicionar/remover item)
  if (isLoadingCart && !cart) {
     return (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="tomato" />
          <Text>Carregando carrinho...</Text>
        </View>
     );
  }

  // Se o carrinho estiver vazio
  if (!cart || !cart.itens.length) {
    return (
      <View style={styles.centered}>
        <Text style={styles.infoText}>Seu carrinho está vazio.</Text>
      </View>
    );
  }

  // --- Renderização Principal do Carrinho ---
  return (
    <View style={styles.container}>
      {/* Botão de Limpar Carrinho (Opcional) */}
      <View style={styles.clearButtonContainer}>
          <Button 
            title="Limpar Carrinho" 
            color="red" 
            onPress={clearCart} 
            disabled={isLoadingCart}
          />
      </View>

      {/* Lista de Itens */}
      <FlatList
        data={cart.itens}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <CartItem item={item} />}
        contentContainerStyle={styles.list}
      />

      {/* Rodapé com Total e Botão Finalizar */}
      <View style={styles.footer}>
        <Text style={styles.totalText}>Total: {totalFormatted}</Text>
        <Button
          title="Finalizar Pedido"
          onPress={handleCreateOrder}
          disabled={isLoadingCart}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  infoText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  list: {
    paddingBottom: 100, // Espaço para o rodapé
  },
  clearButtonContainer: {
    padding: 10,
    alignItems: 'flex-end',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    elevation: 5,
  },
  totalText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});