import { useState } from 'react'
import { useStickers } from '../context/StickersContext'
import { specials } from '../data/stickersData'
import StickerGrid from './StickerGrid'

export default function SpecialsPage() {
  const { stickers, updateStickerLocal, saveTeamPage, isStickerLocked, deleteSavedSticker } = useStickers()
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const specialStickers = specials.map(code => ({
    code,
    owned: stickers[code]?.owned || false,
    duplicates: stickers[code]?.duplicates || 0,
    locked: isStickerLocked(code)
  }))

  const ownedCount = specialStickers.filter(s => s.owned).length

  const handleSave = async () => {
    setSaving(true)
    const success = await saveTeamPage('specials')
    setSaving(false)
    if (success) {
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
  }

  return (
    <div>
      <h2 style={{ fontSize: '18px', marginBottom: '6px' }}>⭐ Especiales & Logo</h2>
      <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
        00 = Logo Panini | FWC1-FWC19 = Historia/Especiales ({ownedCount}/20)
      </p>

      <StickerGrid stickers={specialStickers} onUpdate={updateStickerLocal} onDeleteSaved={deleteSavedSticker} />

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-primary"
          style={{ background: saved ? 'var(--success)' : 'var(--primary)' }}
        >
          {saving ? 'Guardando...' : saved ? '✅ Guardado' : '💾 Guardar especiales'}
        </button>
      </div>
    </div>
  )
}