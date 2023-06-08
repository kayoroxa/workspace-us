import { create } from 'zustand'
import { FormProps } from './../utils/types/FormData'

interface FormState {
  setFormData: (data: FormProps) => void
  formData: FormProps | null
  close: () => void
}

const useFormStore = create<FormState>()(set => ({
  formData: null,
  setFormData: data => set(() => ({ formData: data })),
  close: () => set(() => ({ formData: null })),
}))

export default useFormStore
