import { ReactNode } from 'react'
import useFormStore from '../store/useForm'
import CrudForm from './CrudForm'

interface Props {
  children: ReactNode | ReactNode[]
}
export default function WrapperCrudForm({ children }: Props) {
  const formProps = useFormStore(state => state.formData)

  return (
    <>
      {formProps && <CrudForm {...formProps} />}
      {children}
    </>
  )
}
