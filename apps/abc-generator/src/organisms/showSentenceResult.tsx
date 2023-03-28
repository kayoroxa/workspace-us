import useSentence from '@/hooks/useSentence'

export default function ShowSentenceResult() {
  const { sentence, rawSentence, sentenceWithKey } = useSentence()
  return (
    <div className="py-6 px-4 text-3xl w-full text-center mb-10">
      {sentence.length === 0 && <div>...</div>}
      {sentence.length > 0 && (
        <div className="flex gap-2 justify-center items-center">
          {rawSentence
            .filter(v => v.length > 0)
            .map(teachText => (
              <span className="bg-blue-600/50 p-1" key={teachText}>
                {teachText}
              </span>
            ))}
        </div>
      )}
      {sentence.length > 0 && (
        <div className="flex gap-2 justify-center items-center">
          {sentenceWithKey}
        </div>
      )}
    </div>
  )
}
