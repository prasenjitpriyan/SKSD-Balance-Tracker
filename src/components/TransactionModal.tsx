import React, { useState } from 'react';
import { Modal, TouchableOpacity, Platform, KeyboardAvoidingView, View, Text, TextInput, ActivityIndicator } from 'react-native';
import styled from 'styled-components/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Transaction } from '../types';

const Overlay = styled.View`
  flex: 1;
  background-color: rgba(0,0,0,0.5);
  justify-content: flex-end;
`;

const ModalContainer = styled.View`
  background-color: #FFFFFF;
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  padding: 24px;
  min-height: 400px;
`;

const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const Title = styled.Text<{ type: 'income' | 'expense' }>`
  font-size: 20px;
  font-weight: 700;
  color: ${({ type }) => type === 'income' ? '#2E7D32' : '#C62828'};
`;

const CloseButton = styled.TouchableOpacity`
  padding: 8px;
`;

const CloseText = styled.Text`
  font-size: 16px;
  color: #757575;
  font-weight: 600;
`;

const InputGroup = styled.View`
  margin-bottom: 20px;
`;

const Label = styled.Text`
  font-size: 13px;
  color: #757575;
  margin-bottom: 8px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const StyledInput = styled.TextInput`
  background-color: #F5F5F5;
  padding: 16px;
  border-radius: 12px;
  font-size: 16px;
  color: #111111;
  font-weight: 500;
`;

const DateButtonContainer = styled.TouchableOpacity`
  background-color: #F5F5F5;
  padding: 16px;
  border-radius: 12px;
  align-items: flex-start;
`;

const SaveButton = styled.TouchableOpacity<{ primary: boolean }>`
  background-color: ${({ primary }) => primary ? '#1A237E' : '#1A237E'};
  padding: 16px;
  border-radius: 12px;
  align-items: center;
  margin-top: 12px;
  shadow-color: rgba(26, 35, 126, 0.3);
  shadow-offset: 0px 4px;
  shadow-opacity: 1;
  shadow-radius: 8px;
  elevation: 4;
`;

const SaveText = styled.Text`
  color: #FFFFFF;
  font-size: 16px;
  font-weight: 700;
`;

interface Props {
  visible: boolean;
  type: 'income' | 'expense' | null;
  onClose: () => void;
  onSave: (source: string, amount: number, date: Date, id?: string) => Promise<void>;
  initialData?: Transaction | null;
}

export const TransactionModal: React.FC<Props> = ({ visible, type, onClose, onSave, initialData }) => {
  const [source, setSource] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  // Reset form when opened
  React.useEffect(() => {
    if (visible) {
      if (initialData) {
        setSource(initialData.source);
        setAmount(initialData.amount.toString());
        setDate(initialData.created_at ? new Date(initialData.created_at) : new Date());
      } else {
        setSource('');
        setAmount('');
        setDate(new Date());
      }
      setShowDatePicker(false);
    }
  }, [visible, initialData]);

  const handleSave = async () => {
    if (!source.trim() || !amount.trim() || !type) return;
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) return;

    setLoading(true);
    await onSave(source.trim(), parsedAmount, date, initialData?.id);
    setLoading(false);
    onClose();
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) setDate(selectedDate);
  };

  if (!type) return null;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <Overlay>
          <ModalContainer>
            <Header>
              <Title type={type}>{initialData ? 'Update' : 'Add'} {type === 'income' ? 'Income' : 'Expense'}</Title>
              <CloseButton onPress={onClose} disabled={loading}>
                <CloseText>Close</CloseText>
              </CloseButton>
            </Header>

            <InputGroup>
              <Label>Source / Origin</Label>
              <StyledInput 
                placeholder={type === 'income' ? 'e.g. Salary, Donation' : 'e.g. Coffee, Electricity Bill'} 
                value={source}
                onChangeText={setSource}
                autoCapitalize="words"
                editable={!loading}
              />
            </InputGroup>

            <InputGroup>
              <Label>Amount (₹)</Label>
              <StyledInput 
                placeholder="0.00" 
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                editable={!loading}
              />
            </InputGroup>

            <InputGroup>
              <Label>Transaction Date</Label>
              {Platform.OS === 'android' ? (
                <>
                  <DateButtonContainer onPress={() => setShowDatePicker(true)} disabled={loading}>
                    <Text style={{ fontSize: 16, color: '#111111', fontWeight: '500' }}>
                      {date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </Text>
                  </DateButtonContainer>
                  {showDatePicker && (
                    <DateTimePicker
                      value={date}
                      mode="date"
                      display="default"
                      onChange={handleDateChange}
                      maximumDate={new Date()}
                    />
                  )}
                </>
              ) : (
                <View style={{ alignItems: 'flex-start', marginLeft: -10 }}>
                   <DateTimePicker
                      value={date}
                      mode="date"
                      display="default"
                      onChange={handleDateChange}
                      maximumDate={new Date()}
                    />
                </View>
              )}
            </InputGroup>

            <SaveButton primary={type === 'income'} onPress={handleSave} disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <SaveText>{initialData ? 'Update' : 'Save'} {type === 'income' ? 'Income' : 'Expense'}</SaveText>
              )}
            </SaveButton>

          </ModalContainer>
        </Overlay>
      </KeyboardAvoidingView>
    </Modal>
  );
};
