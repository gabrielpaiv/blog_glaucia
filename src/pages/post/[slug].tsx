interface Post {
  first_publication_date: string | null
  last_publication_date: string | null
  data: {
    title: string
    author: string
    piece: {
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
      data: {
        title: string
      }
    }[]
    nextPost: {
      uid: string
      data: {
        title: string
      }
    }[]
  }
}

export default function Post({ post, navigation }: PostProps) {}
