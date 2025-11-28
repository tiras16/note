import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { HomeScreen } from '../screens/HomeScreen';
import { EditNoteScreen } from '../screens/EditNoteScreen';
import { NoteDetailScreen } from '../screens/NoteDetailScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { Note } from '../types/note';

export type RootStackParamList = {
  Home: undefined;
  EditNote: { noteId?: string };
  NoteDetail: { noteId: string };
  Settings: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'My Notes' }} />
        <Stack.Screen name="EditNote" component={EditNoteScreen} options={{ title: 'Edit Note' }} />
        <Stack.Screen name="NoteDetail" component={NoteDetailScreen} options={{ title: 'Note Details' }} />
        <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
