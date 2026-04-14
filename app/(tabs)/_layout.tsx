import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';


export default function Layout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0F0F0F',
          borderTopColor: '#1C1C1E',
        },
        tabBarActiveTintColor: '#2563EB',
        tabBarInactiveTintColor: '#777',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={22} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="coleta"
        options={{
          title: 'Coleta',
          tabBarIcon: ({ color }) => (
            <Ionicons name="camera" size={22} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="clientes"
        options={{
          title: 'Clientes',
          tabBarIcon: ({ color }) => (
            <Ionicons name="people" size={22} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="financeiro"
        options={{
          title: 'Financeiro',
          tabBarIcon: ({ color }) => (
            <Ionicons name="cash" size={22} color={color} />
          ),
        }}
      />   

      <Tabs.Screen
          name="pecas"
          options={{
            title: 'Peças',
            tabBarIcon: ({ color }) => (
              <Ionicons name="shirt-outline" size={22} color={color} />
            ),
          }}
        />
      </Tabs>
    
  );
}