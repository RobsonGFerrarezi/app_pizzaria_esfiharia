// Arquivo: frontend/screens/UserProfileModal.js (Completo e Corrigido)

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, Alert, ActivityIndicator } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { useIsFocused } from '@react-navigation/core';

export const UserProfileModal = () => {
    const { user, logout, fetchUserDetails } = useAuth();
    const navigation = useNavigation();
    const isFocused = useIsFocused(); // Hook para saber se a tela está visível
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (isFocused && user) {
            setIsLoading(true);
            fetchUserDetails().finally(() => {
                setIsLoading(false);
            });
        }
    }, [isFocused]);

    const handleLogout = () => {
        Alert.alert(
            'Sair',
            'Você tem certeza que deseja sair?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Sair', style: 'destructive', onPress: () => {
                        logout();
                        navigation.goBack(); // Fecha o modal após o logout
                    }
                },
            ],
        );
    };

    if (!user) {
        return (
            <View style={styles.container}>
                <ActivityIndicator />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Meu Perfil</Text>

            {isLoading ? (
                <ActivityIndicator size="large" style={{ marginVertical: 40 }} />
            ) : (
                <View>
                    <View style={styles.infoContainer}>
                        <Text style={styles.label}>Nome:</Text>
                        <Text style={styles.info}>{user.nome}</Text>
                    </View>

                    <View style={styles.infoContainer}>
                        <Text style={styles.label}>E-mail:</Text>
                        <Text style={styles.info}>{user.email}</Text>
                    </View>

                    <View style={styles.infoContainer}>
                        <Text style={styles.label}>Telefone:</Text>
                        <Text style={styles.info}>{user.telefone || '(Não cadastrado)'}</Text>
                    </View>
                </View>
            )}

            {/* Container dos botões (sem o View duplicado) */}
            <View style={styles.buttonContainer}>
                <Button
                    title="Meus Pedidos"
                    onPress={() => navigation.navigate('OrdersScreen')}
                    disabled={isLoading}
                />
                <View style={styles.spacer} />
                <Button
                    title="Mudar Meus Dados"
                    onPress={() => navigation.navigate('UpdateUserModal')}
                    disabled={isLoading}
                />
                <View style={styles.spacer} />
                <Button
                    title="Mudar Senha"
                    onPress={() => navigation.navigate('UpdatePasswordModal')}
                    disabled={isLoading}
                />
                <View style={styles.spacer} />
                <Button
                    title="Sair (Logout)"
                    color="red"
                    onPress={handleLogout}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    infoContainer: {
        marginBottom: 15,
    },
    label: {
        fontSize: 16,
        color: 'gray',
    },
    info: {
        fontSize: 18,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingVertical: 5,
    },
    buttonContainer: {
        marginTop: 30,
    },
    spacer: {
        height: 15,
    }
});