import useLocalStore from '@/hooks/useLocalStore'

export default function Toggle({ id }: { id: string }) {
  const [isOpen, setIsOpen] = useLocalStore(id, false)
  const toggle = () => setIsOpen((prev: boolean) => !prev)

  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        value=""
        className="sr-only peer"
        checked={isOpen}
        onChange={toggle}
      />
      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-500"></div>
    </label>
  )
}

// import { useEffect, useState } from 'react'

// export default function Toggle({
//   email, // Renomeie para email
//   reviewed,
// }: {
//   email: string // Renomeie para email
//   reviewed: boolean
// }) {
//   const [isOpen, setIsOpen] = useState(reviewed)
//   // const [isLoading, setIsLoading] = useState(false)

//   useEffect(() => {
//     setIsOpen(reviewed)
//   }, [reviewed])

//   const toggle = async () => {
//     setIsOpen((prev: boolean) => {
//       const newValue = !prev
//       updateReviewStatus(newValue)
//       return newValue
//     })
//   }

//   const updateReviewStatus = async (reviewed: boolean) => {
//     console.log('reviewed', reviewed)
//     // setIsLoading(true)
//     // try {
//     //   await fetch(`/api/sales/${email}/review`, {
//     //     // Use o email no lugar do id
//     //     method: 'PATCH',
//     //     headers: {
//     //       'Content-Type': 'application/json',
//     //     },
//     //     body: JSON.stringify({ reviewed }),
//     //   })
//     // } catch (error) {
//     //   console.error('Failed to update review status:', error)
//     // } finally {
//     //   setIsLoading(false)
//     // }
//   }

//   return (
//     <label className="relative inline-flex items-center cursor-pointer">
//       <input
//         type="checkbox"
//         value=""
//         className="sr-only peer"
//         checked={isOpen}
//         onChange={toggle}
//         disabled={false}
//       />
//       <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-500"></div>
//     </label>
//   )
// }
