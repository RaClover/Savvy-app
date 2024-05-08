import { View, Text , ScrollView } from 'react-native';
import {useEffect , useState} from "react";
import { fetchUsers } from '../../../database/db';
const Page = () => {
    const [users, setUsers] = useState([]);


    return (
        <ScrollView>
            <View>
                <Text>Transactions</Text>
            </View>
        </ScrollView>
    );
};

export default Page;
