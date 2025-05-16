import { Button, Text, View } from 'react-native'
import { router } from 'expo-router'

export default function Index() {
  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      <Text>Expo Router</Text>
      <Button title="Nova meta" onPress={() => router.navigate('/target')} />
    </View>
  )
}