import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useIsFocused } from '@react-navigation/core';
import api from '../services/api';
import { OrderCard } from '../src/components/OrderCard'; // (Ajuste o caminho se necessário)

export const OrdersScreen = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const isFocused = useIsFocused();

  useEffect(() => {
    const fetchOrders = async () => {
      if (user) {
        setIsLoading(true);
        try {
          // Rota GET /pedido/:userId do seu backend
          const response = await api.get(`/pedido/${user.id}`);
          // Seu backend já retorna os itens e produtos aninhados
          setOrders(response.data); 
        } catch (e) {
          console.error("Falha ao buscar pedidos:", e);
        }
        setIsLoading(false);
      }
    };
    
    if (isFocused) {
      fetchOrders();
    }
  }, [user, isFocused]); // Recarrega se o usuário ou foco mudar

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="tomato" />
        <Text>Carregando pedidos...</Text>
      </View>
    );
  }

  if (!orders.length) {
    return (
      <View style={styles.centered}>
        <Text>Você ainda não fez nenhum pedido.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <OrderCard order={item} />}
      />
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
  },
});