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

import notifee, {AndroidImportance, AuthorizationStatus, EventType, TriggerType} from '@notifee/react-native'

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

  notifee.onBackgroundEvent(async ({ type, detail}) => {
    const { notification, pressAction } = detail;
    if(type === EventType.PRESS){
      console.log("Notificação Background: ", pressAction?.id)
      if(notification?.id){
        await notifee.cancelNotification(notification?.id)
      }
    }
  })

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

  async function handleScheduleNotification(){
    const date = new Date(Date.now());

    console.log(date.getTime())
    date.setSeconds(date.getSeconds() + 10);

    const trigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: date.getTime()
    }
    console.log(date.getTime())
    await notifee.createTriggerNotification({
      title: "Lembrete Estudo",
      body: "Estudar JavaScript as 15:30",
      android:{
        channelId: 'lembrete',
        importance: AndroidImportance.HIGH,
        pressAction: {
          id: 'default',
        }
      }
    }, trigger)
  }


  return (
    <View>
      <Text>Notifee instalado.</Text>
      <Button
        title="Notificação"
        onPress={handleNotificate}
      />
      <Button
        title="Agendar notificação"
        onPress={handleScheduleNotification}
      />
    </View>
  );
}