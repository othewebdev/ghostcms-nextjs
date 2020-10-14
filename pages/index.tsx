import Head from 'next/head'
import styles from '../styles/Home.module.scss'
import Link from 'next/link'

const { BLOG_URL, CONTENT_API_KEY } = process.env

type Post = {
    title: string
    slug: string
}

async function getPosts(){
  // curl "https://demo.ghost.io/ghost/api/v3/content/posts/?key=22444f78447824223cefc48062"
  const res = await fetch(`${BLOG_URL}/ghost/api/v3/content/posts/?key=${CONTENT_API_KEY}&fields=title,url,custom_excerpt,slug,feature_image`).then((res) => res.json())

  const posts = res.posts
  return posts
}

//static props will fetch latest posts and homepage and inject it as props in main components
export const getStaticProps = async ({ params }) => {
  const posts = await getPosts();
  return {
    props: {posts}
  }
}

const Home: React.FC<{posts: Post[]}> = (props) => {

  const { posts } = props

  return (
  <div className={styles.container}>
      <h1 className={styles.h}>TechaBlog</h1>
      <ul>
          {posts.map((post, index) => {
            return (
              <li className={styles.list} key={post.slug}>
              <Link href="/post/[slug]" as={`/post/${post.slug}`}>
                <a href="#">{post.title}</a>
              </Link>
            </li>
            )
          } )}
      </ul>
  </div>
  )
}

export default Home;