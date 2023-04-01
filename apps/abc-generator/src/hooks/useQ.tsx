import { axiosApi } from '@/utils/axiosApi'
import { Option } from '@/utils/types/Category'
import { useMutation, useQueryClient } from 'react-query'

export default function useQ() {
  const queryClient = useQueryClient()
  const changeData = useMutation({
    mutationFn: ({ id, newData }: { id: number; newData: Partial<Option> }) => {
      return axiosApi.patch(`/options/${id}`, newData)
    },
    onSuccess: () => {
      queryClient.invalidateQueries('options', { exact: false })
    },
  })

  return {
    changeDataOption: (id: number, newData: Partial<Option>) => {
      return changeData.mutate({ id, newData })
    },
  }
}
