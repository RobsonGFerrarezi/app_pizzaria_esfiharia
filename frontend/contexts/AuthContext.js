// Arquivo: frontend/src/contexts/AuthContext.js

import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Efeito para carregar o token/usuário ao iniciar o app
  useEffect(() => {
    const loadStorageData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('userToken');
        const storedUser = await AsyncStorage.getItem('userData');

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          // Atualiza o header do axios para futuras requisições
          api.defaults.headers.Authorization = `Bearer ${storedToken}`;
        }
      } catch (e) {
        console.error("Falha ao carregar dados do storage", e);
      }
      setIsLoading(false);
    };
    loadStorageData();
  }, []);

  // Função de Login
  const login = async (email, senha) => {
    try {
      // Usando a rota do seu backend: /auth/login
      const response = await api.post('/auth/login', {
        email: email,
        senha: senha,
      });

      const { access_token, user: userData } = response.data;

      // Salva no estado
      setToken(access_token);
      setUser(userData);

      // Atualiza o header do axios
      api.defaults.headers.Authorization = `Bearer ${access_token}`;

      // Salva no Storage
      await AsyncStorage.setItem('userToken', access_token);
      await AsyncStorage.setItem('userData', JSON.stringify(userData));

      return true; // Sucesso
    } catch (error) {
      console.error('Erro no login:', error.response?.data || error.message);
      return false; // Falha
    }
  };

  // Função de Cadastro (Cria o usuário e o carrinho)
  const register = async (nome, email, telefone, senha) => {
    try {
      // Usando a rota do backend: /user
      await api.post('/user', {
        nome,
        email,
        telefone,
        senha
      });
      // await login(email, senha);
      return true;
    } catch (error) {
      console.error('Erro no cadastro:', error.response?.data || error.message);
      return false;
    }
  };

  // Função de Logout
  const logout = async () => {
    try {
      setToken(null);
      setUser(null);
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userData');
      api.defaults.headers.Authorization = undefined;
    } catch (e) {
      console.error("Falha ao fazer logout", e);
    }
  };

  const fetchUserDetails = async () => {
    if (!user) return null;

    try {
      // Usa a rota GET /user/:id do  backend
      const response = await api.get(`/user/${user.id}`);

      // Atualiza o estado 'user' com os dados completos
      setUser(response.data);

      // Atualiza o storage também
      await AsyncStorage.setItem('userData', JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      console.error("Falha ao buscar detalhes do usuário:", error);
      return null;
    }
  };

  /**
   * Atualiza os dados (nome, telefone, email)
   * Usa a rota PATCH /user/:id
   */
  const updateUser = async (dataToUpdate) => {
    if (!user) return false;

    try {
      // dataToUpdate deve ser { nome: "...", telefone: "..." }
      const response = await api.patch(`/user/${user.id}`, dataToUpdate);

      // Atualiza o estado 'user' localmente
      setUser(response.data);
      await AsyncStorage.setItem('userData', JSON.stringify(response.data));

      return true;
    } catch (error) {
      console.error("Falha ao atualizar usuário:", error.response?.data);
      return false;
    }
  };

  /**
   * Atualiza a senha
   * Usa a rota PATCH /user/:id/password
   */
  const updatePassword = async (senhaAntiga, novaSenha) => {
    if (!user) return false;

    try {
      await api.patch(`/user/${user.id}/password`, {
        senhaAntiga,
        novaSenha
      });
      return true; // Sucesso
    } catch (error) {
      console.error("Falha ao atualizar senha:", error.response?.data);
      return false; // Falha (ex: senha antiga errada)
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        logout,
        register,
        fetchUserDetails,
        updateUser,
        updatePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook para facilitar o uso do contexto
export const useAuth = () => {
  return useContext(AuthContext);
};