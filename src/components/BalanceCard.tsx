import React from 'react';
import styled from 'styled-components/native';
import { TOTAL_INCOME, TOTAL_EXPENSE, BALANCE_IN_HAND } from '../data/mockData';
import { View } from 'react-native';

const CardsRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const SmallCard = styled.View`
  flex: 1;
  background-color: #FFFFFF;
  border-radius: 12px;
  padding: 16px;
  shadow-color: rgba(0, 0, 0, 0.05);
  shadow-offset: 0px 2px;
  shadow-opacity: 1;
  shadow-radius: 8px;
  elevation: 2;
  margin-horizontal: 4px;
`;

const HeroCard = styled.View`
  background-color: #1A237E;
  border-radius: 16px;
  padding: 24px;
  shadow-color: rgba(26, 35, 126, 0.3);
  shadow-offset: 0px 8px;
  shadow-opacity: 1;
  shadow-radius: 16px;
  elevation: 6;
  margin-top: 8px;
  margin-horizontal: 4px;
`;

const SectionLabel = styled.Text`
  color: #757575;
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const HeroLabel = styled(SectionLabel)`
  color: #BAC2E8;
`;

const AmountText = styled.Text`
  font-size: 24px;
  font-weight: 700;
  color: #111111;
`;

const HeroAmountText = styled.Text`
  font-size: 36px;
  font-weight: 800;
  color: #FFFFFF;
  margin-top: 4px;
`;

const ChipContainer = styled.View<{ type: 'income' | 'expense' }>`
  flex-direction: row;
  align-items: center;
  background-color: ${({ type }) => (type === 'income' ? '#E8F5E9' : '#FFEBEE')};
  padding: 4px 8px;
  border-radius: 16px;
  align-self: flex-start;
  margin-top: 8px;
`;

const ChipDot = styled.View<{ type: 'income' | 'expense' }>`
  width: 6px;
  height: 6px;
  border-radius: 3px;
  background-color: ${({ type }) => (type === 'income' ? '#2E7D32' : '#C62828')};
  margin-right: 6px;
`;

const ChipText = styled.Text<{ type: 'income' | 'expense' }>`
  font-size: 11px;
  font-weight: 600;
  color: ${({ type }) => (type === 'income' ? '#2E7D32' : '#C62828')};
`;

export const BalanceCard: React.FC = () => {
  return (
    <View style={{ paddingHorizontal: 12 }}>
      <CardsRow>
        <SmallCard>
          <SectionLabel>Income</SectionLabel>
          <AmountText>₹ {TOTAL_INCOME.toLocaleString('en-IN')}</AmountText>
          <ChipContainer type="income">
            <ChipDot type="income" />
            <ChipText type="income">Verified receipts</ChipText>
          </ChipContainer>
        </SmallCard>
        <SmallCard>
          <SectionLabel>Expense</SectionLabel>
          <AmountText>₹ {TOTAL_EXPENSE.toLocaleString('en-IN')}</AmountText>
          <ChipContainer type="expense">
            <ChipDot type="expense" />
            <ChipText type="expense">Operational</ChipText>
          </ChipContainer>
        </SmallCard>
      </CardsRow>

      <HeroCard>
        <HeroLabel>Current Liquidity</HeroLabel>
        <HeroAmountText>₹ {BALANCE_IN_HAND.toLocaleString('en-IN')}</HeroAmountText>
      </HeroCard>
    </View>
  );
};
