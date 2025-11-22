import React from 'react';
import { View, Text, Image, Pressable, StyleSheet, Alert } from 'react-native';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { API_BASE_URL } from '../../constants/config';

export const ProductCard = ({ product }) => {
  const { addItemToCart, isLoadingCart } = useCart();
  const { user } = useAuth();
  const navigation = useNavigation();

  const handleAddToCart = () => {
    if (!user) {
      // Se não estiver logado, manda para o modal de login
      Alert.alert(
        'Login Necessário',
        'Você precisa fazer login para adicionar itens ao carrinho.',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Fazer Login', onPress: () => navigation.navigate('LoginModal') }
        ]
      );
      return;
    }
    
    // Adiciona o item
    addItemToCart(product.id, 1);
    
    // (Pode adicionar um feedback visual, ex: um Toast)
    Alert.alert('Sucesso', `${product.produto} foi adicionado ao carrinho!`);
  };

  // Seu backend (rota GET /product/:id/image) serve a imagem
  // Vamos construir a URL completa
  const imageUrl = `${API_BASE_URL}/product/${product.id}/image`;

  return (
    <View style={styles.card}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{product.produto}</Text>
        <Text style={styles.price}>
          {/* Formata o preço para R$ */}
          {new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }).format(product.preco)}
        </Text>
        
        <Pressable 
          style={styles.addButton} 
          onPress={handleAddToCart}
          disabled={isLoadingCart} // Desativa o botão enquanto o carrinho carrega
        >
          <Text style={styles.addButtonText}>Adicionar</Text>
        </Pressable>
      </View>
      
      {/* Imagem do Produto */}
      <Image
        source={{ uri: imageUrl }}
        style={styles.image}
        resizeMode="cover"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2, // Sombra (Android)
    shadowColor: '#000', // Sombra (iOS)
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  textContainer: {
    flex: 1,
    paddingRight: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 16,
    color: '#4CAF50', // Verde
    marginVertical: 8,
  },
  addButton: {
    backgroundColor: 'tomato',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    alignSelf: 'flex-start', // Não ocupa a largura toda
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: '#eee' // Cor de fundo enquanto carrega
  },
});