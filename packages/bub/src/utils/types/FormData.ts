export type DataObj = Record<
  string,
  { initialValue?: unknown; type: string; block?: boolean; hide?: boolean }
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
