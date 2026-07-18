import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useStickers } from '../context/StickersContext'
import { specials, teams, teamNames, getTeamStickerCount, getAlbumPageLabel, normalizeSearchText } from '../data/stickersData'
import StickerGrid from './StickerGrid'

function padPage(num) {
  return String(num).padStart(2, '0')
}

function buildAlbumPages() {
  const pages = [
    {
      id: 'specials',
      number: 1,
      albumLabel: getAlbumPageLabel(null),
      title: '⭐ Logo Panini & FWC Specials',
      subtitle: '00 + FWC1 a FWC19',
      team: null,
      codes: specials
    }
  ]

  teams.forEach((team, index) => {
    pages.push({
      id: team,
      number: index + 2,
      albumLabel: getAlbumPageLabel(team),
      title: teamNames[team] || team,
      subtitle: `${team}1 a ${team}${getTeamStickerCount(team)}`,
      team,
      codes: Array.from({ length: getTeamStickerCount(team) }, (_, i) => `${team}${i + 1}`)
    })
  })

  return pages
}

function pageMatchesQuery(page, query) {
  if (!query) return true
  const normalized = normalizeSearchText(query)
  const cleanTitle = normalizeSearchText(page.title)
  const cleanSubtitle = normalizeSearchText(page.subtitle)

  return (
    normalizeSearchText(page.albumLabel || String(page.number).padStart(2, '0')).includes(normalized) ||
    normalizeSearchText(page.id).includes(normalized) ||
    cleanTitle.includes(normalized) ||
    cleanSubtitle.includes(normalized) ||
    page.codes.some(code => normalizeSearchText(code).includes(normalized))
  )
}

function filterCodesByQuery(page, query) {
  if (!query) return page.codes
  const normalized = normalizeSearchText(query)

  if (normalizeSearchText(page.id) === normalized || normalizeSearchText(page.title).includes(normalized)) {
    return page.codes
  }

  return page.codes.filter(code => normalizeSearchText(code).includes(normalized))
}

export default function AlbumPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const {
    stickers,
    pendingChanges,
    updateStickerLocal,
    saveStickersByCodes,
    saveToCloud,
    isStickerLocked,
    deleteSavedSticker
  } = useStickers()

  const albumPages = useMemo(() => buildAlbumPages(), [])
  const initialQuery = searchParams.get('q') || ''
  const initialPageParam = Number(searchParams.get('page') || '1')
  const [query, setQuery] = useState(initialQuery.toUpperCase())
  const [currentPageIndex, setCurrentPageIndex] = useState(
    Math.min(Math.max(initialPageParam - 1, 0), albumPages.length - 1)
  )
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [bulkSelectionModes, setBulkSelectionModes] = useState({})

  const currentPage = albumPages[currentPageIndex]
  const currentPageHasChanges = currentPage.codes.some(code => pendingChanges[code])
  const hasAnyChanges = Object.keys(pendingChanges).length > 0

  useEffect(() => {
    const params = {}
    if (query.trim()) params.q = query.trim()
    if (!query.trim()) params.page = String(currentPage.number)
    setSearchParams(params, { replace: true })
  }, [query, currentPage.number, setSearchParams])

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (!hasAnyChanges) return
      event.preventDefault()
      event.returnValue = ''
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [hasAnyChanges])

  const buildGridStickers = (codes) => {
    return codes.map(code => ({
      code,
      owned: stickers[code]?.owned || false,
      duplicates: stickers[code]?.duplicates || 0,
      locked: isStickerLocked(code),
      pending: Boolean(pendingChanges[code])
    }))
  }

  const flashSaved = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 1800)
  }

  const saveCodes = async (codes, options = {}) => {
    setSaving(true)
    const success = await saveStickersByCodes(codes)
    setSaving(false)
    if (success) {
      flashSaved()
      setBulkSelectionModes({})
      if (options.afterSave) options.afterSave()
    }
    return success
  }

  const saveAllPending = async (afterSave) => {
    setSaving(true)
    const success = await saveToCloud()
    setSaving(false)
    if (success) {
      flashSaved()
      setBulkSelectionModes({})
      if (afterSave) afterSave()
    }
    return success
  }

  const askSaveBeforeAction = async (afterSave) => {
    if (!hasAnyChanges) {
      if (afterSave) afterSave()
      return true
    }

    const shouldSave = window.confirm(
      'Tienes cambios sin guardar en el álbum. Para continuar debes guardar primero. ¿Guardar ahora?'
    )

    if (!shouldSave) return false
    return saveAllPending(afterSave)
  }

  const tryExitAlbum = async () => {
    await askSaveBeforeAction(() => navigate('/'))
  }

  const tryChangePage = async (nextIndex) => {
    const safeIndex = Math.min(Math.max(nextIndex, 0), albumPages.length - 1)
    if (safeIndex === currentPageIndex) return

    if (currentPageHasChanges) {
      const shouldSave = window.confirm(
        'Tienes cambios sin guardar en esta página. Para cambiar de página debes guardar primero. ¿Guardar ahora y continuar?'
      )
      if (!shouldSave) return
      await saveCodes(currentPage.codes, { afterSave: () => setCurrentPageIndex(safeIndex) })
      return
    }

    setCurrentPageIndex(safeIndex)
  }

  const visiblePages = useMemo(() => {
    if (!query.trim()) return [currentPage]

    return albumPages
      .filter(page => pageMatchesQuery(page, query))
      .map(page => ({ ...page, codes: filterCodesByQuery(page, query) }))
      .filter(page => page.codes.length > 0)
  }, [albumPages, currentPage, query])

  const visibleCodes = visiblePages.flatMap(page => page.codes)
  const hasVisibleChanges = visibleCodes.some(code => pendingChanges[code])

  const handleSearchChange = async (value) => {
    const nextQuery = value.toUpperCase()

    if (hasAnyChanges && nextQuery.trim() !== query.trim()) {
      const shouldSave = window.confirm(
        'Tienes cambios sin guardar en el álbum. Para cambiar la búsqueda debes guardar primero. ¿Guardar ahora?'
      )
      if (!shouldSave) return
      await saveAllPending(() => setQuery(nextQuery))
      return
    }

    setQuery(nextQuery)
  }

  const clearSearch = async () => {
    if (hasVisibleChanges || hasAnyChanges) {
      const shouldSave = window.confirm(
        'Tienes cambios sin guardar. Para limpiar la búsqueda debes guardar primero. ¿Guardar ahora?'
      )
      if (!shouldSave) return
      await saveAllPending(() => setQuery(''))
      return
    }
    setQuery('')
  }

  const getSelectableCodes = (codes = []) => codes.filter(code => !isStickerLocked(code))

  const getBulkSelectionState = (pageId, codes = []) => {
    const selectableCodes = getSelectableCodes(codes)
    const selectedCodes = selectableCodes.filter(code => stickers[code]?.owned)
    const hasSelectable = selectableCodes.length > 0
    const isAnulable = Boolean(bulkSelectionModes[pageId]) && selectedCodes.length > 0

    return { selectableCodes, selectedCodes, hasSelectable, isAnulable }
  }

  const toggleBulkSelection = (pageId, codes = []) => {
    const { selectableCodes, selectedCodes, isAnulable } = getBulkSelectionState(pageId, codes)
    if (selectableCodes.length === 0) return

    if (isAnulable) {
      selectedCodes.forEach(code => updateStickerLocal(code, { owned: false }))
      setBulkSelectionModes(prev => ({ ...prev, [pageId]: false }))
      return
    }

    selectableCodes.forEach(code => updateStickerLocal(code, { owned: true }))
    setBulkSelectionModes(prev => ({ ...prev, [pageId]: true }))
  }

  const renderSaveButton = (codes, pageHasChanges, label = 'Guardar') => (
    <button
      type="button"
      className={`album-inline-save ${pageHasChanges ? 'active' : ''}`}
      onClick={() => saveCodes(codes)}
      disabled={saving || !pageHasChanges}
      title={pageHasChanges ? 'Guardar cambios de esta página' : 'No hay cambios pendientes'}
    >
      {saving && pageHasChanges ? 'Guardando...' : saved && !pageHasChanges ? '✅ Guardado' : `💾 ${label}`}
    </button>
  )

  const renderAlbumActions = (pageId, codes, pageHasChanges) => {
    const { hasSelectable, isAnulable } = getBulkSelectionState(pageId, codes)

    return (
      <div className="album-page-actions">
        <button
          type="button"
          className={`album-select-button ${isAnulable ? 'active' : ''}`}
          onClick={() => toggleBulkSelection(pageId, codes)}
          disabled={saving || !hasSelectable}
          title={hasSelectable ? 'Seleccionar o anular solo figuritas no guardadas' : 'Todas las figuritas de esta página ya están guardadas'}
        >
          {isAnulable ? 'Anular Selección' : 'Seleccionar Todas'}
        </button>
        {renderSaveButton(codes, pageHasChanges)}
      </div>
    )
  }

  return (
    <div>
      <div className="album-head">
        <button
          onClick={tryExitAlbum}
          className="ghost-back"
          type="button"
        >
          ←
        </button>
        <div>
          <h2>📖 Ver álbum</h2>
          <p>Marca tus tarjetas por página, busca por selección o código y guarda antes de cambiar de página.</p>
        </div>
      </div>

      <div className="album-search-card">
        <label>Buscar dentro del álbum</label>
        <div className="album-search-row">
          <input
            type="text"
            value={query}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Ej: ARG, ARG5, Brazil, FWC, 01..."
          />
          {query && (
            <button type="button" onClick={clearSearch} className="btn-clear-search">
              Limpiar
            </button>
          )}
        </div>
        <small>
          La búsqueda es dinámica. No necesitas presionar un botón.
        </small>
      </div>

      {!query.trim() && (
        <div className="album-page-nav card">
          <button type="button" onClick={() => tryChangePage(currentPageIndex - 1)} disabled={currentPageIndex === 0}>
            ← Anterior
          </button>
          <select
            value={currentPageIndex}
            onChange={(e) => tryChangePage(Number(e.target.value))}
          >
            {albumPages.map((page, index) => (
              <option key={page.id} value={index}>
                Pág. {page.albumLabel || padPage(page.number)} - {page.title.replace(/^[^\wÀ-ÿ]+\s*/, '')}
              </option>
            ))}
          </select>
          <button type="button" onClick={() => tryChangePage(currentPageIndex + 1)} disabled={currentPageIndex === albumPages.length - 1}>
            Siguiente →
          </button>
        </div>
      )}

      {query.trim() && (
        <div className="album-search-summary card">
          <strong>{visibleCodes.length}</strong> resultado(s) para <strong>{query}</strong>
          <p>
            Puedes marcar desde aquí. Cada bloque tiene su botón Guardar para proteger los cambios antes de salir.
          </p>
        </div>
      )}

      {visiblePages.length === 0 && (
        <div className="card">
          <p>No encontré resultados para <strong>{query}</strong>.</p>
        </div>
      )}

      {visiblePages.map(page => {
        const pageStickers = buildGridStickers(page.codes)
        const ownedCount = page.codes.filter(code => stickers[code]?.owned).length
        const pageDuplicates = page.codes.reduce((total, code) => total + (Number(stickers[code]?.duplicates) || 0), 0)
        const pageHasChanges = page.codes.some(code => pendingChanges[code])

        return (
          <section key={page.id} className="album-page-section card">
            <div className="album-page-title-row">
              <div>
                <h3>Pág. {page.albumLabel || padPage(page.number)} · {page.title}</h3>
                <p>
                  {page.subtitle} · {ownedCount}/{page.codes.length}{' '}
                  <span className="album-page-duplicates">- {pageDuplicates} repetidas</span>
                </p>
              </div>
              {renderAlbumActions(page.id, page.codes, pageHasChanges)}
            </div>

            <StickerGrid stickers={pageStickers} onUpdate={updateStickerLocal} onDeleteSaved={deleteSavedSticker} />
          </section>
        )
      })}

      {query.trim() && hasVisibleChanges && (
        <button
          type="button"
          className="btn-save"
          onClick={() => saveCodes(visibleCodes)}
          disabled={saving || !hasVisibleChanges}
        >
          {saving ? 'Guardando...' : saved ? '✅ Guardado' : '💾 Guardar cambios visibles'}
        </button>
      )}
    </div>
  )
}
