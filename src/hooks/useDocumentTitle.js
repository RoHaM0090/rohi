import { useEffect } from 'react'

const BASE = 'ROHAM PIRZADI — ROHI | Creative Developer & Designer'
export function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} — ROHI` : BASE
  }, [title])
}
