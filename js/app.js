/**
 * MediPulse — Core Application Logic
 * Implements 12 animations, Leaflet map with CartoDB Voyager,
 * bidirectional map-card sync, Web Speech API, OCR simulation,
 * reserve slot morphing flow, telemedicine fallback, and live Admin sync.
 */

class MediPulseApp {
  constructor() {
    this.map = null;
    this.markers = {};
    this.routePolyline = null;
    this.selectedHospitalId = null;
    this.currentSearchMode = 'type'; // 'type', 'speak', 'upload'
    this.activeFilter = 'all';
    this.searchQuery = '';
    this.speechRecognition = null;
    this.isListening = false;
    this.adminLoggedIn = false;
    this.adminCurrentHospitalId = "hosp-alvas";

    this.init();
  }

  init() {
    // 1. Initialize i18n
    window.i18n.subscribe(() => {
      this.renderResults();
      this.updateMapPopups();
    });

    // 2. Setup UI event listeners
    this.setupHeader();
    this.setupSearchModes();
    this.setupVoiceSearch();
    this.setupPrescriptionUpload();
    this.setupFilterChips();
    this.setupHowItWorksObserver();
    this.setupAdminDashboard();

    // 3. Initialize Leaflet Map
    this.initLeafletMap();

    // 4. Initial Render
    this.renderResults();

    // 5. Subscribe to DataStore updates
    window.dataStore.subscribe(() => {
      this.renderResults();
      this.renderAdminView();
      this.refreshMapMarkers();
    });

    // Run signature load animation transition
    this.runSignatureLoadTransition();
  }

  /* ==========================================================================
     1. SIGNATURE LOAD ANIMATION (Heartbeat / EKG -> Search Bar)
     ========================================================================== */
  runSignatureLoadTransition() {
    const ekgPath = document.querySelector('.ekg-svg-path');
    const searchCard = document.querySelector('.search-card-container');
    if (!ekgPath || !searchCard) return;

    // After EKG line draws (~1.4s), smoothly fade out EKG and highlight search bar bottom line
    setTimeout(() => {
      const bottomIndicator = document.querySelector('.search-bottom-indicator');
      if (bottomIndicator) {
        bottomIndicator.style.backgroundColor = 'var(--pulse)';
        bottomIndicator.style.boxShadow = '0 0 10px rgba(232, 98, 44, 0.4)';
        setTimeout(() => {
          bottomIndicator.style.transition = 'background-color 1s, box-shadow 1s';
          bottomIndicator.style.backgroundColor = 'var(--line)';
          bottomIndicator.style.boxShadow = 'none';
        }, 1200);
      }
    }, 1400);
  }

  /* ==========================================================================
     LANGUAGE SELECTOR & HEADER
     ========================================================================== */
  setupHeader() {
    const langSelect = document.getElementById('global-lang-select');
    if (langSelect) {
      langSelect.value = window.i18n.getLang();
      langSelect.addEventListener('change', (e) => {
        window.i18n.setLang(e.target.value);
      });
    }

    const navPortalBtn = document.getElementById('btn-hospital-portal');
    if (navPortalBtn && navPortalBtn.tagName === 'BUTTON') {
      navPortalBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.openAdminModal();
      });
    }
  }

  /* ==========================================================================
     3. SEARCH MODE SWITCHER (Type / Speak / Upload)
     ========================================================================== */
  setupSearchModes() {
    const tabs = document.querySelectorAll('.search-tab-btn');
    const pill = document.querySelector('.mode-indicator-pill');
    const typeRow = document.getElementById('search-input-row');
    const voicePanel = document.getElementById('voice-search-panel');
    const uploadPanel = document.getElementById('upload-search-panel');

    const updatePill = (btn) => {
      if (!btn || !pill) return;
      pill.style.width = `${btn.offsetWidth}px`;
      pill.style.transform = `translateX(${btn.offsetLeft}px)`;
    };

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.currentSearchMode = tab.dataset.mode;
        updatePill(tab);

        // Crossfade display of panels
        if (this.currentSearchMode === 'type') {
          typeRow.style.display = 'flex';
          voicePanel.classList.remove('active');
          uploadPanel.classList.remove('active');
        } else if (this.currentSearchMode === 'speak') {
          typeRow.style.display = 'none';
          voicePanel.classList.add('active');
          uploadPanel.classList.remove('active');
        } else if (this.currentSearchMode === 'upload') {
          typeRow.style.display = 'none';
          voicePanel.classList.remove('active');
          uploadPanel.classList.add('active');
        }
      });
    });

    // Set initial pill position
    const activeBtn = document.querySelector('.search-tab-btn.active');
    if (activeBtn) {
      setTimeout(() => updatePill(activeBtn), 100);
    }

    // Search input listener
    const searchInput = document.getElementById('search-main-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        this.renderResults();
      });
    }

    const searchBtn = document.getElementById('btn-search-action');
    if (searchBtn) {
      searchBtn.addEventListener('click', () => {
        this.renderResults();
        // Scroll to results on mobile
        document.querySelector('.results-map-layout')?.scrollIntoView({ behavior: 'smooth' });
      });
    }
  }

  /* ==========================================================================
     4. VOICE SEARCH MIC (Web Speech API with expanding ring animation)
     ========================================================================== */
  setupVoiceSearch() {
    const micBtn = document.getElementById('mic-action-btn');
    const statusText = document.getElementById('voice-status-text');
    const transcriptText = document.getElementById('voice-transcript-text');

    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
      if (statusText) statusText.textContent = window.i18n.get('speechNotSupported');
      return;
    }

    this.speechRecognition = new SpeechRec();
    this.speechRecognition.continuous = false;
    this.speechRecognition.interimResults = true;

    this.speechRecognition.onstart = () => {
      this.isListening = true;
      micBtn?.classList.add('listening');
      if (statusText) statusText.textContent = window.i18n.get('speechListening');
      if (transcriptText) transcriptText.textContent = "...";
    };

    this.speechRecognition.onresult = (event) => {
      let interim = '';
      let final = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          final += event.results[i][0].transcript;
        } else {
          interim += event.results[i][0].transcript;
        }
      }
      const spoken = final || interim;
      if (transcriptText) transcriptText.textContent = `"${spoken}"`;
      if (final) {
        this.searchQuery = final.toLowerCase().trim();
        const mainInput = document.getElementById('search-main-input');
        if (mainInput) mainInput.value = final;
        this.renderResults();
      }
    };

    this.speechRecognition.onerror = (e) => {
      console.warn("Speech recognition error:", e.error);
      this.isListening = false;
      micBtn?.classList.remove('listening');
      if (statusText) statusText.textContent = window.i18n.get('speechPrompt');
    };

    this.speechRecognition.onend = () => {
      this.isListening = false;
      micBtn?.classList.remove('listening');
      if (statusText) statusText.textContent = window.i18n.get('speechPrompt');
    };

    micBtn?.addEventListener('click', () => {
      if (this.isListening) {
        this.speechRecognition.stop();
      } else {
        this.speechRecognition.lang = window.i18n.getSpeechLang();
        try {
          this.speechRecognition.start();
        } catch (e) {
          console.error("Speech recognition start failed:", e);
        }
      }
    });
  }

  /* ==========================================================================
     PRESCRIPTION UPLOAD (OCR Simulation)
     ========================================================================== */
  setupPrescriptionUpload() {
    const dropzone = document.getElementById('upload-dropzone');
    const fileInput = document.getElementById('rx-file-input');
    const sampleFever = document.getElementById('btn-sample-fever');
    const sampleDiabetes = document.getElementById('btn-sample-diabetes');
    const uploadStatus = document.getElementById('upload-status-result');

    const handlePrescriptionText = (extractedText, medList) => {
      if (uploadStatus) {
        uploadStatus.innerHTML = `
          <div style="margin-top: 12px; padding: 10px 14px; background: #eaf5ed; border-radius: 8px; border: 1px solid var(--sage); color: var(--ink);">
            <strong>${window.i18n.get('uploadSuccess')}</strong>
            <div style="display: flex; gap: 8px; margin-top: 6px; flex-wrap: wrap;">
              ${medList.map(m => `<span style="background: var(--white); padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: 600; border: 1px solid var(--line);">${m}</span>`).join('')}
            </div>
          </div>
        `;
      }
      this.searchQuery = medList[0].toLowerCase();
      const mainInput = document.getElementById('search-main-input');
      if (mainInput) mainInput.value = medList.join(', ');
      this.renderResults();
    };

    sampleFever?.addEventListener('click', () => {
      handlePrescriptionText("Rx: Paracetamol 650mg TDS x 3 days, Amoxicillin 500mg BD x 5 days", ["Paracetamol 650mg", "Amoxicillin 500mg"]);
    });

    sampleDiabetes?.addEventListener('click', () => {
      handlePrescriptionText("Rx: Metformin 500mg OD, Insulin Glargine 10 units SC at night", ["Metformin 500mg", "Insulin Glargine"]);
    });

    dropzone?.addEventListener('click', () => fileInput?.click());
    fileInput?.addEventListener('change', () => {
      if (fileInput.files.length > 0) {
        // Simulate OCR analysis
        if (uploadStatus) uploadStatus.innerHTML = `<span style="color: var(--pulse); font-weight: 500;">Analyzing prescription handwriting with OCR...</span>`;
        setTimeout(() => {
          handlePrescriptionText("Extracted Rx", ["Paracetamol 650mg", "Amoxicillin 500mg"]);
        }, 800);
      }
    });
  }

  /* ==========================================================================
     FILTER CHIPS
     ========================================================================== */
  setupFilterChips() {
    const chips = document.querySelectorAll('.chip-btn');
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        chips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        this.activeFilter = chip.dataset.filter;
        this.renderResults();
      });
    });
  }

  /* ==========================================================================
     LEAFLET MAP INTEGRATION (CartoDB Voyager, Custom SVG Pins, Polyline Route)
     ========================================================================== */
  initLeafletMap() {
    const mapContainer = document.getElementById('leaflet-map');
    if (!mapContainer || typeof L === 'undefined') return;

    // Centered on Moodbidri, Karnataka
    this.map = L.map('leaflet-map', {
      center: [DEFAULT_PATIENT_LOCATION.lat, DEFAULT_PATIENT_LOCATION.lng],
      zoom: 13,
      zoomControl: false,
      scrollWheelZoom: false
    });

    L.control.zoom({ position: 'topright' }).addTo(this.map);

    // CartoDB Voyager tile layer (clean, desaturated palette matching --paper / --ink)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap © CARTO',
      maxZoom: 19
    }).addTo(this.map);

    // Add Patient Marker ("You Are Here")
    const patientIcon = L.divIcon({
      className: 'patient-location-pin',
      html: `
        <div style="background-color: var(--ink); color: var(--white); border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0,0,0,0.3); border: 2px solid var(--white);">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        </div>
      `,
      iconSize: [28, 28],
      iconAnchor: [14, 14]
    });

    L.marker([DEFAULT_PATIENT_LOCATION.lat, DEFAULT_PATIENT_LOCATION.lng], { icon: patientIcon })
      .addTo(this.map)
      .bindPopup(`<div style="padding: 8px; font-weight: 600; font-size: 13px;">${DEFAULT_PATIENT_LOCATION.name} (You are here)</div>`);

    this.refreshMapMarkers();
  }

  refreshMapMarkers() {
    if (!this.map) return;

    // Remove existing markers
    Object.values(this.markers).forEach(m => this.map.removeLayer(m));
    this.markers = {};

    const hospitals = window.dataStore.getAll();
    const bounds = L.latLngBounds([[DEFAULT_PATIENT_LOCATION.lat, DEFAULT_PATIENT_LOCATION.lng]]);

    hospitals.forEach((h, index) => {
      bounds.extend([h.lat, h.lng]);

      // Calculate availability flags
      const hasOnDutyDoctor = h.doctors.some(d => d.onDuty);
      const hasInStockMed = h.medicines.some(m => m.stock > 0);
      const hasVaccines = h.vaccines.some(v => v.doses > 0);
      const isAvailable = hasOnDutyDoctor && (hasInStockMed || hasVaccines);

      const dotBadgeColor = isAvailable ? 'var(--pulse)' : '#8c9794';

      // SVG teardrop pin with status badge
      const markerHtml = `
        <div class="custom-pin-marker" id="pin-${h.id}">
          ${h.isNearest ? '<div class="nearest-pulse-ring"></div>' : ''}
          <svg class="pin-svg-body" viewBox="0 0 34 44" fill="none">
            <path d="M17 0C7.61 0 0 7.61 0 17C0 29.75 17 44 17 44C17 44 34 29.75 34 17C34 7.61 26.39 0 17 0Z" fill="var(--ink)"/>
            <circle cx="17" cy="16" r="10" fill="var(--paper)"/>
            <circle cx="17" cy="16" r="6" fill="${dotBadgeColor}"/>
          </svg>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'hospital-marker-icon',
        html: markerHtml,
        iconSize: [34, 44],
        iconAnchor: [17, 44],
        popupAnchor: [0, -40]
      });

      const marker = L.marker([h.lat, h.lng], { icon: customIcon }).addTo(this.map);

      // Popup Content
      marker.bindPopup(this.createPopupContent(h));

      // Click Marker -> Highlight matching card & animate polyline
      marker.on('click', () => {
        this.selectHospital(h.id, false);
      });

      this.markers[h.id] = marker;

      // Staggered CSS scale-in animation on load (150ms stagger per rank)
      setTimeout(() => {
        const pinEl = document.getElementById(`pin-${h.id}`);
        if (pinEl) pinEl.classList.add('pin-scaled');
      }, index * 150 + 100);
    });

    // Fit all markers in view initially
    this.map.fitBounds(bounds, { padding: [40, 40] });
  }

  createPopupContent(hospital) {
    const onDutyCount = hospital.doctors.filter(d => d.onDuty).length;
    const inStockCount = hospital.medicines.filter(m => m.stock > 0).length;
    const totalDoses = hospital.vaccines.reduce((acc, v) => acc + v.doses, 0);

    return `
      <div class="map-popup-card">
        <div class="map-popup-title">${hospital.name}</div>
        <div class="map-popup-dist">${hospital.distanceKm} km from Moodbidri • ${hospital.type}</div>
        <div class="map-popup-badges">
          <div><strong style="color: ${onDutyCount > 0 ? 'var(--pulse)' : 'var(--danger-soft)'};">●</strong> ${onDutyCount} ${window.i18n.get('doctorsCountOnDuty')}</div>
          <div><strong style="color: ${inStockCount > 0 ? 'var(--pulse)' : 'var(--danger-soft)'};">●</strong> ${inStockCount} ${window.i18n.get('medicinesAvailable')}</div>
          <div><strong style="color: ${totalDoses > 0 ? 'var(--pulse)' : 'var(--danger-soft)'};">●</strong> ${totalDoses} ${window.i18n.get('dosesAvailable')}</div>
        </div>
        <button class="map-popup-btn" onclick="window.mediPulseApp.selectHospital('${hospital.id}', true)">${window.i18n.get('expandDetails')}</button>
      </div>
    `;
  }

  updateMapPopups() {
    const hospitals = window.dataStore.getAll();
    hospitals.forEach(h => {
      if (this.markers[h.id]) {
        this.markers[h.id].setPopupContent(this.createPopupContent(h));
      }
    });
  }

  /* ==========================================================================
     BIDIRECTIONAL CARD-MAP SYNC & GROWING POLYLINE
     ========================================================================== */
  selectHospital(hospitalId, scrollToCard = true) {
    this.selectedHospitalId = hospitalId;
    const hospital = window.dataStore.getById(hospitalId);
    if (!hospital) return;

    // 1. Highlight Card
    document.querySelectorAll('.hospital-card').forEach(card => {
      if (card.dataset.id === hospitalId) {
        card.classList.add('card-selected');
        card.classList.add('expanded');
        if (scrollToCard) {
          card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      } else {
        card.classList.remove('card-selected');
      }
    });

    // 2. Pan/Fly Map to marker and open popup
    if (this.map && this.markers[hospitalId]) {
      this.map.flyTo([hospital.lat, hospital.lng], 14, { duration: 0.8 });
      this.markers[hospitalId].openPopup();
    }

    // 3. Draw animated polyline from patient to hospital marker
    this.drawAnimatedPolyline([DEFAULT_PATIENT_LOCATION.lat, DEFAULT_PATIENT_LOCATION.lng], [hospital.lat, hospital.lng]);
  }

  drawAnimatedPolyline(startCoord, endCoord) {
    if (!this.map) return;

    // Remove previous polyline
    if (this.routePolyline) {
      this.map.removeLayer(this.routePolyline);
    }

    // Generate intermediate points to simulate smooth growing line
    const steps = 12;
    const points = [];
    for (let i = 0; i <= steps; i++) {
      const lat = startCoord[0] + (endCoord[0] - startCoord[0]) * (i / steps);
      const lng = startCoord[1] + (endCoord[1] - startCoord[1]) * (i / steps);
      points.push([lat, lng]);
    }

    this.routePolyline = L.polyline([startCoord], {
      color: 'var(--sage)',
      weight: 3,
      dashArray: '6, 8',
      opacity: 0.9
    }).addTo(this.map);

    let currentStep = 1;
    const interval = setInterval(() => {
      if (currentStep <= steps) {
        this.routePolyline.setLatLngs(points.slice(0, currentStep + 1));
        currentStep++;
      } else {
        clearInterval(interval);
      }
    }, 50); // 12 * 50ms = 600ms growth duration
  }

  /* ==========================================================================
     RENDER SEARCH RESULTS (Cards with live badges, expandable detail tables)
     ========================================================================== */
  renderResults() {
    const container = document.getElementById('results-cards-list');
    const counterEl = document.getElementById('results-counter');
    if (!container) return;

    let hospitals = window.dataStore.getAll();

    // Apply Filter Chips
    if (this.activeFilter === 'doctor') {
      hospitals = hospitals.filter(h => h.doctors.some(d => d.onDuty));
    } else if (this.activeFilter === 'medicine') {
      hospitals = hospitals.filter(h => h.medicines.some(m => m.stock > 0));
    } else if (this.activeFilter === 'vaccine') {
      hospitals = hospitals.filter(h => h.vaccines.some(v => v.doses > 0));
    } else if (this.activeFilter === 'emergency') {
      hospitals = hospitals.filter(h => h.emergency24x7);
    }

    // Apply Search Query
    if (this.searchQuery) {
      hospitals = hospitals.filter(h => {
        const matchesName = h.name.toLowerCase().includes(this.searchQuery);
        const matchesDoctor = h.doctors.some(d => d.name.toLowerCase().includes(this.searchQuery) || d.specialty.toLowerCase().includes(this.searchQuery));
        const matchesMed = h.medicines.some(m => m.name.toLowerCase().includes(this.searchQuery) || m.category.toLowerCase().includes(this.searchQuery));
        const matchesVac = h.vaccines.some(v => v.name.toLowerCase().includes(this.searchQuery));
        return matchesName || matchesDoctor || matchesMed || matchesVac;
      });
    }

    if (counterEl) {
      counterEl.textContent = `${hospitals.length} ${window.i18n.get('resultsFound')}`;
    }

    if (hospitals.length === 0) {
      container.innerHTML = `
        <div style="background: var(--white); padding: 40px; border-radius: 16px; border: 1px solid var(--line); text-align: center;">
          <h3 style="margin-bottom: 8px;">No matching facilities found</h3>
          <p style="color: var(--slate); font-size: 14px;">Try searching for a different medicine (e.g. Paracetamol), specialty, or clear your filters.</p>
        </div>
      `;
      return;
    }

    // Build Cards HTML with 60ms stagger entrance animation
    container.innerHTML = hospitals.map((h, idx) => {
      const onDutyDoctors = h.doctors.filter(d => d.onDuty);
      const onDutyCount = onDutyDoctors.length;
      const inStockMeds = h.medicines.filter(m => m.stock > 0);
      const totalVaccineDoses = h.vaccines.reduce((acc, v) => acc + v.doses, 0);

      const isExpanded = this.selectedHospitalId === h.id;

      return `
        <article class="hospital-card ${isExpanded ? 'expanded card-selected' : ''}" data-id="${h.id}" style="animation-delay: ${idx * 60}ms;">
          <div class="card-top-row">
            <div>
              <h2 class="card-hospital-title">${h.name}</h2>
              <div class="card-hospital-meta">
                <span class="meta-distance-badge">${h.distanceKm} km away</span>
                <span>•</span>
                <span>${h.address}</span>
                <span>•</span>
                <span>${h.type}</span>
              </div>
            </div>
            <div class="card-last-updated">
              ${window.i18n.get('updatedAgo')} ${h.lastUpdatedMins === 0 ? window.i18n.get('justNow') : `${h.lastUpdatedMins} ${window.i18n.get('minsAgo')}`}
            </div>
          </div>

          <!-- 3 Availability Badges Strip -->
          <div class="badges-container">
            <!-- Doctor Badge -->
            <div class="badge-item ${onDutyCount > 0 ? 'badge-live' : 'badge-off'}">
              <span class="${onDutyCount > 0 ? 'pulse-dot-live' : 'dot-static-off'}"></span>
              <div>
                <span class="badge-text-title">${onDutyCount > 0 ? `${onDutyCount} ${window.i18n.get('onDuty')}` : window.i18n.get('offDuty')}</span>
                <span class="badge-text-desc">${onDutyDoctors.length > 0 ? onDutyDoctors.map(d => d.specialty).join(', ') : 'No doctors on shift'}</span>
              </div>
            </div>

            <!-- Medicine Badge -->
            <div class="badge-item ${inStockMeds.length > 0 ? 'badge-live' : 'badge-off'}">
              <span class="${inStockMeds.length > 0 ? 'pulse-dot-live' : 'dot-static-off'}"></span>
              <div>
                <span class="badge-text-title">${inStockMeds.length > 0 ? `${inStockMeds.length} ${window.i18n.get('inStock')}` : window.i18n.get('outOfStock')}</span>
                <span class="badge-text-desc">${inStockMeds.slice(0, 2).map(m => m.name.split(' ')[0]).join(', ')}...</span>
              </div>
            </div>

            <!-- Vaccine Badge -->
            <div class="badge-item ${totalVaccineDoses > 0 ? 'badge-live' : 'badge-off'}">
              <span class="${totalVaccineDoses > 0 ? 'pulse-dot-live' : 'dot-static-off'}"></span>
              <div>
                <span class="badge-text-title">${totalVaccineDoses > 0 ? `${totalVaccineDoses} ${window.i18n.get('dosesAvailable')}` : window.i18n.get('dosesUnavailable')}</span>
                <span class="badge-text-desc">${h.vaccines[0]?.name.split(' ')[0] || 'Cold chain'}</span>
              </div>
            </div>
          </div>

          <!-- Toggle details button -->
          <button class="card-expand-toggle-btn" aria-label="Toggle details">
            <span class="expand-btn-text">${isExpanded ? window.i18n.get('collapseDetails') : window.i18n.get('expandDetails')}</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
          </button>

          <!-- 6. Inline Expandable Details Accordion -->
          <div class="card-details-accordion">
            <!-- Doctor Roster -->
            <div class="detail-section-title">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              <span>${window.i18n.get('dutyRosterTitle')}</span>
            </div>
            <table class="detail-table-card">
              <thead>
                <tr>
                  <th>Doctor & Qualification</th>
                  <th>Specialty</th>
                  <th>Shift Hours</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                ${h.doctors.map(d => `
                  <tr>
                    <td><strong>${d.name}</strong><br><small style="color: var(--slate);">${d.qualification}</small></td>
                    <td>${d.specialty}</td>
                    <td>${d.shift}</td>
                    <td>
                      <span style="display: inline-flex; align-items: center; gap: 6px; font-weight: 600; color: ${d.onDuty ? 'var(--pulse)' : 'var(--danger-soft)'};">
                        <span class="${d.onDuty ? 'pulse-dot-live' : 'dot-static-off'}"></span>
                        ${d.onDuty ? window.i18n.get('onDuty') : window.i18n.get('offDuty')}
                      </span>
                    </td>
                    <td>
                      ${!d.onDuty ? `
                        <!-- 8. Telemedicine Fallback Button with one-time attention pulse -->
                        <button class="btn-telemedicine" onclick="event.stopPropagation(); window.mediPulseApp.openTelemedicineModal('${d.name}', '${d.specialty}', '${h.name}')">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
                          ${window.i18n.get('telemedicineBtn')}
                        </button>
                      ` : `<span style="font-size: 12px; color: var(--slate);">Queue: ${d.queueCount}</span>`}
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>

            <!-- Medicine Inventory -->
            <div class="detail-section-title">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
              <span>${window.i18n.get('medicineTitle')}</span>
            </div>
            <table class="detail-table-card">
              <thead>
                <tr>
                  <th>Medicine</th>
                  <th>Category</th>
                  <th>Stock Available</th>
                  <th>Subsidized Pricing</th>
                </tr>
              </thead>
              <tbody>
                ${h.medicines.map(m => `
                  <tr>
                    <td><strong>${m.name}</strong></td>
                    <td>${m.category}</td>
                    <td>
                      <span style="font-weight: 600; color: ${m.stock === 0 ? 'var(--danger-soft)' : m.stock < m.threshold ? '#b85c18' : 'var(--ink)'};">
                        ${m.stock} ${m.unit}
                        ${m.stock === 0 ? `(${window.i18n.get('outOfStock')})` : m.stock < m.threshold ? `(${window.i18n.get('lowStock')})` : ''}
                      </span>
                    </td>
                    <td>${m.price}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>

            <!-- Vaccine Batches -->
            <div class="detail-section-title">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m18 2 4 4"/><path d="m17 7 3-3"/><path d="M19 9 8.7 19.3c-1 1-2.5 1-3.4 0l-.6-.6c-1-1-1-2.5 0-3.4L15 5"/><path d="m9 11 4 4"/><path d="m5 19-3 3"/></svg>
              <span>${window.i18n.get('vaccineTitle')}</span>
            </div>
            <table class="detail-table-card">
              <thead>
                <tr>
                  <th>Vaccine</th>
                  <th>Batch Number</th>
                  <th>Available Doses</th>
                  <th>Expiry Date</th>
                  <th>Cold Chain Status</th>
                </tr>
              </thead>
              <tbody>
                ${h.vaccines.map(v => `
                  <tr>
                    <td><strong>${v.name}</strong></td>
                    <td><code>${v.batch}</code></td>
                    <td><strong style="color: ${v.doses > 0 ? 'var(--ink)' : 'var(--danger-soft)'};">${v.doses} doses</strong></td>
                    <td>${v.expiry}</td>
                    <td><span style="color: var(--sage); font-weight: 600;">✓ ${v.coldChainStatus}</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>

            <!-- 7. Reserve Slot Action Bar (Morphing button flow) -->
            <div class="card-action-bar">
              <button class="btn-reserve-slot" id="btn-reserve-${h.id}" onclick="event.stopPropagation(); window.mediPulseApp.handleReserveSlot('${h.id}')">
                <span class="slot-spinner"></span>
                <span class="btn-reserve-label">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="19" y2="10"/></svg>
                  ${window.i18n.get('reserveSlot')}
                </span>
              </button>

              <div class="secondary-action-group">
                <a href="https://maps.google.com/?q=${h.lat},${h.lng}" target="_blank" rel="noopener" class="btn-secondary-link" onclick="event.stopPropagation();">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polygon points="12 8 8 12 12 16 12 8"/></svg>
                  ${window.i18n.get('directionsBtn')}
                </a>
                <a href="tel:${h.phone}" class="btn-secondary-link" onclick="event.stopPropagation();">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  ${window.i18n.get('callHospitalBtn')}
                </a>
              </div>
            </div>

            <!-- Confirmation Strip (Slides down after reservation) -->
            <div class="reserve-confirm-strip" id="confirm-strip-${h.id}">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              <span>${window.i18n.get('smsSentNotice')}</span>
            </div>
          </div>
        </article>
      `;
    }).join('');

    // Attach card click handlers for accordion expand and map sync
    container.querySelectorAll('.hospital-card').forEach(card => {
      card.addEventListener('click', (e) => {
        // Prevent toggle if clicking interactive elements inside
        if (e.target.closest('button') || e.target.closest('a') || e.target.closest('input')) return;
        const id = card.dataset.id;
        const willExpand = !card.classList.contains('expanded');
        if (willExpand) {
          this.selectHospital(id, false);
        } else {
          card.classList.remove('expanded');
          card.classList.remove('card-selected');
        }
      });
    });
  }

  /* ==========================================================================
     7. RESERVE SLOT FLOW (Morphing Button + Character-by-character token typing)
     ========================================================================== */
  handleReserveSlot(hospitalId) {
    const btn = document.getElementById(`btn-reserve-${hospitalId}`);
    const confirmStrip = document.getElementById(`confirm-strip-${hospitalId}`);
    if (!btn) return;

    // 1. Button morphs into loading spinner (0.3s)
    btn.classList.add('loading');
    btn.style.width = '70px';

    setTimeout(() => {
      // 2. Success: Generate unique booking token (e.g. MP-8492-K)
      const tokenNumber = `MP-${Math.floor(1000 + Math.random() * 9000)}-${hospitalId.substring(5, 6).toUpperCase()}`;
      btn.classList.remove('loading');
      btn.classList.add('reserved');
      btn.style.width = '190px';

      // Type token character by character (~40ms per character)
      const labelEl = btn.querySelector('.btn-reserve-label');
      if (labelEl) {
        labelEl.style.display = 'inline-flex';
        labelEl.innerHTML = `✓ `;
        let charIndex = 0;
        const typeInterval = setInterval(() => {
          if (charIndex < tokenNumber.length) {
            labelEl.innerHTML += tokenNumber[charIndex];
            charIndex++;
          } else {
            clearInterval(typeInterval);
            // 3. Confirmation strip slides down beneath button with subtle icon bounce
            if (confirmStrip) {
              confirmStrip.classList.add('visible');
            }
            this.showToast(`Token ${tokenNumber} held for 60 mins at ${window.dataStore.getById(hospitalId)?.name}!`);
          }
        }, 40);
      }
    }, 700);
  }

  /* ==========================================================================
     8. TELEMEDICINE FALLBACK MODAL
     ========================================================================== */
  openTelemedicineModal(doctorName, specialty, hospitalName) {
    const modalHtml = `
      <div class="admin-modal-overlay active" id="telemedicine-modal" onclick="if(event.target === this) this.remove()">
        <div class="admin-modal-window" style="max-width: 580px;">
          <div class="admin-modal-header" style="background-color: var(--ink);">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span class="pulse-dot-live"></span>
              <strong>MediPulse Remote Video Triage</strong>
            </div>
            <button onclick="document.getElementById('telemedicine-modal').remove()" style="background: none; border: none; color: var(--paper); font-size: 20px; cursor: pointer;">&times;</button>
          </div>
          <div class="admin-modal-body" style="padding: 24px;">
            <div style="background-color: #0b1a18; border-radius: 12px; height: 260px; display: flex; flex-direction: column; align-items: center; justify-content: center; color: var(--paper); position: relative; overflow: hidden; margin-bottom: 16px;">
              <div class="pulse-dot-live" style="position: absolute; top: 16px; left: 16px;"></div>
              <div style="font-size: 13px; position: absolute; top: 14px; left: 32px; color: #ff9d76;">Live Tele-Consultation Queue</div>
              <div style="width: 72px; height: 72px; border-radius: 50%; background: rgba(255,255,255,0.1); border: 2px solid var(--sage); display: flex; align-items: center; justify-content: center; margin-bottom: 12px;">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
              </div>
              <h3 style="color: var(--paper); margin-bottom: 4px;">Connecting to Dr. On-Call (${specialty})</h3>
              <p style="font-size: 13px; color: rgba(250,246,239,0.7); text-align: center; max-width: 380px;">
                ${doctorName} is off-duty at ${hospitalName}, but our regional digital health backup network is ready.
              </p>
            </div>
            <div style="display: flex; gap: 10px; justify-content: flex-end;">
              <button onclick="document.getElementById('telemedicine-modal').remove()" class="btn-secondary-link">Cancel</button>
              <button onclick="alert('Joining secure WebRTC encrypted room...'); document.getElementById('telemedicine-modal').remove();" class="btn-reserve-slot" style="min-width: 160px;">
                Start video call now
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
  }

  /* ==========================================================================
     9. HOW-IT-WORKS INTERSECTION OBSERVER (Drawing connecting line + Icon sequence)
     ========================================================================== */
  setupHowItWorksObserver() {
    const section = document.querySelector('.how-it-works-section');
    const linePath = document.querySelector('.how-line-path');
    const icons = document.querySelectorAll('.how-step-icon');
    if (!section || !linePath) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // 1. Line draws in (stroke-dashoffset transition)
          linePath.classList.add('drawn');

          // 2. Each step's icon does a quick scale-in sequence
          icons.forEach((icon, idx) => {
            setTimeout(() => {
              icon.classList.add('popped');
            }, 300 + idx * 180);
          });

          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.25 });

    observer.observe(section);
  }

  /* ==========================================================================
     10 & 11. HOSPITAL ADMIN DASHBOARD & LIVE SYNC
     ========================================================================== */
  openAdminModal() {
    const overlay = document.getElementById('admin-modal-overlay');
    if (overlay) {
      overlay.classList.add('active');
      this.renderAdminView();
    }
  }

  closeAdminModal() {
    const overlay = document.getElementById('admin-modal-overlay');
    if (overlay) {
      overlay.classList.remove('active');
    }
  }

  setupAdminDashboard() {
    const overlay = document.getElementById('admin-modal-overlay');
    const closeBtn = document.getElementById('btn-close-admin-modal');
    closeBtn?.addEventListener('click', () => this.closeAdminModal());

    overlay?.addEventListener('click', (e) => {
      if (e.target === overlay) this.closeAdminModal();
    });

    const loginForm = document.getElementById('admin-login-form');
    loginForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      const user = document.getElementById('admin-username')?.value.trim();
      const pass = document.getElementById('admin-password')?.value.trim();
      const loginBox = document.getElementById('admin-login-box');
      const errorMsg = document.getElementById('admin-login-error');

      // Demo credentials check: admin / medipulse2025
      if (user === 'admin' && pass === 'medipulse2025') {
        this.adminLoggedIn = true;
        errorMsg?.classList.remove('visible');
        loginBox?.classList.remove('shake-error');
        this.renderAdminView();
        this.showToast("Hospital staff authenticated successfully!");
      } else {
        // 10. Horizontal shake animation on invalid credentials + red flash
        loginBox?.classList.remove('shake-error');
        void loginBox?.offsetWidth; // trigger reflow
        loginBox?.classList.add('shake-error');
        errorMsg?.classList.add('visible');
      }
    });

    const facilitySelect = document.getElementById('admin-facility-select');
    facilitySelect?.addEventListener('change', (e) => {
      this.adminCurrentHospitalId = e.target.value;
      this.renderAdminView();
    });

    // Admin nav tabs
    const adminTabs = document.querySelectorAll('.admin-nav-tab');
    adminTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        adminTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const view = tab.dataset.view;
        document.querySelectorAll('.admin-tab-pane').forEach(p => p.style.display = 'none');
        const pane = document.getElementById(`admin-pane-${view}`);
        if (pane) pane.style.display = 'block';
      });
    });
  }

  renderAdminView() {
    const loginSection = document.getElementById('admin-login-section');
    const dashboardSection = document.getElementById('admin-dashboard-section');

    if (!this.adminLoggedIn) {
      if (loginSection) loginSection.style.display = 'block';
      if (dashboardSection) dashboardSection.style.display = 'none';
      return;
    }

    if (loginSection) loginSection.style.display = 'none';
    if (dashboardSection) dashboardSection.style.display = 'block';

    const hospital = window.dataStore.getById(this.adminCurrentHospitalId);
    if (!hospital) return;

    // Render Doctor Roster Table
    const doctorsTbody = document.getElementById('admin-doctors-tbody');
    if (doctorsTbody) {
      doctorsTbody.innerHTML = hospital.doctors.map(d => `
        <tr id="row-doc-${d.id}">
          <td><strong>${d.name}</strong><br><small style="color: var(--slate);">${d.qualification}</small></td>
          <td>${d.specialty}</td>
          <td>${d.shift}</td>
          <td>
            <label class="toggle-switch-label">
              <input type="checkbox" ${d.onDuty ? 'checked' : ''} onchange="window.mediPulseApp.handleToggleDoctorDuty('${hospital.id}', '${d.id}')">
              <span class="toggle-slider"></span>
            </label>
          </td>
        </tr>
      `).join('');
    }

    // Render Medicine Inventory
    const medsTbody = document.getElementById('admin-meds-tbody');
    if (medsTbody) {
      medsTbody.innerHTML = hospital.medicines.map(m => `
        <tr id="row-med-${m.id}">
          <td><strong>${m.name}</strong></td>
          <td>${m.category}</td>
          <td>
            <div style="display: flex; align-items: center; gap: 8px;">
              <input type="number" min="0" value="${m.stock}" id="input-stock-${m.id}" style="width: 80px; padding: 6px; border: 1px solid var(--line); border-radius: 6px; font-size: 13px;">
              <span>${m.unit}</span>
            </div>
          </td>
          <td>
            <button class="btn-secondary-link" style="padding: 4px 10px; font-size: 12px;" onclick="window.mediPulseApp.handleUpdateMedicine('${hospital.id}', '${m.id}')">
              Save
            </button>
          </td>
        </tr>
      `).join('');
    }

    // Render Vaccine Batches
    const vacsTbody = document.getElementById('admin-vacs-tbody');
    if (vacsTbody) {
      vacsTbody.innerHTML = hospital.vaccines.map(v => `
        <tr id="row-vac-${v.id}">
          <td><strong>${v.name}</strong></td>
          <td><code>${v.batch}</code></td>
          <td>
            <div style="display: flex; align-items: center; gap: 8px;">
              <input type="number" min="0" value="${v.doses}" id="input-doses-${v.id}" style="width: 80px; padding: 6px; border: 1px solid var(--line); border-radius: 6px; font-size: 13px;">
              <span>doses</span>
            </div>
          </td>
          <td>
            <button class="btn-secondary-link" style="padding: 4px 10px; font-size: 12px;" onclick="window.mediPulseApp.handleUpdateVaccine('${hospital.id}', '${v.id}')">
              Save
            </button>
          </td>
        </tr>
      `).join('');
    }

    // Render Audit Log
    const auditList = document.getElementById('admin-audit-list');
    if (auditList) {
      auditList.innerHTML = window.dataStore.auditLog.map(log => `
        <li style="padding: 10px 0; border-bottom: 1px solid var(--line); display: flex; justify-content: space-between; font-size: 13px;">
          <div>
            <strong>${log.action}</strong>
            <div style="color: var(--slate); font-size: 12px;">By ${log.user} • ${log.facility}</div>
          </div>
          <span style="color: #8c9794; font-size: 12px;">${log.time}</span>
        </li>
      `).join('');
    }
  }

  /* 11. Duty toggle with row pulse flash and toast notification */
  handleToggleDoctorDuty(hospitalId, doctorId) {
    const updated = window.dataStore.toggleDoctorDuty(hospitalId, doctorId);
    if (!updated) return;

    const row = document.getElementById(`row-doc-${doctorId}`);
    if (row) {
      row.classList.remove('row-pulse-flash');
      void row.offsetWidth; // trigger reflow
      row.classList.add('row-pulse-flash');
    }

    this.showToast(`${updated.name} duty updated to ${updated.onDuty ? 'ON DUTY' : 'OFF DUTY'}! Live portal synchronized.`);
  }

  handleUpdateMedicine(hospitalId, medicineId) {
    const input = document.getElementById(`input-stock-${medicineId}`);
    if (!input) return;
    const updated = window.dataStore.updateMedicineStock(hospitalId, medicineId, input.value);
    if (updated) {
      const row = document.getElementById(`row-med-${medicineId}`);
      if (row) {
        row.classList.remove('row-pulse-flash');
        void row.offsetWidth;
        row.classList.add('row-pulse-flash');
      }
      this.showToast(`Inventory updated: ${updated.name} stock set to ${updated.stock} ${updated.unit}.`);
    }
  }

  handleUpdateVaccine(hospitalId, vaccineId) {
    const input = document.getElementById(`input-doses-${vaccineId}`);
    if (!input) return;
    const updated = window.dataStore.updateVaccineDoses(hospitalId, vaccineId, input.value);
    if (updated) {
      const row = document.getElementById(`row-vac-${vaccineId}`);
      if (row) {
        row.classList.remove('row-pulse-flash');
        void row.offsetWidth;
        row.classList.add('row-pulse-flash');
      }
      this.showToast(`Vaccine updated: ${updated.name} available doses set to ${updated.doses}.`);
    }
  }

  /* Toast Notification with 3s shrinking progress bar */
  showToast(message) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast-message-card';
    toast.innerHTML = `
      <div>${message}</div>
      <div class="toast-progress-bar"></div>
    `;

    container.appendChild(toast);

    // Auto-dismiss after 3s
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.2s';
      setTimeout(() => toast.remove(), 250);
    }, 3000);
  }
}

// Global App Initialization
document.addEventListener('DOMContentLoaded', () => {
  window.mediPulseApp = new MediPulseApp();
});
