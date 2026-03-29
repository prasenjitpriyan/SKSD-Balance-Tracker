import React from 'react';
import styled from 'styled-components/native';
import { Transaction } from '../types';
import { View } from 'react-native';
import * as Animatable from 'react-native-animatable';

const ListContainer = styled.View`
  background-color: #F8F9FA;
  padding-horizontal: 16px;
`;

const ItemContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-vertical: 16px;
  border-bottom-width: 1px;
  border-bottom-color: #E0E0E0;
`;

const LeftContent = styled.View`
  flex-direction: row;
  align-items: center;
  flex: 1;
`;

const IconCircle = styled.View<{ type: 'income' | 'expense' }>`
  width: 44px;
  height: 44px;
  border-radius: 22px;
  background-color: ${({ type }) => (type === 'income' ? '#E8F5E9' : '#FFEBEE')};
  justify-content: center;
  align-items: center;
  margin-right: 16px;
`;

const IconText = styled.Text<{ type: 'income' | 'expense' }>`
  color: ${({ type }) => (type === 'income' ? '#2E7D32' : '#C62828')};
  font-weight: 700;
  font-size: 18px;
`;

const SourceText = styled.Text`
  color: #111111;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
`;

const DateText = styled.Text`
  color: #757575;
  font-size: 13px;
`;

const AmountText = styled.Text<{ type: 'income' | 'expense' }>`
  color: ${({ type }) => (type === 'income' ? '#2E7D32' : '#C62828')};
  font-size: 16px;
  font-weight: 700;
`;

interface Props {
  data: Transaction[];
}

export const TransactionList: React.FC<Props> = ({ data }) => {
  const getInitial = (source: string) => source.charAt(0).toUpperCase();
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Completed';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <ListContainer>
      <View style={{ paddingBottom: 100 }}>
        {data.map((item, index) => (
          <Animatable.View 
            key={item.id} 
            animation="fadeInUp" 
            duration={500} 
            delay={index * 100}
          >
            <ItemContainer>
              <LeftContent>
                <IconCircle type={item.type}>
                  <IconText type={item.type}>{getInitial(item.source)}</IconText>
                </IconCircle>
                <View style={{ flex: 1, paddingRight: 12 }}>
                  <SourceText numberOfLines={1}>{item.source}</SourceText>
                  <DateText>{formatDate(item.created_at)}</DateText>
                </View>
              </LeftContent>
              <AmountText type={item.type}>
                {item.type === 'income' ? '+' : '-'}₹{item.amount.toLocaleString('en-IN')}
              </AmountText>
            </ItemContainer>
          </Animatable.View>
        ))}
      </View>
    </ListContainer>
  );
};
