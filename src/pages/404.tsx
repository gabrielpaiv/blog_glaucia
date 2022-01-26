import Head from 'next/head'
import Link from 'next/link'
import common from '../styles/common.module.scss'

export default function NotFound() {
  return (
    <>
      <Head>
        <title>Não encontrado</title>
      </Head>
      <Link href="/">
        <a>
          <main className={common.bodyContent}>
            <h1>404</h1>
            <p>
              Parece que esta página não existe, verifique o endereço digitado.
            </p>
          </main>
        </a>
      </Link>
    </>
  )
}
