import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient , AuthChangeEvent , Session} from '@supabase/supabase-js';
import { AppState } from 'react-native';

const supabaseUrl = 'https://peoqsdozojjavcgiaous.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBlb3FzZG96b2pqYXZjZ2lhb3VzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU1NjM3NjMsImV4cCI6MjAzMTEzOTc2M30.jTLhDNNokpx0vRe-eSmNp8aCo60hRh-YIFfBpn0rtBQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});

// Fetch transactions
export const fetchTransactions = async (userId: string) => {
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
        return [];
    }
    return data;
};

// Fetch total balance
export const fetchTotalBalance = async (userId: string) => {
    const { data, error } = await supabase
        .from('bank_cards')
        .select('current_balance, card_number, bank_name')
        .eq('user_id', userId);
    if (error) {
        console.error('Error fetching card balances:', error);
        return { cards: [], total: 0 };
    }
    const total = data.reduce((sum: number, card: any) => sum + (card.current_balance ?? 0), 0);
    return { cards: data, total };
};

// Subscribe to transaction changes
export const subscribeToTransactionChanges = (userId: string, setTransactions: (transactions: any) => void) => {
    return supabase
        .channel('public:transactions')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'transactions' }, (payload: { new: any }) => {
            setTransactions((prevTransactions: any) => {
                const updatedTransactions = [payload.new, ...prevTransactions];
                return updatedTransactions.slice(0, 8);
            });
        })
        .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'transactions' }, (payload: { old: { id: string } }) => {
            setTransactions((prevTransactions: any) => {
                return prevTransactions.filter((transaction: any) => transaction.id !== payload.old.id);
            });
        })
        .subscribe();
};

// Subscribe to card balance changes
export const subscribeToCardBalanceChanges = (userId: string, fetchTotalBalance: (userId: string) => void) => {
    return supabase
        .channel('public:bank_cards')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'bank_cards' }, () => {
            fetchTotalBalance(userId);
        })
        .subscribe();
};

