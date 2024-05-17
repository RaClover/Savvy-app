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

