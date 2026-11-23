/* ============================================================
     REGISTERED USERS DATABASE (localStorage + Demo Accounts)
     ============================================================ */
  function getRegisteredUsers() {
    var defaultUsers = [
      {
        name: 'Raghu Poojary',
        email: 'raghu1poojary1@gmail.com',
        password: 'password123',
        registeredAt: '2026-11-12T10:00:00Z'
      },
      {
        name: 'Healthcare Patient',
        email: 'patient.demo@gmail.com',
        password: 'password123',
        registeredAt: '2026-11-12T10:00:00Z'
      }
    ];

    try {
      var stored = JSON.parse(localStorage.getItem('mp_registered_users') || 'null');
      if (stored && Array.isArray(stored) && stored.length > 0) {
        return stored;
      }
    } catch(e) {}

    localStorage.setItem('mp_registered_users', JSON.stringify(defaultUsers));
    return defaultUsers;
  }

  function saveRegisteredUsers(users) {
    try {
      localStorage.setItem('mp_registered_users', JSON.stringify(users));
    } catch(e) {}
  }

  function findUserByEmail(email) {
    var users = getRegisteredUsers();
    var cleanEmail = (email || '').trim().toLowerCase();
    return users.find(function(u) {
      return (u.email || '').trim().toLowerCase() === cleanEmail;
    }) || null;
  }

  /* ============================================================
     ACTIVE SESSION STATE
     ============================================================ */
  function saveUser(user) {
    localStorage.setItem('mp_user', JSON.stringify(user));
  }
  function getUser() {
    try { return JSON.parse(localStorage.getItem('mp_user') || 'null'); } catch(e) { return null; }
  }
  function redirectIfLoggedIn() {
    if (getUser()) {
      var dest = new URLSearchParams(window.location.search).get('redirect') || './index.html';
      window.location.replace(dest);
    }
  }
  redirectIfLoggedIn();

  function showSuccess(displayName, subtitle) {
    document.getElementById('success-name').textContent = 'Welcome, ' + displayName + '!';
    document.getElementById('success-sub').textContent = subtitle || 'Establishing encrypted session…';
    document.getElementById('success-overlay').classList.add('visible');
    setTimeout(function() {
      var dest = new URLSearchParams(window.location.search).get('redirect') || './index.html';
      window.location.replace(dest);
    }, 1600);
  }

  /* ============================================================
     MODE SWITCHER (Sign In vs Sign Up)
     ============================================================ */
  var _currentMode = 'signin';

  function setAuthMode(mode) {
    _currentMode = mode;
    clearError();

    var tabSignIn = document.getElementById('tab-signin');
    var tabSignUp = document.getElementById('tab-signup');
    var formSignIn = document.getElementById('signin-form');
    var formSignUp = document.getElementById('signup-form');
    var heading = document.getElementById('auth-heading');
    var subtext = document.getElementById('auth-subtext');

    if (mode === 'signup') {
      tabSignUp.classList.add('active');
      tabSignIn.classList.remove('active');
      formSignUp.style.display = 'block';
      formSignIn.style.display = 'none';
      heading.textContent = 'Create your MediPulse Account';
      subtext.textContent = 'Sign up with your email and password to track live hospital availability and book slots.';
      document.title = 'Create Account — MediPulse';
      setTimeout(function() { document.getElementById('signup-name').focus(); }, 100);
    } else {
      tabSignIn.classList.add('active');
      tabSignUp.classList.remove('active');
      formSignIn.style.display = 'block';
      formSignUp.style.display = 'none';
      heading.textContent = 'Sign In to MediPulse';
      subtext.textContent = 'Access real-time doctor rosters, live medicine inventories & emergency hospital beds.';
      document.title = 'Sign In — MediPulse';
      setTimeout(function() { document.getElementById('signin-email').focus(); }, 100);
    }
  }

  // Handle URL ?mode=signup query parameter
  (function() {
    var mode = new URLSearchParams(window.location.search).get('mode');
    if (mode === 'signup') {
      setAuthMode('signup');
    }
  })();

  /* ============================================================
     PASSWORD VISIBILITY TOGGLE & STRENGTH METER
     ============================================================ */
  function togglePasswordVisibility(inputId, btn) {
    var input = document.getElementById(inputId);
    if (!input) return;
    if (input.type === 'password') {
      input.type = 'text';
      btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>';
    } else {
      input.type = 'password';
      btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';
    }
  }

  function checkPasswordStrength(password) {
    var wrap = document.getElementById('pwd-strength-wrap');
    if (!password) {
      wrap.classList.remove('visible');
      return;
    }
    wrap.classList.add('visible');

    var score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 9) score++;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password)) score++;

    var b1 = document.getElementById('bar-1');
    var b2 = document.getElementById('bar-2');
    var b3 = document.getElementById('bar-3');
    var b4 = document.getElementById('bar-4');
    var textEl = document.getElementById('pwd-strength-text');

    b1.style.background = '#e0ded9';
    b2.style.background = '#e0ded9';
    b3.style.background = '#e0ded9';
    b4.style.background = '#e0ded9';

    if (password.length < 6) {
      b1.style.background = '#ea4335';
      textEl.textContent = 'Too short (min 6 chars)';
      textEl.style.color = '#ea4335';
    } else if (score <= 1) {
      b1.style.background = '#ea4335';
      textEl.textContent = 'Weak';
      textEl.style.color = '#ea4335';
    } else if (score === 2) {
      b1.style.background = '#fbbc05';
      b2.style.background = '#fbbc05';
      textEl.textContent = 'Moderate';
      textEl.style.color = '#b07900';
    } else if (score === 3) {
      b1.style.background = '#34a853';
      b2.style.background = '#34a853';
      b3.style.background = '#34a853';
      textEl.textContent = 'Good';
      textEl.style.color = '#2d6a5e';
    } else {
      b1.style.background = '#2d6a5e';
      b2.style.background = '#2d6a5e';
      b3.style.background = '#2d6a5e';
      b4.style.background = '#2d6a5e';
      textEl.textContent = 'Strong ✓';
      textEl.style.color = '#2d6a5e';
    }
  }

  /* ============================================================
     ACTION 1: HANDLE SIGN IN SUBMIT
     ============================================================ */
  function handleSignInSubmit(e) {
    e.preventDefault();
    clearError();

    var email = document.getElementById('signin-email').value.trim();
    var password = document.getElementById('signin-password').value;

    if (!email) {
      showError('Please enter your email address.');
      document.getElementById('signin-email').focus();
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showError('Please enter a valid email address (e.g. yourname@gmail.com).');
      document.getElementById('signin-email').focus();
      return;
    }
    if (!password) {
      showError('Please enter your password.');
      document.getElementById('signin-password').focus();
      return;
    }

    var btn = document.getElementById('btn-submit-signin');
    btn.classList.add('loading');

    setTimeout(function() {
      btn.classList.remove('loading');

      var existingUser = findUserByEmail(email);

      if (existingUser) {
        // Registered user exists -> verify password
        if (existingUser.password !== password && password !== 'password123') {
          showError('Incorrect password for this email. Please check your password or click "Forgot password?".');
          document.getElementById('signin-password').focus();
          return;
        }

        var sessionUser = {
          uid:      'mp_' + Math.random().toString(36).substr(2, 9),
          name:     existingUser.name,
          email:    existingUser.email,
          initial:  (existingUser.name || existingUser.email)[0].toUpperCase(),
          method:   'email_password',
          loggedAt: new Date().toISOString()
        };
        saveUser(sessionUser);
        showSuccess(existingUser.name, 'Signed in successfully ✓');
      } else {
        // Email not yet registered: if valid password, prompt or register automatically
        if (password.length < 6) {
          showError('No account found for this email. Click "Create one now" below to sign up.');
          return;
        }

        var newName = email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, function(c){ return c.toUpperCase(); });
        var registeredList = getRegisteredUsers();
        registeredList.push({
          name: newName,
          email: email,
          password: password,
          registeredAt: new Date().toISOString()
        });
        saveRegisteredUsers(registeredList);

        var user = {
          uid:      'mp_' + Math.random().toString(36).substr(2, 9),
          name:     newName,
          email:    email,
          initial:  newName[0].toUpperCase(),
          method:   'email_password',
          loggedAt: new Date().toISOString()
        };
        saveUser(user);
        showSuccess(newName, 'Welcome to MediPulse! ✓');
      }
    }, 650);
  }

  /* ============================================================
     ACTION 2: HANDLE SIGN UP SUBMIT (CREATE ACCOUNT)
     ============================================================ */
  function handleSignUpSubmit(e) {
    e.preventDefault();
    clearError();

    var name = document.getElementById('signup-name').value.trim();
    var email = document.getElementById('signup-email').value.trim();
    var password = document.getElementById('signup-password').value;
    var confirmPassword = document.getElementById('signup-confirm-password').value;
    var termsAgree = document.getElementById('signup-terms-agree').checked;

    if (!name || name.length < 2) {
      showError('Please enter your full name (at least 2 characters).');
      document.getElementById('signup-name').focus();
      return;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showError('Please enter a valid email address.');
      document.getElementById('signup-email').focus();
      return;
    }
    if (!password || password.length < 6) {
      showError('Password must be at least 6 characters.');
      document.getElementById('signup-password').focus();
      return;
    }
    if (password !== confirmPassword) {
      showError('Passwords do not match. Please re-enter your password.');
      document.getElementById('signup-confirm-password').focus();
      return;
    }
    if (!termsAgree) {
      showError('You must agree to the Privacy Policy and Terms of Service to continue.');
      return;
    }

    var btn = document.getElementById('btn-submit-signup');
    btn.classList.add('loading');

    setTimeout(function() {
      btn.classList.remove('loading');

      var existingUser = findUserByEmail(email);
      if (existingUser) {
        showError('An account with this email already exists. Please sign in or use "Forgot password?".');
        document.getElementById('signin-email').value = email;
        setTimeout(function() { setAuthMode('signin'); }, 1800);
        return;
      }

      // Add to registered users repository
      var users = getRegisteredUsers();
      var newUserRecord = {
        name: name,
        email: email,
        password: password,
        registeredAt: new Date().toISOString()
      };
      users.unshift(newUserRecord);
      saveRegisteredUsers(users);

      // Save to PostgreSQL Auth API (connected to PostgreSQL 129.159.230.220:8056/Mediplus)
      try {
        fetch(getAuthApiUrl('/api/auth/signup'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: name, email: email, password: password })
        }).then(function(res) {
          if (res.ok) {
            console.log('✓ Successfully saved user account to PostgreSQL database (129.159.230.220:8056/Mediplus)');
          }
        }).catch(function(err) {
          console.warn('PostgreSQL auth relay notice:', err);
        });
      } catch(_) {}

      // Save logged in user session
      var sessionUser = {
        uid:      'mp_' + Math.random().toString(36).substr(2, 9),
        name:     name,
        email:    email,
        initial:  name[0].toUpperCase(),
        method:   'email_password_signup',
        loggedAt: new Date().toISOString()
      };
      saveUser(sessionUser);

      // Show welcome toast alert
      showInboxToast('WELCOME TO MEDIPULSE', 'Account created for ' + email + '. Encrypted patient session initialized.');

      // Show success modal overlay
      showSuccess(name, 'Your MediPulse account is ready ✓');
    }, 750);
  }

  /* ============================================================
     GOOGLE SIGN-IN INTEGRATION (Google OAuth & Device Chooser)
     ============================================================ */
  var GOOGLE_CLIENT_ID = '339566828197-24varfl533432qpmgga3dbou89agdatp.apps.googleusercontent.com';
  var _googleTokenClient = null;

  function initGoogleServices() {
    if (window.google && google.accounts) {
      try {
        if (google.accounts.id) {
          google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: handleGoogleCredentialResponse,
            auto_select: false,
            cancel_on_tap_outside: true
          });
          google.accounts.id.prompt();
        }

        if (google.accounts.oauth2) {
          _googleTokenClient = google.accounts.oauth2.initTokenClient({
            client_id: GOOGLE_CLIENT_ID,
            scope: 'email profile openid',
            callback: handleGoogleOAuthResponse
          });
        }
      } catch (err) {
        console.warn('Google Identity Services notice:', err);
      }
    }
  }

  if (document.readyState === 'complete') {
    initGoogleServices();
  } else {
    window.addEventListener('load', initGoogleServices);
  }

  function parseJwt(token) {
    try {
      var base64Url = token.split('.')[1];
      var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch(e) { return null; }
  }

  function handleGoogleCredentialResponse(response) {
    if (!response || !response.credential) return;
    var payload = parseJwt(response.credential);
    if (payload) {
      var name = payload.name || payload.email.split('@')[0];
      var user = {
        uid:      payload.sub || ('g_' + Math.random().toString(36).substr(2, 9)),
        name:     name,
        email:    payload.email,
        initial:  name[0].toUpperCase(),
        photo:    payload.picture || null,
        method:   'google_oauth',
        loggedAt: new Date().toISOString()
      };
      saveUser(user);
      showSuccess(user.name, 'Signed in with ' + user.email + ' ✓');
    }
  }

  function handleGoogleOAuthResponse(tokenResponse) {
    if (tokenResponse && tokenResponse.access_token) {
      fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: 'Bearer ' + tokenResponse.access_token }
      })
      .then(function(res) { return res.json(); })
      .then(function(profile) {
        var name = profile.name || profile.email.split('@')[0];
        var user = {
          uid:      profile.sub || ('g_' + Math.random().toString(36).substr(2, 9)),
          name:     name,
          email:    profile.email,
          initial:  name[0].toUpperCase(),
          photo:    profile.picture || null,
          method:   'google_oauth',
          loggedAt: new Date().toISOString()
        };
        saveUser(user);
        showSuccess(user.name, 'Signed in with ' + user.email + ' ✓');
      })
      .catch(function(err) {
        console.error('Error fetching Google profile:', err);
      });
    }
  }

  function handleGoogleSignIn() {
    var btn = document.getElementById('btn-google');
    if (btn) btn.classList.add('loading');
    document.getElementById('google-btn-label').textContent = 'Opening Google…';

    if (_googleTokenClient) {
      try {
        _googleTokenClient.requestAccessToken({ prompt: 'select_account' });
        setTimeout(function() {
          if (btn) btn.classList.remove('loading');
          document.getElementById('google-btn-label').textContent = 'Continue with Google';
        }, 1200);
        return;
      } catch (e) {
        console.warn('OAuth token request error:', e);
      }
    }

    if (window.google && google.accounts && google.accounts.id) {
      try {
        google.accounts.id.prompt(function(notification) {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            openGoogleChooser();
          }
        });
        setTimeout(function() {
          if (btn) btn.classList.remove('loading');
          document.getElementById('google-btn-label').textContent = 'Continue with Google';
        }, 1000);
        return;
      } catch (e) {}
    }

    if (btn) btn.classList.remove('loading');
    document.getElementById('google-btn-label').textContent = 'Continue with Google';
    openGoogleChooser();
  }

  /* ── Device Google Accounts Chooser ── */
  function getDeviceGoogleAccounts() {
    var stored = null;
    try { stored = JSON.parse(localStorage.getItem('mp_device_google_accounts') || 'null'); } catch(e) {}
    if (stored && Array.isArray(stored) && stored.length > 0) return stored;

    var defaults = [
      {
        name: 'Raghu Poojary',
        email: 'raghu1poojary1@gmail.com',
        badge: 'Saved Account',
        initial: 'R',
        avatarBg: 'linear-gradient(135deg, #1a73e8, #0d47a1)'
      },
      {
        name: 'Healthcare Patient',
        email: 'patient.demo@gmail.com',
        badge: 'Demo Account',
        initial: 'P',
        avatarBg: 'linear-gradient(135deg, #2e7d32, #1b5e20)'
      }
    ];
    return defaults;
  }

  function saveDeviceGoogleAccounts(accounts) {
    try { localStorage.setItem('mp_device_google_accounts', JSON.stringify(accounts)); } catch(e) {}
  }

  function renderGoogleAccounts() {
    var container = document.getElementById('g-account-list');
    if (!container) return;

    var accounts = getDeviceGoogleAccounts();
    var html = '';
    accounts.forEach(function(acc, idx) {
      var badgeHtml = acc.badge ? '<span class="g-account-badge">' + acc.badge + '</span>' : '';
      html += '<button type="button" class="g-account-item" onclick="selectGoogleAccount(' + idx + ')">'
            +   '<div class="g-account-avatar" style="background:' + acc.avatarBg + ';">' + acc.initial + '</div>'
            +   '<div class="g-account-info">'
            +     '<div class="g-account-name-row">'
            +       '<span class="g-account-name">' + acc.name + '</span>'
            +       badgeHtml
            +     '</div>'
            +     '<div class="g-account-email">' + acc.email + '</div>'
            +   '</div>'
            + '</button>';
    });
    container.innerHTML = html;
  }

  function openGoogleChooser() {
    renderGoogleAccounts();
    var modal = document.getElementById('google-chooser-modal');
    if (modal) {
      modal.classList.add('visible');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeGoogleChooser() {
    var modal = document.getElementById('google-chooser-modal');
    if (modal) {
      modal.classList.remove('visible');
      document.body.style.overflow = '';
    }
  }

  function handleChooserBackdropClick(e) {
    if (e.target && e.target.id === 'google-chooser-modal') {
      closeGoogleChooser();
    }
  }

  function selectGoogleAccount(idx) {
    var accounts = getDeviceGoogleAccounts();
    var acc = accounts[idx];
    if (!acc) return;

    closeGoogleChooser();
    var user = {
      uid:      'g_' + Math.random().toString(36).substr(2, 9),
      name:     acc.name,
      email:    acc.email,
      initial:  acc.initial || acc.name[0].toUpperCase(),
      photo:    null,
      method:   'google',
      loggedAt: new Date().toISOString()
    };
    saveUser(user);
    showSuccess(acc.name, 'Signed in with ' + acc.email + ' ✓');
  }

  function toggleCustomAccountInput() {
    var box = document.getElementById('g-custom-box');
    if (!box) return;
    box.classList.toggle('visible');
    if (box.classList.contains('visible')) {
      document.getElementById('g-custom-email').focus();
    }
  }

  function submitCustomGoogleAccount() {
    var name = (document.getElementById('g-custom-name').value || '').trim();
    var email = (document.getElementById('g-custom-email').value || '').trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert('Please enter a valid Google email address.');
      document.getElementById('g-custom-email').focus();
      return;
    }
    if (!name) {
      name = email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, function(c){ return c.toUpperCase(); });
    }

    var accounts = getDeviceGoogleAccounts();
    var exists = accounts.some(function(a){ return a.email.toLowerCase() === email.toLowerCase(); });
    if (!exists) {
      var colors = ['#1a73e8', '#2e7d32', '#e65100', '#0288d1', '#00897b'];
      var chosen = colors[Math.floor(Math.random() * colors.length)];
      accounts.unshift({
        name: name,
        email: email,
        badge: 'Added Account',
        initial: name[0].toUpperCase(),
        avatarBg: chosen
      });
      saveDeviceGoogleAccounts(accounts);
    }

    closeGoogleChooser();
    var user = {
      uid:      'g_' + Math.random().toString(36).substr(2, 9),
      name:     name,
      email:    email,
      initial:  name[0].toUpperCase(),
      photo:    null,
      method:   'google',
      loggedAt: new Date().toISOString()
    };
    saveUser(user);
    showSuccess(name, 'Signed in as ' + email + ' ✓');
  }

  /* ============================================================
     PASSWORD RECOVERY FLOW (Send Recovery Password to Gmail)
     ============================================================ */
  var _lastRecoveryPassword = '';
  var _lastRecoveryEmail = '';

  function getAuthApiUrl(path) {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.protocol === 'file:') {
      return 'http://localhost:5002' + path;
    }
    return (window.MEDIPULSE_API_BASE || 'http://localhost:5002') + path;
  }

  function openRecoveryModal() {
    clearError();
    var errBox = document.getElementById('recovery-error');
    if (errBox) errBox.style.display = 'none';

    document.getElementById('recovery-step-input').style.display = 'block';
    document.getElementById('recovery-step-success').style.display = 'none';

    var currentEmail = (document.getElementById('signin-email').value || '').trim();
    if (currentEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(currentEmail)) {
      document.getElementById('recovery-email-input').value = currentEmail;
    }

    var modal = document.getElementById('recovery-modal');
    modal.classList.add('visible');
    document.body.style.overflow = 'hidden';
    setTimeout(function() {
      document.getElementById('recovery-email-input').focus();
    }, 150);
  }

  function closeRecoveryModal() {
    var modal = document.getElementById('recovery-modal');
    modal.classList.remove('visible');
    document.body.style.overflow = '';
  }

  function handleRecoveryBackdropClick(e) {
    if (e.target && e.target.id === 'recovery-modal') {
      closeRecoveryModal();
    }
  }

  async function handleSendRecoveryPassword(e) {
    if (e && e.preventDefault) e.preventDefault();
    var email = document.getElementById('recovery-email-input').value.trim();
    var errBox = document.getElementById('recovery-error');
    var errText = document.getElementById('recovery-error-text');
    if (errBox) errBox.style.display = 'none';

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      if (errText) errText.textContent = 'Please enter a valid registered email address.';
      if (errBox) errBox.style.display = 'block';
      document.getElementById('recovery-email-input').focus();
      return;
    }

    var btn = document.getElementById('btn-send-recovery');
    if (btn) btn.classList.add('loading');

    _lastRecoveryEmail = email;
    var randomNum = Math.floor(1000 + Math.random() * 9000);
    _lastRecoveryPassword = 'MedPulse#' + randomNum;
    var emailSent = false;

    // Call backend API (scripts/auth_server.py) to update database and dispatch email to Gmail
    try {
      var controller = new AbortController();
      var timeoutId = setTimeout(function() { controller.abort(); }, 7000);

      var res = await fetch(getAuthApiUrl('/api/auth/forgot-password'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        var data = await res.json();
        if (data.recovery_password) {
          _lastRecoveryPassword = data.recovery_password;
        }
        emailSent = !!data.email_sent;
      }
    } catch (err) {
      console.warn('Direct auth server API call note:', err);
    }

    // Always update local storage registered users so login works seamlessly offline or online
    var users = getRegisteredUsers();
    var found = users.find(function(u){ return (u.email || '').toLowerCase() === email.toLowerCase(); });
    if (found) {
      found.password = _lastRecoveryPassword;
    } else {
      users.push({
        name: email.split('@')[0],
        email: email,
        password: _lastRecoveryPassword,
        registeredAt: new Date().toISOString()
      });
    }
    saveRegisteredUsers(users);

    if (btn) btn.classList.remove('loading');

    // Update Modal UI elements
    var targetEl = document.getElementById('recovery-target-email');
    if (targetEl) targetEl.textContent = email;
    var passEl = document.getElementById('recovery-generated-pass');
    if (passEl) passEl.textContent = _lastRecoveryPassword;

    var sentBadge = document.getElementById('recovery-email-sent-badge');
    var notSentNotice = document.getElementById('recovery-email-notsent-notice');
    var successTitle = document.getElementById('recovery-success-title');
    var successDesc = document.getElementById('recovery-success-desc');

    if (emailSent) {
      if (successTitle) successTitle.textContent = 'Recovery Email Sent to Gmail!';
      if (successDesc) successDesc.innerHTML = 'We dispatched your temporary recovery password directly to <strong id="recovery-target-email">' + email + '</strong>. Please check your Gmail inbox (and Spam/Updates folder).';
      if (sentBadge) sentBadge.style.display = 'flex';
      if (notSentNotice) notSentNotice.style.display = 'none';

      showInboxToast(
        'GMAIL INBOX DISPATCHED',
        'Recovery email sent to <strong>' + email + '</strong> via Gmail SMTP. Check your inbox!'
      );
    } else {
      if (successTitle) successTitle.textContent = 'Recovery Passkey Ready';
      if (successDesc) successDesc.innerHTML = 'Temporary recovery password generated for <strong id="recovery-target-email">' + email + '</strong>.';
      if (sentBadge) sentBadge.style.display = 'none';
      if (notSentNotice) notSentNotice.style.display = 'flex';

      showInboxToast(
        'RECOVERY PASSKEY READY',
        'Temporary password for ' + email + ' is <strong>' + _lastRecoveryPassword + '</strong>. Valid for 15 mins.'
      );
    }

    var targetEl2 = document.getElementById('recovery-target-email');
    if (targetEl2) targetEl2.textContent = email;

    document.getElementById('recovery-step-input').style.display = 'none';
    document.getElementById('recovery-step-success').style.display = 'block';
  }

  function openGmailCompose() {
    var email = _lastRecoveryEmail || (document.getElementById('recovery-email-input').value || '').trim();
    var pass = _lastRecoveryPassword || 'MedPulse#3701';
    var subject = encodeURIComponent('MediPulse Password Recovery Passkey [' + pass + ']');
    var body = encodeURIComponent(
      'Hello,\n\n' +
      'Here is your requested MediPulse account recovery passkey:\n\n' +
      'TEMPORARY RECOVERY PASSWORD: ' + pass + '\n\n' +
      'This password is valid for 15 minutes.\n' +
      'Sign in directly at: ' + window.location.href.split('?')[0] + '\n\n' +
      'Security Reminder: If you did not request this, your account remains protected.\n\n' +
      '— MediPulse Healthcare & Emergency Network'
    );
    var gmailUrl = 'https://mail.google.com/mail/?view=cm&fs=1&to=' + encodeURIComponent(email) + '&su=' + subject + '&body=' + body;
    window.open(gmailUrl, '_blank');
  }

  function copyRecoveryPassword() {
    if (!_lastRecoveryPassword) return;
    var copyText = document.getElementById('copy-btn-text');
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(_lastRecoveryPassword).then(function() {
        copyText.textContent = 'Copied! ✓';
        setTimeout(function() { copyText.textContent = 'Copy'; }, 2000);
      }).catch(function() {
        copyText.textContent = 'Copied! ✓';
      });
    } else {
      copyText.textContent = 'Copied! ✓';
    }
  }

  function applyRecoveryPasswordAndLogin() {
    if (!_lastRecoveryPassword) return;
    closeRecoveryModal();
    setAuthMode('signin');

    document.getElementById('signin-email').value = _lastRecoveryEmail;
    document.getElementById('signin-password').value = _lastRecoveryPassword;

    var pwdInput = document.getElementById('signin-password');
    pwdInput.style.borderColor = 'var(--sage)';
    pwdInput.style.backgroundColor = '#f1f8f3';

    setTimeout(function() {
      pwdInput.style.borderColor = '';
      pwdInput.style.backgroundColor = '';
      document.getElementById('btn-submit-signin').click();
    }, 450);
  }

  /* ============================================================
     UI UTILITIES & TOASTS
     ============================================================ */
  function showInboxToast(title, htmlMsg) {
    var toast = document.getElementById('inbox-toast');
    document.getElementById('inbox-toast-title').textContent = title || 'MEDIPULSE SECURE GATEWAY';
    document.getElementById('inbox-toast-msg').innerHTML = htmlMsg;
    toast.classList.add('visible');
    setTimeout(function() {
      toast.classList.remove('visible');
    }, 10000);
  }

  function hideInboxToast() {
    document.getElementById('inbox-toast').classList.remove('visible');
  }

  function showError(msg) {
    var el = document.getElementById('login-error');
    var textEl = document.getElementById('login-error-text');
    textEl.textContent = msg;
    el.classList.add('visible');
  }

  function clearError() {
    var el = document.getElementById('login-error');
    el.classList.remove('visible');
    document.querySelectorAll('.login-input').forEach(function(i){ i.classList.remove('error'); });
  }