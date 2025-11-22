
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';
import api from '../services/api';
import { Alert } from 'react-native';


const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  
  useEffect(() => {
    const fetchCart = async () => {
      if (user) {
        setIsLoading(true);
        try {
          const response = await api.get(`/carrinho/${user.id}`);
          setCart(response.data);
        } catch (e) {
          console.error("Falha ao buscar carrinho:", e);
        }
        setIsLoading(false);
      } else {
        setCart(null);
      }
    };
    fetchCart();
  }, [user]);

  // Função para buscar o carrinho novamente
  const refetchCart = async () => {
    if (!user) return;
    try {
      const response = await api.get(`/carrinho/${user.id}`);
      setCart(response.data);
    } catch (e) {
      console.error("Falha ao re-buscar carrinho:", e);
    }
  };

  // --- FUNÇÕES DE AÇÃO ---

  const addItemToCart = async (productId, quantidade = 1) => {
    if (!user || !cart) return;
    setIsLoading(true);
    try {
      await api.post(`/carrinho/${user.id}/add`, {
        productId,
        quantidade
      });
      await refetchCart();
    } catch (e) {
      console.error("Falha ao adicionar item:", e);
    }
    setIsLoading(false);
  };

  // NOVA FUNÇÃO: Atualizar quantidade
  const updateItemQuantity = async (itemId, newQuantity) => {
    if (!user || !cart) return;
    
    // Se a quantidade for zero ou menos, remove o item
    if (newQuantity <= 0) {
      await removeItemFromCart(itemId);
      return;
    }

    setIsLoading(true);
    try {
      // Rota PATCH /carrinho/:userId/item/:itemId
      await api.patch(`/carrinho/${user.id}/item/${itemId}`, {
        quantidade: newQuantity
      });
      await refetchCart();
    } catch (e) {
      console.error("Falha ao atualizar item:", e);
    }
    setIsLoading(false);
  };

  // NOVA FUNÇÃO: Remover item
  const removeItemFromCart = async (itemId) => {
    if (!user || !cart) return;
    setIsLoading(true);
    try {
      // Rota DELETE /carrinho/:userId/item/:itemId
      await api.delete(`/carrinho/${user.id}/item/${itemId}`);
      await refetchCart();
    } catch (e) {
      console.error("Falha ao remover item:", e);
    }
    setIsLoading(false);
  };

  // NOVA FUNÇÃO: Limpar carrinho
  const clearCart = async () => {
    if (!user || !cart) return;
    setIsLoading(true);
    try {
        // Rota DELETE /carrinho/:userId/clear
        await api.delete(`/carrinho/${user.id}/clear`);
        await refetchCart(); // Vai buscar o carrinho vazio
    } catch (e) {
        console.error("Falha ao limpar carrinho:", e);
    }
    setIsLoading(false);
  };

  // NOVA FUNÇÃO: Criar Pedido
  const createOrder = async () => {
    if (!user || !cart || !cart.itens.length) {
        Alert.alert("Erro", "Seu carrinho está vazio.");
        return false;
    }
    
    setIsLoading(true);
    try {
        // Rota POST /pedido/:userId
        await api.post(`/pedido/${user.id}`);
        await refetchCart(); // Esvazia o carrinho local
        Alert.alert("Sucesso!", "Seu pedido foi criado!");
        return true;
    } catch (error) {
        console.error("Falha ao criar pedido:", error.response?.data);
        Alert.alert("Erro", "Não foi possível criar o pedido.");
        return false;
    } finally {
        setIsLoading(false);
    }
  };

  // --- CÁLCULO DO TOTAL ---
  const getCartTotal = () => {
    if (!cart || !cart.itens) {
      return 0.0;
    }
    return cart.itens.reduce((total, item) => {
      return total + (item.quantidade * item.product.preco);
    }, 0);
  };
  
  // Formata o total para R$
  const totalFormatted = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(getCartTotal());

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoadingCart: isLoading,
        addItemToCart,
        refetchCart,
        getCartTotal,
        totalFormatted, // Exporta o total formatado
        
        // Novas funções
        updateItemQuantity,
        removeItemFromCart,
        clearCart,
        createOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};