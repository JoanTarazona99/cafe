import { useState, useEffect, useRef } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────
type Theme = 'light' | 'dark';
type Lang = 'ru' | 'es';

interface Entry {
  customer: string;
  phone: string;
  cuisine: string;
  location: string;
  competitors: string;
  parking: string;
  entrance: string;
  avgCheck: string;
  anchor: string;
  notes: string;
  timestamp: string;
}

// ─── Translations ─────────────────────────────────────────────────────────────
const translations = {
  ru: {
    meta: { title: 'Кафе · Ввод данных' },
    skip: 'Перейти к содержимому',
    brand: { name: 'Кафе · Оценка условий открытия', ariaLabel: 'Ввод данных кафе' },
    theme: { toggleAria: 'Сменить тему' },
    form: {
      langSelect: 'Выбрать язык',
      title: 'Новый сценарий',
      description: 'Заполните форму и сохраните запись, чтобы увидеть её в боковой панели.',
      labels: {
        customer: 'Клиент',
        phone: 'Телефон',
        cuisine: 'Тип кухни',
        location: 'Локация',
        competitors: 'Конкуренты (кол-во)',
        parking: 'Парковка',
        entrance: 'Тип входа',
        avgCheck: 'Средний чек (₽)',
        anchor: 'Якорь',
        notes: 'Заметки',
      },
      placeholders: {
        customer: 'Напр. Иван Иванов',
        phone: '+7 900 000 00 00',
        cuisine: 'Выберите тип кухни',
        location: 'Выберите локацию',
        competitors: 'Напр. 3',
        parking: 'Выберите парковку',
        entrance: 'Выберите тип входа',
        avgCheck: 'Напр. 850',
        anchor: 'Выберите привязку',
        notes: 'Без дополнительных примечаний',
      },
      options: {
        cuisine: { cafeteria: 'Кофейня', fastfood: 'Фастфуд', family: 'Семейный ресторан', author: 'Авторская кухня', pizzeria: 'Пиццерия', sushibar: 'Суши-бар', burger: 'Бургерная' },
        location: { center: 'Центр', residential: 'Спальный район', business: 'Деловой квартал', metro: 'У метро', shopping: 'Торговая улица', alley: 'Переулок', station: 'Вокзал', airport: 'Аэропорт' },
        parking: { none: 'Отсутствует', paid: 'Платная', free: 'Бесплатная' },
        entrance: { street: 'С улицы', mall: 'Внутри ТЦ', arch: 'Через арку', basement: 'Цокольный этаж', second: 'Второй этаж', aboveSecond: 'Выше второго этажа' },
        anchor: { none: 'Нет', mall: 'ТЦ', business_center: 'Бизнес-центр', university: 'Университет', college: 'Колледж', metro: 'Метро', tourist: 'Туристический объект' },
      },
      buttons: { calculate: 'Оценить сценарий', reset: 'Очистить форму' },
    },
    badge: { quickEntry: 'БЫСТРЫЙ ВВОД', summary: 'Сводка', activity: 'Активность' },
    hero: {
      h1: 'Фиксируйте параметры заведения и анализируйте сценарии открытия..',
      p: 'Эта страница задумана как первоначальная база для вашего репозитория <strong>cafe</strong>: позволяет фиксировать данные клиента, тип кухни, локацию, конкурентов, парковку и прочее с мгновенным сводом на экране.',
    },
    stats: { ariaLabel: 'Визуальное резюме', fieldsLabel: 'Ключевые поля', fieldsValue: '9', visualModeLabel: 'Режим отображения', visualModeValue: 'Светлая/Тёмная', storageLabel: 'Хранение', storageValue: 'Локально в памяти' },
    summary: { title: 'Текущее состояние', totalRecords: 'Всего сценариев', lastCuisine: 'Последняя кухня', lastLocation: 'Последняя локация' },
    log: {
      title: 'Последние сценарии',
      description: 'Каждая отправка добавляется в этот список в реальном времени, чтобы проверить структуру формы.',
      empty: 'Записей ещё нет. Используйте форму, чтобы создать первую запись.',
      noNotes: 'Без дополнительных заметок.',
    },
    footer: 'Статическая база, предназначенная для публикации на GitHub Pages или для развития в панель с бэкендом в будущем.',
  },
  es: {
    meta: { title: 'Café · Evaluación de escenarios de apertura' },
    skip: 'Saltar al contenido',
    brand: { name: 'Café · Evaluación de escenarios de apertura', ariaLabel: 'Entrada de datos del café' },
    theme: { toggleAria: 'Cambiar tema' },
    form: {
      langSelect: 'Seleccionar idioma',
      title: 'Nuevo escenario',
      description: 'Registra los parámetros del local y analiza escenarios de apertura.',
      labels: {
        customer: 'Cliente',
        phone: 'Teléfono',
        cuisine: 'Tipo de cocina',
        location: 'Ubicación',
        competitors: 'Competidores (cantidad)',
        parking: 'Parking',
        entrance: 'Entrada',
        avgCheck: 'Ticket medio (₽)',
        anchor: 'Ancla',
        notes: 'Notas',
      },
      placeholders: {
        customer: 'Ej. Carlos Tarazona',
        phone: '+7 900 000 00 00',
        cuisine: 'Selecciona tipo de cocina',
        location: 'Selecciona ubicación',
        competitors: 'Ej. 3',
        parking: 'Selecciona parking',
        entrance: 'Selecciona tipo de entrada',
        avgCheck: 'Ej. 850',
        anchor: 'Selecciona ancla',
        notes: 'Sin notas adicionales',
      },
      options: {
        cuisine: { cafeteria: 'Cafetería', fastfood: 'Comida rápida', family: 'Restaurante familiar', author: 'Cocina de autor', pizzeria: 'Pizzería', sushibar: 'Sushi-bar', burger: 'Hamburguesería' },
        location: { center: 'Centro', residential: 'Barrio residencial', business: 'Distrito de negocios', metro: 'Cerca del metro', shopping: 'Calle comercial', alley: 'Calle secundaria', station: 'Estación', airport: 'Aeropuerto' },
        parking: { none: 'Inexistente', paid: 'De pago', free: 'Gratuita' },
        entrance: { street: 'Desde la calle', mall: 'Dentro de un centro comercial', arch: 'A través de un arco', basement: 'Sótano', second: 'Segundo piso', aboveSecond: 'Piso superior' },
        anchor: { none: 'Ninguno', mall: 'Centro comercial', business_center: 'Centro de negocios', university: 'Universidad', college: 'Colegio', metro: 'Metro', tourist: 'Atracción turística' },
      },
      buttons: { calculate: 'Evaluar escenario', reset: 'Limpiar formulario' },
    },
    badge: { quickEntry: 'BÚSQUEDA RÁPIDA', summary: 'Resumen', activity: 'Actividad' },
    hero: {
      h1: 'Registra los parámetros del local y analiza escenarios de apertura.',
      p: 'Esta página está pensada como una primera base para tu repositorio <strong>cafe</strong>: permite capturar datos del cliente, tipo de cocina, ubicación, competidores, parking y más, con un resumen inmediato en pantalla.',
    },
    stats: { ariaLabel: 'Resumen visual', fieldsLabel: 'Campos clave', fieldsValue: '9', visualModeLabel: 'Modo visual', visualModeValue: 'Claro/Oscuro', storageLabel: 'Almacenamiento', storageValue: 'Local en memoria' },
    summary: { title: 'Estado actual', totalRecords: 'Total de escenarios', lastCuisine: 'Última cocina', lastLocation: 'Última ubicación' },
    log: {
      title: 'Últimos escenarios',
      description: 'Cada envío se añade a esta lista en tiempo real para validar la estructura del formulario.',
      empty: 'Aún no hay registros. Usa el formulario para crear la primera entrada.',
      noNotes: 'Sin notas adicionales.',
    },
    footer: 'Base estática pensada para publicarse en GitHub Pages o evolucionar hacia un panel con backend más adelante.',
  },
} as const;

type Tr = typeof translations.ru;

function t(lang: Lang, path: string): string {
  const keys = path.split('.');
  let cur: unknown = translations[lang];
  for (const k of keys) {
    if (cur && typeof cur === 'object' && k in (cur as Record<string, unknown>)) {
      cur = (cur as Record<string, unknown>)[k];
    } else {
      // fallback to es
      let fb: unknown = translations['es'];
      for (const fk of keys) {
        if (fb && typeof fb === 'object' && fk in (fb as Record<string, unknown>)) {
          fb = (fb as Record<string, unknown>)[fk];
        } else return path;
      }
      return typeof fb === 'string' ? fb : path;
    }
  }
  return typeof cur === 'string' ? cur : path;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const LOCALE_MAP: Record<Lang, string> = { ru: 'ru-RU', es: 'es-ES' };

function formatNow(lang: Lang) {
  return new Intl.DateTimeFormat(LOCALE_MAP[lang], { dateStyle: 'short', timeStyle: 'short' }).format(new Date());
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function CoffeeLogo() {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="logo" style={{ width: 38, height: 38, color: 'var(--color-primary)' }}>
      <path d="M18 22h24c0 14-5 22-12 22s-12-8-12-22Z" stroke="currentColor" strokeWidth="3.5" />
      <path d="M42 25h5c4 0 7 3 7 7s-3 7-7 7h-3" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M22 15c-2 3-1 5 1 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M31 12c-2 3-1 5 1 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M40 15c-2 3-1 5 1 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M14 48h36" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  );
}

interface FieldProps {
  label: string;
  children: React.ReactNode;
}
function Field({ label, children }: FieldProps) {
  return (
    <div className="field">
      <label>{label}</label>
      {children}
    </div>
  );
}

interface SelectFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  options: { value: string; label: string }[];
  placeholder: string;
}
function SelectField({ id, label, value, onChange, required, options, placeholder }: SelectFieldProps) {
  return (
    <Field label={label}>
      <select id={id} value={value} onChange={e => onChange(e.target.value)} required={required}>
        <option value="">{placeholder}</option>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </Field>
  );
}

interface NumericFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  min?: number;
  required?: boolean;
}
function NumericField({ id, label, value, onChange, placeholder, min = 0, required }: NumericFieldProps) {
  return (
    <Field label={label}>
      <input
        id={id}
        type="number"
        min={min}
        step="1"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
      />
    </Field>
  );
}

// ─── Entry Card ───────────────────────────────────────────────────────────────
function EntryCard({ entry, lang }: { entry: Entry; lang: Lang }) {
  const tr = (path: string) => t(lang, path);

  const rows: [string, string][] = [
    [tr('form.labels.cuisine'), tr(`form.options.cuisine.${entry.cuisine}`) || entry.cuisine],
    [tr('form.labels.location'), tr(`form.options.location.${entry.location}`) || entry.location],
    [tr('form.labels.competitors'), entry.competitors],
    [tr('form.labels.parking'), tr(`form.options.parking.${entry.parking}`) || entry.parking],
    [tr('form.labels.entrance'), tr(`form.options.entrance.${entry.entrance}`) || entry.entrance],
    [tr('form.labels.avgCheck'), entry.avgCheck],
    [tr('form.labels.anchor'), tr(`form.options.anchor.${entry.anchor}`) || entry.anchor],
  ];

  if (entry.notes) rows.push([tr('form.labels.notes'), entry.notes]);

  return (
    <article className="entry">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', marginBottom: '0.75rem' }}>
        <strong>{entry.customer}</strong>
        <small style={{ color: 'var(--color-text-muted)' }}>
          {entry.phone ? `${entry.phone} · ` : ''}{entry.timestamp}
        </small>
      </div>
      <dl style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '0.25rem 1rem', fontSize: 'var(--text-sm)', margin: 0 }}>
        {rows.map(([label, val]) => (
          val ? (
            <><dt key={`dt-${label}`} style={{ color: 'var(--color-text-muted)', fontWeight: 700 }}>{label}</dt>
              <dd key={`dd-${label}`} style={{ margin: 0 }}>{val}</dd></>
          ) : null
        ))}
      </dl>
    </article>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [theme, setTheme] = useState<Theme>(() =>
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  );
  const [lang, setLang] = useState<Lang>(() => {
    const saved = localStorage.getItem('lang');
    return (saved === 'ru' || saved === 'es') ? saved : 'ru';
  });
  const [entries, setEntries] = useState<Entry[]>([]);

  // Form state
  const [customer, setCustomer] = useState('');
  const [phone, setPhone] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [location, setLocation] = useState('');
  const [competitors, setCompetitors] = useState('');
  const [parking, setParking] = useState('');
  const [entrance, setEntrance] = useState('');
  const [avgCheck, setAvgCheck] = useState('');
  const [anchor, setAnchor] = useState('');
  const [notes, setNotes] = useState('');

  const customerRef = useRef<HTMLInputElement>(null);

  // Apply theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Apply lang
  useEffect(() => {
    document.documentElement.lang = lang;
    localStorage.setItem('lang', lang);
    document.title = t(lang, 'meta.title');
  }, [lang]);

  const tr = (path: string) => t(lang, path);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const entry: Entry = {
      customer: customer.trim(),
      phone: phone.trim(),
      cuisine,
      location,
      competitors: competitors.trim(),
      parking,
      entrance,
      avgCheck: avgCheck.trim(),
      anchor,
      notes: notes.trim(),
      timestamp: formatNow(lang),
    };
    setEntries(prev => [entry, ...prev]);
    // reset
    setCustomer(''); setPhone(''); setCuisine(''); setLocation('');
    setCompetitors(''); setParking(''); setEntrance('');
    setAvgCheck(''); setAnchor(''); setNotes('');
    setTimeout(() => customerRef.current?.focus(), 50);
  }

  const latest = entries[0];

  const cuisineOptions = Object.entries(
    (translations[lang] as Tr).form.options.cuisine
  ).map(([value, label]) => ({ value, label }));

  const locationOptions = Object.entries(
    (translations[lang] as Tr).form.options.location
  ).map(([value, label]) => ({ value, label }));

  const parkingOptions = Object.entries(
    (translations[lang] as Tr).form.options.parking
  ).map(([value, label]) => ({ value, label }));

  const entranceOptions = Object.entries(
    (translations[lang] as Tr).form.options.entrance
  ).map(([value, label]) => ({ value, label }));

  const anchorOptions = Object.entries(
    (translations[lang] as Tr).form.options.anchor
  ).map(([value, label]) => ({ value, label }));

  return (
    <>
      {/* Global CSS — injected once */}
      <style>{`
        :root,[data-theme="light"]{
          --text-xs:clamp(.75rem,.7rem + .25vw,.875rem);
          --text-sm:clamp(.875rem,.8rem + .35vw,1rem);
          --text-base:clamp(1rem,.95rem + .25vw,1.125rem);
          --text-lg:clamp(1.125rem,1rem + .75vw,1.5rem);
          --text-xl:clamp(1.5rem,1.2rem + 1.25vw,2.25rem);
          --text-2xl:clamp(2rem,1.2rem + 2.5vw,3.5rem);
          --space-1:.25rem;--space-2:.5rem;--space-3:.75rem;--space-4:1rem;--space-5:1.25rem;
          --space-6:1.5rem;--space-8:2rem;--space-10:2.5rem;--space-12:3rem;--space-16:4rem;
          --color-bg:#f7f3ef;--color-surface:#fcfaf7;--color-surface-2:#f2ece6;
          --color-border:#d8cec4;--color-text:#2d2118;--color-text-muted:#6f655d;
          --color-primary:#6f4e37;--color-primary-hover:#573a27;--color-accent:#c08a5b;
          --color-success:#3f6b46;--color-danger:#9e3f3f;--color-text-inverse:#fffaf5;
          --radius-sm:.5rem;--radius-md:.85rem;--radius-lg:1.25rem;--radius-full:9999px;
          --shadow-sm:0 6px 20px rgba(64,38,18,.08);--shadow-md:0 18px 42px rgba(64,38,18,.12);
          --font-body:'Satoshi',Inter,sans-serif;--font-display:'Boska',Georgia,serif;
        }
        [data-theme="dark"]{
          --color-bg:#181311;--color-surface:#231c18;--color-surface-2:#2d2520;
          --color-border:#4a3c34;--color-text:#f2e9df;--color-text-muted:#b8ab9e;
          --color-primary:#c08a5b;--color-primary-hover:#d6a477;--color-accent:#8b5e3c;
          --color-success:#7ec08a;--color-danger:#d97f7f;--color-text-inverse:#1a1412;
          --shadow-sm:0 6px 20px rgba(0,0,0,.25);--shadow-md:0 18px 42px rgba(0,0,0,.35);
        }
        *,*::before,*::after{box-sizing:border-box}
        html{scroll-behavior:smooth}
        body{margin:0;min-height:100vh;font-family:var(--font-body);background:linear-gradient(180deg,var(--color-bg),var(--color-surface-2));color:var(--color-text);line-height:1.6}
        button,input,select,textarea{font:inherit}
        .skip-link{position:absolute;left:-9999px;top:auto}
        .skip-link:focus{left:1rem;top:1rem;background:var(--color-primary);color:var(--color-text-inverse);padding:.75rem 1rem;border-radius:var(--radius-md);z-index:10}
        .shell{max-width:1180px;margin:0 auto;padding:var(--space-4)}
        .topbar{display:flex;justify-content:space-between;align-items:center;gap:var(--space-4);padding:var(--space-4) 0}
        .brand{display:flex;align-items:center;gap:.8rem;font-weight:700}
        .brand span{font-size:var(--text-lg)}
        .theme-toggle{min-width:44px;min-height:44px;border:1px solid var(--color-border);border-radius:var(--radius-full);display:grid;place-items:center;background:var(--color-surface);color:var(--color-text);cursor:pointer}
        .hero{display:grid;grid-template-columns:1.15fr .85fr;gap:var(--space-8);align-items:start;padding:var(--space-8) 0 var(--space-12)}
        .hero-copy h1{font-family:var(--font-display);font-size:var(--text-2xl);line-height:1.02;margin:0 0 var(--space-4)}
        .hero-copy p{font-size:var(--text-base);color:var(--color-text-muted);max-width:58ch;margin:0 0 var(--space-6)}
        .stats{display:grid;grid-template-columns:repeat(3,1fr);gap:var(--space-3)}
        .stat{background:color-mix(in srgb,var(--color-surface) 86%,transparent);border:1px solid var(--color-border);padding:var(--space-4);border-radius:var(--radius-lg);box-shadow:var(--shadow-sm)}
        .stat strong{display:block;font-size:var(--text-lg)}
        .panel{background:color-mix(in srgb,var(--color-surface) 94%,transparent);border:1px solid var(--color-border);border-radius:calc(var(--radius-lg) + 2px);box-shadow:var(--shadow-md)}
        .form-panel{padding:var(--space-6)}
        .panel h2{margin:0 0 var(--space-2);font-size:var(--text-xl)}
        .panel p{margin:0 0 var(--space-6);color:var(--color-text-muted)}
        form{display:grid;gap:var(--space-4)}
        .grid-2{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:var(--space-4)}
        .field{display:grid;gap:.45rem}
        label{font-size:var(--text-sm);font-weight:700}
        input,select,textarea{width:100%;border:1px solid var(--color-border);background:var(--color-surface);color:var(--color-text);border-radius:var(--radius-md);padding:.9rem 1rem;min-height:48px;outline:none}
        input[type=number]{-moz-appearance:textfield}
        input[type=number]::-webkit-inner-spin-button,input[type=number]::-webkit-outer-spin-button{opacity:1}
        textarea{min-height:120px;resize:vertical}
        input:focus,select:focus,textarea:focus{border-color:var(--color-primary);box-shadow:0 0 0 4px color-mix(in srgb,var(--color-primary) 20%,transparent)}
        .actions{display:flex;flex-wrap:wrap;gap:var(--space-3);padding-top:var(--space-2)}
        .btn{min-height:48px;padding:.9rem 1.2rem;border-radius:var(--radius-full);border:none;font-weight:700;display:inline-flex;align-items:center;justify-content:center;gap:.6rem;cursor:pointer}
        .btn-primary{background:var(--color-primary);color:var(--color-text-inverse)}
        .btn-primary:hover{background:var(--color-primary-hover)}
        .btn-secondary{background:transparent;border:1px solid var(--color-border);color:var(--color-text)}
        .btn-secondary:hover{background:var(--color-surface-2)}
        .summary{padding:var(--space-6);display:grid;gap:var(--space-4)}
        .summary-card{background:var(--color-surface-2);border:1px solid var(--color-border);padding:var(--space-4);border-radius:var(--radius-lg)}
        .summary-card h3{margin:0 0 .35rem;font-size:var(--text-sm);text-transform:uppercase;letter-spacing:.06em;color:var(--color-text-muted)}
        .summary-card strong{font-size:var(--text-lg)}
        .log{padding:var(--space-6) var(--space-6) var(--space-8)}
        .log-list{display:grid;gap:var(--space-3);margin-top:var(--space-4)}
        .entry{padding:var(--space-4);border:1px solid var(--color-border);border-radius:var(--radius-lg);background:var(--color-surface)}
        .empty{padding:var(--space-6);border:1px dashed var(--color-border);border-radius:var(--radius-lg);color:var(--color-text-muted);text-align:center;background:color-mix(in srgb,var(--color-surface) 85%,transparent);margin-top:var(--space-4)}
        .badge{display:inline-flex;align-items:center;gap:.45rem;width:max-content;padding:.45rem .8rem;border-radius:var(--radius-full);background:color-mix(in srgb,var(--color-accent) 18%,transparent);color:var(--color-primary);font-size:var(--text-xs);font-weight:700;text-transform:uppercase;letter-spacing:.08em}
        .lang-select{width:auto;min-width:88px;min-height:40px;padding:.45rem 2.2rem .45rem 1rem;appearance:none;-webkit-appearance:none;cursor:pointer;background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='%236f4e37' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'/></svg>");background-repeat:no-repeat;background-position:right .6rem center;background-size:1rem}
        [data-theme="dark"] .lang-select{background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='%23c08a5b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'/></svg>")}
        footer{padding:var(--space-8) 0 var(--space-4);color:var(--color-text-muted);font-size:var(--text-sm)}
        @media(max-width:900px){.hero{grid-template-columns:1fr}.grid-2,.stats{grid-template-columns:1fr}}
        @media(prefers-reduced-motion:reduce){*{scroll-behavior:auto;transition:none !important}}
      `}</style>

      <a className="skip-link" href="#contenido">{tr('skip')}</a>

      <div className="shell">
        {/* ── Top bar ── */}
        <header className="topbar">
          <div className="brand" aria-label={tr('brand.ariaLabel')}>
            <CoffeeLogo />
            <span>{tr('brand.name')}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              className="theme-toggle"
              type="button"
              aria-label={tr('theme.toggleAria')}
              onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
            >
              <span aria-hidden="true">◐</span>
            </button>

            <select
              className="lang-select"
              aria-label={tr('form.langSelect')}
              value={lang}
              onChange={e => setLang(e.target.value as Lang)}
            >
              <option value="ru">Русский</option>
              <option value="es">Español</option>
            </select>
          </div>
        </header>

        {/* ── Main ── */}
        <main id="contenido">
          {/* Hero row */}
          <section className="hero">
            {/* Left: copy + stats */}
            <div className="hero-copy">
              <span className="badge">{tr('badge.quickEntry')}</span>
              <h1>{tr('hero.h1')}</h1>
              <p dangerouslySetInnerHTML={{ __html: tr('hero.p') }} />
              <div className="stats" aria-label={tr('stats.ariaLabel')}>
                <article className="stat">
                  <span>{tr('stats.fieldsLabel')}</span>
                  <strong>{tr('stats.fieldsValue')}</strong>
                </article>
                <article className="stat">
                  <span>{tr('stats.visualModeLabel')}</span>
                  <strong>{tr('stats.visualModeValue')}</strong>
                </article>
                <article className="stat">
                  <span>{tr('stats.storageLabel')}</span>
                  <strong>{tr('stats.storageValue')}</strong>
                </article>
              </div>
            </div>

            {/* Right: form */}
            <section className="panel form-panel" aria-labelledby="form-title">
              <h2 id="form-title">{tr('form.title')}</h2>
              <p>{tr('form.description')}</p>

              <form onSubmit={handleSubmit} onReset={() => {
                setCustomer(''); setPhone(''); setCuisine(''); setLocation('');
                setCompetitors(''); setParking(''); setEntrance('');
                setAvgCheck(''); setAnchor(''); setNotes('');
              }}>
                {/* Row 1 */}
                <div className="grid-2">
                  <Field label={tr('form.labels.customer')}>
                    <input
                      ref={customerRef}
                      id="customer"
                      type="text"
                      value={customer}
                      onChange={e => setCustomer(e.target.value)}
                      placeholder={tr('form.placeholders.customer')}
                      required
                    />
                  </Field>
                  <Field label={tr('form.labels.phone')}>
                    <input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder={tr('form.placeholders.phone')}
                    />
                  </Field>
                </div>

                {/* Row 2 */}
                <div className="grid-2">
                  <SelectField
                    id="cuisine"
                    label={tr('form.labels.cuisine')}
                    value={cuisine}
                    onChange={setCuisine}
                    required
                    options={cuisineOptions}
                    placeholder={tr('form.placeholders.cuisine')}
                  />
                  <SelectField
                    id="location"
                    label={tr('form.labels.location')}
                    value={location}
                    onChange={setLocation}
                    required
                    options={locationOptions}
                    placeholder={tr('form.placeholders.location')}
                  />
                </div>

                {/* Row 3 — numeric inputs */}
                <div className="grid-2">
                  <NumericField
                    id="competitors"
                    label={tr('form.labels.competitors')}
                    value={competitors}
                    onChange={setCompetitors}
                    placeholder={tr('form.placeholders.competitors')}
                    min={0}
                    required
                  />
                  <NumericField
                    id="avgCheck"
                    label={tr('form.labels.avgCheck')}
                    value={avgCheck}
                    onChange={setAvgCheck}
                    placeholder={tr('form.placeholders.avgCheck')}
                    min={0}
                    required
                  />
                </div>

                {/* Row 4 */}
                <div className="grid-2">
                  <SelectField
                    id="parking"
                    label={tr('form.labels.parking')}
                    value={parking}
                    onChange={setParking}
                    required
                    options={parkingOptions}
                    placeholder={tr('form.placeholders.parking')}
                  />
                  <SelectField
                    id="entrance"
                    label={tr('form.labels.entrance')}
                    value={entrance}
                    onChange={setEntrance}
                    required
                    options={entranceOptions}
                    placeholder={tr('form.placeholders.entrance')}
                  />
                </div>

                {/* Row 5 */}
                <SelectField
                  id="anchor"
                  label={tr('form.labels.anchor')}
                  value={anchor}
                  onChange={setAnchor}
                  required
                  options={anchorOptions}
                  placeholder={tr('form.placeholders.anchor')}
                />

                {/* Notes */}
                <Field label={tr('form.labels.notes')}>
                  <textarea
                    id="notes"
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder={tr('form.placeholders.notes')}
                  />
                </Field>

                <div className="actions">
                  <button className="btn btn-primary" type="submit">{tr('form.buttons.calculate')}</button>
                  <button className="btn btn-secondary" type="reset">{tr('form.buttons.reset')}</button>
                </div>
              </form>
            </section>
          </section>

          {/* Summary + Log row */}
          <section className="hero" style={{ paddingTop: 0, alignItems: 'stretch' }}>
            {/* Summary */}
            <aside className="panel summary" aria-labelledby="summary-title">
              <div>
                <span className="badge">{tr('badge.summary')}</span>
                <h2 id="summary-title">{tr('summary.title')}</h2>
              </div>
              <div className="summary-card">
                <h3>{tr('summary.totalRecords')}</h3>
                <strong>{entries.length}</strong>
              </div>
              <div className="summary-card">
                <h3>{tr('summary.lastCuisine')}</h3>
                <strong>
                  {latest
                    ? (tr(`form.options.cuisine.${latest.cuisine}`) || latest.cuisine)
                    : tr('log.empty')}
                </strong>
              </div>
              <div className="summary-card">
                <h3>{tr('summary.lastLocation')}</h3>
                <strong>
                  {latest
                    ? (tr(`form.options.location.${latest.location}`) || latest.location)
                    : tr('log.empty')}
                </strong>
              </div>
            </aside>

            {/* Log */}
            <section className="panel log" aria-labelledby="log-title">
              <span className="badge">{tr('badge.activity')}</span>
              <h2 id="log-title">{tr('log.title')}</h2>
              <p>{tr('log.description')}</p>

              {entries.length === 0 ? (
                <div className="empty">{tr('log.empty')}</div>
              ) : (
                <div className="log-list" aria-live="polite">
                  {entries.map((entry, i) => (
                    <EntryCard key={i} entry={entry} lang={lang} />
                  ))}
                </div>
              )}
            </section>
          </section>
        </main>

        <footer>{tr('footer')}</footer>
      </div>
    </>
  );
}
