import { useMemo, useState } from 'react'
import { useUser } from '../context/UserContext'
import {
  googleProvider,
  reauthenticateWithPopup,
  reauthenticateWithCredential,
  EmailAuthProvider
} from '../firebase'

function getFriendlyAuthError(error) {
  const code = error?.code || ''

  if (code.includes('popup-closed-by-user') || code.includes('cancelled-popup-request')) {
    return 'La confirmación con Google fue cancelada.'
  }

  if (code.includes('wrong-password') || code.includes('invalid-credential')) {
    return 'La contraseña no es correcta. Inténtalo nuevamente.'
  }

  if (code.includes('too-many-requests')) {
    return 'Demasiados intentos. Espera unos minutos y vuelve a intentar.'
  }

  if (code.includes('requires-recent-login')) {
    return 'Por seguridad, Firebase solicita confirmar tu identidad antes de eliminar.'
  }

  return error?.message || 'No se pudo confirmar tu identidad.'
}

export default function DeleteStickerConfirmation({ stickerCode, onCancel, onDeleteConfirmed }) {
  const { firebaseUser, user } = useUser()
  const [step, setStep] = useState('confirm')
  const [password, setPassword] = useState('')
  const [working, setWorking] = useState(false)
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')

  const isGoogleUser = useMemo(() => {
    return Boolean(firebaseUser?.providerData?.some(provider => provider.providerId === 'google.com')) || user?.provider === 'google.com'
  }, [firebaseUser, user])

  const isPasswordUser = useMemo(() => {
    return Boolean(firebaseUser?.providerData?.some(provider => provider.providerId === 'password')) || user?.provider === 'password'
  }, [firebaseUser, user])

  const confirmIdentityAndDelete = async () => {
    if (!firebaseUser) {
      setError('No se encontró una sesión activa. Vuelve a iniciar sesión.')
      return
    }

    setWorking(true)
    setError('')
    setInfo('')

    try {
      if (isGoogleUser) {
        await reauthenticateWithPopup(firebaseUser, googleProvider)
      } else if (isPasswordUser) {
        if (!password.trim()) {
          setError('Escribe tu contraseña para confirmar la eliminación.')
          setWorking(false)
          return
        }
        const credential = EmailAuthProvider.credential(firebaseUser.email, password)
        await reauthenticateWithCredential(firebaseUser, credential)
      } else {
        setError('Este tipo de cuenta no tiene un método de confirmación compatible todavía.')
        setWorking(false)
        return
      }

      await onDeleteConfirmed(stickerCode)
      setInfo(`La tarjeta ${stickerCode} fue eliminada correctamente.`)
      setPassword('')
      setTimeout(() => onCancel(), 800)
    } catch (err) {
      console.error('Error confirmando eliminación:', err)
      setError(getFriendlyAuthError(err))
    } finally {
      setWorking(false)
    }
  }

  return (
    <div className="delete-confirm-box">
      <div className="delete-confirm-title">{stickerCode} forma parte de tu álbum guardado.</div>

      {step === 'confirm' && (
        <>
          <p>¿Deseas eliminarla?</p>
          <div className="delete-confirm-actions">
            <button type="button" className="btn-danger-small" onClick={() => setStep('auth')} disabled={working}>
              Sí, eliminar
            </button>
            <button type="button" className="btn-neutral-small" onClick={onCancel} disabled={working}>
              No, cancelar
            </button>
          </div>
        </>
      )}

      {step === 'auth' && (
        <>
          {isGoogleUser ? (
            <>
              <p>
                Para proteger tu álbum, confirma nuevamente tu cuenta de Google.
              </p>
              <button
                type="button"
                className="btn-google-confirm"
                onClick={confirmIdentityAndDelete}
                disabled={working}
              >
                {working ? 'Confirmando...' : 'Confirmar con Google'}
              </button>
            </>
          ) : (
            <>
              <p>
                Para proteger tu álbum, escribe tu contraseña actual antes de eliminar la tarjeta.
              </p>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') confirmIdentityAndDelete()
                }}
                placeholder="Contraseña actual"
                className="delete-password-input"
                autoComplete="current-password"
              />
              <button
                type="button"
                className="btn-danger-small btn-full-small"
                onClick={confirmIdentityAndDelete}
                disabled={working || !password.trim()}
              >
                {working ? 'Confirmando...' : 'Confirmar eliminación'}
              </button>
            </>
          )}

          <button type="button" className="btn-neutral-small btn-full-small" onClick={onCancel} disabled={working}>
            Volver sin eliminar
          </button>
        </>
      )}

      {info && <div className="delete-confirm-info">{info}</div>}
      {error && <div className="delete-confirm-error">{error}</div>}
    </div>
  )
}
