import React from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { useCart } from '../../contexts/CartContext';

// 'item' é o objeto { id, quantidade, product: { ... } }
export const CartItem = ({ item }) => {
  const { updateItemQuantity, removeItemFromCart, isLoadingCart } = useCart();

  const handleDecrease = () => {
    updateItemQuantity(item.id, item.quantidade - 1);
  };

  const handleIncrease = () => {
    updateItemQuantity(item.id, item.quantidade + 1);
  };

  const handleRemove = () => {
    removeItemFromCart(item.id);
  };

  // Formata o preço
  const priceFormatted = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(item.product.preco);

  return (
    <View style={styles.card}>
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{item.product.produto}</Text>
        <Text style={styles.price}>{priceFormatted}</Text>
      </View>

      <View style={styles.controlsContainer}>
        {isLoadingCart ? (
          <ActivityIndicator />
        ) : (
          <>
            <Pressable style={styles.controlButton} onPress={handleDecrease}>
              <Text style={styles.controlText}>-</Text>
            </Pressable>
            <Text style={styles.quantity}>{item.quantidade}</Text>
            <Pressable style={styles.controlButton} onPress={handleIncrease}>
              <Text style={styles.controlText}>+</Text>
            </Pressable>
            
            <Pressable style={styles.removeButton} onPress={handleRemove}>
              <Text style={styles.removeText}>X</Text>
            </Pressable>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  infoContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 16,
    color: '#4CAF50', // Verde
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  controlButton: {
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginHorizontal: 5,
  },
  controlText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantity: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: 10,
  },
  removeButton: {
    marginLeft: 15,
  },
  removeText: {
    color: 'red',
    fontSize: 18,
    fontWeight: 'bold',
  },
});