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
  return (
    <div
      className="fixed top-0 left-0 z-40 w-screen h-screen bg-zinc-900/80"
      onClick={() => {
        closeForm()
        if (onRequestClose) onRequestClose()
      }}
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
            onClick={() => {
              closeForm()
              if (onRequestClose) onRequestClose()
            }}
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
              .map(d => [d[0], d[1].type, d[1].hide])
              .map(([key, type]) => (
                <div
                  className="flex gap-6 bg-slate-500 p-2"
                  key={key as string}
                >
                  <label htmlFor={key as string}>{key}</label>
                  <Field
                    name={key}
                    type={type}
                    key={key}
                    disable={true}
                    className="bg-zinc-600 text-white"
                  />
                </div>
              ))}
            <button
              type="submit"
              className="bg-green-800/60 p-2"
              // onClick={onRequestClose}
            >
              Submit
            </button>
          </Form>
        </Formik>
      </div>
    </div>
  )
}
