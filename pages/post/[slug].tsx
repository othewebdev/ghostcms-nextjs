import Link from 'next/link';
import {useRouter} from 'next/router';
import React, {useState} from 'react';
import styles from '../../styles/Home.module.scss';


const { BLOG_URL, CONTENT_API_KEY} = process.env

async function getPost(slug:string) {
    // curl "https://demo.ghost.io/ghost/api/v3/content/posts/?key=22444f78447824223cefc48062"
    const res = await fetch(`${BLOG_URL}/ghost/api/v3/content/posts/slug/${slug}?key=${CONTENT_API_KEY}&fields=title,url,html,created_at,slug,feature_image`).then((res) => res.json())

    const posts = res.posts
    return posts[0]
}

// GhostCMSRequest
export const getStaticProps = async ({ params }) => {
    const post = await getPost(params.slug);
    return {
        revalidate: 10,
        props: { post }
        
    }
}

//limits slugs but not restricting

export const getStaticPaths = () => {
    //paths -> slugs that are allowed
    //fallback -> 
    return {
        paths: [],
        fallback: true
    }

}

type Post = {
    title: string 
    html: string
    slug: string
}

const Post: React.FC<{post: Post}> = (props) => {
    console.log(props)

    const { post } = props 
    const [enableLoadComments, setEnableLoadComments] = useState<boolean>(true)

    const router = useRouter()

    if(router.isFallback){
        return <h1>Loading...</h1>   
    }
    
    function loadComments() {
        setEnableLoadComments(false)
        ;(window as any).disqus_config = function () {
            this.page.url = window.location.href;
            this.page.identifier = post.slug;
        };

        const script = document.createElement('script');
        script.src = 'https://techablog.disqus.com/embed.js';
        script.setAttribute('data-timestamp', Date.now().toString());
        document.body.appendChild(script)
    }

    return (
        <div className={styles.container}>
            <Link href="/">
                <a className={styles.goback}>Go Back</a>
            </Link>
            <h1 className={styles.h}>{post.title}</h1>
            <div className={styles.p} dangerouslySetInnerHTML={{__html:post.html }}></div>
            {enableLoadComments && (<p onClick={loadComments} className={styles.goback}>
                <a>Load Comments</a>
            </p>)}
            <div className={styles.disqus_thread} id="disqus_thread"></div>
        </div>
    )
}

export default Post