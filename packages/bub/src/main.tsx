import { RefObject } from 'react'
import GetRef from './getRef'
import useFormStore from './store/useForm'
import useRefStore from './store/useRefStore'

export default function useBub() {
  const refs = useRefStore(state => state.refs)

  const action = {
    changeStyle: (nameId: string, newStyle: any) => {
      // const ref = refs.find(([nameRef]) => nameRef === nameId)?.[1]
      // if (ref?.current?.style) {
      // for (const prop in newStyle) {
      //   if (ref.current?.style[prop]) {
      //     ref.current?.style[prop] = newStyle[prop]
      //   }
      // }
      // }
    },
    changeClass: (nameId: string, newClass: string) => {
      const ref = refs.find(([nameRef]) => nameRef === nameId)?.[1] as
        | RefObject<HTMLDivElement | HTMLButtonElement>
        | undefined

      if (ref?.current) {
        ref.current.className += ' ' + newClass
      }
    },
    hideElement: (nameId: string, putNone?: boolean) => {
      const ref = refs.find(([nameRef]) => nameRef === nameId)?.[1] as
        | RefObject<HTMLDivElement | HTMLButtonElement>
        | undefined

      if (ref?.current) {
        if (!putNone) {
          ref.current.style.opacity = '0'
        } else {
          ref.current.hidden = true
        }
      }
    },
    showElement: (nameId: string) => {
      const ref = refs.find(([nameRef]) => nameRef === nameId)?.[1]
      if (ref?.current) {
        ref.current.style.opacity = '1'
        ref.current.hidden = false
      }
    },
    toggleShowElement: (nameId: string, putNone?: boolean) => {
      const ref = refs.find(([nameRef]) => nameRef === nameId)?.[1]
      if (!ref?.current) return

      const isHidden =
        ref?.current?.hidden || ref?.current?.style.opacity === '0'

      if (isHidden) {
        ref.current.style.opacity = '1'
        ref.current.hidden = false
      } else if (!putNone) {
        ref.current.style.opacity = '0'
      } else {
        ref.current.hidden = true
      }
    },
    changeValue: (nameId: string, newValue: string) => {
      const ref = refs.find(([nameRef]) => nameRef === nameId)?.[1]
      if (ref?.current) {
        ref.current.textContent = newValue
      }
    },
  }

  return {
    action,
    ref: refs,
    getRef: GetRef,
    createForm: useFormStore(state => state.setFormData),
    formProps: useFormStore(state => state.formData),
    closeForm: useFormStore(state => state.close),
  }
}
