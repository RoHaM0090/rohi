import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import Icon from './Icon.jsx'
import { sound } from '../utils/sound.js'

const ToastCtx = createContext(() => {})
export const useToast = () => useContext(ToastCtx)

export function ToastProvider({ children }) {
  const [items, setItems] = useState([])
  const id = useRef(0)

  const toast = useCallback((message, { type = 'ok', icon } = {}) => {
    const key = ++id.current
    setItems((list) => [...list.slice(-2), { key, message, type, icon }])
    sound.play('toast')
    setTimeout(() => setItems((list) => list.filter((t) => t.key !== key)), 3400)
  }, [])

  const value = useMemo(() => toast, [toast])

  return (
    <ToastCtx.Provider value={value}>
      {children}
      <div className="toasts" role="status" aria-live="polite">
        {items.map((t) => (
          <div key={t.key} className={`toast toast--${t.type}`}>
            <Icon name={t.icon || (t.type === 'err' ? 'close' : 'check')} size={18} />
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  )
}
