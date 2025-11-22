import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // 1. Busca as categorias
        const categoryResponse = await api.get('/categoria');
        setCategories(categoryResponse.data);
        
        // 2. Busca os produtos
        const productResponse = await api.get('/product');
        setProducts(productResponse.data);
        
      } catch (e) {
        console.error("Falha ao buscar produtos ou categorias:", e);
        setError("Não foi possível carregar os produtos.");
      }
      setIsLoading(false);
    };
    
    fetchData();
  }, []); // Executa apenas uma vez

  return (
    <ProductContext.Provider
      value={{
        categories,
        products,
        isLoading,
        error,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  return useContext(ProductContext);
};