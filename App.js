import React, {useEffect, useState} from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import notifee, {AndroidImportance, AuthorizationStatus, EventType} from '@notifee/react-native'

export default function App(){

  const [statusNotification, setStatusNotification] = useState(true)

  useEffect(() => {
    async function getPermission(){
      const settings = await notifee.requestPermission();
      if(settings.authorizationStatus >= AuthorizationStatus.AUTHORIZED){
        console.log(settings.authorizationStatus)
        setStatusNotification(true)
      }
      else{
        console.log('negado')
        setStatusNotification(false)
      }
    }
    getPermission();
  }, [])

  useEffect(() => {
    return notifee.onForegroundEvent(({type, detail}) => {
      switch(type){
        case EventType.DISMISSED:
          console.log("Usuario descartou a notificação");
          break;
        case EventType.PRESS:
          console.log("notificação pressionada ", detail.notification)
          break;
      }
    })
  }, [])

  async function handleNotificate(){

    if(!statusNotification){
      return
    }
    const channelId = await notifee.createChannel({
      id: 'lembrate',
      name: 'lembrete',
      vibration: true,
      importance: AndroidImportance.HIGH
    })

    await notifee.displayNotification({
      id: 'lembrete',
      title: 'estudar programação!',
      body: 'Estude react-native',
      android:{
        channelId,
        pressAction:{
          id: 'default'
        }
      }
    })
  }

  return (
    <View>
      <Text>Notifee instalado.</Text>
      <Button
        title="Notificação"
        onPress={handleNotificate}
      />
    </View>
  );
}