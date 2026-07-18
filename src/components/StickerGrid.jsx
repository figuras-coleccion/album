import { useState } from 'react'
import DeleteStickerConfirmation from './DeleteStickerConfirmation'

export default function StickerGrid({ stickers, onUpdate, onDeleteSaved }) {
  const [deleteCandidate, setDeleteCandidate] = useState(null)

  const handleToggleOwned = (code, currentOwned, locked) => {
    if (locked && currentOwned) {
      setDeleteCandidate(prev => (prev === code ? null : code))
      return
    }

    setDeleteCandidate(null)
    onUpdate(code, { owned: !currentOwned })
  }

  const handleDuplicateChange = (code, currentDup, delta) => {
    const newDup = Math.max(0, currentDup + delta)
    onUpdate(code, { duplicates: newDup })
  }

  return (
    <div className="sticker-grid">
      {stickers.map(({ code, owned, duplicates, locked, pending }) => (
        <div key={code} className={`sticker-item ${owned ? 'owned' : ''} ${locked ? 'locked' : ''} ${pending ? 'pending' : ''}`.trim()}>
          <span className="code">{code}</span>
          <div
            className="checkbox"
            onClick={() => handleToggleOwned(code, owned, locked)}
            title={locked ? 'Ya fue guardada. Toca para eliminar con confirmación segura.' : owned ? 'Quitar antes de guardar' : 'Marcar como pegada'}
            style={{ cursor: 'pointer', opacity: locked ? 0.9 : 1 }}
          >
            {owned ? '✓' : ''}
          </div>
          {pending && (
            <span className="pending-chip">Pendiente</span>
          )}

          {owned && (
            <div className="dup-controls">
              <button
                onClick={() => handleDuplicateChange(code, duplicates, -1)}
                disabled={duplicates <= 0}
              >
                -
              </button>
              <span className="dup-count">{duplicates}</span>
              <button onClick={() => handleDuplicateChange(code, duplicates, 1)}>
                +
              </button>
            </div>
          )}
          {!owned && (
            <div style={{ height: '28px', marginTop: '6px' }} />
          )}

          {deleteCandidate === code && locked && owned && onDeleteSaved && (
            <DeleteStickerConfirmation
              stickerCode={code}
              onCancel={() => setDeleteCandidate(null)}
              onDeleteConfirmed={onDeleteSaved}
            />
          )}
        </div>
      ))}
    </div>
  )
}
