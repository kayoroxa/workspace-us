import { useEffect, useState } from 'react'

export default function useFetch<T>(
  asyncFunc: () => Promise<any>,
  endFunc?: (result: T) => void
) {
  const [posts, setPosts] = useState<T>()

  useEffect(() => {
    async function fetchPosts() {
      try {
        const result = await asyncFunc()
        setPosts(result)
        if (endFunc) endFunc(result)
      } catch (error) {
        console.error(error)
      }
    }

    fetchPosts()
  }, [])

  return {
    data: posts,
  }
}
