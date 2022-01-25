import Link from 'next/link'

import styles from './header.module.scss'

export default function Header() {
  return (
    <header className={styles.container}>
      <div className={styles.content}>
        <Link href="/">
          <a>
            <img src="/images/logo.svg" alt="logo" />
          </a>
        </Link>
        <h1>Glaucia Cavalcanti</h1>
      </div>
    </header>
  )
}
