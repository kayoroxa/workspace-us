import useFetch from '@/hooks/useFetch'
import useAppStore from '@/store/useAppStore'
import useBlockStore from '@/store/useBlockStore'
import GenerateScriptTemplate from '../templates/GenerateScriptTemplate'
import { axiosApi } from '../utils/axiosApi'

type Data = {
  id: number
  name: string
  options: {
    name: string
    countReview: number
  }[]
}[]

export default function GenerateScript() {
  // const {
  //   isLoading,
  //   error,
  //   data: posts,
  // } = useQuery('categories', async () => {

  // })
  const setCategories = useAppStore(s => s.setCategories)
  const categories = useAppStore(s => s.categories)
  const selectedIn = useBlockStore(s => s.selectedIn)

  useFetch<Data>(async () => {
    const response = await axiosApi.get<Data>('/categories')
    return response.data
    // return response.data.map(post => {
    //   return {
    //     ...post,
    //     options: post.options.sort((a, b) => a.countReview - b.countReview),
    //   }
    // })
  }, setCategories)

  return (
    <div>
      {/* {JSON.stringify(categories)} */}
      <GenerateScriptTemplate data={categories || []} />
    </div>
  )
}
