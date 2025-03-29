import { useState } from 'react'

export default function FindPhonePage() {
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState<string | null>(null)
  const [name, setName] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPhone = async () => {
    if (!email) return

    setLoading(true)
    setPhone(null)
    setError(null)

    try {
      const res = await fetch(
        `/api/find-phone?email=${encodeURIComponent(email)}`
      )
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong')
      }

      setPhone(data.phone)
      setName(data.name)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    fetchPhone()
  }

  const getWhatsappLink = (phone: string) => {
    const cleanPhone = phone.replace(/\D/g, '') // Remove caracteres não numéricos
    return `https://wa.me/${cleanPhone}`
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>🔍 Buscar telefone por e-mail</h1>

      <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
        <input
          className="outline"
          type="email"
          placeholder="Digite o e-mail do comprador"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{
            padding: '0.5rem',
            fontSize: '1rem',
            width: '300px',
            marginRight: '1rem',
          }}
          required
        />
        <button
          type="submit"
          style={{ padding: '0.5rem 1rem', fontSize: '1rem' }}
        >
          Buscar
        </button>
      </form>

      {loading && <p>🔄 Buscando...</p>}
      {error && <p style={{ color: 'red' }}>❌ {error}</p>}
      {phone && (
        <div style={{ marginTop: '1rem' }}>
          <p>
            📞 Telefone: <strong>{phone}</strong>
          </p>
          <p>
            🧑 Nome: <strong>{name}</strong>
          </p>
          <a
            href={getWhatsappLink(phone)}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              marginTop: '1rem',
              padding: '0.5rem 1rem',
              backgroundColor: '#25D366',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '5px',
              fontWeight: 'bold',
            }}
          >
            💬 Enviar mensagem no WhatsApp
          </a>
        </div>
      )}
    </div>
  )
}
