export type DataObj = Record<
  string,
  {
    initialValue?: unknown
    type: string
    block?: boolean
    hide?: boolean
    options?: {
      label: string
      value: number | string
    }[]
  }
>

export interface FormProps {
  title: string
  data: DataObj
  onSubmit: (values: {
    [K in keyof DataObj]: DataObj[K]['initialValue']
  }) => void
  isCol?: boolean
  onRequestClose?: () => void
}
