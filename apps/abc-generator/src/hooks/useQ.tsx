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

  const addOptions = useMutation({
    mutationFn: (newDatas: Partial<Option>) => {
      return axiosApi.post('/options', newDatas)
    },
    onSuccess: () => {
      queryClient.invalidateQueries('options', { exact: false })
    },
  })

  const deleteOptions = useMutation({
    mutationFn: (id: number) => {
      return axiosApi.delete(`/options/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries('options', { exact: false })
    },
  })

  return {
    changeDataOption: (id: number, newData: Partial<Option>) => {
      return changeData.mutate({ id, newData })
    },
    addOptions: (newDatas: Omit<Option, 'id'>[]) => {
      for (const newData of newDatas) {
        addOptions.mutate(newData)
      }
    },
    deleteOptions: deleteOptions.mutate,
  }
}
