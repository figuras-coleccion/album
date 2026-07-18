import { useStickers } from '../context/StickersContext'

export default function DuplicatesList({ duplicates, onGoToPage }) {
  const { updateStickerLocal, stickers } = useStickers()

  if (duplicates.length === 0) {
    return <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>No tienes repetidas aún.</p>
  }

  return (
    <div>
      {duplicates.map(({ code, duplicates }) => (
        <div
          key={code}
          className="duplicate-row"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 12px',
            background: 'var(--bg-card)',
            borderRadius: '8px',
            marginBottom: '6px',
            border: '1px solid var(--border)',
            flexWrap: 'wrap'
          }}
        >
          <span
            onClick={() => onGoToPage(code)}
            style={{
              cursor: 'pointer',
              fontWeight: 600,
              color: 'var(--accent)',
              fontSize: '14px',
              flex: '1 1 auto',
              minWidth: '60px'
            }}
          >
            [ ] {code}
          </span>
          <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
            ({duplicates})
          </span>
          <button
            onClick={() => updateStickerLocal(code, { duplicates: Math.max(0, duplicates - 1) })}
            disabled={duplicates <= 0}
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: duplicates > 0 ? 'var(--primary)' : 'var(--border)',
              color: 'white',
              fontSize: '16px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            -
          </button>
          <button
            onClick={() => updateStickerLocal(code, { duplicates: duplicates + 1 })}
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: 'var(--success)',
              color: 'white',
              fontSize: '16px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            +
          </button>
        </div>
      ))}
    </div>
  )
}