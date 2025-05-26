import { View ,StatusBar, Alert} from 'react-native'
import { useCallback , useState} from 'react'
import { router, useFocusEffect } from 'expo-router'

import { HomeHeader, HomeHeaderProps } from '@/components/HomeHeader'
import { Target, TargetProps } from '@/components/Target'
import { List } from '@/components/List'
import { Loading } from '@/components/Loading'
import { Button } from '@/components/Button'

import { numberToCurrency } from '@/utils/numberToCurrency'

import { useTargetDatabase } from '@/database/useTargetDatabase'
import { useTransactionDatabase } from '@/database/useTransactionsDatabase'

const summary = {
  total: 'R$ 2.680,00',
  input: { label: 'Entradas', value: 'R$ 6.184,90' },
  output: { label: 'Saídas', value: '-R$ 883,65' },
}

export default function Index() {
  const [summary, setSummary] = useState<HomeHeaderProps>()
  const [targets, setTargets] = useState<TargetProps[]>([])
  const [isFetching, setIsFetching] = useState(true)

  const transactionsDatabase = useTransactionDatabase()
  const targetDatabase = useTargetDatabase()

  async function fetchTargets() {
    try {
      const response = await targetDatabase.listByClosestTarget()
      return response.map((item) => ({
        id: String(item.id),
        name: item.name,
        current: numberToCurrency(item.current),
        percentage: item.percentage.toFixed(0) + '%',
        target: numberToCurrency(item.amount),
      }))
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar as metas.')
      console.log(error)
    }
  }

  async function fetchSummary(): Promise<HomeHeaderProps> {
    try {
      const response = await transactionsDatabase.summary()

      return {
        total: numberToCurrency(response.input + response.output),
        input: {
          label: 'Entradas',
          value: numberToCurrency(response.input),
        },
        output: {
          label: 'Saídas',
          value: numberToCurrency(response.output),
        },
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar o resumo.')
      console.log(error)
    }
  }

  async function fetchData() {
    const targetDataPromise = fetchTargets()
    const dataSummaryPromise = fetchSummary()

    const [targetData, dataSummary] = await Promise.all([
      targetDataPromise,
      dataSummaryPromise,
    ])

    setSummary(dataSummary)
    setTargets(targetData)
    setIsFetching(false)
  }

  useFocusEffect(
    useCallback(() => {
      fetchData()
    }, []),
  )

  if (isFetching) {
    return <Loading />
  }

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