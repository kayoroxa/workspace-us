import { useAccount, useLabels, useUser } from '@/hooks/useCruds'
import { CreateButton } from 'bub/crud'

function Section({ children }: { children: React.ReactNode }) {
  return <section className="flex flex-col p-4 bg-zinc-700">{children}</section>
}

export default function ConfigPage() {
  const { data: allUsers } = useUser().get()
  const { data: allLabels } = useLabels().get()
  const createLabel = useLabels().create

  const { data: allAccount } = useAccount().get()

  return (
    <div className="flex flex-col gap-4 p-5">
      <h1 className="text-2xl">Config:</h1>
      <main className="flex flex-col gap-4">
        <Section>
          <h1 className="text-3xl">Users</h1>
          <div>
            {allUsers?.map(u => (
              <div key={u.id}>{u.name}</div>
            ))}
          </div>
        </Section>
        <Section>
          <div className="flex gap-4">
            <h1 className="text-3xl">Labels</h1>
            <CreateButton
              title="criar label"
              buttonTitle={false}
              data={{ name: { type: 'string', initialValue: '' } }}
              onSubmit={data => {
                createLabel(data)
              }}
            />
          </div>
          <div>
            {allLabels?.map(l => (
              <div key={l.id}>{l.name}</div>
            ))}
          </div>
        </Section>
        <Section>
          <h1 className="text-3xl">Accounts</h1>
          <div>
            {allAccount?.map(a => (
              <div key={a.id}>{a.name}</div>
            ))}
          </div>
        </Section>
      </main>
    </div>
  )
}
