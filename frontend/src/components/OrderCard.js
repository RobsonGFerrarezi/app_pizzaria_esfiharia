import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const OrderCard = ({ order }) => {
  // Formata o total
  const totalFormatted = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(order.total);

  // Formata a data
  const dateFormatted = new Date(order.createdAt).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Pedido #{order.id}</Text>
        <Text style={styles.status}>{order.status}</Text>
      </View>
      
      <View style={styles.body}>
        <Text style={styles.total}>{totalFormatted}</Text>
        <Text style={styles.date}>{dateFormatted}</Text>

        <View style={styles.itemContainer}>
          <Text style={styles.itemTitle}>Itens:</Text>
          {order.itens.map((item) => (
            <Text key={item.id} style={styles.itemText}>
              {item.quantidade}x {item.product.produto}
            </Text>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginVertical: 8,
    marginHorizontal: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  status: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'orange', // (Pode mudar a cor baseado no status)
    backgroundColor: '#FFF8E1',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
  },
  body: {
    padding: 12,
  },
  total: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 10,
  },
  itemContainer: {
    marginTop: 5,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  itemText: {
    fontSize: 14,
    color: '#333',
  },
});