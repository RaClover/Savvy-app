// home.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { interpolate, useAnimatedStyle, runOnJS, SharedValue } from 'react-native-reanimated';
import Carousel from 'react-native-reanimated-carousel';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useHeaderHeight } from '@react-navigation/elements';
import { supabase } from '@/utils/supabase';
import WidgetList from '@/components/SortableList/WidgetList';
import Colors from '@/constants/Colors';
import { defaultStyles } from '@/constants/Styles';
import { Ionicons } from '@expo/vector-icons';
import CreditCard from "@/components/CreditCard";
import { useAuth, useUser } from '@clerk/clerk-expo';

interface Transaction {
  id: string;
  transaction_type: string;
  amount: number;
  currency: string;
  merchant: string;
  category: string;
  time: string; // or number depending on your schema
  created_at: string;
}

interface Card {
  id: string;
  current_balance: number | null;
  card_number: string | null;
  bank_name: string | null;
}

const PAGE_WIDTH = 340;
const PAGE_HEIGHT = 180;

// Define an array of colors
const cardColors = ['#FFC107', '#03A9F4', '#4CAF50', '#E91E63', '#FF9800'];

function withAnchorPoint(
    transform: any,
    anchorPoint: { x: number; y: number },
    size: { width: number; height: number }
) {
  'worklet';

  const translateX = size.width * anchorPoint.x;
  const translateY = size.height * anchorPoint.y;

  return {
    ...transform,
    transform: [
      { translateX: -translateX },
      { translateY: -translateY },
      ...transform.transform,
      { translateX },
      { translateY },
    ],
  };
}

const Page = () => {
  const headerHeight = useHeaderHeight();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [supabaseUserId, setSupabaseUserId] = useState<string | null>(null);
  const [totalBalance, setTotalBalance] = useState<number>(0);
  const [cards, setCards] = useState<Card[]>([]);
  const { user } = useUser();

  useEffect(() => {
    const getUserId = async () => {
      const userId = await AsyncStorage.getItem('supabaseUserId');
      setSupabaseUserId(userId);
    };
    getUserId();
  }, []);

  const fetchTransactions = async (userId: string) => {
    const { data, error } = await supabase
        .from('transactions')
        .select(`
        id, transaction_type, amount, currency, merchant, category, time, created_at,
        bank_cards!inner(user_id)
      `)
        .eq('bank_cards.user_id', userId)
        .order('created_at', { ascending: false })
        .limit(8);
    if (error) {
      console.error('Error fetching transactions:', error);
    } else {
      console.log('Fetched transactions:', data);
      setTransactions(data as Transaction[]);
    }
  };

  const fetchTotalBalance = async (userId: string) => {
    const { data, error } = await supabase
        .from('bank_cards')
        .select('current_balance, card_number, bank_name')
        .eq('user_id', userId);
    if (error) {
      console.error('Error fetching card balances:', error);
    } else {
      console.log('Fetched card balances:', data);
      setCards(data as Card[]);
      const total = data.reduce((sum: number, card: Card) => sum + (card.current_balance ?? 0), 0);
      setTotalBalance(total);
    }
  };

  useEffect(() => {
    if (supabaseUserId) {
      fetchTransactions(supabaseUserId);
      fetchTotalBalance(supabaseUserId);

      const transactionChannel = supabase
          .channel('public:transactions')
          .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'transactions' }, (payload: { new: Transaction }) => {
            runOnJS(() => {
              setTransactions((prevTransactions) => {
                const updatedTransactions = [payload.new, ...prevTransactions];
                return updatedTransactions.slice(0, 8);
              });
            });
          })
          .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'transactions' }, (payload: { old: { id: string } }) => {
            runOnJS(() => {
              setTransactions((prevTransactions) => {
                return prevTransactions.filter(transaction => transaction.id !== payload.old.id);
              });
            });
          })
          .subscribe();

      const cardChannel = supabase
          .channel('public:bank_cards')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'bank_cards' }, () => {
            fetchTotalBalance(supabaseUserId);
          })
          .subscribe();

      return () => {
        supabase.removeChannel(transactionChannel);
        supabase.removeChannel(cardChannel);
      };
    }
  }, [supabaseUserId]);

  const renderIcon = (transaction: Transaction) => {
    let iconName: keyof typeof Ionicons.glyphMap = 'add';
    let iconColor = Colors.primary;

    if (transaction.transaction_type === 'payment' || transaction.transaction_type === 'transfer') {
      iconName = 'remove';
      iconColor = 'black';
    }
    if (transaction.transaction_type === 'deposit') {
      iconName = 'add';
      iconColor = 'black';
    }
    return <Ionicons name={iconName} size={24} color={iconColor} />;
  };

  const CardComponent = ({
                           card,
                           index, // Add index to the props
                           animationValue,
                         }: {
    card: Card;
    index: number; // Add index type
    animationValue: SharedValue<number>;
  }) => {
    const WIDTH = PAGE_WIDTH / 1.5;
    const HEIGHT = PAGE_HEIGHT;

    const cardStyle = useAnimatedStyle(() => {
      const scale = interpolate(
          animationValue.value,
          [-0.1, 0, 1],
          [0.95, 1, 1],
          "clamp"
      );

      const translateX = interpolate(
          animationValue.value,
          [-1, -0.2, 0, 1],
          [0, WIDTH * 0.3, 0, 0],
          "clamp"
      );

      const transform = {
        transform: [
          { scale },
          { translateX },
          { perspective: 200 },
          {
            rotateY: `${interpolate(
                animationValue.value,
                [-1, 0, 0.4, 1],
                [30, 0, -25, -25],
                "clamp"
            )}deg`,
          },
        ],
      };

      return {
        ...withAnchorPoint(
            transform,
            { x: 0.5, y: 0.5 },
            { width: WIDTH, height: HEIGHT },
        ),
      };
    }, [card.id]);

    const blockStyle = useAnimatedStyle(() => {
      const translateX = interpolate(
          animationValue.value,
          [-1, 0, 1],
          [0, 60, 60],
          "clamp"
      );

      const translateY = interpolate(
          animationValue.value,
          [-1, 0, 1],
          [0, -40, -40],
          "clamp"
      );

      const rotateZ = interpolate(
          animationValue.value,
          [-1, 0, 1],
          [0, 0, -25],
          "clamp"
      );

      return {
        transform: [
          { translateX },
          { translateY },
          { rotateZ: `${rotateZ}deg` },
        ],
      };
    }, [card.id]);

    const cardColor = cardColors[index % cardColors.length]; // Determine color based on index

    return (
        <Animated.View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
        >
          <Animated.View
              style={[
                {
                  backgroundColor: cardColor, // Use cardColor here
                  alignSelf: "center",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 20,
                  width: WIDTH,
                  height: HEIGHT,
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 8,
                  },
                  shadowOpacity: 0.44,
                  shadowRadius: 10.32,
                  elevation: 16,
                },
                cardStyle,
              ]}
          >
            <CreditCard
                name={user?.firstName + " " + user?.lastName}
                date="11/22"
                suffix={card.card_number ?? "0000"}
                balance={card.current_balance ?? 0}
                bank_name={card.bank_name ?? "Unknown"}
                color={cardColor} // Pass cardColor to CreditCard component
            />
          </Animated.View>

          <Animated.View
              style={[
                {
                  width: WIDTH * 0.8,
                  borderRadius: 16,
                  justifyContent: "center",
                  alignItems: "center",
                  position: "absolute",
                  zIndex: 999,
                },
                blockStyle,
              ]}
          />
        </Animated.View>
    );
  };

  return (
      <ScrollView
          style={{ backgroundColor: Colors.background }}
          contentContainerStyle={{
            paddingTop: headerHeight,
          }}
      >
        <View style={styles.account}>
          <View style={styles.row}>
            <Text style={styles.balance}>{totalBalance.toFixed(2)}</Text>
            <Text style={styles.currency}>₽</Text>
          </View>
          <TouchableOpacity
              style={styles.totalBalance}
          >
            <Text style={[defaultStyles.buttonTextSmall, { color: Colors.dark, fontSize: 20, }]}>
              Total Balance
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={defaultStyles.sectionHeader}>Your Cards</Text>
        <View style={styles.actionRow}>
          {cards.length > 1 ? (
              <Carousel
                  width={PAGE_WIDTH}
                  height={PAGE_HEIGHT}
                  loop
                  autoPlay={false}
                  data={cards}
                  renderItem={({ item, index, animationValue }) => (
                      <CardComponent card={item} index={index} animationValue={animationValue} />
                  )}
              />
          ) : (
              cards.length === 1 && (
                  <CreditCard
                      name={user?.firstName + " " + user?.lastName}
                      date="11/22"
                      suffix={cards[0].card_number ?? "0000"}
                      balance={cards[0].current_balance ?? 0}
                      bank_name={cards[0].bank_name ?? "Unknown"}
                      color={cardColors[0]} // Use first color for single card
                  />
              )
          )}
        </View>

        <View style={styles.transactions}>
          {transactions.length === 0 && (
              <Text style={{ padding: 14, color: Colors.gray }}>No transactions yet</Text>
          )}
          {transactions.map((transaction) => (
              <View
                  key={transaction.id}
                  style={{ flexDirection: "row", alignItems: "center", gap: 16 }}
              >
                <View
                    style={[
                      styles.circle,
                      {
                        backgroundColor:
                            transaction.transaction_type === "payment" ||
                            transaction.transaction_type === "transfer"
                                ? "red"
                                : "green",
                      },
                    ]}
                >
                  {renderIcon(transaction)}
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: "400" }}>{transaction.category}</Text>
                  <Text style={{ color: Colors.gray, fontSize: 12 }}>
                    {new Date(transaction.time).toLocaleString()}
                  </Text>
                </View>
                <Text>{transaction.amount} ₽</Text>
              </View>
          ))}
        </View>
        <Text style={defaultStyles.sectionHeader}>Widgets</Text>
        <WidgetList />
      </ScrollView>
  );
};

const styles = StyleSheet.create({
  account: {
    margin: 20,
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    gap: 10,
  },
  header: {
    fontSize: 36,
    fontWeight: "900",
    textTransform: "uppercase",
    color: "black",
  },
  balance: {
    fontSize: 50,
    fontWeight: "bold",
  },
  currency: {
    fontSize: 20,
    fontWeight: "500",
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
  },
  transactions: {
    marginHorizontal: 20,
    padding: 14,
    backgroundColor: "#fff",
    borderRadius: 16,
    gap: 20,
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    marginHorizontal: "auto",
    maxWidth: 500,
    marginTop: 20,
  },
  totalBalance: {
    paddingHorizontal: 20,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 1
  }
});

export default Page;
