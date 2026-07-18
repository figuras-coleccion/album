export const COUNTRIES = [
  { code: 'PE', name: 'Perú' },
  { code: 'MX', name: 'México' },
  { code: 'AR', name: 'Argentina' },
  { code: 'BO', name: 'Bolivia' },
  { code: 'BR', name: 'Brasil' },
  { code: 'CL', name: 'Chile' },
  { code: 'CO', name: 'Colombia' },
  { code: 'CR', name: 'Costa Rica' },
  { code: 'CU', name: 'Cuba' },
  { code: 'DO', name: 'República Dominicana' },
  { code: 'EC', name: 'Ecuador' },
  { code: 'SV', name: 'El Salvador' },
  { code: 'GT', name: 'Guatemala' },
  { code: 'HN', name: 'Honduras' },
  { code: 'NI', name: 'Nicaragua' },
  { code: 'PA', name: 'Panamá' },
  { code: 'PY', name: 'Paraguay' },
  { code: 'UY', name: 'Uruguay' },
  { code: 'VE', name: 'Venezuela' },
  { code: 'US', name: 'Estados Unidos' },
  { code: 'CA', name: 'Canadá' },
  { code: 'ES', name: 'España' },
  { code: 'GB', name: 'Reino Unido' },
  { code: 'DE', name: 'Alemania' },
  { code: 'FR', name: 'Francia' },
  { code: 'IT', name: 'Italia' },
  { code: 'PT', name: 'Portugal' },
  { code: 'OTHER', name: 'Otro país' }
]

export const COUNTRY_BY_CODE = new Map(COUNTRIES.map(country => [country.code, country]))

const TIMEZONE_COUNTRY_HINTS = {
  'America/Lima': 'PE',
  'America/Mexico_City': 'MX',
  'America/Cancun': 'MX',
  'America/Monterrey': 'MX',
  'America/Argentina/Buenos_Aires': 'AR',
  'America/La_Paz': 'BO',
  'America/Sao_Paulo': 'BR',
  'America/Santiago': 'CL',
  'America/Bogota': 'CO',
  'America/Costa_Rica': 'CR',
  'America/Havana': 'CU',
  'America/Santo_Domingo': 'DO',
  'America/Guayaquil': 'EC',
  'America/El_Salvador': 'SV',
  'America/Guatemala': 'GT',
  'America/Tegucigalpa': 'HN',
  'America/Managua': 'NI',
  'America/Panama': 'PA',
  'America/Asuncion': 'PY',
  'America/Montevideo': 'UY',
  'America/Caracas': 'VE',
  'America/New_York': 'US',
  'America/Chicago': 'US',
  'America/Denver': 'US',
  'America/Los_Angeles': 'US',
  'America/Toronto': 'CA',
  'America/Vancouver': 'CA',
  'Europe/Madrid': 'ES',
  'Europe/London': 'GB',
  'Europe/Berlin': 'DE',
  'Europe/Paris': 'FR',
  'Europe/Rome': 'IT',
  'Europe/Lisbon': 'PT'
}

export function getCountryName(code) {
  return COUNTRY_BY_CODE.get(String(code || '').toUpperCase())?.name || ''
}

export function detectCountryCode() {
  try {
    const language = navigator.language || navigator.languages?.[0] || ''
    if (language && typeof Intl !== 'undefined' && Intl.Locale) {
      const region = new Intl.Locale(language).region
      if (region && COUNTRY_BY_CODE.has(region.toUpperCase())) {
        return region.toUpperCase()
      }
    }
  } catch (_) {
    // Fallback silencioso.
  }

  try {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
    const guessed = TIMEZONE_COUNTRY_HINTS[timeZone]
    if (guessed && COUNTRY_BY_CODE.has(guessed)) return guessed
  } catch (_) {
    // Fallback silencioso.
  }

  return ''
}
