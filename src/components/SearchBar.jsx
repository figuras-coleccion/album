import { useState } from 'react'

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (query.trim()) {
      onSearch(query.trim())
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px' }}>
      <input
        type="text"
        placeholder="Buscar código (ej: ARG5, FWC1, 00)..."
        value={query}
        onChange={(e) => setQuery(e.target.value.toUpperCase())}
        style={{ flex: 1 }}
      />
      <button
        type="submit"
        style={{
          background: 'var(--primary)',
          color: 'white',
          padding: '12px 20px',
          borderRadius: 'var(--radius)',
          fontWeight: 600,
          fontSize: '14px'
        }}
      >
        🔍
      </button>
    </form>
  )
}