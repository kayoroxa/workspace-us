import useQ from '@/hooks/useQ'
import useAppStore from '@/store/useAppStore'
import { Option } from '@/utils/types/Category'
import { useRef, useState } from 'react'
import { useQuery } from 'react-query'

export default function Input() {
  const { addOptions } = useQ()
  const [data, setData] = useState('')
  const modalCategoryId = useAppStore(s => s.modalCategoryId)
  const textRef = useRef<HTMLTextAreaElement>(null)

  const { data: options } = useQuery<Option[]>(
    ['options', , modalCategoryId],
    () =>
      fetch(
        `http://localhost:4000/options?category_id=${modalCategoryId}`
      ).then(res => res.json())
  )

  function handleSubmit(e: any) {
    e.preventDefault()
    const names = data
      .split(',')
      .map(v => v.trim())
      .filter(opName => {
        if (opName.trim() === '') return false
        if (options?.find(op => op.name === opName)) return false
        return true
      })
    const datas = names.map(name => ({
      name,
      category_id: modalCategoryId,
      isOnBoard: false,
      countReview: 0,
    }))

    addOptions(datas)
    textRef.current!.value = ''
  }

  return (
    <form className="w-full" onSubmit={handleSubmit}>
      <label htmlFor="chat" className="sr-only">
        Your message
      </label>
      <div className="flex items-center px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700">
        <textarea
          ref={textRef}
          id="chat"
          rows={1}
          className="block mx-4 p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Your message..."
          onChange={e => setData(e.target.value)}
        ></textarea>
        <button
          type="submit"
          className="inline-flex justify-center p-2 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100 dark:text-blue-500 dark:hover:bg-gray-600"
        >
          <svg
            aria-hidden="true"
            className="w-6 h-6 rotate-90"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
          </svg>
          <span className="sr-only">Send message</span>
        </button>
      </div>
    </form>
  )
}
