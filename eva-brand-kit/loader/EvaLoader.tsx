// Загрузка ЕВА: анимированный логотип. Варианты:
//   splash  — полный экран при старте приложения (160px, подпись, полоса прогресса);
//   overlay — поверх панели или экрана: открытие проекта, загрузка модели (96px);
//   inline  — в шапке блока, на кнопке, в строке Прогона (24px, грани мигают по часовой).
// progress: число 0..1 — полоса с прогрессом; undefined — полоса «бегущая»; null — без полосы.
import { useId, type CSSProperties } from 'react';
import { EVA_FACES } from './evaLogoPaths';
import './EvaLoader.css';

type Props = {
  variant?: 'splash' | 'overlay' | 'inline';
  label?: string;
  progress?: number | null;
};

const CENTER_SHIFT = 'translate(-226 -210)';
const VIEWBOX = '-200 -200 400 400';

// Плашки-искры: угол, дальность разлёта и докрутка. Фиксированные, чтобы анимация была одинаковой каждый раз.
const BITS = [
  { a: 8, r: 150, spin: 90 }, { a: 38, r: 182, spin: -120 }, { a: 66, r: 140, spin: 160 },
  { a: 98, r: 172, spin: -90 }, { a: 128, r: 150, spin: 120 }, { a: 158, r: 186, spin: -160 },
  { a: 190, r: 145, spin: 90 }, { a: 218, r: 176, spin: -120 }, { a: 248, r: 152, spin: 140 },
  { a: 278, r: 184, spin: -90 }, { a: 308, r: 146, spin: 120 }, { a: 338, r: 170, spin: -140 },
];

export default function EvaLoader({ variant = 'overlay', label, progress }: Props) {
  const glowId = useId().replace(/:/g, '');
  const isInline = variant === 'inline';
  const showBar = !isInline && progress !== null;
  const indeterminate = progress === undefined;
  const pct = typeof progress === 'number' ? Math.max(0, Math.min(1, progress)) : 0;

  return (
    <div
      className={`eva-loader eva-loader--${variant}`}
      role="status"
      aria-live="polite"
      aria-label={label ?? 'Загрузка'}
    >
      <div className="eva-loader__stage" aria-hidden="true">
        {!isInline && (
          <svg viewBox={VIEWBOX}>
            <defs>
              <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="12" />
              </filter>
            </defs>
            <g className="eva-loader__glow" filter={`url(#${glowId})`}>
              {EVA_FACES.map((f) => (
                <path key={f.id} d={f.d} fillRule="evenodd" transform={CENTER_SHIFT} />
              ))}
            </g>
          </svg>
        )}

        <svg viewBox={VIEWBOX} className="eva-loader__spin">
          {EVA_FACES.map((f) => (
            <g
              key={f.id}
              className={`eva-loader__fly eva-loader__fly--${f.id}`}
              style={{ '--dx': f.dx, '--dy': f.dy } as CSSProperties}
            >
              <path className="eva-loader__face" d={f.d} fillRule="evenodd" transform={CENTER_SHIFT} />
            </g>
          ))}
        </svg>

        {!isInline && (
          <svg viewBox={VIEWBOX}>
            <circle className="eva-loader__ring" cx="0" cy="0" r="120" />
            {BITS.map((b, i) => (
              <rect
                key={i}
                className={`eva-loader__bit ${i % 4 === 3 ? 'eva-loader__bit--blue' : ''}`}
                x="-9"
                y="-9"
                width="18"
                height="18"
                rx="3"
                style={{ '--a': `${b.a}deg`, '--r': `${b.r}px`, '--spin': `${b.spin}deg` } as CSSProperties}
              />
            ))}
          </svg>
        )}
      </div>

      {label && <div className="eva-loader__label">{label}</div>}

      {showBar && (
        <div className={`eva-loader__bar ${indeterminate ? 'eva-loader__bar--indeterminate' : ''}`}>
          <i style={{ '--eva-progress': pct } as CSSProperties} />
        </div>
      )}
    </div>
  );
}
