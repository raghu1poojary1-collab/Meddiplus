// MediPulse Standalone React Application
const {
  useEffect,
  useMemo,
  useRef,
  useState
} = React;
const hospitals = [{
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
  doctors: [{
    name: 'Dr. Ananya Rao',
    specialty: 'General Medicine',
    shift: 'Until 8:00 PM',
    initials: 'AR'
  }, {
    name: 'Dr. Kiran Shetty',
    specialty: 'Cardiology',
    shift: 'Until 6:30 PM',
    initials: 'KS'
  }],
  medicines: [{
    name: 'Paracetamol 500mg',
    stock: 92,
    units: 184
  }, {
    name: 'Metformin 500mg',
    stock: 76,
    units: 96
  }]
}, {
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
  doctors: [{
    name: 'Dr. Farah Khan',
    specialty: 'Paediatrics',
    shift: '24-hour duty',
    initials: 'FK'
  }, {
    name: 'Dr. Joel D’Souza',
    specialty: 'Emergency Care',
    shift: 'Until 10:00 PM',
    initials: 'JD'
  }],
  medicines: [{
    name: 'Covaxin',
    stock: 66,
    units: 48
  }, {
    name: 'ORS Sachets',
    stock: 88,
    units: 210
  }]
}, {
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
  doctors: [{
    name: 'Dr. Meera Pai',
    specialty: 'Dermatology',
    shift: 'Until 7:00 PM',
    initials: 'MP'
  }, {
    name: 'Dr. Nithin Kumar',
    specialty: 'Orthopaedics',
    shift: 'From 4:00 PM',
    initials: 'NK'
  }],
  medicines: [{
    name: 'Amoxicillin 250mg',
    stock: 54,
    units: 62
  }, {
    name: 'Insulin Glargine',
    stock: 24,
    units: 12
  }]
}];
const suggestions = ['Paracetamol 500mg', 'Metformin 500mg', 'Covaxin', 'Cardiology', 'Paediatrics', 'Dr. Ananya Rao', 'Emergency care'];
const languages = ['English', 'ಕನ್ನಡ', 'ತುಳು', 'हिन्दी', 'తెలుగు', 'தமிழ்', 'മലയാളം', 'मराठी', 'اردو', 'বাংলা'];
const cities = ['Moodbidri', 'Mangaluru', 'Udupi', 'Bengaluru', 'Mysuru'];
function Icon({
  name,
  size = 20
}) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true
  };
  const paths = {
    search: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
      cx: "11",
      cy: "11",
      r: "7"
    }), /*#__PURE__*/React.createElement("path", {
      d: "m20 20-4-4"
    })),
    mic: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("rect", {
      x: "9",
      y: "3",
      width: "6",
      height: "11",
      rx: "3"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21M9 21h6"
    })),
    upload: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M5 14v5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-5"
    })),
    lock: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("rect", {
      x: "4",
      y: "10",
      width: "16",
      height: "11",
      rx: "2"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M8 10V7a4 4 0 0 1 8 0v3M12 14v3"
    })),
    chevron: /*#__PURE__*/React.createElement("path", {
      d: "m9 18 6-6-6-6"
    }),
    map: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3z"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M9 3v15M15 6v15"
    })),
    clock: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "12",
      r: "9"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M12 7v5l3 2"
    })),
    route: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
      cx: "6",
      cy: "19",
      r: "2"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "18",
      cy: "5",
      r: "2"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M8 19h3a3 3 0 0 0 3-3V8a3 3 0 0 1 3-3"
    })),
    medicine: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "m10 5 9 9a4 4 0 0 1-6 6l-9-9a4 4 0 0 1 6-6Z"
    }), /*#__PURE__*/React.createElement("path", {
      d: "m8 15 7-7"
    })),
    user: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "8",
      r: "4"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M4 21a8 8 0 0 1 16 0"
    })),
    shield: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M12 3 4.5 6v5c0 5 3.2 8.5 7.5 10 4.3-1.5 7.5-5 7.5-10V6z"
    }), /*#__PURE__*/React.createElement("path", {
      d: "m9 12 2 2 4-4"
    })),
    phone: /*#__PURE__*/React.createElement("path", {
      d: "M8 3H5a2 2 0 0 0-2 2c0 8.8 7.2 16 16 16a2 2 0 0 0 2-2v-3l-4-1-2 2c-3.4-1.5-6.1-4.2-7.5-7.5l2-2z"
    }),
    close: /*#__PURE__*/React.createElement("path", {
      d: "m6 6 12 12M18 6 6 18"
    }),
    heart: /*#__PURE__*/React.createElement("path", {
      d: "M20.8 5.8a5.5 5.5 0 0 0-7.8 0L12 6.9l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 22l8.8-8.4a5.5 5.5 0 0 0 0-7.8z"
    }),
    spark: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "m12 3 1.3 4.2L17 9l-3.7 1.8L12 15l-1.3-4.2L7 9l3.7-1.8z"
    }), /*#__PURE__*/React.createElement("path", {
      d: "m19 15 .7 2.3L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.7z"
    }))
  };
  return /*#__PURE__*/React.createElement("svg", common, paths[name]);
}
function HeartbeatLogo() {
  return /*#__PURE__*/React.createElement("div", {
    className: "logo-mark",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 36 22"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M1 12h7l2.3-5 4 11 4.2-15 3.5 9h5l2-4 2.5 4H35"
  })));
}
function RadarDot({
  light = false
}) {
  return /*#__PURE__*/React.createElement("span", {
    className: `radar-dot ${light ? 'light' : ''}`
  }, /*#__PURE__*/React.createElement("i", null), /*#__PURE__*/React.createElement("b", null));
}
function CareNetworkGraphic() {
  return /*#__PURE__*/React.createElement("svg", {
    className: "care-network-svg",
    viewBox: "0 0 430 390",
    role: "img",
    "aria-label": "Connected hospital care network illustration"
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
    id: "careCard",
    x1: "0",
    y1: "0",
    x2: "1",
    y2: "1"
  }, /*#__PURE__*/React.createElement("stop", {
    stopColor: "#ffffff"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "1",
    stopColor: "#f2ede4"
  })), /*#__PURE__*/React.createElement("filter", {
    id: "softShadow",
    x: "-30%",
    y: "-30%",
    width: "160%",
    height: "160%"
  }, /*#__PURE__*/React.createElement("feDropShadow", {
    dx: "0",
    dy: "14",
    stdDeviation: "16",
    floodColor: "#12312E",
    floodOpacity: ".12"
  }))), /*#__PURE__*/React.createElement("circle", {
    className: "graphic-orbit orbit-a",
    cx: "215",
    cy: "195",
    r: "156"
  }), /*#__PURE__*/React.createElement("circle", {
    className: "graphic-orbit orbit-b",
    cx: "215",
    cy: "195",
    r: "122"
  }), /*#__PURE__*/React.createElement("path", {
    className: "graphic-route",
    d: "M76 252C121 224 131 125 214 132s93 104 148 56"
  }), /*#__PURE__*/React.createElement("path", {
    className: "graphic-route route-two",
    d: "M99 101c55 20 62 104 124 119s91-31 122 46"
  }), /*#__PURE__*/React.createElement("g", {
    className: "hospital-building",
    filter: "url(#softShadow)"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "133",
    y: "98",
    width: "166",
    height: "194",
    rx: "24",
    fill: "url(#careCard)",
    stroke: "#DDD5C7"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M151 274h130v18H151z",
    fill: "#12312E",
    opacity: ".08"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "188",
    y: "71",
    width: "56",
    height: "56",
    rx: "18",
    fill: "#E8622C"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M216 86v26M203 99h26",
    stroke: "#fff",
    strokeWidth: "7",
    strokeLinecap: "round"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "158",
    y: "151",
    width: "32",
    height: "34",
    rx: "8",
    fill: "#DCE8DC"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "201",
    y: "151",
    width: "32",
    height: "34",
    rx: "8",
    fill: "#DCE8DC"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "244",
    y: "151",
    width: "32",
    height: "34",
    rx: "8",
    fill: "#DCE8DC"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "158",
    y: "198",
    width: "32",
    height: "34",
    rx: "8",
    fill: "#DCE8DC"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "244",
    y: "198",
    width: "32",
    height: "34",
    rx: "8",
    fill: "#DCE8DC"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M202 292v-64c0-8 6-14 14-14s14 6 14 14v64",
    fill: "#12312E"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "221",
    cy: "252",
    r: "3",
    fill: "#FAF6EF"
  })), /*#__PURE__*/React.createElement("g", {
    className: "floating-card doctor-chip",
    filter: "url(#softShadow)"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "29",
    y: "73",
    width: "122",
    height: "61",
    rx: "17",
    fill: "#fff",
    stroke: "#DDD5C7"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "58",
    cy: "103",
    r: "17",
    fill: "#6B8F71"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M49 109c2-10 16-10 19 0M58 99a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z",
    fill: "none",
    stroke: "#fff",
    strokeWidth: "2",
    strokeLinecap: "round"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "82",
    y: "92",
    width: "50",
    height: "6",
    rx: "3",
    fill: "#12312E",
    opacity: ".8"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "82",
    y: "105",
    width: "36",
    height: "5",
    rx: "2.5",
    fill: "#6B8F71",
    opacity: ".45"
  })), /*#__PURE__*/React.createElement("g", {
    className: "floating-card medicine-chip",
    filter: "url(#softShadow)"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "286",
    y: "252",
    width: "118",
    height: "65",
    rx: "18",
    fill: "#fff",
    stroke: "#DDD5C7"
  }), /*#__PURE__*/React.createElement("g", {
    transform: "translate(306 270) rotate(-45 14 14)"
  }, /*#__PURE__*/React.createElement("rect", {
    width: "28",
    height: "45",
    rx: "14",
    fill: "#E8622C"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M0 22h28",
    stroke: "#fff",
    strokeWidth: "2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M0 22h28v9a14 14 0 0 1-28 0z",
    fill: "#FAF6EF"
  })), /*#__PURE__*/React.createElement("rect", {
    x: "350",
    y: "273",
    width: "35",
    height: "6",
    rx: "3",
    fill: "#12312E",
    opacity: ".8"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "350",
    y: "287",
    width: "25",
    height: "5",
    rx: "2.5",
    fill: "#E8622C",
    opacity: ".45"
  })), /*#__PURE__*/React.createElement("g", {
    className: "floating-card route-chip",
    filter: "url(#softShadow)"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "21",
    y: "273",
    width: "113",
    height: "62",
    rx: "18",
    fill: "#12312E"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "50",
    cy: "304",
    r: "16",
    fill: "#FAF6EF",
    opacity: ".12"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M43 305c10-15 18 7 25-8",
    fill: "none",
    stroke: "#FAF6EF",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeDasharray: "3 3"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "43",
    cy: "305",
    r: "3",
    fill: "#E8622C"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "68",
    cy: "297",
    r: "3",
    fill: "#6B8F71"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "79",
    y: "293",
    width: "37",
    height: "6",
    rx: "3",
    fill: "#FAF6EF",
    opacity: ".8"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "79",
    y: "307",
    width: "27",
    height: "5",
    rx: "2.5",
    fill: "#FAF6EF",
    opacity: ".35"
  })), /*#__PURE__*/React.createElement("g", {
    className: "graphic-pulse pulse-one"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "349",
    cy: "89",
    r: "7",
    fill: "#E8622C"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "349",
    cy: "89",
    r: "15",
    fill: "none",
    stroke: "#E8622C"
  })), /*#__PURE__*/React.createElement("g", {
    className: "graphic-pulse pulse-two"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "94",
    cy: "205",
    r: "6",
    fill: "#6B8F71"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "94",
    cy: "205",
    r: "14",
    fill: "none",
    stroke: "#6B8F71"
  })));
}
function HospitalCard({
  hospital,
  active,
  onHover,
  onAction
}) {
  return /*#__PURE__*/React.createElement("article", {
    className: `hospital-card reveal ${active ? 'active' : ''}`,
    onMouseEnter: onHover,
    onFocus: onHover,
    tabIndex: 0
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-top"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow"
  }, /*#__PURE__*/React.createElement(RadarDot, null), " Live · Verified ", hospital.verified), /*#__PURE__*/React.createElement("h3", null, hospital.name), /*#__PURE__*/React.createElement("p", null, hospital.type, " · ", hospital.city)), /*#__PURE__*/React.createElement("span", {
    className: "distance"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "route",
    size: 14
  }), " ", hospital.distance)), /*#__PURE__*/React.createElement("div", {
    className: "doctor-row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "avatar-stack"
  }, hospital.doctors.map(doctor => /*#__PURE__*/React.createElement("span", {
    key: doctor.name,
    title: doctor.name
  }, doctor.initials))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, hospital.doctors.length, " doctors on duty"), /*#__PURE__*/React.createElement("p", null, hospital.doctors[0].specialty, " · ", hospital.doctors[0].shift)), /*#__PURE__*/React.createElement("button", {
    className: "icon-button",
    "aria-label": "View doctors"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "chevron",
    size: 18
  }))), /*#__PURE__*/React.createElement("div", {
    className: "stock-list"
  }, hospital.medicines.map(medicine => /*#__PURE__*/React.createElement("div", {
    className: "stock",
    key: medicine.name
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", null, medicine.name), /*#__PURE__*/React.createElement("small", null, medicine.units, " units")), /*#__PURE__*/React.createElement("div", {
    className: "stock-track"
  }, /*#__PURE__*/React.createElement("i", {
    style: {
      width: `${medicine.stock}%`
    },
    className: medicine.stock < 35 ? 'low' : ''
  }))))), /*#__PURE__*/React.createElement("div", {
    className: "card-actions"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => onAction('doctors')
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "user",
    size: 17
  }), " View doctors"), /*#__PURE__*/React.createElement("button", {
    onClick: () => onAction('medicine')
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "medicine",
    size: 17
  }), " Reserve medicine"), /*#__PURE__*/React.createElement("button", {
    onClick: () => onAction('directions')
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "route",
    size: 17
  }), " Directions")));
}
function AnimatedCounter({
  target,
  suffix = ''
}) {
  const [value, setValue] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      const start = performance.now();
      const tick = now => {
        const progress = Math.min((now - start) / 1100, 1);
        setValue(Math.round(target * (1 - Math.pow(1 - progress, 3))));
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      observer.disconnect();
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [target]);
  return /*#__PURE__*/React.createElement("span", {
    ref: ref
  }, value, suffix);
}
function LoginPage({
  onClose
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [closing, setClosing] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [recoveryOpen, setRecoveryOpen] = useState(false);
  const [recoveryStep, setRecoveryStep] = useState('input');
  const [recoveryEmail, setRecoveryEmail] = useState('raghu1poojary1@gmail.com');
  const [recoveryPass, setRecoveryPass] = useState('');
  const [recoveryLoading, setRecoveryLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const closePage = () => {
    setClosing(true);
    window.setTimeout(onClose, 650);
  };
  const handleSendRecovery = async e => {
    e.preventDefault();
    setRecoveryLoading(true);
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    let generatedPass = `MedPulse#${randomNum}`;
    try {
      const resp = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: recoveryEmail
        })
      });
      if (resp.ok) {
        const data = await resp.json();
        if (data.recovery_password) generatedPass = data.recovery_password;
      }
    } catch (err) {
      console.log('Recovery mailer notice:', err);
    }
    setRecoveryPass(generatedPass);
    setRecoveryStep('sent');
    setRecoveryLoading(false);
  };
  const handleFillAndSignIn = () => {
    setPassword(recoveryPass);
    if (recoveryEmail) setEmail(recoveryEmail);
    setRecoveryOpen(false);
    setRecoveryStep('input');
  };
  const copyCode = () => {
    navigator.clipboard.writeText(recoveryPass);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };
  return /*#__PURE__*/React.createElement("section", {
    className: `login-page ${closing ? 'page-closing' : ''}`,
    "aria-labelledby": "login-title"
  }, /*#__PURE__*/React.createElement("div", {
    className: "login-visual"
  }, /*#__PURE__*/React.createElement("div", {
    className: "login-grid"
  }), /*#__PURE__*/React.createElement("button", {
    className: "login-back",
    onClick: closePage
  }, /*#__PURE__*/React.createElement("span", null, "←"), " Back to live search"), /*#__PURE__*/React.createElement("div", {
    className: "login-brand"
  }, /*#__PURE__*/React.createElement(HeartbeatLogo, null), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("strong", null, "MediPulse"), /*#__PURE__*/React.createElement("small", null, "Hospital network console"))), /*#__PURE__*/React.createElement("div", {
    className: "login-story"
  }, /*#__PURE__*/React.createElement("div", {
    className: "verified-pill"
  }, /*#__PURE__*/React.createElement(RadarDot, {
    light: true
  }), " Secure hospital access"), /*#__PURE__*/React.createElement("h1", null, "Keep care", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("em", null, "moving.")), /*#__PURE__*/React.createElement("p", null, "Update doctor rosters, medicine availability, and emergency capacity for patients across the network."), /*#__PURE__*/React.createElement("div", {
    className: "login-live-card"
  }, /*#__PURE__*/React.createElement("span", {
    className: "signal-orbit"
  }, /*#__PURE__*/React.createElement("i", null), /*#__PURE__*/React.createElement("b", null), /*#__PURE__*/React.createElement(Icon, {
    name: "shield",
    size: 23
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("small", null, "NETWORK STATUS"), /*#__PURE__*/React.createElement("strong", null, "31 facilities online"), /*#__PURE__*/React.createElement("em", null, "Last sync: just now")))), /*#__PURE__*/React.createElement("svg", {
    className: "login-ekg",
    viewBox: "0 0 900 120",
    preserveAspectRatio: "none",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    className: "ekg-base",
    d: "M0 62h170l18-1 12-27 18 58 26-88 22 58h98l15-24 20 24h145l16-1 12-22 18 44 25-73 24 52h78l18-34 19 34h127"
  }), /*#__PURE__*/React.createElement("path", {
    className: "ekg-pulse",
    d: "M0 62h170l18-1 12-27 18 58 26-88 22 58h98l15-24 20 24h145l16-1 12-22 18 44 25-73 24 52h78l18-34 19 34h127"
  })), /*#__PURE__*/React.createElement("div", {
    className: "login-proof"
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(Icon, {
    name: "shield",
    size: 16
  }), " Device-secured session"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(RadarDot, {
    light: true
  }), " Network operational"))), /*#__PURE__*/React.createElement("div", {
    className: "login-form-side"
  }, /*#__PURE__*/React.createElement("button", {
    className: "login-close",
    onClick: closePage,
    "aria-label": "Close login"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "close",
    size: 20
  })), !signedIn ? /*#__PURE__*/React.createElement("div", {
    className: "login-form-wrap"
  }, /*#__PURE__*/React.createElement("span", {
    className: "login-kicker"
  }, "STAFF PORTAL"), /*#__PURE__*/React.createElement("h2", {
    id: "login-title"
  }, "Welcome back."), /*#__PURE__*/React.createElement("p", null, "Sign in with your hospital-issued credentials."), /*#__PURE__*/React.createElement("form", {
    onSubmit: event => {
      event.preventDefault();
      setSignedIn(true);
    }
  }, /*#__PURE__*/React.createElement("label", null, /*#__PURE__*/React.createElement("span", null, "Work email or staff ID"), /*#__PURE__*/React.createElement("div", {
    className: "login-input"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "user",
    size: 18
  }), /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "staff@hospital.org",
    value: email,
    onChange: e => setEmail(e.target.value),
    required: true,
    autoFocus: true
  }))), /*#__PURE__*/React.createElement("label", null, /*#__PURE__*/React.createElement("span", null, "Password"), /*#__PURE__*/React.createElement("div", {
    className: "login-input"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "lock",
    size: 18
  }), /*#__PURE__*/React.createElement("input", {
    type: showPassword ? 'text' : 'password',
    placeholder: "Enter your password",
    value: password,
    onChange: e => setPassword(e.target.value),
    required: true,
    minLength: 4
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setShowPassword(value => !value)
  }, showPassword ? 'Hide' : 'Show'))), /*#__PURE__*/React.createElement("div", {
    className: "login-options"
  }, /*#__PURE__*/React.createElement("label", null, /*#__PURE__*/React.createElement("input", {
    type: "checkbox"
  }), " ", /*#__PURE__*/React.createElement("span", null, "Keep me signed in")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => {
      setRecoveryEmail(email || 'raghu1poojary1@gmail.com');
      setRecoveryOpen(true);
    }
  }, "Forgot password?")), /*#__PURE__*/React.createElement("button", {
    className: "login-submit",
    type: "submit"
  }, "Sign in securely ", /*#__PURE__*/React.createElement("span", null, "→"))), /*#__PURE__*/React.createElement("div", {
    className: "login-divider"
  }, /*#__PURE__*/React.createElement("span", null, "or continue with")), /*#__PURE__*/React.createElement("button", {
    className: "hospital-sso"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "shield",
    size: 18
  }), " Hospital single sign-on"), /*#__PURE__*/React.createElement("p", {
    className: "login-help"
  }, "Need access? ", /*#__PURE__*/React.createElement("button", null, "Contact your hospital administrator")), /*#__PURE__*/React.createElement("div", {
    className: "login-security"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "lock",
    size: 14
  }), " This demonstration validates locally. No credentials are transmitted.")) : /*#__PURE__*/React.createElement("div", {
    className: "login-success"
  }, /*#__PURE__*/React.createElement("div", {
    className: "success-rings"
  }, /*#__PURE__*/React.createElement("i", null), /*#__PURE__*/React.createElement("b", null), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(Icon, {
    name: "shield",
    size: 31
  }))), /*#__PURE__*/React.createElement("span", {
    className: "login-kicker"
  }, "IDENTITY VERIFIED"), /*#__PURE__*/React.createElement("h2", null, "Access granted."), /*#__PURE__*/React.createElement("p", null, "Your demonstration staff session is ready. Continue to the live availability portal."), /*#__PURE__*/React.createElement("button", {
    className: "login-submit",
    onClick: closePage
  }, "Enter MediPulse ", /*#__PURE__*/React.createElement("span", null, "→"))), /*#__PURE__*/React.createElement("div", {
    className: "login-footer"
  }, /*#__PURE__*/React.createElement("span", null, "Privacy"), /*#__PURE__*/React.createElement("span", null, "Security"), /*#__PURE__*/React.createElement("span", null, "Support"), /*#__PURE__*/React.createElement("small", null, "© MediPulse Network"))), recoveryOpen && /*#__PURE__*/React.createElement("div", {
    className: "recovery-backdrop visible",
    role: "dialog",
    "aria-modal": "true",
    onClick: e => {
      if (e.target === e.currentTarget) setRecoveryOpen(false);
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "recovery-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "recovery-header-row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "recovery-icon-badge"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "lock",
    size: 20
  })), /*#__PURE__*/React.createElement("button", {
    className: "modal-close",
    onClick: () => setRecoveryOpen(false),
    "aria-label": "Close",
    style: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: 4
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "close",
    size: 18
  }))), recoveryStep === 'input' ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    className: "recovery-title"
  }, "Recover Account Password"), /*#__PURE__*/React.createElement("p", {
    className: "recovery-subtext"
  }, "Enter your registered email address. We'll generate a secure temporary recovery password and dispatch it directly to your Gmail inbox."), /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSendRecovery
  }, /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'block',
      marginBottom: '14px',
      fontSize: '12px',
      fontWeight: 600
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      marginBottom: '6px'
    }
  }, "Registered Email Address"), /*#__PURE__*/React.createElement("div", {
    className: "login-input"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "user",
    size: 18
  }), /*#__PURE__*/React.createElement("input", {
    type: "email",
    value: recoveryEmail,
    onChange: e => setRecoveryEmail(e.target.value),
    placeholder: "you@gmail.com",
    required: true,
    autoFocus: true
  }))), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "login-submit",
    disabled: recoveryLoading,
    style: {
      width: '100%'
    }
  }, recoveryLoading ? 'Dispatching Recovery Email...' : 'Send Recovery Password →'))) : /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 44,
      height: 44,
      borderRadius: '50%',
      background: '#d1fae5',
      color: '#059669',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "22",
    height: "22",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.5"
  }, /*#__PURE__*/React.createElement("polyline", {
    points: "20 6 9 17 4 12"
  }))), /*#__PURE__*/React.createElement("h2", {
    className: "recovery-title"
  }, "Recovery Password Sent!"), /*#__PURE__*/React.createElement("p", {
    className: "recovery-subtext"
  }, "We have dispatched a temporary recovery password to ", /*#__PURE__*/React.createElement("strong", null, recoveryEmail), "."), /*#__PURE__*/React.createElement("div", {
    className: "recovery-pass-box"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '10px',
      color: 'var(--slate)',
      textTransform: 'uppercase',
      fontWeight: 700,
      letterSpacing: '0.05em',
      marginBottom: '3px'
    }
  }, "TEMPORARY RECOVERY PASSWORD"), /*#__PURE__*/React.createElement("div", {
    className: "recovery-pass-text"
  }, recoveryPass)), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn-copy-code",
    onClick: copyCode
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "shield",
    size: 14
  }), /*#__PURE__*/React.createElement("span", null, copied ? 'Copied!' : 'Copy'))), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "login-submit",
    onClick: handleFillAndSignIn,
    style: {
      width: '100%',
      marginBottom: '10px'
    }
  }, "✓ Fill & Sign In Now"), /*#__PURE__*/React.createElement("a", {
    href: `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(recoveryEmail)}&su=${encodeURIComponent('MediPulse Recovery Password')}&body=${encodeURIComponent('Your temporary recovery password: ' + recoveryPass)}`,
    target: "_blank",
    rel: "noreferrer",
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '7px',
      width: '100%',
      padding: '9px 14px',
      background: '#f8fafc',
      border: '1.5px solid #cbd5e1',
      color: '#334155',
      fontWeight: 600,
      fontSize: '12px',
      borderRadius: '10px',
      textDecoration: 'none',
      marginBottom: '8px'
    }
  }, "Open in Gmail Web ✉️")))));
}
function FacilityActionPage({
  hospital,
  action,
  onClose
}) {
  const [reserved, setReserved] = useState(false);
  const [closing, setClosing] = useState(false);
  const closePage = () => {
    setClosing(true);
    window.setTimeout(onClose, 650);
  };
  const labels = {
    doctors: ['Doctor roster', 'Doctors ready when you arrive'],
    medicine: ['Medicine desk', 'Reserve before you travel'],
    directions: ['Route guidance', 'The clearest path to care']
  };
  return /*#__PURE__*/React.createElement("section", {
    className: `action-page action-${action} ${closing ? 'page-closing' : ''}`,
    "aria-labelledby": "action-title"
  }, /*#__PURE__*/React.createElement("div", {
    className: "action-transition",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement(HeartbeatLogo, null), /*#__PURE__*/React.createElement("span", null)), /*#__PURE__*/React.createElement("header", {
    className: "action-header"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: closePage
  }, /*#__PURE__*/React.createElement("span", null, "←"), " Back to facilities"), /*#__PURE__*/React.createElement("div", {
    className: "brand"
  }, /*#__PURE__*/React.createElement(HeartbeatLogo, null), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("strong", null, "MediPulse"), /*#__PURE__*/React.createElement("small", null, "Live care detail"))), /*#__PURE__*/React.createElement("div", {
    className: "action-live"
  }, /*#__PURE__*/React.createElement(RadarDot, null), " Verified ", hospital.verified)), /*#__PURE__*/React.createElement("div", {
    className: "action-hero"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "section-kicker"
  }, labels[action][0]), /*#__PURE__*/React.createElement("h1", {
    id: "action-title"
  }, labels[action][1]), /*#__PURE__*/React.createElement("p", null, hospital.name, " · ", hospital.city, " · ", hospital.distance)), /*#__PURE__*/React.createElement("div", {
    className: "action-hero-icon"
  }, /*#__PURE__*/React.createElement("i", null), /*#__PURE__*/React.createElement("b", null), /*#__PURE__*/React.createElement(Icon, {
    name: action === 'doctors' ? 'user' : action === 'medicine' ? 'medicine' : 'route',
    size: 34
  }))), /*#__PURE__*/React.createElement("div", {
    className: "action-content"
  }, action === 'doctors' && /*#__PURE__*/React.createElement("div", {
    className: "doctor-detail-grid"
  }, hospital.doctors.map((doctor, index) => /*#__PURE__*/React.createElement("article", {
    className: "doctor-detail-card",
    style: {
      '--action-delay': `${index * 110}ms`
    },
    key: doctor.name
  }, /*#__PURE__*/React.createElement("div", {
    className: "doctor-portrait"
  }, /*#__PURE__*/React.createElement("span", null, doctor.initials), /*#__PURE__*/React.createElement("i", null)), /*#__PURE__*/React.createElement("div", {
    className: "doctor-info"
  }, /*#__PURE__*/React.createElement("span", {
    className: "availability"
  }, /*#__PURE__*/React.createElement(RadarDot, null), " On duty now"), /*#__PURE__*/React.createElement("h2", null, doctor.name), /*#__PURE__*/React.createElement("p", null, doctor.specialty), /*#__PURE__*/React.createElement("div", {
    className: "doctor-meta"
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(Icon, {
    name: "clock",
    size: 16
  }), " ", doctor.shift), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(Icon, {
    name: "shield",
    size: 16
  }), " Verified roster"))), /*#__PURE__*/React.createElement("button", {
    onClick: () => setReserved(true)
  }, "Request consultation ", /*#__PURE__*/React.createElement("span", null, "→")))), /*#__PURE__*/React.createElement("aside", {
    className: "action-note"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "spark",
    size: 21
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, "Before you visit"), /*#__PURE__*/React.createElement("p", null, "Doctor status is refreshed by the hospital desk every few minutes. Emergency cases are prioritised on arrival.")))), action === 'medicine' && !reserved && /*#__PURE__*/React.createElement("div", {
    className: "medicine-detail-layout"
  }, /*#__PURE__*/React.createElement("div", {
    className: "medicine-reserve-list"
  }, hospital.medicines.map((medicine, index) => /*#__PURE__*/React.createElement("label", {
    className: "medicine-reserve-card",
    style: {
      '--action-delay': `${index * 110}ms`
    },
    key: medicine.name
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    defaultChecked: index === 0
  }), /*#__PURE__*/React.createElement("span", {
    className: "medicine-bottle"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "medicine",
    size: 23
  })), /*#__PURE__*/React.createElement("span", {
    className: "medicine-copy"
  }, /*#__PURE__*/React.createElement("small", null, "IN STOCK · ", medicine.units, " UNITS"), /*#__PURE__*/React.createElement("strong", null, medicine.name), /*#__PURE__*/React.createElement("em", null, "Verified ", hospital.verified)), /*#__PURE__*/React.createElement("span", {
    className: "stock-ring",
    style: {
      '--stock': `${medicine.stock * 3.6}deg`
    }
  }, /*#__PURE__*/React.createElement("b", null, medicine.stock, "%"))))), /*#__PURE__*/React.createElement("aside", {
    className: "reservation-summary"
  }, /*#__PURE__*/React.createElement("span", {
    className: "section-kicker"
  }, "Reservation summary"), /*#__PURE__*/React.createElement("h2", null, "Hold for 30 minutes"), /*#__PURE__*/React.createElement("p", null, "The medicine desk will keep your selected items ready while you travel."), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", null, "Facility"), /*#__PURE__*/React.createElement("strong", null, hospital.name)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", null, "Pickup window"), /*#__PURE__*/React.createElement("strong", null, "Today · Next 30 min")), /*#__PURE__*/React.createElement("button", {
    onClick: () => setReserved(true)
  }, "Confirm reservation ", /*#__PURE__*/React.createElement("span", null, "→")), /*#__PURE__*/React.createElement("small", null, "No payment is collected in this demonstration."))), action === 'directions' && /*#__PURE__*/React.createElement("div", {
    className: "route-detail-layout"
  }, /*#__PURE__*/React.createElement("div", {
    className: "route-map-graphic"
  }, /*#__PURE__*/React.createElement("div", {
    className: "route-grid"
  }), /*#__PURE__*/React.createElement("div", {
    className: "route-line"
  }, /*#__PURE__*/React.createElement("i", null), /*#__PURE__*/React.createElement("b", null), /*#__PURE__*/React.createElement("em", null)), /*#__PURE__*/React.createElement("span", {
    className: "route-start"
  }, /*#__PURE__*/React.createElement("i", null), " Your location"), /*#__PURE__*/React.createElement("span", {
    className: "route-finish"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "heart",
    size: 17
  }), /*#__PURE__*/React.createElement("b", null, hospital.name)), /*#__PURE__*/React.createElement("div", {
    className: "route-time"
  }, /*#__PURE__*/React.createElement("strong", null, "12 min"), /*#__PURE__*/React.createElement("span", null, hospital.distance, " · Fastest route"))), /*#__PURE__*/React.createElement("div", {
    className: "route-steps"
  }, /*#__PURE__*/React.createElement("span", {
    className: "section-kicker"
  }, "Turn-by-turn preview"), /*#__PURE__*/React.createElement("h2", null, "Ready when you are"), ['Head towards Moodbidri Main Road', 'Continue straight past the town junction', `Arrive at ${hospital.name}`].map((step, index) => /*#__PURE__*/React.createElement("div", {
    className: "route-step",
    style: {
      '--action-delay': `${index * 90}ms`
    },
    key: step
  }, /*#__PURE__*/React.createElement("span", null, index + 1), /*#__PURE__*/React.createElement("p", null, step, /*#__PURE__*/React.createElement("small", null, index === 0 ? '300 m' : index === 1 ? '1.0 km' : '100 m')))), /*#__PURE__*/React.createElement("a", {
    href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hospital.name + ' ' + hospital.city)}`,
    target: "_blank",
    rel: "noreferrer"
  }, "Open live directions ", /*#__PURE__*/React.createElement("span", null, "↗")), /*#__PURE__*/React.createElement("small", null, "External navigation opens only when you choose to continue."))), reserved && /*#__PURE__*/React.createElement("div", {
    className: "action-success"
  }, /*#__PURE__*/React.createElement("div", {
    className: "success-rings"
  }, /*#__PURE__*/React.createElement("i", null), /*#__PURE__*/React.createElement("b", null), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(Icon, {
    name: "shield",
    size: 31
  }))), /*#__PURE__*/React.createElement("span", {
    className: "section-kicker"
  }, "REQUEST CONFIRMED"), /*#__PURE__*/React.createElement("h2", null, action === 'doctors' ? 'Consultation request sent.' : 'Medicine reserved.'), /*#__PURE__*/React.createElement("p", null, action === 'doctors' ? 'The hospital desk has received your request and will guide you on arrival.' : `Your selected medicine is held at ${hospital.name} for the next 30 minutes.`), /*#__PURE__*/React.createElement("button", {
    onClick: closePage
  }, "Return to facilities ", /*#__PURE__*/React.createElement("span", null, "→")))));
}
function App() {
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [language, setLanguage] = useState('English');
  const [mode, setMode] = useState('type');
  const [query, setQuery] = useState('');
  const [city, setCity] = useState('Moodbidri');
  const [filter, setFilter] = useState('All facilities');
  const [activeHospital, setActiveHospital] = useState(1);
  const [voiceActive, setVoiceActive] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [emergencyOpen, setEmergencyOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [activeAction, setActiveAction] = useState(null);
  const [searched, setSearched] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScrolled(y > 48);
      setProgress(max > 0 ? y / max * 100 : 0);
      document.documentElement.style.setProperty('--scroll-y', `${y}px`);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, {
      passive: true
    });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => {
    const nodes = document.querySelectorAll('.reveal, .journey-path');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, {
      threshold: 0.02,
      rootMargin: '80px 0px 80px 0px'
    });
    nodes.forEach(node => observer.observe(node));
    return () => observer.disconnect();
  }, []);
  const matches = useMemo(() => {
    const q = query.toLowerCase();
    return hospitals.filter(h => {
      const text = [h.name, h.city, ...h.doctors.flatMap(d => [d.name, d.specialty]), ...h.medicines.map(m => m.name)].join(' ').toLowerCase();
      const searchMatch = !q || text.includes(q);
      const filterMatch = filter === 'All facilities' || filter === 'Doctors on duty' && h.doctors.length > 0 || filter === 'In-stock medicines' && h.medicines.some(m => m.stock > 30) || filter === 'Vaccines ready' && h.vaccines || filter === '24/7 Emergency' && h.emergency;
      return searchMatch && filterMatch;
    });
  }, [filter, query]);
  const visibleSuggestions = query ? suggestions.filter(s => s.toLowerCase().includes(query.toLowerCase())).slice(0, 4) : [];
  const modeIndex = mode === 'type' ? 0 : mode === 'voice' ? 1 : 2;
  const runVoice = () => {
    setVoiceActive(true);
    window.setTimeout(() => {
      setQuery('Emergency care');
      setVoiceActive(false);
      setSearched(true);
    }, 1900);
  };
  return /*#__PURE__*/React.createElement("main", {
    className: "app-shell",
    onPointerMove: event => {
      event.currentTarget.style.setProperty('--pointer-x', `${event.clientX}px`);
      event.currentTarget.style.setProperty('--pointer-y', `${event.clientY}px`);
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "page-intro",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("div", {
    className: "intro-logo"
  }, /*#__PURE__*/React.createElement(HeartbeatLogo, null), /*#__PURE__*/React.createElement("span", null, "MediPulse")), /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 300 50"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M0 27h84l10-19 12 36 16-32 12 15h34l8-10 10 10h114"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "scroll-progress",
    style: {
      width: `${progress}%`
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "scroll-rail",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("span", null, "01"), /*#__PURE__*/React.createElement("i", null, /*#__PURE__*/React.createElement("b", {
    style: {
      transform: `scaleY(${progress / 100})`
    }
  }), /*#__PURE__*/React.createElement("em", {
    style: {
      top: `${progress}%`
    }
  })), /*#__PURE__*/React.createElement("span", null, "04")), /*#__PURE__*/React.createElement("div", {
    className: "pointer-glow",
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("div", {
    className: "ambient ambient-one"
  }), /*#__PURE__*/React.createElement("div", {
    className: "ambient ambient-two"
  }), /*#__PURE__*/React.createElement("header", {
    className: scrolled ? 'site-header compact' : 'site-header'
  }, /*#__PURE__*/React.createElement("div", {
    className: "nav-shell"
  }, /*#__PURE__*/React.createElement("a", {
    className: "brand",
    href: "#top",
    "aria-label": "MediPulse home"
  }, /*#__PURE__*/React.createElement(HeartbeatLogo, null), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("strong", null, "MediPulse"), /*#__PURE__*/React.createElement("small", null, "Real-time healthcare availability"))), /*#__PURE__*/React.createElement("div", {
    className: "nav-actions"
  }, /*#__PURE__*/React.createElement("div", {
    className: "network-status"
  }, /*#__PURE__*/React.createElement(RadarDot, null), /*#__PURE__*/React.createElement("span", null, "Live network active")), /*#__PURE__*/React.createElement("label", {
    className: "language-select"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sr-only"
  }, "Select language"), /*#__PURE__*/React.createElement("select", {
    value: language,
    onChange: e => setLanguage(e.target.value)
  }, languages.map(item => /*#__PURE__*/React.createElement("option", {
    key: item
  }, item)))), /*#__PURE__*/React.createElement("button", {
    className: "staff-button",
    onClick: () => setLoginOpen(true)
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "lock",
    size: 17
  }), /*#__PURE__*/React.createElement("span", null, "Hospital staff portal"))))), /*#__PURE__*/React.createElement("section", {
    className: "hero",
    id: "top"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hero-grid",
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("svg", {
    className: "ekg-bg",
    viewBox: "0 0 1400 180",
    preserveAspectRatio: "none",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    className: "ekg-base",
    d: "M0 95h305l25-1 13-31 22 78 35-125 28 79h83l18-29 22 29h254l17-1 14-24 20 49 29-91 28 66h100l22-42 20 42h300"
  }), /*#__PURE__*/React.createElement("path", {
    className: "ekg-pulse",
    d: "M0 95h305l25-1 13-31 22 78 35-125 28 79h83l18-29 22 29h254l17-1 14-24 20 49 29-91 28 66h100l22-42 20 42h300"
  })), /*#__PURE__*/React.createElement("div", {
    className: "hero-copy"
  }, /*#__PURE__*/React.createElement("div", {
    className: "verified-pill"
  }, /*#__PURE__*/React.createElement(RadarDot, null), " 31 hospitals verified live"), /*#__PURE__*/React.createElement("h1", null, /*#__PURE__*/React.createElement("span", null, "Know before you"), " ", /*#__PURE__*/React.createElement("em", null, "go.")), /*#__PURE__*/React.createElement("p", null, "Check real-time doctor rosters, medicine stocks, and vaccine dose counts across South India—before leaving home."), /*#__PURE__*/React.createElement("div", {
    className: "hero-trust-row"
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(Icon, {
    name: "shield",
    size: 15
  }), " Hospital verified"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(Icon, {
    name: "clock",
    size: 15
  }), " Updated every 2 min"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(Icon, {
    name: "map",
    size: 15
  }), " 31 locations")), /*#__PURE__*/React.createElement("div", {
    className: "hero-signal-card"
  }, /*#__PURE__*/React.createElement("span", {
    className: "signal-orbit"
  }, /*#__PURE__*/React.createElement("i", null), /*#__PURE__*/React.createElement("b", null), /*#__PURE__*/React.createElement(Icon, {
    name: "heart",
    size: 23
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("small", null, "NETWORK PULSE"), /*#__PURE__*/React.createElement("strong", null, "All systems live"), /*#__PURE__*/React.createElement("em", null, "98% data freshness"))), /*#__PURE__*/React.createElement("div", {
    className: "hero-care-graphic"
  }, /*#__PURE__*/React.createElement(CareNetworkGraphic, null))), /*#__PURE__*/React.createElement("div", {
    className: "search-terminal"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mode-tabs",
    style: {
      '--tab-index': modeIndex
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "tab-slider"
  }), /*#__PURE__*/React.createElement("button", {
    className: mode === 'type' ? 'selected' : '',
    onClick: () => setMode('type')
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "search",
    size: 17
  }), " Type search"), /*#__PURE__*/React.createElement("button", {
    className: mode === 'voice' ? 'selected' : '',
    onClick: () => setMode('voice')
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "mic",
    size: 17
  }), " Speak query"), /*#__PURE__*/React.createElement("button", {
    className: mode === 'upload' ? 'selected' : '',
    onClick: () => setMode('upload')
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "upload",
    size: 17
  }), " Upload prescription")), mode === 'type' && /*#__PURE__*/React.createElement("div", {
    className: "search-form"
  }, /*#__PURE__*/React.createElement("div", {
    className: "input-wrap"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "search",
    size: 22
  }), /*#__PURE__*/React.createElement("input", {
    value: query,
    onChange: e => {
      setQuery(e.target.value);
      setSearched(false);
    },
    placeholder: "Search a doctor, medicine, vaccine..."
  }), visibleSuggestions.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "suggestions"
  }, visibleSuggestions.map(item => /*#__PURE__*/React.createElement("button", {
    key: item,
    onClick: () => setQuery(item)
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "search",
    size: 15
  }), item)))), /*#__PURE__*/React.createElement("div", {
    className: "city-wrap"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "map",
    size: 20
  }), /*#__PURE__*/React.createElement("select", {
    value: city,
    onChange: e => setCity(e.target.value)
  }, cities.map(item => /*#__PURE__*/React.createElement("option", {
    key: item
  }, item)))), /*#__PURE__*/React.createElement("button", {
    className: "primary-cta",
    onClick: () => {
      setSearched(true);
      document.getElementById('results')?.scrollIntoView({
        behavior: 'smooth'
      });
    }
  }, "Check availability ", /*#__PURE__*/React.createElement("span", null, "→"))), mode === 'voice' && /*#__PURE__*/React.createElement("div", {
    className: "voice-mode"
  }, /*#__PURE__*/React.createElement("button", {
    className: `voice-button ${voiceActive ? 'listening' : ''}`,
    onClick: runVoice
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "mic",
    size: 25
  }), /*#__PURE__*/React.createElement("i", null), /*#__PURE__*/React.createElement("b", null), /*#__PURE__*/React.createElement("em", null)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, voiceActive ? 'Listening…' : 'Tap to speak'), /*#__PURE__*/React.createElement("p", null, voiceActive ? 'Try “Emergency care near me”' : 'Your voice stays on this device.'))), mode === 'upload' && /*#__PURE__*/React.createElement("label", {
    className: `upload-zone ${uploaded ? 'uploaded' : ''}`
  }, /*#__PURE__*/React.createElement("input", {
    type: "file",
    accept: "image/*,.pdf",
    onChange: () => {
      setUploaded(true);
      setQuery('Paracetamol');
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "scan-beam"
  }), /*#__PURE__*/React.createElement(Icon, {
    name: uploaded ? 'shield' : 'upload',
    size: 27
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, uploaded ? 'Prescription scanned locally' : 'Drop a prescription here'), /*#__PURE__*/React.createElement("p", null, uploaded ? '3 medicines detected · Ready to check' : 'JPG, PNG or PDF · Nothing leaves your device')), /*#__PURE__*/React.createElement("button", {
    type: "button"
  }, uploaded ? 'Check matches' : 'Choose file'))), /*#__PURE__*/React.createElement("div", {
    className: "filter-bar"
  }, /*#__PURE__*/React.createElement("span", null, "Show me"), ['All facilities', 'Doctors on duty', 'In-stock medicines', 'Vaccines ready', '24/7 Emergency'].map(item => /*#__PURE__*/React.createElement("button", {
    key: item,
    className: filter === item ? 'active' : '',
    onClick: () => setFilter(item)
  }, item === '24/7 Emergency' && /*#__PURE__*/React.createElement(RadarDot, null), " ", item))), /*#__PURE__*/React.createElement("a", {
    className: "scroll-cue",
    href: "#results"
  }, /*#__PURE__*/React.createElement("span", null, "Explore live care"), /*#__PURE__*/React.createElement("i", null, /*#__PURE__*/React.createElement(Icon, {
    name: "chevron",
    size: 16
  })))), /*#__PURE__*/React.createElement("div", {
    className: "live-ticker",
    "aria-label": "Live network updates"
  }, /*#__PURE__*/React.createElement("div", null, [0, 1].map(loop => /*#__PURE__*/React.createElement("span", {
    className: "ticker-set",
    key: loop,
    "aria-hidden": loop === 1
  }, /*#__PURE__*/React.createElement("b", null, /*#__PURE__*/React.createElement(RadarDot, {
    light: true
  }), " LIVE NOW"), /*#__PURE__*/React.createElement("em", null, "Alvas Health Centre verified 2 min ago"), /*#__PURE__*/React.createElement("i", null), /*#__PURE__*/React.createElement("em", null, "12 Covaxin doses available in Moodbidri"), /*#__PURE__*/React.createElement("i", null), /*#__PURE__*/React.createElement("em", null, "Dr. Farah Khan on duty until 10 PM"), /*#__PURE__*/React.createElement("i", null), /*#__PURE__*/React.createElement("em", null, "Emergency wait time under 8 minutes"), /*#__PURE__*/React.createElement("i", null))))), /*#__PURE__*/React.createElement("section", {
    className: "stats-strip",
    "aria-label": "Live network statistics"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, /*#__PURE__*/React.createElement(AnimatedCounter, {
    target: 31
  })), /*#__PURE__*/React.createElement("span", null, "Facilities active")), /*#__PURE__*/React.createElement("i", null), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, /*#__PURE__*/React.createElement(AnimatedCounter, {
    target: 98,
    suffix: "%"
  })), /*#__PURE__*/React.createElement("span", null, "Live bed sync")), /*#__PURE__*/React.createElement("i", null), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, /*#__PURE__*/React.createElement(AnimatedCounter, {
    target: 15,
    suffix: " min"
  })), /*#__PURE__*/React.createElement("span", null, "Stock guarantee")), /*#__PURE__*/React.createElement("i", null), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, /*#__PURE__*/React.createElement(AnimatedCounter, {
    target: 284
  })), /*#__PURE__*/React.createElement("span", null, "Doctors on duty"))), /*#__PURE__*/React.createElement("section", {
    className: "care-visual-band",
    "aria-label": "Connected healthcare services"
  }, [['user', 'Live roster', '284 doctors', 'Shift status verified'], ['medicine', 'Medicine sync', '4,810 items', 'Stock moving live'], ['route', 'Safe routing', '31 facilities', 'Fastest care path']].map(([icon, label, value, detail], index) => /*#__PURE__*/React.createElement("article", {
    className: "visual-system-card reveal",
    style: {
      transitionDelay: `${index * 120}ms`
    },
    key: label
  }, /*#__PURE__*/React.createElement("div", {
    className: "visual-orb"
  }, /*#__PURE__*/React.createElement("i", null), /*#__PURE__*/React.createElement("b", null), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: 25
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("small", null, label), /*#__PURE__*/React.createElement("strong", null, value), /*#__PURE__*/React.createElement("p", null, detail)), /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 110 35",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M0 24h20l7-1 5-15 9 26 11-31 9 21h13l6-9 7 9h23"
  }))))), /*#__PURE__*/React.createElement("section", {
    className: "results-section",
    id: "results"
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-heading reveal"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "section-kicker"
  }, "Live healthcare radar"), /*#__PURE__*/React.createElement("h2", null, "Care within your reach")), /*#__PURE__*/React.createElement("p", null, searched ? `Showing live matches for “${query || 'all care'}” near ${city}.` : `Continuously verified care near ${city}.`)), /*#__PURE__*/React.createElement("div", {
    className: "radar-layout"
  }, /*#__PURE__*/React.createElement("div", {
    className: "results-list"
  }, /*#__PURE__*/React.createElement("div", {
    className: "count-banner reveal"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(RadarDot, null), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("strong", null, matches.length || 0, " shown"), " from 31 verified health facilities")), /*#__PURE__*/React.createElement("span", null, "Updated just now")), /*#__PURE__*/React.createElement("div", {
    className: "triage-insight reveal"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ai-icon"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "spark",
    size: 20
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("small", null, "MEDIPULSE TRIAGE INSIGHT"), /*#__PURE__*/React.createElement("strong", null, query.toLowerCase().includes('emergency') ? 'Urgent · Emergency care suggested' : 'Routine care · General medicine suggested')), /*#__PURE__*/React.createElement("span", {
    className: query.toLowerCase().includes('emergency') ? 'urgency urgent' : 'urgency'
  }, query.toLowerCase().includes('emergency') ? 'High priority' : 'Low urgency')), matches.length ? matches.map(hospital => /*#__PURE__*/React.createElement(HospitalCard, {
    key: hospital.id,
    hospital: hospital,
    active: activeHospital === hospital.id,
    onHover: () => setActiveHospital(hospital.id),
    onAction: action => setActiveAction({
      hospital,
      action
    })
  })) : /*#__PURE__*/React.createElement("div", {
    className: "empty-state"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "search",
    size: 28
  }), /*#__PURE__*/React.createElement("h3", null, "No exact match nearby"), /*#__PURE__*/React.createElement("p", null, "Try another medicine, specialty, or facility filter."), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setQuery('');
      setFilter('All facilities');
    }
  }, "Clear search"))), /*#__PURE__*/React.createElement("aside", {
    className: "map-panel reveal"
  }, /*#__PURE__*/React.createElement("div", {
    className: "map-toolbar"
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(RadarDot, null), " LIVE FACILITY MAP"), /*#__PURE__*/React.createElement("button", {
    "aria-label": "Center map"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "route",
    size: 17
  }))), /*#__PURE__*/React.createElement("div", {
    className: "map-canvas"
  }, /*#__PURE__*/React.createElement("div", {
    className: "map-grid"
  }), /*#__PURE__*/React.createElement("div", {
    className: "map-road road-one"
  }), /*#__PURE__*/React.createElement("div", {
    className: "map-road road-two"
  }), /*#__PURE__*/React.createElement("div", {
    className: "map-road road-three"
  }), /*#__PURE__*/React.createElement("span", {
    className: "map-label label-one"
  }, "Moodbidri"), /*#__PURE__*/React.createElement("span", {
    className: "map-label label-two"
  }, "Mangaluru Road"), /*#__PURE__*/React.createElement("span", {
    className: "map-label label-three"
  }, "Belvai"), hospitals.map(hospital => /*#__PURE__*/React.createElement("button", {
    key: hospital.id,
    className: `map-pin ${activeHospital === hospital.id ? 'active' : ''}`,
    style: {
      left: `${hospital.x}%`,
      top: `${hospital.y}%`
    },
    onClick: () => setActiveHospital(hospital.id),
    "aria-label": `View ${hospital.name}`
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(Icon, {
    name: "heart",
    size: 17
  })), /*#__PURE__*/React.createElement("i", null), /*#__PURE__*/React.createElement("b", null), activeHospital === hospital.id && /*#__PURE__*/React.createElement("em", null, hospital.name, /*#__PURE__*/React.createElement("small", null, hospital.distance)))), /*#__PURE__*/React.createElement("div", {
    className: "you-are-here"
  }, /*#__PURE__*/React.createElement("span", null), " You are here")), /*#__PURE__*/React.createElement("div", {
    className: "map-footer"
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("i", null), " Verified now"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("i", null), " Emergency ready"), /*#__PURE__*/React.createElement("small", null, "Local radar view"))))), /*#__PURE__*/React.createElement("section", {
    className: "journey-section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-heading centered reveal"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "section-kicker"
  }, "How it works"), /*#__PURE__*/React.createElement("h2", null, "Protection at every step")), /*#__PURE__*/React.createElement("p", null, "One clear journey from uncertainty to verified care.")), /*#__PURE__*/React.createElement("div", {
    className: "journey-grid"
  }, /*#__PURE__*/React.createElement("svg", {
    className: "journey-path",
    viewBox: "0 0 900 150",
    preserveAspectRatio: "none",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M110 80 C240 8 320 8 450 80 S690 150 790 80"
  })), [['01', 'search', 'Search before travel', 'Find the right care by medicine, symptom, doctor, or speciality before leaving home.'], ['02', 'shield', 'Live roster verification', 'Hospital teams verify shifts and stock, while MediPulse timestamps every update.'], ['03', 'heart', 'Emergency triage', 'Get a clear urgency signal, direct route, and instant emergency contact when minutes matter.']].map(([number, icon, title, copy], index) => /*#__PURE__*/React.createElement("article", {
    className: "journey-card reveal",
    style: {
      transitionDelay: `${index * 130}ms`
    },
    key: number
  }, /*#__PURE__*/React.createElement("span", {
    className: "step-number"
  }, number), /*#__PURE__*/React.createElement("div", {
    className: "step-icon"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: 25
  })), /*#__PURE__*/React.createElement("h3", null, title), /*#__PURE__*/React.createElement("p", null, copy), /*#__PURE__*/React.createElement("span", {
    className: "learn-link"
  }, "Learn more ", /*#__PURE__*/React.createElement(Icon, {
    name: "chevron",
    size: 15
  })))))), /*#__PURE__*/React.createElement("footer", null, /*#__PURE__*/React.createElement("div", {
    className: "brand"
  }, /*#__PURE__*/React.createElement(HeartbeatLogo, null), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("strong", null, "MediPulse"), /*#__PURE__*/React.createElement("small", null, "Care, verified before the journey."))), /*#__PURE__*/React.createElement("p", null, "Frontend demonstration · All availability shown is realistic mock data."), /*#__PURE__*/React.createElement("span", null, "Built for safer healthcare journeys.")), /*#__PURE__*/React.createElement("button", {
    className: "emergency-fab",
    onClick: () => setEmergencyOpen(true)
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(Icon, {
    name: "phone",
    size: 20
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("small", null, "NEED HELP NOW?"), /*#__PURE__*/React.createElement("strong", null, "Emergency"))), /*#__PURE__*/React.createElement("nav", {
    className: "mobile-nav"
  }, /*#__PURE__*/React.createElement("a", {
    href: "#top",
    className: "active"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "search"
  }), /*#__PURE__*/React.createElement("span", null, "Search")), /*#__PURE__*/React.createElement("a", {
    href: "#results"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "map"
  }), /*#__PURE__*/React.createElement("span", null, "Map")), /*#__PURE__*/React.createElement("button", {
    onClick: () => setEmergencyOpen(true)
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "spark"
  }), /*#__PURE__*/React.createElement("span", null, "AI Triage")), /*#__PURE__*/React.createElement("button", {
    onClick: () => setLoginOpen(true)
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "user"
  }), /*#__PURE__*/React.createElement("span", null, "Account"))), loginOpen && /*#__PURE__*/React.createElement(LoginPage, {
    onClose: () => setLoginOpen(false)
  }), activeAction && /*#__PURE__*/React.createElement(FacilityActionPage, {
    hospital: activeAction.hospital,
    action: activeAction.action,
    onClose: () => setActiveAction(null)
  }), emergencyOpen && /*#__PURE__*/React.createElement("div", {
    className: "modal-backdrop",
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "emergency-title",
    onMouseDown: e => {
      if (e.target === e.currentTarget) setEmergencyOpen(false);
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "emergency-modal"
  }, /*#__PURE__*/React.createElement("button", {
    className: "modal-close",
    onClick: () => setEmergencyOpen(false),
    "aria-label": "Close"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "close"
  })), /*#__PURE__*/React.createElement("div", {
    className: "emergency-symbol"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "phone",
    size: 28
  })), /*#__PURE__*/React.createElement("span", {
    className: "section-kicker"
  }, "Immediate assistance"), /*#__PURE__*/React.createElement("h2", {
    id: "emergency-title"
  }, "You’re not alone."), /*#__PURE__*/React.createElement("p", null, "For a life-threatening emergency, call the national emergency response line now."), /*#__PURE__*/React.createElement("a", {
    className: "call-now",
    href: "tel:112"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "phone"
  }), " Call 112 now"), /*#__PURE__*/React.createElement("button", {
    className: "ambulance-button",
    onClick: () => setEmergencyOpen(false)
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "route"
  }), " Find nearest emergency facility"), /*#__PURE__*/React.createElement("small", null, "Your location and call are handled by your device."))));
}

// Mount React application
document.addEventListener("DOMContentLoaded", function() {
  var rootEl = document.getElementById("root");
  if (rootEl && typeof ReactDOM !== "undefined") {
    ReactDOM.createRoot(rootEl).render(React.createElement(App));
  }
});
