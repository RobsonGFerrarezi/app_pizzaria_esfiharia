import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useProducts } from '../../contexts/ProductContext';

// 'selectedCategory' é o ID da categoria selecionada
// 'onSelectCategory' é a função para mudar o ID
export const CategoryTabs = ({ selectedCategory, onSelectCategory }) => {
  const { categories, isLoading } = useProducts();

  if (isLoading) {
    return <Text style={styles.loading}>Carregando categorias...</Text>;
  }

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {/* Botão "Todas" */}
        <Pressable
          style={[
            styles.tab,
            selectedCategory === null ? styles.tabActive : null,
          ]}
          onPress={() => onSelectCategory(null)} // 'null' para "Todas"
        >
          <Text
            style={[
              styles.tabText,
              selectedCategory === null ? styles.tabTextActive : null,
            ]}
          >
            Todas
          </Text>
        </Pressable>

        {/* Mapeia as categorias da API */}
        {categories.map((cat) => (
          <Pressable
            key={cat.id}
            style={[
              styles.tab,
              selectedCategory === cat.id ? styles.tabActive : null,
            ]}
            onPress={() => onSelectCategory(cat.id)}
          >
            <Text
              style={[
                styles.tabText,
                selectedCategory === cat.id ? styles.tabTextActive : null,
              ]}
            >
              {cat.categoria} 
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  loading: {
    padding: 10,
    fontStyle: 'italic',
    color: 'gray',
  },
  container: {
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginHorizontal: 5,
    backgroundColor: '#f0f0f0',
  },
  tabActive: {
    backgroundColor: 'tomato', // Cor de destaque
  },
  tabText: {
    fontSize: 16,
    color: '#333',
  },
  tabTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
});