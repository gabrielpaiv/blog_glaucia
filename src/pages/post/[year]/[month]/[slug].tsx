import Head from 'next/head'
import { useRouter } from 'next/router'
import { GetStaticPaths, GetStaticProps } from 'next'

import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import Prismic from '@prismicio/client'
import { getPrismicClient } from '../../../../services/prismic'

import { IoBookOutline, IoCalendarOutline, IoPerson } from 'react-icons/io5'

import common from '../../../../styles/common.module.scss'
import styles from './post.module.scss'
import { RichText } from 'prismic-dom'
import Link from 'next/link'

interface Post {
  first_publication_date: string | null
  last_publication_date: string | null
  data: {
    title: string
    author: string
    content: {
      heading: string
      body: {
        text: string
      }[]
    }[]
  }
}

interface PostProps {
  post: Post
  navigation: {
    prevPost: {
      uid: string
      first_publication_date: string | null
      data: {
        title: string
      }
    }[]
    nextPost: {
      uid: string
      first_publication_date: string | null
      data: {
        title: string
      }
    }[]
  }
}

export default function MyPost({ post, navigation }: PostProps) {
  const totalWords = post?.data.content.reduce((total, contentItem) => {
    total += contentItem.heading ? contentItem.heading?.split(' ').length : 0

    const words = contentItem.body.map(item => item.text?.split(' ').length)
    words.map(word => {
      word ? (total += word) : ''
    })

    return total
  }, 0)
  const router = useRouter()

  if (router.isFallback) {
    return <h1 className={common.bodyContent}>Carregando...</h1>
  }

  const nextPostPublicationDate = new Date(
    navigation.nextPost[0]?.first_publication_date
  )
  const prevPostPublicationDate = new Date(
    navigation.prevPost[0]?.first_publication_date
  )

  const nextPostParams = {
    year: nextPostPublicationDate.getFullYear().toString() || '',
    month: String(nextPostPublicationDate.getMonth() + 1) || ''
  }
  const prevPostParams = {
    year: prevPostPublicationDate.getFullYear().toString() || '',
    month: String(prevPostPublicationDate.getMonth() + 1) || ''
  }

  return (
    <>
      <Head>
        <title>{post.data.title}</title>
      </Head>
      <main className={common.bodyContent}>
        <article className={styles.content}>
          <div className={styles.head}>
            <h1>{post.data.title}</h1>
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

              <div>
                <IoBookOutline size={20} />
                {Math.ceil(totalWords / 200)} min
              </div>
            </div>
            {post.first_publication_date !== post.last_publication_date && (
              <p>
                * editado em{' '}
                {format(
                  new Date(post.last_publication_date),
                  'dd MMM yyyy, H:mm',
                  {
                    locale: ptBR
                  }
                )}
              </p>
            )}
          </div>
          {post.data.content.map(item => {
            return (
              <div key={item.heading}>
                <h3>{item.heading}</h3>
                <section
                  dangerouslySetInnerHTML={{
                    __html: RichText.asHtml(item.body)
                  }}
                />
              </div>
            )
          })}
        </article>
        <footer className={styles.footerContent}>
          <aside className={styles.postNavigation}>
            {navigation.nextPost[0] && (
              <div className={styles.navigationNext}>
                <h4>{navigation.nextPost[0].data.title}</h4>
                <Link
                  href={`/post/${nextPostParams.year}/${nextPostParams.month}/${navigation.nextPost[0].uid}`}
                >
                  <a>Próximo post</a>
                </Link>
              </div>
            )}
            {navigation.prevPost[0] && (
              <div className={styles.navigationPrev}>
                <h4>{navigation.prevPost[0].data.title}</h4>
                <Link
                  href={`/post/${prevPostParams.year}/${prevPostParams.month}/${navigation.prevPost[0].uid}`}
                >
                  <a>Post anterior</a>
                </Link>
              </div>
            )}
          </aside>
        </footer>
      </main>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient()
  const posts = await prismic.query([
    Prismic.predicates.at('document.type', 'posts')
  ])

  const paths = posts.results.map(post => {
    const slug = post.uid
    const year = new Date(post.first_publication_date).getFullYear().toString()
    const month = new Date(post.first_publication_date).getMonth().toString()
    return {
      params: {
        year,
        month,
        slug
      }
    }
  })

  return {
    paths,
    fallback: true
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params
  const prismic = getPrismicClient()

  const response = await prismic.getByUID<any>('posts', String(slug), {})

  const nextPost = await prismic.query(
    [Prismic.Predicates.at('document.type', 'posts')],
    {
      pageSize: 1,
      after: response.id,
      orderings: '[document.first_publication_date]'
    }
  )
  const prevPost = await prismic.query(
    [Prismic.Predicates.at('document.type', 'posts')],
    {
      pageSize: 1,
      after: response.id,
      orderings: '[document.first_publication_date desc]'
    }
  )
  const post = {
    first_publication_date: response.first_publication_date,
    last_publication_date: response.last_publication_date,
    uid: response.uid,

    data: {
      title: response.data.title,
      subtitle: response.data.subtitle,
      author: response.data.author,
      content: response.data.content
    }
  }

  return {
    props: {
      post,
      navigation: {
        prevPost: prevPost?.results,
        nextPost: nextPost?.results
      }
    },
    revalidate: 60 * 60 * 24
  }
}
