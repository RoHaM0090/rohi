import Btn from '../components/Btn.jsx'
import { Claws } from '../components/Motifs.jsx'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'

export default function NotFound() {
  useDocumentTitle('۴۰۴')
  return (
    <div className="page container nf">
      <Claws className="nf-claws" />
      <p className="eyebrow latin">ERROR // 404</p>
      <h1 className="shead-title">این مسیر وجود ندارد.</h1>
      <p className="lead">شاید آدرس اشتباه است یا پروژه حذف شده.</p>
      <Btn to="/" icon="arrow">بازگشت به خانه</Btn>
    </div>
  )
}
