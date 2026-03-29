import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import { BalanceCard } from './src/components/BalanceCard';
import { TransactionList } from './src/components/TransactionList';
import { INCOME_DATA, EXPENSE_DATA } from './src/data/mockData';

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

  return (
    <SafeAreaProvider>
      <Container>
        <StatusBar style="dark" />
        <SafeAreaView style={{ flex: 1 }}>
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

        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          <BalanceCard />

          <ActionsContainer>
            <ActionBtn primary>
              <ActionText primary>+ Add Income</ActionText>
            </ActionBtn>
            <ActionBtn>
              <ActionText>- Add Expense</ActionText>
            </ActionBtn>
          </ActionsContainer>

          <SectionHeader>
            {activeTab === 'expense' ? 'Recent Expenses' : 'Recent Income'}
          </SectionHeader>

          {activeTab === 'expense' ? (
            <TransactionList data={EXPENSE_DATA} type="expense" />
          ) : (
            <TransactionList data={INCOME_DATA} type="income" />
          )}
        </ScrollView>
      </SafeAreaView>

      <BottomNav>
        {['home', 'income', 'expense', 'reports'].map((tab) => (
          <NavItem key={tab} onPress={() => setActiveTab(tab as any)}>
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
