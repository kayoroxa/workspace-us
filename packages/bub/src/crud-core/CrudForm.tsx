import { Field, Form, Formik } from 'formik'
import useFormStore from '../store/useForm'
import { FormProps } from '../utils/types/FormData'

export default function CrudForm({
  title,
  data,
  onSubmit,
  isCol,
  onRequestClose,
}: FormProps) {
  isCol = isCol ?? true
  const closeForm = useFormStore(state => state.close)
  const closeMe = () => {
    closeForm()
    if (onRequestClose) onRequestClose()
  }
  return (
    <div
      className="fixed top-0 left-0 z-40 w-screen h-screen bg-zinc-900/80"
      onClick={closeMe}
    >
      <div
        className="bg-slate-800 p-10 w-fit fixed top-0 left-0 right-0 bottom-0 m-auto z-50 overflow-x-hidden overflow-y-auto md:inset-0 h-fit max-h-full"
        onClick={e => {
          e.stopPropagation()
        }}
      >
        <header className="flex justify-between">
          <h1>{title}</h1>
          <button
            onClick={closeMe}
            className="p-2 bg-red-500 rounded-xl absolute top-0 right-0"
          >
            Close
          </button>
        </header>
        <Formik
          initialValues={Object.fromEntries(
            Object.entries(data).map(d => [d[0], d[1]?.initialValue || ''])
          )}
          onSubmit={onSubmit}
        >
          <Form className={`flex gap-5 ${isCol ? 'flex-col' : ''}`}>
            {/* <Field name="name" type="text" /> */}
            {/* <Field name="email" type="email" /> */}
            {Object.entries(data)
              .map(d => ({ key: d[0], type: d[1].type, options: d[1].options }))
              .map(({ key, type, options }) => (
                <div
                  className="flex gap-6 bg-slate-500 p-2"
                  key={key as string}
                >
                  <label htmlFor={key as string}>{key}</label>
                  <Yo _key={key as any} type={type as any} options={options} />
                </div>
              ))}
            <button
              type="submit"
              className="bg-green-800/60 p-2"
              onClick={() => {
                setTimeout(() => {
                  closeMe()
                }, 300)
              }}
            >
              Submit
            </button>
          </Form>
        </Formik>
      </div>
    </div>
  )
}

interface YoProps {
  _key: string
  type: 'datalist' | 'number' | 'string'
  options?: {
    label: string
    value: number | string
  }[]
}

function Yo({ _key, type, options }: YoProps) {
  if (type === 'datalist' && options) {
    return (
      <div className="flex-1">
        <Field
          name={_key}
          list={_key} // Nome do datalist
          component="input"
          placeholder="Digite um item"
          className="bg-zinc-600 text-white w-full"
          autocomplete="off"
        />
        <datalist id={_key}>
          {options?.map((o, i) => (
            <option key={i} value={o.value}>
              {o.label}
            </option>
          ))}
        </datalist>
      </div>
    )
  } else {
    return (
      <div className="flex-1">
        <Field
          name={_key}
          type={type}
          key={_key}
          disable={true}
          className="bg-zinc-600 text-white w-full"
          autocomplete="off"
        />
      </div>
    )
  }
}
