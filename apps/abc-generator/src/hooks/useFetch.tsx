import { DependencyList, useCallback, useEffect, useState } from 'react'

export default function useFetch<T>(
  asyncFunc: () => Promise<any>,
  endFunc?: (result: T) => void,
  deps: DependencyList[] = []
) {
  const [posts, setPosts] = useState<T>()

  const myEndFunc = useCallback(
    (result: T) => {
      if (endFunc) endFunc(result)
    },
    [endFunc]
  )

  useEffect(() => {
    async function fetchPosts() {
      try {
        const result = await asyncFunc()
        setPosts(result)
        if (myEndFunc) myEndFunc(result)
      } catch (error) {
        console.error(error)
      }
    }

    fetchPosts()
  }, [...deps, myEndFunc])

  return {
    data: posts,
  }
}
