import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { View, ScrollView, ActivityIndicator, LayoutAnimation, UIManager, Platform, Alert } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import { BalanceCard } from './src/components/BalanceCard';
import { TransactionList } from './src/components/TransactionList';
import { TransactionModal } from './src/components/TransactionModal';
import { supabase } from './src/lib/supabase';
import { Transaction } from './src/types';

const Container = styled.View`
  flex: 1;
  background-color: #F8F9FA;
`;

// --- Header Shapes ---
const HeaderRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px 8px;
`;

const HeaderTitle = styled.Text`
  font-size: 20px;
  font-weight: 700;
  color: #1A237E;
`;

const Subtitle = styled.Text`
  font-size: 11px;
  font-weight: 600;
  color: #757575;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: 2px;
`;

const AvatarRow = styled.View`
  flex-direction: row;
  align-items: center;
`;

const IconButton = styled.TouchableOpacity`
  width: 36px;
  height: 36px;
  border-radius: 18px;
  background-color: #E8EAF6;
  justify-content: center;
  align-items: center;
  margin-right: 12px;
`;

const Avatar = styled.View`
  width: 36px;
  height: 36px;
  border-radius: 18px;
  background-color: #1A237E;
  justify-content: center;
  align-items: center;
`;

const AvatarText = styled.Text`
  color: #FFFFFF;
  font-weight: 700;
  font-size: 14px;
`;

// --- Quick Actions ---
const ActionsContainer = styled.View`
  flex-direction: row;
  padding: 16px;
  justify-content: space-between;
`;

const ActionBtn = styled.TouchableOpacity<{ primary?: boolean }>`
  flex: 1;
  background-color: ${({ primary }) => (primary ? '#1A237E' : '#E0E0E0')};
  padding: 14px;
  border-radius: 12px;
  align-items: center;
  margin-horizontal: 4px;
`;

const ActionText = styled.Text<{ primary?: boolean }>`
  color: ${({ primary }) => (primary ? '#FFFFFF' : '#424242')};
  font-weight: 600;
  font-size: 14px;
`;

// --- Bottom Navigation ---
const BottomNav = styled.View`
  flex-direction: row;
  background-color: #FFFFFF;
  padding-bottom: 24px;
  padding-top: 12px;
  border-top-width: 1px;
  border-top-color: #EEEEEE;
  justify-content: space-around;
`;

const NavItem = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
  flex: 1;
`;

const NavDot = styled.View<{ active: boolean }>`
  width: 40px;
  height: 4px;
  border-radius: 2px;
  background-color: ${({ active }) => (active ? '#1A237E' : 'transparent')};
  position: absolute;
  top: -12px;
`;

const NavText = styled.Text<{ active: boolean }>`
  font-size: 12px;
  font-weight: 600;
  margin-top: 4px;
  color: ${({ active }) => (active ? '#1A237E' : '#9E9E9E')};
`;

const SectionHeader = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: #111111;
  margin-horizontal: 20px;
  margin-top: 8px;
  margin-bottom: 4px;
`;



export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'income' | 'expense' | 'reports'>('home');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'income' | 'expense' | null>(null);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const handleTabPress = (tab: any) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching transactions:', error);
    } else if (data) {
      setTransactions(data);
    }
    setLoading(false);
  };

  const handleSaveTransaction = async (source: string, amount: number, date: Date, id?: string) => {
    if (!modalType) return;
    
    if (id) {
      const { error } = await supabase.from('transactions').update({
        source, amount, type: modalType, created_at: date.toISOString()
      }).eq('id', id);

      if (error) {
        console.error('Update error:', error);
        Alert.alert('Error', 'Failed to update transaction. Did you enable the UPDATE policy in Supabase?');
      } else {
        await fetchTransactions();
      }
    } else {
      const { error } = await supabase.from('transactions').insert([
        { source, amount, type: modalType, created_at: date.toISOString() }
      ]);
      
      if (error) {
        console.error('Insert error:', error);
        Alert.alert('Error', 'Failed to save transaction. Did you enable the INSERT policy in Supabase?');
      } else {
        await fetchTransactions();
      }
    }
  };

  const handleEditTransaction = (item: Transaction) => {
    setModalType(item.type);
    setEditingTransaction(item);
    setModalVisible(true);
  };

  const handleDeleteTransaction = (id: string, source: string) => {
    Alert.alert(
      "Delete Transaction",
      `Are you sure you want to delete "${source}"?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: async () => {
            const { error } = await supabase.from('transactions').delete().eq('id', id);
            if (error) {
              console.error('Delete error:', error);
              Alert.alert('Error', 'Failed to delete transaction. Ensure DELETE policy is enabled.');
            } else {
              await fetchTransactions();
            }
          }
        }
      ]
    );
  };

  const incomeTransactions = transactions.filter(t => t.type === 'income');
  const expenseTransactions = transactions.filter(t => t.type === 'expense');

  const totalIncome = incomeTransactions.reduce((acc, cur) => acc + cur.amount, 0);
  const totalExpense = expenseTransactions.reduce((acc, cur) => acc + cur.amount, 0);
  const balanceInHand = totalIncome - totalExpense;

  return (
    <SafeAreaProvider>
      <Container>
        <StatusBar style="dark" />
        <SafeAreaView style={{ flex: 1 }}>
        <Animatable.View animation="fadeInDown" duration={600}>
          <HeaderRow>
            <View>
              <HeaderTitle>Division Summary</HeaderTitle>
              <Subtitle>SOUTH KOLKATA FIRST SUB DIVISION</Subtitle>
            </View>
            <AvatarRow>
              <IconButton>
                <AvatarText style={{ color: '#1A237E' }}>🔔</AvatarText>
              </IconButton>
              <Avatar>
                <AvatarText>PD</AvatarText>
              </Avatar>
            </AvatarRow>
          </HeaderRow>
        </Animatable.View>

        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          <BalanceCard 
            totalIncome={totalIncome} 
            totalExpense={totalExpense} 
            balanceInHand={balanceInHand} 
          />

          <Animatable.View animation="fadeInUp" duration={800} delay={600}>
            <ActionsContainer>
              <ActionBtn primary onPress={() => { setModalType('income'); setEditingTransaction(null); setModalVisible(true); }}>
                <ActionText primary>+ Add Income</ActionText>
              </ActionBtn>
              <ActionBtn onPress={() => { setModalType('expense'); setEditingTransaction(null); setModalVisible(true); }}>
                <ActionText>- Add Expense</ActionText>
              </ActionBtn>
            </ActionsContainer>
          </Animatable.View>

          <SectionHeader>
            {activeTab === 'home' ? 'Recent Transactions' : activeTab === 'expense' ? 'Recent Expenses' : activeTab === 'income' ? 'Recent Income' : 'All Reports'}
          </SectionHeader>

          {loading ? (
            <ActivityIndicator size="large" color="#1A237E" style={{ marginTop: 20 }} />
          ) : (
            activeTab === 'home' || activeTab === 'reports' ? (
              <TransactionList data={transactions} onDelete={handleDeleteTransaction} onEdit={handleEditTransaction} />
            ) : activeTab === 'expense' ? (
              <TransactionList data={expenseTransactions} onDelete={handleDeleteTransaction} onEdit={handleEditTransaction} />
            ) : (
              <TransactionList data={incomeTransactions} onDelete={handleDeleteTransaction} onEdit={handleEditTransaction} />
            )
          )}
        </ScrollView>
      </SafeAreaView>

      <BottomNav>
        {['home', 'income', 'expense', 'reports'].map((tab) => (
          <NavItem key={tab} onPress={() => handleTabPress(tab as any)}>
            <NavDot active={activeTab === tab} />
            <NavText active={activeTab === tab}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </NavText>
          </NavItem>
        ))}
      </BottomNav>
      
      <TransactionModal 
        visible={modalVisible}
        type={modalType}
        onClose={() => { setModalVisible(false); setEditingTransaction(null); }}
        onSave={handleSaveTransaction}
        initialData={editingTransaction}
      />
      </Container>
    </SafeAreaProvider>
  );
}
