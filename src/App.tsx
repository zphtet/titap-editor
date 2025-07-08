import TipTap from '@/components/tiptap'
import Simple from '@/components/simple'
import EditableComponent from './components/editable-com'

const App = () => {
  return (
    <div>
      {/* <p>tiptap editor</p> */}
      {/* <TipTap /> */}
      <Simple />

      <div>
        <p style={{color: 'red' , textAlign:"center"}}>editable component</p>
         <EditableComponent />
      </div>
    </div>
  )
}

export default App