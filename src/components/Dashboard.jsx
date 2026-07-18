import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStickers } from '../context/StickersContext'
import { specials, teams, teamNames, getTeamStickerCount } from '../data/stickersData'

function normalizeStickerState(state) {
  return {
    owned: Boolean(state?.owned),
    duplicates: Math.max(0, Number(state?.duplicates) || 0)
  }
}

function getProgressClass(percent) {
  if (percent >= 100) return 'complete'
  if (percent >= 75) return 'high'
  if (percent >= 40) return 'medium'
  return 'low'
}


const flagCodeByTeam = {
  MEX: 'mx', RSA: 'za', KOR: 'kr', CZE: 'cz', CAN: 'ca', BIH: 'ba', QAT: 'qa', SUI: 'ch',
  BRA: 'br', MAR: 'ma', HAI: 'ht', SCO: 'gb-sct', USA: 'us', PAR: 'py', AUS: 'au', TUR: 'tr',
  GER: 'de', CUW: 'cw', CIV: 'ci', ECU: 'ec', NED: 'nl', JPN: 'jp', SWE: 'se', TUN: 'tn',
  BEL: 'be', EGY: 'eg', IRN: 'ir', NZL: 'nz', ESP: 'es', CPV: 'cv', KSA: 'sa', URU: 'uy',
  FRA: 'fr', SEN: 'sn', IRQ: 'iq', NOR: 'no', ARG: 'ar', ALG: 'dz', AUT: 'at', JOR: 'jo',
  POR: 'pt', COD: 'cd', UZB: 'uz', COL: 'co', ENG: 'gb-eng', CRO: 'hr', GHA: 'gh', PAN: 'pa'
}

const spanishNameByTeam = {
  MEX: 'México', RSA: 'Sudáfrica', KOR: 'Corea del Sur', CZE: 'República Checa', CAN: 'Canadá',
  BIH: 'Bosnia', QAT: 'Catar', SUI: 'Suiza', BRA: 'Brasil', MAR: 'Marruecos', HAI: 'Haití',
  SCO: 'Escocia', USA: 'Estados Unidos', PAR: 'Paraguay', AUS: 'Australia', TUR: 'Turquía',
  GER: 'Alemania', CUW: 'Curazao', CIV: 'Costa de Marfil', ECU: 'Ecuador', NED: 'Países Bajos',
  JPN: 'Japón', SWE: 'Suecia', TUN: 'Túnez', BEL: 'Bélgica', EGY: 'Egipto', IRN: 'Irán',
  NZL: 'Nueva Zelanda', ESP: 'España', CPV: 'Cabo Verde', KSA: 'Arabia Saudita', URU: 'Uruguay',
  FRA: 'Francia', SEN: 'Senegal', IRQ: 'Irak', NOR: 'Noruega', ARG: 'Argentina', ALG: 'Argelia',
  AUT: 'Austria', JOR: 'Jordania', POR: 'Portugal', COD: 'RD Congo', UZB: 'Uzbekistán',
  COL: 'Colombia', ENG: 'Inglaterra', CRO: 'Croacia', GHA: 'Ghana', PAN: 'Panamá', CC: 'Coca-Cola'
}

function SectionBadgeTitle({ section }) {
  if (section.id === 'specials') {
    return (
      <span className="section-progress-badge-title">
        <span className="section-progress-brand-badge fifa">FIFA</span>
        <span className="section-progress-separator">-</span>
        <strong>FWC</strong>
      </span>
    )
  }

  if (section.id === 'CC') {
    return (
      <span className="section-progress-badge-title">
        <span className="section-progress-brand-badge coca-cola">Coca‑Cola</span>
        <span className="section-progress-separator">-</span>
        <strong>CC</strong>
      </span>
    )
  }

  const spanishName = spanishNameByTeam[section.id]
  const flagCode = flagCodeByTeam[section.id]

  return (
    <span className="section-progress-badge-title">
      <span className="section-progress-flag-wrap">
        {flagCode ? (
          <img
            className="section-progress-flag-img"
            src={`https://flagcdn.com/w40/${flagCode}.png`}
            alt=""
            loading="lazy"
          />
        ) : (
          <span className="section-progress-flag-fallback">🏳️</span>
        )}
      </span>
      <span className="section-progress-separator">-</span>
      <strong>{section.id}</strong>
      {spanishName && <span className="section-progress-spanish">({spanishName})</span>}
    </span>
  )
}

function buildSections() {
  return [
    {
      id: 'specials',
      title: '🏆 Logo Panini & FWC Specials',
      total: specials.length,
      codes: specials,
      albumTarget: '/album?page=1'
    },
    ...teams.map((team, index) => {
      const total = getTeamStickerCount(team)
      return {
        id: team,
        title: teamNames[team] || team,
        total,
        codes: Array.from({ length: total }, (_, i) => `${team}${i + 1}`),
        albumTarget: `/album?page=${index + 2}`
      }
    })
  ]
}

export default function Dashboard() {
  const { getStats, savedStickers, saveToCloud, lastSaved, pendingChanges } = useStickers()
  const stats = getStats()
  const navigate = useNavigate()

  const hasPendingChanges = Object.keys(pendingChanges).length > 0

  const progressSections = useMemo(() => {
    return buildSections().map(section => {
      const owned = section.codes.reduce((count, code) => {
        return count + (normalizeStickerState(savedStickers[code]).owned ? 1 : 0)
      }, 0)

      const duplicates = section.codes.reduce((count, code) => {
        return count + normalizeStickerState(savedStickers[code]).duplicates
      }, 0)

      const missing = Math.max(section.total - owned, 0)
      const percent = section.total > 0 ? Math.round((owned / section.total) * 100) : 0

      return {
        ...section,
        owned,
        missing,
        duplicates,
        percent,
        progressClass: getProgressClass(percent)
      }
    })
  }, [savedStickers])

  const goToAlbum = () => {
    navigate('/album')
  }

  const goToSection = (target) => {
    navigate(target)
  }

  return (
    <div>
      <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>📊 Mi Dashboard</h2>
      
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-value">{stats.owned}</div>
          <div className="stat-label">Pegadas</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.missing}</div>
          <div className="stat-label">Faltantes</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.duplicates}</div>
          <div className="stat-label">Repetidas</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{Math.round((stats.owned / stats.total) * 100)}%</div>
          <div className="stat-label">Completado</div>
        </div>
      </div>

      <div style={{ 
        background: 'var(--border)', 
        borderRadius: '10px', 
        height: '8px', 
        marginBottom: '20px',
        overflow: 'hidden'
      }}>
        <div style={{
          width: `${(stats.owned / stats.total) * 100}%`,
          height: '100%',
          background: 'linear-gradient(90deg, var(--primary), var(--accent))',
          borderRadius: '10px',
          transition: 'width 0.5s'
        }} />
      </div>

      <div className="dashboard-actions card">
        <button type="button" className="btn-primary" onClick={() => goToAlbum()}>
          📖 Ver álbum por páginas
        </button>
        <div className="dashboard-report-actions">
          <button type="button" className="btn-secondary dashboard-report-button" onClick={() => navigate('/visual-report')}>
            🧾 Reporte visual de faltantes
          </button>
        </div>
        <p>
          Navega desde la página 01, marca varias tarjetas de una vez y guarda antes de cambiar de página.
          También puedes imprimir tu reporte visual para revisar rápido qué figuras tienes y cuáles te faltan.
        </p>
      </div>

      <section className="section-progress-panel card">
        <div className="section-progress-header">
          <div>
            <h3>📊 Avance por selección</h3>
            <p>Revisa qué páginas tienes más avanzadas, cuáles te faltan y dónde tienes más repetidas para intercambiar.</p>
          </div>
        </div>

        <div className="section-progress-grid">
          {progressSections.map(section => (
            <button
              key={section.id}
              type="button"
              className="section-progress-card"
              onClick={() => goToSection(section.albumTarget)}
              title={`Abrir ${section.title} en el álbum`}
            >
              <div className="section-progress-title"><SectionBadgeTitle section={section} /></div>
              <div className="section-progress-main">
                <strong>{section.owned}/{section.total}</strong>
                <span>{section.percent}%</span>
              </div>
              <div className="section-progress-caption">
                {section.missing} faltantes · {section.duplicates} repetida{section.duplicates === 1 ? '' : 's'}
              </div>
              <div className="section-progress-bar" aria-hidden="true">
                <span className={section.progressClass} style={{ width: `${section.percent}%` }} />
              </div>
            </button>
          ))}
        </div>
      </section>

      {hasPendingChanges && (
        <button className="btn-save" onClick={saveToCloud}>
          💾 Guardar cambios
          {lastSaved && (
            <span style={{ fontSize: '10px', display: 'block' }}>
              Último: {new Date(lastSaved).toLocaleTimeString()}
            </span>
          )}
        </button>
      )}
    </div>
  )
}
