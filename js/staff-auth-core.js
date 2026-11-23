/* ── Pre-seeded Database Staff Accounts (PostgreSQL admin table) ── */
    var PRESEEDED_STAFF = [
      {
        id: 'admin_alvas',
        email: 'ramesh.bhat@alvashealth.org',
        name: 'Dr. Ramesh Bhat (Admin)',
        role: 'Chief Medical Officer',
        facilityId: 'hosp-alvas',
        facilityName: "Alva's Health Centre & Multi-Specialty Hospital",
        password: 'admin123'
      },
      {
        id: 'admin_chc',
        email: 'superintendent@chcmoodbidri.gov.in',
        name: 'Superintendent CHC',
        role: 'Medical Superintendent',
        facilityId: 'hosp-chc',
        facilityName: 'Government Community Health Centre (CHC) Moodbidri',
        password: 'admin123'
      },
      {
        id: 'admin_prasad',
        email: 'harish.poojary@prasadhospital.in',
        name: 'Dr. Harish Poojary (Admin)',
        role: 'Trauma & Clinical Director',
        facilityId: 'hosp-prasad',
        facilityName: 'Prasad Hospital & Trauma Care',
        password: 'admin123'
      },
      {
        id: 'admin_yenepoya',
        email: 'medicalofficer@yenepoyarural.org',
        name: 'Medical Officer Yenepoya',
        role: 'Medical Officer',
        facilityId: 'hosp-yenepoya',
        facilityName: 'Yenepoya Rural Health & Training Centre',
        password: 'admin123'
      },
      {
        id: 'admin',
        email: 'admin@medipulse.org',
        name: 'Hospital Desk Administrator',
        role: 'Administrator',
        facilityId: 'hosp-alvas',
        facilityName: "Alva's Health Centre",
        password: 'medipulse2025'
      }
    ];

    /* ── Stored Registered Staff List ── */
    function getRegisteredStaff() {
      try {
        var stored = JSON.parse(localStorage.getItem('mp_registered_staff') || 'null');
        if (stored && Array.isArray(stored) && stored.length > 0) return stored;
      } catch (e) { }
      localStorage.setItem('mp_registered_staff', JSON.stringify(PRESEEDED_STAFF));
      return PRESEEDED_STAFF;
    }

    function saveRegisteredStaff(list) {
      try {
        localStorage.setItem('mp_registered_staff', JSON.stringify(list));
      } catch (e) { }
    }

    function findStaffMember(identifier) {
      var staffList = getRegisteredStaff();
      var clean = (identifier || '').trim().toLowerCase();
      return staffList.find(function (s) {
        return (s.id && s.id.toLowerCase() === clean) ||
          (s.email && s.email.toLowerCase() === clean);
      }) || null;
    }

    /* ── Mode Switcher (Sign In vs Request Access) ── */
    var _currentMode = 'signin';
    function setStaffMode(mode) {
      _currentMode = mode;
      clearStaffError();
      var tabSignIn = document.getElementById('tab-staff-signin');
      var tabSignUp = document.getElementById('tab-staff-signup');
      var formSignIn = document.getElementById('staff-signin-form');
      var formSignUp = document.getElementById('staff-signup-form');
      var heading = document.getElementById('staff-heading');
      var subtext = document.getElementById('staff-subtext');

      if (mode === 'signup') {
        tabSignUp.classList.add('active');
        tabSignIn.classList.remove('active');
        formSignUp.style.display = 'block';
        formSignIn.style.display = 'none';
        heading.textContent = 'Request Staff & Doctor Desk Access';
        subtext.textContent = 'Register your medical council credentials to manage hospital inventories and shift schedules.';
        document.title = 'Staff Registration — MediPulse';
      } else {
        tabSignIn.classList.add('active');
        tabSignUp.classList.remove('active');
        formSignIn.style.display = 'block';
        formSignUp.style.display = 'none';
        heading.textContent = 'Staff & Doctor Sign In';
        subtext.textContent = 'Access real-time doctor rosters, update medicine supplies, and manage cold-chain vaccine batches.';
        document.title = 'Staff & Doctor Clinical Portal — MediPulse';
      }
    }

    /* ── Auto-fill Demo credentials ── */
    function quickFillStaff(username, password, facilityId) {
      document.getElementById('signin-staff-id').value = username;
      document.getElementById('signin-password').value = password;
      if (facilityId) {
        document.getElementById('signin-facility').value = facilityId;
      }
      clearStaffError();
      showToast('Autofilled credentials for: ' + username);
    }

    /* ── Show Error Banner ── */
    function showStaffError(msg) {
      var box = document.getElementById('staff-error-box');
      var text = document.getElementById('staff-error-text');
      text.textContent = msg;
      box.classList.add('visible');

      var card = document.getElementById('staff-auth-box');
      card.classList.remove('shake-error');
      void card.offsetWidth;
      card.classList.add('shake-error');
    }

    function clearStaffError() {
      var box = document.getElementById('staff-error-box');
      box.classList.remove('visible');
    }

    /* ── Success Transition ── */
    function showStaffSuccess(name, facilityName) {
      document.getElementById('success-staff-name').textContent = 'Welcome, ' + name + '!';
      document.getElementById('success-staff-sub').textContent = 'Loading ' + (facilityName || 'Hospital Desk') + '…';
      document.getElementById('staff-success-overlay').classList.add('visible');
      setTimeout(function () {
        var dest = new URLSearchParams(window.location.search).get('redirect') || './admin.html';
        window.location.replace(dest);
      }, 1500);
    }

    /* ── Password Visibility Toggle ── */
    function togglePwdVisibility(inputId, btn) {
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

    /* ── Password Strength Evaluator ── */
    function checkStaffPasswordStrength(pwd) {
      var wrap = document.getElementById('pwd-strength-wrap');
      if (!pwd) {
        wrap.classList.remove('visible');
        return;
      }
      wrap.classList.add('visible');
      var score = 0;
      if (pwd.length >= 6) score++;
      if (pwd.length >= 9) score++;
      if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score++;
      if (/[0-9]/.test(pwd) || /[^A-Za-z0-9]/.test(pwd)) score++;

      var b1 = document.getElementById('bar-1');
      var b2 = document.getElementById('bar-2');
      var b3 = document.getElementById('bar-3');
      var b4 = document.getElementById('bar-4');
      var text = document.getElementById('pwd-strength-text');

      b1.style.background = '#e0ded9';
      b2.style.background = '#e0ded9';
      b3.style.background = '#e0ded9';
      b4.style.background = '#e0ded9';

      if (pwd.length < 6) {
        b1.style.background = '#ea4335';
        text.textContent = 'Too short';
        text.style.color = '#ea4335';
      } else if (score <= 1) {
        b1.style.background = '#ea4335';
        text.textContent = 'Basic';
        text.style.color = '#ea4335';
      } else if (score === 2) {
        b1.style.background = '#fbbc05';
        b2.style.background = '#fbbc05';
        text.textContent = 'Moderate';
        text.style.color = '#b07900';
      } else {
        b1.style.background = '#2d6a5e';
        b2.style.background = '#2d6a5e';
        b3.style.background = '#2d6a5e';
        b4.style.background = '#2d6a5e';
        text.textContent = 'Strong ✓';
        text.style.color = '#2d6a5e';
      }
    }

    /* ── ACTION 1: Handle Staff Sign In ── */
    function handleStaffSignIn(e) {
      e.preventDefault();
      clearStaffError();

      var staffId = document.getElementById('signin-staff-id').value.trim();
      var password = document.getElementById('signin-password').value;
      var facilityId = document.getElementById('signin-facility').value;

      if (!staffId) {
        showStaffError('Please enter your Staff ID or official hospital email.');
        document.getElementById('signin-staff-id').focus();
        return;
      }
      if (!password) {
        showStaffError('Please enter your access passkey.');
        document.getElementById('signin-password').focus();
        return;
      }

      var btn = document.getElementById('btn-submit-staff-signin');
      btn.classList.add('loading');

      setTimeout(function () {
        btn.classList.remove('loading');

        var matched = findStaffMember(staffId);

        // Verification logic
        var isValid = false;
        var staffRecord = null;

        if (matched) {
          if (matched.password === password || password === 'admin123' || password === 'medipulse2025' || password.startsWith('STAFF#')) {
            isValid = true;
            staffRecord = matched;
          }
        } else if (staffId.toLowerCase() === 'admin' && password === 'medipulse2025') {
          isValid = true;
          staffRecord = PRESEEDED_STAFF[4];
        } else if (password === 'admin123' || password === 'medipulse2025' || password.startsWith('STAFF#')) {
          // If valid demo/universal password, allow sign in and associate with chosen facility
          isValid = true;
          var facilityName = document.getElementById('signin-facility').selectedOptions[0].text;
          staffRecord = {
            id: staffId,
            email: staffId.includes('@') ? staffId : staffId + '@medipulse.org',
            name: staffId.replace(/_/g, ' ').replace(/\b\w/g, function (c) { return c.toUpperCase(); }),
            role: 'Clinical Staff Member',
            facilityId: facilityId,
            facilityName: facilityName
          };
        }

        if (!isValid) {
          showStaffError('Invalid staff credentials or passkey. Select a demo account chip below to test immediately.');
          return;
        }

        // Establish Staff Session
        var staffSession = {
          uid: 'staff_' + Math.random().toString(36).substr(2, 9),
          id: staffRecord.id,
          name: staffRecord.name,
          email: staffRecord.email,
          role: staffRecord.role || 'ROLE_HOSPITAL_ADMIN',
          facilityId: facilityId || staffRecord.facilityId || 'hosp-alvas',
          facilityName: staffRecord.facilityName || "Alva's Health Centre",
          method: 'passkey',
          authenticatedAt: new Date().toISOString()
        };

        localStorage.setItem('medipulse_admin_auth', 'true');
        localStorage.setItem('mp_staff_session', JSON.stringify(staffSession));

        showStaffSuccess(staffRecord.name, staffSession.facilityName);
      }, 550);
    }

    /* ── ACTION 2: Handle Request Staff Access (Registration) ── */
    function handleStaffSignUp(e) {
      e.preventDefault();
      clearStaffError();

      var name = document.getElementById('reg-name').value.trim();
      var councilNo = document.getElementById('reg-council-no').value.trim();
      var email = document.getElementById('reg-email').value.trim();
      var facilityId = document.getElementById('reg-facility').value;
      var facilityName = document.getElementById('reg-facility').selectedOptions[0].text;
      var role = document.getElementById('reg-role').value;
      var password = document.getElementById('reg-password').value;
      var confirmPassword = document.getElementById('reg-confirm-password').value;
      var termsAgree = document.getElementById('reg-terms-agree').checked;

      if (!name || name.length < 2) {
        showStaffError('Please enter your full clinical name and title.');
        document.getElementById('reg-name').focus();
        return;
      }
      if (!councilNo) {
        showStaffError('Please enter your Medical Council Registration or Employee Code.');
        document.getElementById('reg-council-no').focus();
        return;
      }
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showStaffError('Please enter a valid official hospital email address.');
        document.getElementById('reg-email').focus();
        return;
      }
      if (!password || password.length < 6) {
        showStaffError('Clinical passkey must be at least 6 characters.');
        document.getElementById('reg-password').focus();
        return;
      }
      if (password !== confirmPassword) {
        showStaffError('Passkeys do not match. Please verify your passkey.');
        document.getElementById('reg-confirm-password').focus();
        return;
      }
      if (!termsAgree) {
        showStaffError('Please verify medical authorization and agree to compliance terms.');
        return;
      }

      var btn = document.getElementById('btn-submit-staff-signup');
      btn.classList.add('loading');

      setTimeout(function () {
        btn.classList.remove('loading');

        var staffList = getRegisteredStaff();
        var existing = findStaffMember(email);
        if (existing) {
          showStaffError('A staff account with this email already exists. Please sign in directly.');
          return;
        }

        var newStaffRecord = {
          id: 'staff_' + Math.random().toString(36).substr(2, 6),
          name: name,
          councilNo: councilNo,
          email: email,
          role: role,
          facilityId: facilityId,
          facilityName: facilityName,
          password: password,
          registeredAt: new Date().toISOString()
        };

        staffList.unshift(newStaffRecord);
        saveRegisteredStaff(staffList);

        // Establish session
        var staffSession = {
          uid: 'staff_' + Math.random().toString(36).substr(2, 9),
          id: newStaffRecord.id,
          name: name,
          email: email,
          role: role,
          facilityId: facilityId,
          facilityName: facilityName,
          method: 'registration',
          authenticatedAt: new Date().toISOString()
        };

        localStorage.setItem('medipulse_admin_auth', 'true');
        localStorage.setItem('mp_staff_session', JSON.stringify(staffSession));

        showStaffSuccess(name, facilityName);
      }, 650);
    }

    /* ── ACTION 3: Google Identity Services & Account Chooser ── */
    var _googleTokenClient = null;

    function initGoogleAuth() {
      if (window.google && google.accounts && google.accounts.oauth2) {
        try {
          _googleTokenClient = google.accounts.oauth2.initTokenClient({
            client_id: '108423982490-dummyfornow.apps.googleusercontent.com',
            scope: 'email profile openid',
            callback: function (tokenResponse) {
              if (tokenResponse && tokenResponse.access_token) {
                fetchGoogleUserInfo(tokenResponse.access_token);
              }
            }
          });
        } catch (e) { }
      }
    }

    window.addEventListener('load', function () {
      setTimeout(initGoogleAuth, 600);
    });

    function handleGoogleSignIn() {
      var btn = document.getElementById('btn-google-staff');
      if (btn) btn.classList.add('loading');
      document.getElementById('google-btn-label').textContent = 'Connecting Google…';

      if (_googleTokenClient) {
        try {
          _googleTokenClient.requestAccessToken({ prompt: 'select_account' });
          setTimeout(function () {
            if (btn) btn.classList.remove('loading');
            document.getElementById('google-btn-label').textContent = 'Continue with Hospital Google Workspace';
          }, 1200);
          return;
        } catch (e) { }
      }

      if (btn) btn.classList.remove('loading');
      document.getElementById('google-btn-label').textContent = 'Continue with Hospital Google Workspace';
      openGoogleChooser();
    }

    /* ── Doctor & Staff Google Accounts List ── */
    function getStaffGoogleAccounts() {
      var stored = null;
      try { stored = JSON.parse(localStorage.getItem('mp_staff_google_accounts') || 'null'); } catch (e) { }
      if (stored && Array.isArray(stored) && stored.length > 0) return stored;

      var defaults = [
        {
          name: 'Dr. Ramesh Bhat',
          email: 'ramesh.bhat@alvashealth.org',
          role: 'Chief Medical Officer',
          facilityId: 'hosp-alvas',
          facilityName: "Alva's Health Centre",
          badge: "Alva's CMO",
          initial: 'R',
          avatarBg: 'linear-gradient(135deg, #1a73e8, #0d47a1)'
        },
        {
          name: 'Superintendent CHC',
          email: 'superintendent@chcmoodbidri.gov.in',
          role: 'Medical Superintendent',
          facilityId: 'hosp-chc',
          facilityName: 'Govt CHC Moodbidri',
          badge: 'CHC Admin',
          initial: 'S',
          avatarBg: 'linear-gradient(135deg, #2e7d32, #1b5e20)'
        },
        {
          name: 'Dr. Harish Poojary',
          email: 'harish.poojary@prasadhospital.in',
          role: 'Trauma & Clinical Director',
          facilityId: 'hosp-prasad',
          facilityName: 'Prasad Hospital',
          badge: 'Prasad Lead',
          initial: 'H',
          avatarBg: 'linear-gradient(135deg, #e65100, #bf360c)'
        },
        {
          name: 'Medical Officer Yenepoya',
          email: 'medicalofficer@yenepoyarural.org',
          role: 'Medical Officer',
          facilityId: 'hosp-yenepoya',
          facilityName: 'Yenepoya Rural Centre',
          badge: 'Yenepoya MO',
          initial: 'Y',
          avatarBg: 'linear-gradient(135deg, #6a1b9a, #4a148c)'
        }
      ];
      return defaults;
    }

    function saveStaffGoogleAccounts(accs) {
      try { localStorage.setItem('mp_staff_google_accounts', JSON.stringify(accs)); } catch (e) { }
    }

    function renderGoogleAccounts() {
      var container = document.getElementById('g-account-list');
      if (!container) return;

      var accounts = getStaffGoogleAccounts();
      var html = '';
      accounts.forEach(function (acc, idx) {
        var badgeHtml = acc.badge ? '<span class="g-account-badge">' + acc.badge + '</span>' : '';
        html += '<button type="button" class="g-account-item" onclick="selectStaffGoogleAccount(' + idx + ')">'
          + '<div class="g-account-avatar" style="background:' + acc.avatarBg + ';">' + acc.initial + '</div>'
          + '<div class="g-account-info">'
          + '<div class="g-account-name-row">'
          + '<span class="g-account-name">' + acc.name + '</span>'
          + badgeHtml
          + '</div>'
          + '<div class="g-account-email">' + acc.email + ' • ' + (acc.facilityName || 'Hospital Desk') + '</div>'
          + '</div>'
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

    function selectStaffGoogleAccount(idx) {
      var accounts = getStaffGoogleAccounts();
      var acc = accounts[idx];
      if (!acc) return;

      closeGoogleChooser();

      var staffSession = {
        uid: 'staff_g_' + Math.random().toString(36).substr(2, 9),
        id: acc.email.split('@')[0],
        name: acc.name,
        email: acc.email,
        role: acc.role || 'ROLE_HOSPITAL_ADMIN',
        facilityId: acc.facilityId || 'hosp-alvas',
        facilityName: acc.facilityName || "Alva's Health Centre",
        method: 'google',
        authenticatedAt: new Date().toISOString()
      };

      localStorage.setItem('medipulse_admin_auth', 'true');
      localStorage.setItem('mp_staff_session', JSON.stringify(staffSession));

      showStaffSuccess(acc.name, acc.facilityName);
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
        name = email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, function (c) { return c.toUpperCase(); });
      }

      var accounts = getStaffGoogleAccounts();
      var exists = accounts.some(function (a) { return a.email.toLowerCase() === email.toLowerCase(); });
      if (!exists) {
        var colors = ['#1a73e8', '#2e7d32', '#e65100', '#0288d1', '#6a1b9a'];
        var chosen = colors[Math.floor(Math.random() * colors.length)];
        accounts.unshift({
          name: name,
          email: email,
          role: 'Attending Staff',
          facilityId: 'hosp-alvas',
          facilityName: "Alva's Health Centre",
          badge: 'Added Staff',
          initial: name[0].toUpperCase(),
          avatarBg: chosen
        });
        saveStaffGoogleAccounts(accounts);
      }

      closeGoogleChooser();

      var staffSession = {
        uid: 'staff_g_' + Math.random().toString(36).substr(2, 9),
        id: email.split('@')[0],
        name: name,
        email: email,
        role: 'Verified Medical Staff',
        facilityId: 'hosp-alvas',
        facilityName: "Alva's Health Centre",
        method: 'google',
        authenticatedAt: new Date().toISOString()
      };

      localStorage.setItem('medipulse_admin_auth', 'true');
      localStorage.setItem('mp_staff_session', JSON.stringify(staffSession));

      showStaffSuccess(name, "Alva's Health Centre");
    }

    /* ── ACTION 4: Password Recovery Modal ── */
    var _emergencyPin = '';
    var _emergencyTarget = '';

    function openRecoveryModal() {
      clearStaffError();
      var modal = document.getElementById('recovery-modal');
      document.getElementById('recovery-step-1').style.display = 'block';
      document.getElementById('recovery-step-2').style.display = 'none';

      var curr = document.getElementById('signin-staff-id').value.trim();
      if (curr) document.getElementById('recovery-input-email').value = curr;

      modal.classList.add('visible');
    }

    function closeRecoveryModal() {
      document.getElementById('recovery-modal').classList.remove('visible');
    }

    function handleRecoveryBackdrop(e) {
      if (e.target && e.target.id === 'recovery-modal') closeRecoveryModal();
    }

    async function dispatchEmergencyPasscode() {
      var input = document.getElementById('recovery-input-email').value.trim();
      if (!input) {
        alert('Please enter your Staff ID or Hospital Email.');
        return;
      }

      _emergencyTarget = input;
      _emergencyPin = 'STAFF#' + Math.floor(1000 + Math.random() * 9000);

      // If it's an email address, trigger backend recovery to dispatch to Gmail
      if (input.includes('@')) {
        try {
          var apiUrl = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.protocol === 'file:') ? 'http://localhost:5002/api/auth/forgot-password' : (window.MEDIPULSE_API_BASE || 'http://localhost:5002') + '/api/auth/forgot-password';
          fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: input })
          }).then(function(r) { return r.json(); }).then(function(d) {
            if (d && d.recovery_password) {
              _emergencyPin = d.recovery_password;
              document.getElementById('recovery-pin-val').textContent = _emergencyPin;
            }
          }).catch(function() {});
        } catch(_) {}
      }

      document.getElementById('recovery-target-id').textContent = input;
      document.getElementById('recovery-pin-val').textContent = _emergencyPin;

      document.getElementById('recovery-step-1').style.display = 'none';
      document.getElementById('recovery-step-2').style.display = 'block';

      showToast('Emergency passkey dispatched for ' + input + ' (Check Gmail)');
    }

    function openStaffGmailCompose() {
      var email = _emergencyTarget || (document.getElementById('recovery-input-email').value || '').trim();
      var pass = _emergencyPin || 'STAFF#9281';
      var subject = encodeURIComponent('MediPulse Staff Access Passkey [' + pass + ']');
      var body = encodeURIComponent(
        'MediPulse Clinical Desk Authorization\n\n' +
        'Staff Identifier: ' + email + '\n' +
        'Emergency Passkey: ' + pass + '\n\n' +
        'Valid for 15 minutes.\n' +
        'Access desk at: ' + window.location.href.split('?')[0] + '\n\n' +
        '— MediPulse Health & Emergency Network'
      );
      var gmailUrl = 'https://mail.google.com/mail/?view=cm&fs=1&to=' + encodeURIComponent(email) + '&su=' + subject + '&body=' + body;
      window.open(gmailUrl, '_blank');
    }

    function copyRecoveryPin() {
      navigator.clipboard.writeText(_emergencyPin);
      document.getElementById('copy-pin-text').textContent = 'Copied!';
      setTimeout(function () {
        document.getElementById('copy-pin-text').textContent = 'Copy';
      }, 1500);
    }

    function applyRecoveryAndAuthenticate() {
      document.getElementById('signin-staff-id').value = _emergencyTarget;
      document.getElementById('signin-password').value = _emergencyPin;
      closeRecoveryModal();
      document.getElementById('btn-submit-staff-signin').click();
    }

    /* ── Toast Helper ── */
    var _toastTimer = null;
    function showToast(msg) {
      var t = document.getElementById('staff-inbox-toast');
      document.getElementById('toast-msg').textContent = msg;
      t.classList.add('visible');
      clearTimeout(_toastTimer);
      _toastTimer = setTimeout(function () {
        t.classList.remove('visible');
      }, 4000);
    }
    function closeToast() {
      document.getElementById('staff-inbox-toast').classList.remove('visible');
    }

    /* ── Check if already authenticated ── */
    (function () {
      if (localStorage.getItem('medipulse_admin_auth') === 'true') {
        var params = new URLSearchParams(window.location.search);
        var autoRedirect = params.get('redirect') || './admin.html';
        // If not explicitly requesting signout or re-auth, can redirect
        if (params.get('reauth') !== 'true') {
          window.location.replace(autoRedirect);
        }
      }
    })();