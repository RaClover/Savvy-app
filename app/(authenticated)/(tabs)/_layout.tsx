import Colors from '@/constants/Colors';
import { FontAwesome } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { BlurView } from 'expo-blur';
import CustomHeader from '@/components/CustomHeader';
import { registerBackgroundFetchAsync } from '@/tasks/backgroundFetchTasks';
import {useEffect} from "react";
import SMSListener from "@/components/SMSListener";

const Layout = () => {
    useEffect(() => {
        registerBackgroundFetchAsync();
    }, []);
  return (
      <>
          <SMSListener />
          <Tabs
          screenOptions={{
              tabBarActiveTintColor: Colors.primary,
              tabBarBackground: () => (<BlurView
                  intensity={80}
                  style={{
                      flex: 1,
                      backgroundColor: Colors.lightGray,
                  }}/>),
              tabBarStyle: {
                  backgroundColor: 'transparent',
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  elevation: 0,
                  borderTopLeftRadius: 0,
                  borderTopRightRadius: 0,
                  overflow: 'hidden',
              },
          }}>
          <Tabs.Screen
              name="home"
              options={{
                  title: 'Dashboard',
                  tabBarIcon: ({size, color}) => (
                      <FontAwesome name="dashboard" size={size} color={color}/>
                  ),
                  header: () => <CustomHeader/>,
                  headerTransparent: true,
              }}/>
          <Tabs.Screen
              name="analysis"
              options={{
                  title: 'Analysis',
                  tabBarIcon: ({size, color}) => (
                      <FontAwesome name="line-chart" size={size} color={color}/>
                  ),
              }}/>

          <Tabs.Screen
              name="assistant"
              options={{
                  title: 'Assistant',
                  tabBarIcon: ({size, color}) => (
                      <FontAwesome name="microphone" size={size} color={color}/> // Ensure you have the 'microphone' icon in FontAwesome or choose a suitable one from another library
                  ),
                  header: () => <CustomHeader/>,
                  headerTransparent: true,
              }}/>

          <Tabs.Screen
              name="transactions"
              options={{
                  title: 'Transactions',
                  tabBarIcon: ({size, color}) => (
                      <FontAwesome name="exchange" size={size} color={color}/>
                  ),
              }}/>
          <Tabs.Screen
              name="more"
              options={{
                  title: 'More',
                  tabBarIcon: ({size, color}) => <FontAwesome name="th" size={size} color={color}/>,
              }}/>
      </Tabs>
          </>


  );
};
export default Layout;
