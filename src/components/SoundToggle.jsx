import { useEffect, useState } from 'react'
import Icon from './Icon.jsx'
import { sound } from '../utils/sound.js'

export default function SoundToggle() {
  const [on, setOn] = useState(sound.enabled)
  useEffect(() => sound.subscribe(setOn), [])
  return (
    <button
      type="button"
      className="icon-btn"
      onClick={() => sound.toggle()}
      aria-pressed={on}
      aria-label={on ? 'خاموش کردن افکت‌های صوتی' : 'روشن کردن افکت‌های صوتی'}
      title={on ? 'صدا روشن' : 'صدا خاموش'}
    >
      <Icon name={on ? 'sound' : 'mute'} size={18} />
    </button>
  )
}
