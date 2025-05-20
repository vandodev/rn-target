import {View } from 'react-native'

import { Input } from '@/components/Input'
import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/Button'
import { CurrencyInput } from '@/components/CurrencyInput'

export default function Target() {
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
        />
        <CurrencyInput label='valor alvo' value={0} />
        <Button title="Salvar" />
      </View>
    </View>
  )
}