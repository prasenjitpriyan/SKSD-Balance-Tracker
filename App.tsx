import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { View, ScrollView, ActivityIndicator, LayoutAnimation, UIManager, Platform } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import { BalanceCard } from './src/components/BalanceCard';
import { TransactionList } from './src/components/TransactionList';
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

  const handleTabPress = (tab: any) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setActiveTab(tab);
  };
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

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
        <Animatable.View animation="fadeInDown" duration={600} useNativeDriver>
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

          <Animatable.View animation="fadeInUp" duration={800} delay={600} useNativeDriver>
            <ActionsContainer>
              <ActionBtn primary>
                <ActionText primary>+ Add Income</ActionText>
              </ActionBtn>
              <ActionBtn>
                <ActionText>- Add Expense</ActionText>
              </ActionBtn>
            </ActionsContainer>
          </Animatable.View>

          <SectionHeader>
            {activeTab === 'expense' ? 'Recent Expenses' : 'Recent Income'}
          </SectionHeader>

          {loading ? (
            <ActivityIndicator size="large" color="#1A237E" style={{ marginTop: 20 }} />
          ) : (
            activeTab === 'expense' ? (
              <TransactionList data={expenseTransactions} type="expense" />
            ) : (
              <TransactionList data={incomeTransactions} type="income" />
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
      </Container>
    </SafeAreaProvider>
  );
}
