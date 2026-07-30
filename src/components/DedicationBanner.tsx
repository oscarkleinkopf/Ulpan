import { Link } from 'react-router-dom'

type Props = {
  compact?: boolean
}

export function DedicationBanner({ compact = false }: Props) {
  return (
    <aside className={`dedication${compact ? ' dedication-compact' : ''}`} aria-label="Dedicatoria">
      <div className="dedication-inner">
        <p className="dedication-kicker">Dedicatoria especial</p>
        <p className="dedication-he he" lang="he">
          לְזֵכֶר גִּבּוֹרֵי צַהַ״ל
        </p>
        <p className="dedication-title">En honor a los héroes de Tzahal</p>
        {!compact ? (
          <p className="dedication-body">
            Esta app se dedica, con respeto y gratitud, a quienes sirvieron y sirven en las Fuerzas de Defensa de
            Israel — צְבָא הֲגָנָה לְיִשְׂרָאֵל.
          </p>
        ) : null}
        <Link className="dedication-link" to="/sionismo">
          Ver léxico y calendario
        </Link>
      </div>
    </aside>
  )
}
