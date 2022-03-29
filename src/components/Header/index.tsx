import Link from 'next/link'

import styles from './header.module.scss'
import common from '../../styles/common.module.scss'

export default function Header() {
  return (
    <header className={styles.container}>
      <div className={styles.content}>
        <Link href="/">
          <a>
            <img src="/images/logo.svg" alt="logo" />
            <h2>Glaucia Cavalcanti</h2>
          </a>
        </Link>
      </div>
    </header>
  )
}
