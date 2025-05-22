import { View ,StatusBar, Alert} from 'react-native'
import { useCallback } from 'react'
import { router, useFocusEffect } from 'expo-router'

import { HomeHeader } from '@/components/HomeHeader'
import { Target } from '@/components/Target'
import { List } from '@/components/List'
import { Button } from '@/components/Button'

import { useTargetDatabase } from '@/database/useTargetDatabase'

const summary = {
  total: 'R$ 2.680,00',
  input: { label: 'Entradas', value: 'R$ 6.184,90' },
  output: { label: 'Saídas', value: '-R$ 883,65' },
}

const targets = [
  {
    id: "1",
    name: 'Comprar uma cadeira ergonômica',
    percentage: '75%',
    current: '900,00',
    target: '1.200,00',
  },
    {
    id: "2",
    name: 'Comprar um notbook',
    percentage: '75%',
    current: '4000,00',
    target: '1.200,00',
  },
]


export default function Index() {
  const targetDatabase = useTargetDatabase()

   async function fetchTargets() {
    try {
      const response = await targetDatabase.listBySavedValue()
      console.log(response)
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar as metas.')
      console.log(error)
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchTargets()
    }, []),
  )

  return (
    <View style={{ flex: 1, }}>
      <StatusBar barStyle="light-content" />
      <HomeHeader data={summary} />     
      
      <List
        title="Metas"
        data={targets}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) =>
          <Target 
            data={item}
            onPress={() => router.navigate(`/in-progress/${item.id}`)}
          />
        }
        emptyMessage="Nenhuma meta. Toque em nova meta para criar."
        containerStyle={{ paddingHorizontal: 24 }}
      />

       <View style={{ padding: 24, paddingBottom: 32 }}>
        <Button title="Nova meta" onPress={() => router.navigate('/target')} />
      </View>
      
    </View>
  )
}