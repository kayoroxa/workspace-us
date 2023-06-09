import { QueryKey, useQuery } from 'react-query'

import axios from 'axios'
import { queryClient } from '../components/bubWrapper'

const BACK_PORT = process.env.BACK_PORT || '4011'

export default function dictToQuery<T>(options?: Partial<T>) {
  const optionsQuery =
    options &&
    Object.entries(options)
      .map(([key, value]) => {
        // if (value === null) return `${key}_null`
        return `${key}=${value}`
      })
      .join('&')

  return optionsQuery || ''
}

export const axiosApi = axios.create({
  baseURL: `http://localhost:${BACK_PORT}/`,
  // headers: {
  //   Authorization: 'Bearer ' + localStorage.getItem('token'),
  // },
})

interface Props {
  pluralLabel: string
  singularLabel: string
}

export function myUseQuery<Type extends { id: unknown }>({
  pluralLabel,
  singularLabel,
}: Props) {
  function useGet(op: { id?: Type['id']; params?: Partial<Type> } = {}) {
    const query = dictToQuery<Type>(op.params)

    let queryKey: QueryKey = []

    let path = `/${pluralLabel}`

    if (op.id) {
      path = `/${pluralLabel}/${op.id}`
      queryKey = [singularLabel, op.id]
    } else if (op.params) {
      path = `/${pluralLabel}?${query}`
      queryKey = [pluralLabel, query]
    } else {
      queryKey = [pluralLabel]
    }

    const getAll = useQuery<Type[]>(
      queryKey,
      async () => {
        if (op?.id && op?.id < 0) return []
        const { data } = await axiosApi.get<Type[]>(path)
        console.log({ data, path })
        return data
      },
      {
        staleTime: 1000 * 60 * 2,
      }
    )

    return {
      ...getAll,
      data: getAll.data as Type[],
    }
  }

  function useDelete(id: Type['id']) {
    axiosApi.delete(`/${pluralLabel}/${id}`).then(() => {
      queryClient.invalidateQueries([pluralLabel])
    })
  }

  function useUpdate(id: Type['id'], updatedData: Partial<Type>) {
    axiosApi.patch(`/${pluralLabel}/${id}`, updatedData).then(() => {
      queryClient.invalidateQueries([pluralLabel])
    })
  }

  function useCreate(dataCreate: Partial<Type>) {
    axiosApi.post(`/${pluralLabel}`, dataCreate).then(() => {
      queryClient.invalidateQueries([pluralLabel])
    })
  }

  return {
    get: useGet,
    delete: useDelete,
    update: useUpdate,
    create: useCreate,
  }
}
