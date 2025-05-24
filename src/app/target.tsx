import { Alert, View } from 'react-native'
import { useEffect, useState } from 'react'
import { router, useLocalSearchParams } from 'expo-router'

import { Input } from '@/components/Input'
import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/Button'
import { CurrencyInput } from '@/components/CurrencyInput'
import { useTargetDatabase } from '@/database/useTargetDatabase'


export default function Target() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [name, setName] = useState('')
  const [amount, setAmount] = useState(0)

  const params = useLocalSearchParams<{ id?: string }>()
  const targetDatabase = useTargetDatabase()

  function handleSave() {
    if (!name.trim() || amount <= 0) {
      return Alert.alert(
        'Atenção',
        'Preencha o nome e o valor precisa ser maior que zero.',
      )
    }

    setIsProcessing(true)

    if (params.id) {
      // update
    } else {
      create()
    }
  }

  async function create() {
    await targetDatabase.create({ name, amount })
    try {
      Alert.alert('Nova Meta', 'Meta criada com sucesso!', [
        {
          text: 'Ok',
          onPress: router.back,
        },
      ])
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível criar a meta.')
      console.log(error)
      setIsProcessing(false)
    }
  }

  async function fetchDetails(id: number) {
    try {
      const response = await targetDatabase.show(id)
      setName(response.name)
      setAmount(response.amount)
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os detalhes da meta.')
      console.log(error)
    }
  }

  useEffect(() => {
    if (params.id) {
      fetchDetails(Number(params.id))
    }
  }, [params.id])

  return (
    <View style={{ flex: 1, padding:24}}>
      
      <PageHeader
        title="Meta"
        subtitle="Economize para alcançar sua meta financeira."
        // rightButton={{
        //     icon:  "edit",
        //     onPress: () => {}
        //   }           
        // }         
      />

       <View style={{ marginTop: 32, gap: 24 }}>
        <Input
          label="Nova meta"
          placeholder="Ex: Viagem para praia, Apple Watch"
          onChangeText={setName}
          value={name}
        />
        <CurrencyInput 
          label='valor alvo'
          value={amount}
          onChangeValue={setAmount}
         />
        
        <Button
          title="Salvar"
          isProcessing={isProcessing}
          onPress={handleSave}
        />

      </View>
    </View>
  )
}