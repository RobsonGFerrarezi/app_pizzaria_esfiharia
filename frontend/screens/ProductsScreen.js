import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useProducts } from '../contexts/ProductContext';

// 1. Importar os novos componentes
import { CategoryTabs } from '../src/components/CategoryTabs'; 
import { ProductCard } from '../src/components/ProductCard'; 

export const ProductsScreen = () => {
  const { products, isLoading, error } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState(null); // 'null' = Todas

  const filteredProducts = useMemo(() => {
    if (!selectedCategory) {
      return products; // Retorna todos se "Todas" estiver selecionado
    }
    // Filtra pelo ID da categoria
    return products.filter(
      (product) => product.categoria.id === selectedCategory
    );
  }, [products, selectedCategory]);

  // Se estiver carregando
  if (isLoading && !products.length) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="tomato" />
        <Text>Carregando produtos...</Text>
      </View>
    );
  }

  // Se der erro
  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  // Renderização principal
  return (
    <View style={styles.container}>
      {/* 2. Renderiza as abas de categoria */}
      <CategoryTabs 
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory} // Passa a função para atualizar o estado
      />

      {/* 3. Renderiza a lista de produtos filtrados */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <ProductCard product={item} />}
        contentContainerStyle={styles.list}
        // Se a lista filtrada estiver vazia
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text>Nenhum produto encontrado nesta categoria.</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5', // Um cinza claro de fundo
  },
  list: {
    paddingBottom: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center'
  }
});