import { useState } from 'react'
import { GetStaticProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import Prismic from '@prismicio/client'
import { getPrismicClient } from '../services/prismic'

import { ptBR } from 'date-fns/locale'
import { format } from 'date-fns'

import { IoCalendarOutline, IoPerson } from 'react-icons/io5'

import Footer from '../components/Footer'

import common from '../styles/common.module.scss'
import styles from './home.module.scss'

interface Post {
  uid?: string
  first_publication_date: string | null
  data: {
    title: string
    subtitle: string
    author: string
  }
}

interface PostPagination {
  next_page: string
  results: Post[]
}

interface HomeProps {
  postsPagination: PostPagination
}

export default function Home({ postsPagination }: HomeProps) {
  const [results, setResults] = useState<Post[]>(postsPagination.results)
  const [nextPage, setNextPage] = useState(postsPagination.next_page)
  async function handleLoadPosts() {
    const newResults = await fetch(nextPage).then(response => response.json())
    setNextPage(newResults.nextPage)

    const newPosts: Post[] = newResults.results.map(result => {
      return {
        uid: result.uid,
        first_publication_date: result.first_publication_date,
        data: {
          author: result.data.author,
          title: result.data.title,
          subtitle: result.data.subtitle
        }
      }
    })
    setResults([...results, ...newPosts])
  }
  return (
    <>
      <Head>
        <title>Glaucia Cavalcanti</title>
      </Head>
      <main className={common.bodyContent}>
        <div className={styles.posts}>
          {results.map(post => {
            const date = new Date(post.first_publication_date)
            return (
              <Link
                href={`/post/${date.getFullYear()}/${date.getMonth() + 1}/${
                  post.uid
                }`}
                key={post.uid}
              >
                <a>
                  <h1>{post.data.title}</h1>
                  <p>{post.data.subtitle}</p>
                  <div className={styles.info}>
                    <div>
                      <IoCalendarOutline size={20} />
                      <time>
                        {format(
                          new Date(post.first_publication_date),
                          'dd MMM yyyy',
                          {
                            locale: ptBR
                          }
                        )}
                      </time>
                    </div>
                    <div>
                      <IoPerson size={20} />
                      {post.data.author}
                    </div>
                  </div>
                </a>
              </Link>
            )
          })}
          {nextPage ? (
            <button onClick={handleLoadPosts}>Carregar mais posts</button>
          ) : (
            ''
          )}
        </div>
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient()
  const postsResponse = await prismic.query(
    [Prismic.predicates.at('document.type', 'posts')],
    {
      fetch: [
        'publication.title',
        'publication.subtitle',
        'publication.author'
      ],
      pageSize: 5
    }
  )

  const posts = postsResponse.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: post.first_publication_date,
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author
      }
    }
  })

  return {
    props: {
      postsPagination: {
        next_page: postsResponse.next_page,
        results: posts
      },
      revalidate: 60 * 60 * 24
    }
  }
}
