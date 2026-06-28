import AppLayout from './components/layout/AppLayout'
import ChatWindow from './components/chat/ChatWindow'
import { useOllamaConnection } from './hooks/useOllamaConnection'

export default function App() {
  useOllamaConnection()

  return (
    <AppLayout>
      <ChatWindow />
    </AppLayout>
  )
}
