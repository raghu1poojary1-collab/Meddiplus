import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'

type Medicine = { name: string; stock: number; units: number }
type Doctor = { name: string; specialty: string; shift: string; initials: string }
type Hospital = {
  id: number
  name: string
  type: string
  city: string
  distance: string
  verified: string
  emergency: boolean
  vaccines: boolean
  x: number
  y: number
  doctors: Doctor[]
  medicines: Medicine[]
}

const hospitals: Hospital[] = [
  {
    id: 1,
    name: 'Alvas Health Centre',
    type: 'Multispeciality hospital',
    city: 'Moodbidri',
    distance: '1.4 km away',
    verified: '2 min ago',
    emergency: true,
    vaccines: true,
    x: 37,
    y: 37,
    doctors: [
      { name: 'Dr. Ananya Rao', specialty: 'General Medicine', shift: 'Until 8:00 PM', initials: 'AR' },
      { name: 'Dr. Kiran Shetty', specialty: 'Cardiology', shift: 'Until 6:30 PM', initials: 'KS' },
    ],
    medicines: [
      { name: 'Paracetamol 500mg', stock: 92, units: 184 },
      { name: 'Metformin 500mg', stock: 76, units: 96 },
    ],
  },
  {
    id: 2,
    name: 'Community Health Centre',
    type: 'Government facility',
    city: 'Moodbidri',
    distance: '3.2 km away',
    verified: '4 min ago',
    emergency: true,
    vaccines: true,
    x: 67,
    y: 29,
    doctors: [
      { name: 'Dr. Farah Khan', specialty: 'Paediatrics', shift: '24-hour duty', initials: 'FK' },
      { name: 'Dr. Joel D’Souza', specialty: 'Emergency Care', shift: 'Until 10:00 PM', initials: 'JD' },
    ],
    medicines: [
      { name: 'Covaxin', stock: 66, units: 48 },
      { name: 'ORS Sachets', stock: 88, units: 210 },
    ],
  },
  {
    id: 3,
    name: 'Pragathi Speciality Clinic',
    type: 'Speciality clinic',
    city: 'Mangaluru',
    distance: '8.7 km away',
    verified: '7 min ago',
    emergency: false,
    vaccines: false,
    x: 56,
    y: 61,
    doctors: [
      { name: 'Dr. Meera Pai', specialty: 'Dermatology', shift: 'Until 7:00 PM', initials: 'MP' },
      { name: 'Dr. Nithin Kumar', specialty: 'Orthopaedics', shift: 'From 4:00 PM', initials: 'NK' },
    ],
    medicines: [
      { name: 'Amoxicillin 250mg', stock: 54, units: 62 },
      { name: 'Insulin Glargine', stock: 24, units: 12 },
    ],
  },
]

const suggestions = [
  'Paracetamol 500mg',
  'Metformin 500mg',
  'Covaxin',
  'Cardiology',
  'Paediatrics',
  'Dr. Ananya Rao',
  'Emergency care',
]
const languages = ['English', 'ಕನ್ನಡ', 'ತುಳು', 'हिन्दी', 'తెలుగు', 'தமிழ்', 'മലയാളം', 'मराठी', 'اردو', 'বাংলা']
const cities = ['Moodbidri', 'Mangaluru', 'Udupi', 'Bengaluru', 'Mysuru']

function Icon({ name, size = 20 }: { name: string; size?: number }) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  }
  const paths: Record<string, ReactNode> = {
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    mic: <><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21M9 21h6" /></>,
    upload: <><path d="M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5" /><path d="M5 14v5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-5" /></>,
    lock: <><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3" /></>,
    chevron: <path d="m9 18 6-6-6-6" />,
    map: <><path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3z" /><path d="M9 3v15M15 6v15" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    route: <><circle cx="6" cy="19" r="2" /><circle cx="18" cy="5" r="2" /><path d="M8 19h3a3 3 0 0 0 3-3V8a3 3 0 0 1 3-3" /></>,
    medicine: <><path d="m10 5 9 9a4 4 0 0 1-6 6l-9-9a4 4 0 0 1 6-6Z" /><path d="m8 15 7-7" /></>,
    user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
    shield: <><path d="M12 3 4.5 6v5c0 5 3.2 8.5 7.5 10 4.3-1.5 7.5-5 7.5-10V6z" /><path d="m9 12 2 2 4-4" /></>,
    phone: <path d="M8 3H5a2 2 0 0 0-2 2c0 8.8 7.2 16 16 16a2 2 0 0 0 2-2v-3l-4-1-2 2c-3.4-1.5-6.1-4.2-7.5-7.5l2-2z" />,
    close: <path d="m6 6 12 12M18 6 6 18" />,
    heart: <path d="M20.8 5.8a5.5 5.5 0 0 0-7.8 0L12 6.9l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 22l8.8-8.4a5.5 5.5 0 0 0 0-7.8z" />,
    spark: <><path d="m12 3 1.3 4.2L17 9l-3.7 1.8L12 15l-1.3-4.2L7 9l3.7-1.8z" /><path d="m19 15 .7 2.3L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.7z" /></>,
  }
  return <svg {...common}>{paths[name]}</svg>
}

function HeartbeatLogo() {
  return (
    <div className="logo-mark" aria-hidden="true">
      <svg viewBox="0 0 36 22">
        <path d="M1 12h7l2.3-5 4 11 4.2-15 3.5 9h5l2-4 2.5 4H35" />
      </svg>
    </div>
  )
}

function RadarDot({ light = false }: { light?: boolean }) {
  return <span className={`radar-dot ${light ? 'light' : ''}`}><i /><b /></span>
}

function CareNetworkGraphic() {
  return (
    <svg className="care-network-svg" viewBox="0 0 430 390" role="img" aria-label="Connected hospital care network illustration">
      <defs>
        <linearGradient id="careCard" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#ffffff" />
          <stop offset="1" stopColor="#f2ede4" />
        </linearGradient>
        <filter id="softShadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="14" stdDeviation="16" floodColor="#12312E" floodOpacity=".12" />
        </filter>
      </defs>
      <circle className="graphic-orbit orbit-a" cx="215" cy="195" r="156" />
      <circle className="graphic-orbit orbit-b" cx="215" cy="195" r="122" />
      <path className="graphic-route" d="M76 252C121 224 131 125 214 132s93 104 148 56" />
      <path className="graphic-route route-two" d="M99 101c55 20 62 104 124 119s91-31 122 46" />

      <g className="hospital-building" filter="url(#softShadow)">
        <rect x="133" y="98" width="166" height="194" rx="24" fill="url(#careCard)" stroke="#DDD5C7" />
        <path d="M151 274h130v18H151z" fill="#12312E" opacity=".08" />
        <rect x="188" y="71" width="56" height="56" rx="18" fill="#E8622C" />
        <path d="M216 86v26M203 99h26" stroke="#fff" strokeWidth="7" strokeLinecap="round" />
        <rect x="158" y="151" width="32" height="34" rx="8" fill="#DCE8DC" />
        <rect x="201" y="151" width="32" height="34" rx="8" fill="#DCE8DC" />
        <rect x="244" y="151" width="32" height="34" rx="8" fill="#DCE8DC" />
        <rect x="158" y="198" width="32" height="34" rx="8" fill="#DCE8DC" />
        <rect x="244" y="198" width="32" height="34" rx="8" fill="#DCE8DC" />
        <path d="M202 292v-64c0-8 6-14 14-14s14 6 14 14v64" fill="#12312E" />
        <circle cx="221" cy="252" r="3" fill="#FAF6EF" />
      </g>

      <g className="floating-card doctor-chip" filter="url(#softShadow)">
        <rect x="29" y="73" width="122" height="61" rx="17" fill="#fff" stroke="#DDD5C7" />
        <circle cx="58" cy="103" r="17" fill="#6B8F71" />
        <path d="M49 109c2-10 16-10 19 0M58 99a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
        <rect x="82" y="92" width="50" height="6" rx="3" fill="#12312E" opacity=".8" />
        <rect x="82" y="105" width="36" height="5" rx="2.5" fill="#6B8F71" opacity=".45" />
      </g>
      <g className="floating-card medicine-chip" filter="url(#softShadow)">
        <rect x="286" y="252" width="118" height="65" rx="18" fill="#fff" stroke="#DDD5C7" />
        <g transform="translate(306 270) rotate(-45 14 14)">
          <rect width="28" height="45" rx="14" fill="#E8622C" />
          <path d="M0 22h28" stroke="#fff" strokeWidth="2" />
          <path d="M0 22h28v9a14 14 0 0 1-28 0z" fill="#FAF6EF" />
        </g>
        <rect x="350" y="273" width="35" height="6" rx="3" fill="#12312E" opacity=".8" />
        <rect x="350" y="287" width="25" height="5" rx="2.5" fill="#E8622C" opacity=".45" />
      </g>
      <g className="floating-card route-chip" filter="url(#softShadow)">
        <rect x="21" y="273" width="113" height="62" rx="18" fill="#12312E" />
        <circle cx="50" cy="304" r="16" fill="#FAF6EF" opacity=".12" />
        <path d="M43 305c10-15 18 7 25-8" fill="none" stroke="#FAF6EF" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 3" />
        <circle cx="43" cy="305" r="3" fill="#E8622C" /><circle cx="68" cy="297" r="3" fill="#6B8F71" />
        <rect x="79" y="293" width="37" height="6" rx="3" fill="#FAF6EF" opacity=".8" />
        <rect x="79" y="307" width="27" height="5" rx="2.5" fill="#FAF6EF" opacity=".35" />
      </g>
      <g className="graphic-pulse pulse-one"><circle cx="349" cy="89" r="7" fill="#E8622C" /><circle cx="349" cy="89" r="15" fill="none" stroke="#E8622C" /></g>
      <g className="graphic-pulse pulse-two"><circle cx="94" cy="205" r="6" fill="#6B8F71" /><circle cx="94" cy="205" r="14" fill="none" stroke="#6B8F71" /></g>
    </svg>
  )
}

function HospitalCard({ hospital, active, onHover, onAction }: { hospital: Hospital; active: boolean; onHover: () => void; onAction: (action: 'doctors' | 'medicine' | 'directions') => void }) {
  return (
    <article className={`hospital-card reveal ${active ? 'active' : ''}`} onMouseEnter={onHover} onFocus={onHover} tabIndex={0}>
      <div className="card-top">
        <div>
          <div className="eyebrow"><RadarDot /> Live · Verified {hospital.verified}</div>
          <h3>{hospital.name}</h3>
          <p>{hospital.type} · {hospital.city}</p>
        </div>
        <span className="distance"><Icon name="route" size={14} /> {hospital.distance}</span>
      </div>
      <div className="doctor-row">
        <div className="avatar-stack">
          {hospital.doctors.map((doctor) => <span key={doctor.name} title={doctor.name}>{doctor.initials}</span>)}
        </div>
        <div>
          <strong>{hospital.doctors.length} doctors on duty</strong>
          <p>{hospital.doctors[0].specialty} · {hospital.doctors[0].shift}</p>
        </div>
        <button className="icon-button" aria-label="View doctors"><Icon name="chevron" size={18} /></button>
      </div>
      <div className="stock-list">
        {hospital.medicines.map((medicine) => (
          <div className="stock" key={medicine.name}>
            <div><span>{medicine.name}</span><small>{medicine.units} units</small></div>
            <div className="stock-track"><i style={{ width: `${medicine.stock}%` }} className={medicine.stock < 35 ? 'low' : ''} /></div>
          </div>
        ))}
      </div>
      <div className="card-actions">
        <button onClick={() => onAction('doctors')}><Icon name="user" size={17} /> View doctors</button>
        <button onClick={() => onAction('medicine')}><Icon name="medicine" size={17} /> Reserve medicine</button>
        <button onClick={() => onAction('directions')}><Icon name="route" size={17} /> Directions</button>
      </div>
    </article>
  )
}

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [value, setValue] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      const start = performance.now()
      const tick = (now: number) => {
        const progress = Math.min((now - start) / 1100, 1)
        setValue(Math.round(target * (1 - Math.pow(1 - progress, 3))))
        if (progress < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
      observer.disconnect()
    })
    observer.observe(node)
    return () => observer.disconnect()
  }, [target])
  return <span ref={ref}>{value}{suffix}</span>
}

function LoginPage({ onClose }: { onClose: () => void }) {
  const [showPassword, setShowPassword] = useState(false)
  const [signedIn, setSignedIn] = useState(false)
  const [closing, setClosing] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [recoveryOpen, setRecoveryOpen] = useState(false)
  const [recoveryStep, setRecoveryStep] = useState<'input' | 'sent'>('input')
  const [recoveryEmail, setRecoveryEmail] = useState('raghu1poojary1@gmail.com')
  const [recoveryPass, setRecoveryPass] = useState('')
  const [recoveryLoading, setRecoveryLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const closePage = () => {
    setClosing(true)
    window.setTimeout(onClose, 650)
  }

  const handleSendRecovery = async (e: React.FormEvent) => {
    e.preventDefault()
    setRecoveryLoading(true)
    const randomNum = Math.floor(1000 + Math.random() * 9000)
    let generatedPass = `MedPulse#${randomNum}`

    try {
      const resp = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: recoveryEmail })
      })
      if (resp.ok) {
        const data = await resp.json()
        if (data.recovery_password) generatedPass = data.recovery_password
      }
    } catch (err) {
      console.log('Recovery mailer notice:', err)
    }

    setRecoveryPass(generatedPass)
    setRecoveryStep('sent')
    setRecoveryLoading(false)
  }

  const handleFillAndSignIn = () => {
    setPassword(recoveryPass)
    if (recoveryEmail) setEmail(recoveryEmail)
    setRecoveryOpen(false)
    setRecoveryStep('input')
  }

  const copyCode = () => {
    navigator.clipboard.writeText(recoveryPass)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section className={`login-page ${closing ? 'page-closing' : ''}`} aria-labelledby="login-title">
      <div className="login-visual">
        <div className="login-grid" />
        <button className="login-back" onClick={closePage}><span>←</span> Back to live search</button>
        <div className="login-brand"><HeartbeatLogo /><span><strong>MediPulse</strong><small>Hospital network console</small></span></div>
        <div className="login-story">
          <div className="verified-pill"><RadarDot light /> Secure hospital access</div>
          <h1>Keep care<br /><em>moving.</em></h1>
          <p>Update doctor rosters, medicine availability, and emergency capacity for patients across the network.</p>
          <div className="login-live-card">
            <span className="signal-orbit"><i /><b /><Icon name="shield" size={23} /></span>
            <div><small>NETWORK STATUS</small><strong>31 facilities online</strong><em>Last sync: just now</em></div>
          </div>
        </div>
        <svg className="login-ekg" viewBox="0 0 900 120" preserveAspectRatio="none" aria-hidden="true">
          <path className="ekg-base" d="M0 62h170l18-1 12-27 18 58 26-88 22 58h98l15-24 20 24h145l16-1 12-22 18 44 25-73 24 52h78l18-34 19 34h127" />
          <path className="ekg-pulse" d="M0 62h170l18-1 12-27 18 58 26-88 22 58h98l15-24 20 24h145l16-1 12-22 18 44 25-73 24 52h78l18-34 19 34h127" />
        </svg>
        <div className="login-proof">
          <span><Icon name="shield" size={16} /> Device-secured session</span>
          <span><RadarDot light /> Network operational</span>
        </div>
      </div>

      <div className="login-form-side">
        <button className="login-close" onClick={closePage} aria-label="Close login"><Icon name="close" size={20} /></button>
        {!signedIn ? (
          <div className="login-form-wrap">
            <span className="login-kicker">STAFF PORTAL</span>
            <h2 id="login-title">Welcome back.</h2>
            <p>Sign in with your hospital-issued credentials.</p>
            <form onSubmit={(event) => { event.preventDefault(); setSignedIn(true) }}>
              <label>
                <span>Work email or staff ID</span>
                <div className="login-input"><Icon name="user" size={18} /><input type="text" placeholder="staff@hospital.org" value={email} onChange={(e) => setEmail(e.target.value)} required autoFocus /></div>
              </label>
              <label>
                <span>Password</span>
                <div className="login-input"><Icon name="lock" size={18} /><input type={showPassword ? 'text' : 'password'} placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={4} /><button type="button" onClick={() => setShowPassword((value) => !value)}>{showPassword ? 'Hide' : 'Show'}</button></div>
              </label>
              <div className="login-options">
                <label><input type="checkbox" /> <span>Keep me signed in</span></label>
                <button type="button" onClick={() => { setRecoveryEmail(email || 'raghu1poojary1@gmail.com'); setRecoveryOpen(true) }}>Forgot password?</button>
              </div>
              <button className="login-submit" type="submit">Sign in securely <span>→</span></button>
            </form>
            <div className="login-divider"><span>or continue with</span></div>
            <button className="hospital-sso"><Icon name="shield" size={18} /> Hospital single sign-on</button>
            <p className="login-help">Need access? <button>Contact your hospital administrator</button></p>
            <div className="login-security"><Icon name="lock" size={14} /> This demonstration validates locally. No credentials are transmitted.</div>
          </div>
        ) : (
          <div className="login-success">
            <div className="success-rings"><i /><b /><span><Icon name="shield" size={31} /></span></div>
            <span className="login-kicker">IDENTITY VERIFIED</span>
            <h2>Access granted.</h2>
            <p>Your demonstration staff session is ready. Continue to the live availability portal.</p>
            <button className="login-submit" onClick={closePage}>Enter MediPulse <span>→</span></button>
          </div>
        )}
        <div className="login-footer"><span>Privacy</span><span>Security</span><span>Support</span><small>© MediPulse Network</small></div>
      </div>

      {recoveryOpen && (
        <div className="recovery-backdrop visible" role="dialog" aria-modal="true" onClick={(e) => { if (e.target === e.currentTarget) setRecoveryOpen(false) }}>
          <div className="recovery-card">
            <div className="recovery-header-row">
              <div className="recovery-icon-badge"><Icon name="lock" size={20} /></div>
              <button className="modal-close" onClick={() => setRecoveryOpen(false)} aria-label="Close" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}><Icon name="close" size={18} /></button>
            </div>

            {recoveryStep === 'input' ? (
              <div>
                <h2 className="recovery-title">Recover Account Password</h2>
                <p className="recovery-subtext">Enter your registered email address. We'll generate a secure temporary recovery password and dispatch it directly to your Gmail inbox.</p>
                <form onSubmit={handleSendRecovery}>
                  <label style={{ display: 'block', marginBottom: '14px', fontSize: '12px', fontWeight: 600 }}>
                    <span style={{ display: 'block', marginBottom: '6px' }}>Registered Email Address</span>
                    <div className="login-input">
                      <Icon name="user" size={18} />
                      <input
                        type="email"
                        value={recoveryEmail}
                        onChange={(e) => setRecoveryEmail(e.target.value)}
                        placeholder="you@gmail.com"
                        required
                        autoFocus
                      />
                    </div>
                  </label>
                  <button type="submit" className="login-submit" disabled={recoveryLoading} style={{ width: '100%' }}>
                    {recoveryLoading ? 'Dispatching Recovery Email...' : 'Send Recovery Password →'}
                  </button>
                </form>
              </div>
            ) : (
              <div>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#d1fae5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <h2 className="recovery-title">Recovery Password Sent!</h2>
                <p className="recovery-subtext">We have dispatched a temporary recovery password to <strong>{recoveryEmail}</strong>.</p>
                
                <div className="recovery-pass-box">
                  <div>
                    <div style={{ fontSize: '10px', color: 'var(--slate)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '3px' }}>TEMPORARY RECOVERY PASSWORD</div>
                    <div className="recovery-pass-text">{recoveryPass}</div>
                  </div>
                  <button type="button" className="btn-copy-code" onClick={copyCode}>
                    <Icon name="shield" size={14} />
                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>

                <button type="button" className="login-submit" onClick={handleFillAndSignIn} style={{ width: '100%', marginBottom: '10px' }}>
                  ✓ Fill & Sign In Now
                </button>

                <a
                  href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(recoveryEmail)}&su=${encodeURIComponent('MediPulse Recovery Password')}&body=${encodeURIComponent('Your temporary recovery password: ' + recoveryPass)}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', width: '100%', padding: '9px 14px', background: '#f8fafc', border: '1.5px solid #cbd5e1', color: '#334155', fontWeight: 600, fontSize: '12px', borderRadius: '10px', textDecoration: 'none', marginBottom: '8px' }}
                >
                  Open in Gmail Web ✉️
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  )
}

function FacilityActionPage({ hospital, action, onClose }: { hospital: Hospital; action: 'doctors' | 'medicine' | 'directions'; onClose: () => void }) {
  const [reserved, setReserved] = useState(false)
  const [closing, setClosing] = useState(false)
  const closePage = () => {
    setClosing(true)
    window.setTimeout(onClose, 650)
  }
  const labels = {
    doctors: ['Doctor roster', 'Doctors ready when you arrive'],
    medicine: ['Medicine desk', 'Reserve before you travel'],
    directions: ['Route guidance', 'The clearest path to care'],
  }

  return (
    <section className={`action-page action-${action} ${closing ? 'page-closing' : ''}`} aria-labelledby="action-title">
      <div className="action-transition" aria-hidden="true"><HeartbeatLogo /><span /></div>
      <header className="action-header">
        <button onClick={closePage}><span>←</span> Back to facilities</button>
        <div className="brand"><HeartbeatLogo /><span><strong>MediPulse</strong><small>Live care detail</small></span></div>
        <div className="action-live"><RadarDot /> Verified {hospital.verified}</div>
      </header>

      <div className="action-hero">
        <div>
          <span className="section-kicker">{labels[action][0]}</span>
          <h1 id="action-title">{labels[action][1]}</h1>
          <p>{hospital.name} · {hospital.city} · {hospital.distance}</p>
        </div>
        <div className="action-hero-icon"><i /><b /><Icon name={action === 'doctors' ? 'user' : action === 'medicine' ? 'medicine' : 'route'} size={34} /></div>
      </div>

      <div className="action-content">
        {action === 'doctors' && (
          <div className="doctor-detail-grid">
            {hospital.doctors.map((doctor, index) => (
              <article className="doctor-detail-card" style={{ '--action-delay': `${index * 110}ms` } as React.CSSProperties} key={doctor.name}>
                <div className="doctor-portrait"><span>{doctor.initials}</span><i /></div>
                <div className="doctor-info">
                  <span className="availability"><RadarDot /> On duty now</span>
                  <h2>{doctor.name}</h2><p>{doctor.specialty}</p>
                  <div className="doctor-meta"><span><Icon name="clock" size={16} /> {doctor.shift}</span><span><Icon name="shield" size={16} /> Verified roster</span></div>
                </div>
                <button onClick={() => setReserved(true)}>Request consultation <span>→</span></button>
              </article>
            ))}
            <aside className="action-note"><Icon name="spark" size={21} /><div><strong>Before you visit</strong><p>Doctor status is refreshed by the hospital desk every few minutes. Emergency cases are prioritised on arrival.</p></div></aside>
          </div>
        )}

        {action === 'medicine' && !reserved && (
          <div className="medicine-detail-layout">
            <div className="medicine-reserve-list">
              {hospital.medicines.map((medicine, index) => (
                <label className="medicine-reserve-card" style={{ '--action-delay': `${index * 110}ms` } as React.CSSProperties} key={medicine.name}>
                  <input type="checkbox" defaultChecked={index === 0} />
                  <span className="medicine-bottle"><Icon name="medicine" size={23} /></span>
                  <span className="medicine-copy"><small>IN STOCK · {medicine.units} UNITS</small><strong>{medicine.name}</strong><em>Verified {hospital.verified}</em></span>
                  <span className="stock-ring" style={{ '--stock': `${medicine.stock * 3.6}deg` } as React.CSSProperties}><b>{medicine.stock}%</b></span>
                </label>
              ))}
            </div>
            <aside className="reservation-summary">
              <span className="section-kicker">Reservation summary</span><h2>Hold for 30 minutes</h2>
              <p>The medicine desk will keep your selected items ready while you travel.</p>
              <div><span>Facility</span><strong>{hospital.name}</strong></div><div><span>Pickup window</span><strong>Today · Next 30 min</strong></div>
              <button onClick={() => setReserved(true)}>Confirm reservation <span>→</span></button>
              <small>No payment is collected in this demonstration.</small>
            </aside>
          </div>
        )}

        {action === 'directions' && (
          <div className="route-detail-layout">
            <div className="route-map-graphic">
              <div className="route-grid" /><div className="route-line"><i /><b /><em /></div>
              <span className="route-start"><i /> Your location</span>
              <span className="route-finish"><Icon name="heart" size={17} /><b>{hospital.name}</b></span>
              <div className="route-time"><strong>12 min</strong><span>{hospital.distance} · Fastest route</span></div>
            </div>
            <div className="route-steps">
              <span className="section-kicker">Turn-by-turn preview</span><h2>Ready when you are</h2>
              {['Head towards Moodbidri Main Road', 'Continue straight past the town junction', `Arrive at ${hospital.name}`].map((step, index) => <div className="route-step" style={{ '--action-delay': `${index * 90}ms` } as React.CSSProperties} key={step}><span>{index + 1}</span><p>{step}<small>{index === 0 ? '300 m' : index === 1 ? '1.0 km' : '100 m'}</small></p></div>)}
              <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hospital.name + ' ' + hospital.city)}`} target="_blank" rel="noreferrer">Open live directions <span>↗</span></a>
              <small>External navigation opens only when you choose to continue.</small>
            </div>
          </div>
        )}

        {reserved && (
          <div className="action-success">
            <div className="success-rings"><i /><b /><span><Icon name="shield" size={31} /></span></div>
            <span className="section-kicker">REQUEST CONFIRMED</span>
            <h2>{action === 'doctors' ? 'Consultation request sent.' : 'Medicine reserved.'}</h2>
            <p>{action === 'doctors' ? 'The hospital desk has received your request and will guide you on arrival.' : `Your selected medicine is held at ${hospital.name} for the next 30 minutes.`}</p>
            <button onClick={closePage}>Return to facilities <span>→</span></button>
          </div>
        )}
      </div>
    </section>
  )
}

export default function App() {
  const [scrolled, setScrolled] = useState(false)
  const [progress, setProgress] = useState(0)
  const [language, setLanguage] = useState('English')
  const [mode, setMode] = useState<'type' | 'voice' | 'upload'>('type')
  const [query, setQuery] = useState('')
  const [city, setCity] = useState('Moodbidri')
  const [filter, setFilter] = useState('All facilities')
  const [activeHospital, setActiveHospital] = useState(1)
  const [voiceActive, setVoiceActive] = useState(false)
  const [uploaded, setUploaded] = useState(false)
  const [emergencyOpen, setEmergencyOpen] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)
  const [activeAction, setActiveAction] = useState<{ hospital: Hospital; action: 'doctors' | 'medicine' | 'directions' } | null>(null)
  const [searched, setSearched] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      const max = document.documentElement.scrollHeight - window.innerHeight
      setScrolled(y > 48)
      setProgress(max > 0 ? (y / max) * 100 : 0)
      document.documentElement.style.setProperty('--scroll-y', `${y}px`)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const nodes = document.querySelectorAll('.reveal, .journey-path')
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('visible')
      })
    }, { threshold: 0.02, rootMargin: '80px 0px 80px 0px' })
    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [])

  const matches = useMemo(() => {
    const q = query.toLowerCase()
    return hospitals.filter((h) => {
      const text = [h.name, h.city, ...h.doctors.flatMap((d) => [d.name, d.specialty]), ...h.medicines.map((m) => m.name)].join(' ').toLowerCase()
      const searchMatch = !q || text.includes(q)
      const filterMatch = filter === 'All facilities' ||
        (filter === 'Doctors on duty' && h.doctors.length > 0) ||
        (filter === 'In-stock medicines' && h.medicines.some((m) => m.stock > 30)) ||
        (filter === 'Vaccines ready' && h.vaccines) ||
        (filter === '24/7 Emergency' && h.emergency)
      return searchMatch && filterMatch
    })
  }, [filter, query])

  const visibleSuggestions = query ? suggestions.filter((s) => s.toLowerCase().includes(query.toLowerCase())).slice(0, 4) : []
  const modeIndex = mode === 'type' ? 0 : mode === 'voice' ? 1 : 2

  const runVoice = () => {
    setVoiceActive(true)
    window.setTimeout(() => {
      setQuery('Emergency care')
      setVoiceActive(false)
      setSearched(true)
    }, 1900)
  }

  return (
    <main
      className="app-shell"
      onPointerMove={(event) => {
        event.currentTarget.style.setProperty('--pointer-x', `${event.clientX}px`)
        event.currentTarget.style.setProperty('--pointer-y', `${event.clientY}px`)
      }}
    >
      <div className="page-intro" aria-hidden="true">
        <div className="intro-logo"><HeartbeatLogo /><span>MediPulse</span></div>
        <svg viewBox="0 0 300 50"><path d="M0 27h84l10-19 12 36 16-32 12 15h34l8-10 10 10h114" /></svg>
      </div>
      <div className="scroll-progress" style={{ width: `${progress}%` }} />
      <div className="scroll-rail" aria-hidden="true">
        <span>01</span><i><b style={{ transform: `scaleY(${progress / 100})` }} /><em style={{ top: `${progress}%` }} /></i><span>04</span>
      </div>
      <div className="pointer-glow" aria-hidden="true" />
      <div className="ambient ambient-one" /><div className="ambient ambient-two" />

      <header className={scrolled ? 'site-header compact' : 'site-header'}>
        <div className="nav-shell">
          <a className="brand" href="#top" aria-label="MediPulse home">
            <HeartbeatLogo />
            <span><strong>MediPulse</strong><small>Real-time healthcare availability</small></span>
          </a>
          <div className="nav-actions">
            <div className="network-status"><RadarDot /><span>Live network active</span></div>
            <label className="language-select">
              <span className="sr-only">Select language</span>
              <select value={language} onChange={(e) => setLanguage(e.target.value)}>{languages.map((item) => <option key={item}>{item}</option>)}</select>
            </label>
            <button className="staff-button" onClick={() => setLoginOpen(true)}><Icon name="lock" size={17} /><span>Hospital staff portal</span></button>
          </div>
        </div>
      </header>

      <section className="hero" id="top">
        <div className="hero-grid" aria-hidden="true" />
        <svg className="ekg-bg" viewBox="0 0 1400 180" preserveAspectRatio="none" aria-hidden="true">
          <path className="ekg-base" d="M0 95h305l25-1 13-31 22 78 35-125 28 79h83l18-29 22 29h254l17-1 14-24 20 49 29-91 28 66h100l22-42 20 42h300" />
          <path className="ekg-pulse" d="M0 95h305l25-1 13-31 22 78 35-125 28 79h83l18-29 22 29h254l17-1 14-24 20 49 29-91 28 66h100l22-42 20 42h300" />
        </svg>
        <div className="hero-copy">
          <div className="verified-pill"><RadarDot /> 31 hospitals verified live</div>
          <h1><span>Know before you</span> <em>go.</em></h1>
          <p>Check real-time doctor rosters, medicine stocks, and vaccine dose counts across South India—before leaving home.</p>
          <div className="hero-trust-row">
            <span><Icon name="shield" size={15} /> Hospital verified</span>
            <span><Icon name="clock" size={15} /> Updated every 2 min</span>
            <span><Icon name="map" size={15} /> 31 locations</span>
          </div>
          <div className="hero-signal-card">
            <span className="signal-orbit"><i /><b /><Icon name="heart" size={23} /></span>
            <div><small>NETWORK PULSE</small><strong>All systems live</strong><em>98% data freshness</em></div>
          </div>
          <div className="hero-care-graphic"><CareNetworkGraphic /></div>
        </div>

        <div className="search-terminal">
          <div className="mode-tabs" style={{ '--tab-index': modeIndex } as React.CSSProperties}>
            <span className="tab-slider" />
            <button className={mode === 'type' ? 'selected' : ''} onClick={() => setMode('type')}><Icon name="search" size={17} /> Type search</button>
            <button className={mode === 'voice' ? 'selected' : ''} onClick={() => setMode('voice')}><Icon name="mic" size={17} /> Speak query</button>
            <button className={mode === 'upload' ? 'selected' : ''} onClick={() => setMode('upload')}><Icon name="upload" size={17} /> Upload prescription</button>
          </div>

          {mode === 'type' && (
            <div className="search-form">
              <div className="input-wrap">
                <Icon name="search" size={22} />
                <input value={query} onChange={(e) => { setQuery(e.target.value); setSearched(false) }} placeholder="Search a doctor, medicine, vaccine..." />
                {visibleSuggestions.length > 0 && (
                  <div className="suggestions">{visibleSuggestions.map((item) => <button key={item} onClick={() => setQuery(item)}><Icon name="search" size={15} />{item}</button>)}</div>
                )}
              </div>
              <div className="city-wrap"><Icon name="map" size={20} /><select value={city} onChange={(e) => setCity(e.target.value)}>{cities.map((item) => <option key={item}>{item}</option>)}</select></div>
              <button className="primary-cta" onClick={() => { setSearched(true); document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' }) }}>Check availability <span>→</span></button>
            </div>
          )}
          {mode === 'voice' && (
            <div className="voice-mode">
              <button className={`voice-button ${voiceActive ? 'listening' : ''}`} onClick={runVoice}><Icon name="mic" size={25} /><i /><b /><em /></button>
              <div><strong>{voiceActive ? 'Listening…' : 'Tap to speak'}</strong><p>{voiceActive ? 'Try “Emergency care near me”' : 'Your voice stays on this device.'}</p></div>
            </div>
          )}
          {mode === 'upload' && (
            <label className={`upload-zone ${uploaded ? 'uploaded' : ''}`}>
              <input type="file" accept="image/*,.pdf" onChange={() => { setUploaded(true); setQuery('Paracetamol') }} />
              <span className="scan-beam" />
              <Icon name={uploaded ? 'shield' : 'upload'} size={27} />
              <div><strong>{uploaded ? 'Prescription scanned locally' : 'Drop a prescription here'}</strong><p>{uploaded ? '3 medicines detected · Ready to check' : 'JPG, PNG or PDF · Nothing leaves your device'}</p></div>
              <button type="button">{uploaded ? 'Check matches' : 'Choose file'}</button>
            </label>
          )}
        </div>

        <div className="filter-bar">
          <span>Show me</span>
          {['All facilities', 'Doctors on duty', 'In-stock medicines', 'Vaccines ready', '24/7 Emergency'].map((item) => (
            <button key={item} className={filter === item ? 'active' : ''} onClick={() => setFilter(item)}>{item === '24/7 Emergency' && <RadarDot />} {item}</button>
          ))}
        </div>
        <a className="scroll-cue" href="#results"><span>Explore live care</span><i><Icon name="chevron" size={16} /></i></a>
      </section>

      <div className="live-ticker" aria-label="Live network updates">
        <div>
          {[0, 1].map((loop) => (
            <span className="ticker-set" key={loop} aria-hidden={loop === 1}>
              <b><RadarDot light /> LIVE NOW</b>
              <em>Alvas Health Centre verified 2 min ago</em><i />
              <em>12 Covaxin doses available in Moodbidri</em><i />
              <em>Dr. Farah Khan on duty until 10 PM</em><i />
              <em>Emergency wait time under 8 minutes</em><i />
            </span>
          ))}
        </div>
      </div>

      <section className="stats-strip" aria-label="Live network statistics">
        <div><strong><AnimatedCounter target={31} /></strong><span>Facilities active</span></div>
        <i />
        <div><strong><AnimatedCounter target={98} suffix="%" /></strong><span>Live bed sync</span></div>
        <i />
        <div><strong><AnimatedCounter target={15} suffix=" min" /></strong><span>Stock guarantee</span></div>
        <i />
        <div><strong><AnimatedCounter target={284} /></strong><span>Doctors on duty</span></div>
      </section>

      <section className="care-visual-band" aria-label="Connected healthcare services">
        {[
          ['user', 'Live roster', '284 doctors', 'Shift status verified'],
          ['medicine', 'Medicine sync', '4,810 items', 'Stock moving live'],
          ['route', 'Safe routing', '31 facilities', 'Fastest care path'],
        ].map(([icon, label, value, detail], index) => (
          <article className="visual-system-card reveal" style={{ transitionDelay: `${index * 120}ms` }} key={label}>
            <div className="visual-orb">
              <i /><b /><span><Icon name={icon} size={25} /></span>
            </div>
            <div><small>{label}</small><strong>{value}</strong><p>{detail}</p></div>
            <svg viewBox="0 0 110 35" aria-hidden="true"><path d="M0 24h20l7-1 5-15 9 26 11-31 9 21h13l6-9 7 9h23" /></svg>
          </article>
        ))}
      </section>

      <section className="results-section" id="results">
        <div className="section-heading reveal">
          <div><span className="section-kicker">Live healthcare radar</span><h2>Care within your reach</h2></div>
          <p>{searched ? `Showing live matches for “${query || 'all care'}” near ${city}.` : `Continuously verified care near ${city}.`}</p>
        </div>
        <div className="radar-layout">
          <div className="results-list">
            <div className="count-banner reveal">
              <div><RadarDot /><span><strong>{matches.length || 0} shown</strong> from 31 verified health facilities</span></div>
              <span>Updated just now</span>
            </div>
            <div className="triage-insight reveal">
              <span className="ai-icon"><Icon name="spark" size={20} /></span>
              <div><small>MEDIPULSE TRIAGE INSIGHT</small><strong>{query.toLowerCase().includes('emergency') ? 'Urgent · Emergency care suggested' : 'Routine care · General medicine suggested'}</strong></div>
              <span className={query.toLowerCase().includes('emergency') ? 'urgency urgent' : 'urgency'}>{query.toLowerCase().includes('emergency') ? 'High priority' : 'Low urgency'}</span>
            </div>
            {matches.length ? matches.map((hospital) => <HospitalCard key={hospital.id} hospital={hospital} active={activeHospital === hospital.id} onHover={() => setActiveHospital(hospital.id)} onAction={(action) => setActiveAction({ hospital, action })} />) : (
              <div className="empty-state"><Icon name="search" size={28} /><h3>No exact match nearby</h3><p>Try another medicine, specialty, or facility filter.</p><button onClick={() => { setQuery(''); setFilter('All facilities') }}>Clear search</button></div>
            )}
          </div>

          <aside className="map-panel reveal">
            <div className="map-toolbar"><span><RadarDot /> LIVE FACILITY MAP</span><button aria-label="Center map"><Icon name="route" size={17} /></button></div>
            <div className="map-canvas">
              <div className="map-grid" />
              <div className="map-road road-one" /><div className="map-road road-two" /><div className="map-road road-three" />
              <span className="map-label label-one">Moodbidri</span><span className="map-label label-two">Mangaluru Road</span><span className="map-label label-three">Belvai</span>
              {hospitals.map((hospital) => (
                <button key={hospital.id} className={`map-pin ${activeHospital === hospital.id ? 'active' : ''}`} style={{ left: `${hospital.x}%`, top: `${hospital.y}%` }} onClick={() => setActiveHospital(hospital.id)} aria-label={`View ${hospital.name}`}>
                  <span><Icon name="heart" size={17} /></span><i /><b />
                  {activeHospital === hospital.id && <em>{hospital.name}<small>{hospital.distance}</small></em>}
                </button>
              ))}
              <div className="you-are-here"><span /> You are here</div>
            </div>
            <div className="map-footer"><span><i /> Verified now</span><span><i /> Emergency ready</span><small>Local radar view</small></div>
          </aside>
        </div>
      </section>

      <section className="journey-section">
        <div className="section-heading centered reveal">
          <div><span className="section-kicker">How it works</span><h2>Protection at every step</h2></div>
          <p>One clear journey from uncertainty to verified care.</p>
        </div>
        <div className="journey-grid">
          <svg className="journey-path" viewBox="0 0 900 150" preserveAspectRatio="none" aria-hidden="true"><path d="M110 80 C240 8 320 8 450 80 S690 150 790 80" /></svg>
          {[
            ['01', 'search', 'Search before travel', 'Find the right care by medicine, symptom, doctor, or speciality before leaving home.'],
            ['02', 'shield', 'Live roster verification', 'Hospital teams verify shifts and stock, while MediPulse timestamps every update.'],
            ['03', 'heart', 'Emergency triage', 'Get a clear urgency signal, direct route, and instant emergency contact when minutes matter.'],
          ].map(([number, icon, title, copy], index) => (
            <article className="journey-card reveal" style={{ transitionDelay: `${index * 130}ms` }} key={number}>
              <span className="step-number">{number}</span><div className="step-icon"><Icon name={icon} size={25} /></div><h3>{title}</h3><p>{copy}</p><span className="learn-link">Learn more <Icon name="chevron" size={15} /></span>
            </article>
          ))}
        </div>
      </section>

      <footer>
        <div className="brand"><HeartbeatLogo /><span><strong>MediPulse</strong><small>Care, verified before the journey.</small></span></div>
        <p>Frontend demonstration · All availability shown is realistic mock data.</p>
        <span>Built for safer healthcare journeys.</span>
      </footer>

      <button className="emergency-fab" onClick={() => setEmergencyOpen(true)}><span><Icon name="phone" size={20} /></span><div><small>NEED HELP NOW?</small><strong>Emergency</strong></div></button>
      <nav className="mobile-nav">
        <a href="#top" className="active"><Icon name="search" /><span>Search</span></a>
        <a href="#results"><Icon name="map" /><span>Map</span></a>
        <button onClick={() => setEmergencyOpen(true)}><Icon name="spark" /><span>AI Triage</span></button>
        <button onClick={() => setLoginOpen(true)}><Icon name="user" /><span>Account</span></button>
      </nav>

      {loginOpen && <LoginPage onClose={() => setLoginOpen(false)} />}
      {activeAction && <FacilityActionPage hospital={activeAction.hospital} action={activeAction.action} onClose={() => setActiveAction(null)} />}

      {emergencyOpen && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="emergency-title" onMouseDown={(e) => { if (e.target === e.currentTarget) setEmergencyOpen(false) }}>
          <div className="emergency-modal">
            <button className="modal-close" onClick={() => setEmergencyOpen(false)} aria-label="Close"><Icon name="close" /></button>
            <div className="emergency-symbol"><Icon name="phone" size={28} /></div>
            <span className="section-kicker">Immediate assistance</span>
            <h2 id="emergency-title">You’re not alone.</h2>
            <p>For a life-threatening emergency, call the national emergency response line now.</p>
            <a className="call-now" href="tel:112"><Icon name="phone" /> Call 112 now</a>
            <button className="ambulance-button" onClick={() => setEmergencyOpen(false)}><Icon name="route" /> Find nearest emergency facility</button>
            <small>Your location and call are handled by your device.</small>
          </div>
        </div>
      )}
    </main>
  )
}
