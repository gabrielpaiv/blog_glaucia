import Link from 'next/link'

import { BsInstagram, BsFacebook, BsWhatsapp } from 'react-icons/bs'

import styles from './footer.module.scss'

export default function Footer() {
  return (
    <footer className={styles.container}>
      <div className={styles.content}>
        <div>
          <a
            target="_blank"
            href="https://www.instagram.com/glauciacavalcantipsi/"
          >
            <BsInstagram />
            <span>@glauciacavalcantipsi</span>
          </a>
          <a
            target="_blank"
            href="https://www.facebook.com/glauciacavalcantipsi"
          >
            <BsFacebook />
            <span>glauciacavalcantipsi</span>
          </a>
          <a
            target="_blank"
            href="https://api.whatsapp.com/send?phone=5561992677978"
          >
            <BsWhatsapp /> <span>(61)99267-7978</span>
          </a>
        </div>
        <div>
          <h6>Serviços:</h6>
          <div className={styles.services}>
            <li>Psicoterapia online</li>
            <li>Mentoria</li>
            <li>Curso</li>
            <li>Técnicas de transformação pessoal</li>
            <li>Vídeos motivacionais</li>
          </div>
        </div>
      </div>
    </footer>
  )
}
