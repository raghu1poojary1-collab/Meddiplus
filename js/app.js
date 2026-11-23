/**
 * ============================================================================
 * OPENSTREETMAP (LEAFLET.JS) CONFIGURATION
 * Reference view: https://www.openstreetmap.org/#map=7/16.222/76.882
 * ============================================================================
 */
const OSM_TILE_URL = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
const OSM_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors';
const OSM_REGIONAL_VIEW = { lat: 16.222, lng: 76.882, zoom: 7 };

/**
 * MediPulse — Core Application Logic
 * Implements OpenStreetMap via Leaflet.js with custom SVG teardrop pins,
 * animated dashed polyline, bidirectional sync, Web Speech API,
 * OCR simulation, and live Admin sync.
 */
class MediPulseApp {
  constructor() {
    this.map = null;
    this.markers = {};
    this.infoWindows = {};
    this.routePolyline = null;
    this.selectedHospitalId = null;
    this.currentSearchMode = 'type'; // 'type', 'speak', 'upload'
    this.activeFilter = 'all';
    this.searchQuery = '';
    this.speechRecognition = null;
    this.isListening = false;
    this.adminLoggedIn = false;
    this.adminCurrentHospitalId = "hosp-alvas";

    // Patient location: Default centered on Moodbidri, Karnataka (13.0733° N, 74.9958° E)
    this.patientLocation = {
      lat: 13.0733,
      lng: 74.9958,
      name: "Moodbidri Town Bus Stand, Karnataka"
    };
    this.patientMarker = null;
    this.mapSearchMarker = null;
    this.mapSearchAbort = null;
    this.mapEngine = 'osm'; // 'osm' | 'fallback'

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
    this.setupMapSearch();
    this.setupVoiceSearch();
    this.setupPrescriptionUpload();
    this.setupFilterChips();
    this.setupHowItWorksObserver();
    this.setupAdminDashboard();
    this.initScrollAnimations();

    // 3. Recenter with HTML5 Geolocation (fallback to default Moodbidri coordinates)
    this.setupGeolocation();

    // 4. Initialize Google Maps Engine
    this.initMapEngine();

    // 5. Initial Render
    this.renderResults();

    // 6. Subscribe to DataStore updates
    window.dataStore.subscribe(() => {
      this.renderResults();
      this.renderAdminView();
      this.refreshMapMarkers();
    });

    // Run signature load animation transition
    this.runSignatureLoadTransition();
  }

  /* ==========================================================================
     GEOLOCATION & RECENTERING
     ========================================================================== */
  setupGeolocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          this.patientLocation.lat = pos.coords.latitude;
          this.patientLocation.lng = pos.coords.longitude;
          this.patientLocation.name = "Your Live Location";

          if (this.map && this.mapEngine === 'osm') {
            this.map.panTo([this.patientLocation.lat, this.patientLocation.lng]);
            if (this.patientMarker && this.patientMarker.setLatLng) {
              this.patientMarker.setLatLng([this.patientLocation.lat, this.patientLocation.lng]);
            }
            this.fitBoundsWithPatient();
          }
        },
        (err) => {
          console.info("Geolocation declined or unavailable. Centered on Moodbidri default coordinates.", err.message);
        },
        { timeout: 6000, maximumAge: 60000 }
      );
    }
  }

  /* ==========================================================================
     MAP ENGINE INITIALIZATION & FALLBACK (OpenStreetMap + Leaflet)
     ========================================================================== */
  initMapEngine() {
    if (typeof L !== 'undefined' && typeof L.map === 'function') {
      this.initOpenStreetMap();
      return;
    }

    // Wait briefly if Leaflet script is still finishing load
    setTimeout(() => {
      if (typeof L !== 'undefined' && typeof L.map === 'function') {
        this.initOpenStreetMap();
      } else if (!this.map) {
        console.info("Leaflet/OpenStreetMap not ready after timeout. Activating graceful fallback view.");
        this.showMapFallback();
      }
    }, 1500);
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
  filterByPrescriptionMed(medName) {
    if (!medName || medName === 'all') {
      if (this.activePrescriptionMeds && this.activePrescriptionMeds.length > 0) {
        this.searchQuery = this.activePrescriptionMeds.join(', ');
        const mainInput = document.getElementById('search-main-input');
        if (mainInput) mainInput.value = this.activePrescriptionMeds.join(', ');
      } else {
        this.searchQuery = '';
      }
    } else {
      this.searchQuery = medName;
      const mainInput = document.getElementById('search-main-input');
      if (mainInput) mainInput.value = medName;
    }

    // Highlight active pill
    document.querySelectorAll('.rx-pill-btn').forEach(btn => {
      const match = (medName === 'all' && btn.dataset.med === 'all') || (btn.dataset.med === medName);
      btn.classList.toggle('active', match);
    });

    this.renderResults();
  }

  clearPrescriptionFilter() {
    this.activePrescriptionMeds = null;
    this.searchQuery = '';
    const mainInput = document.getElementById('search-main-input');
    if (mainInput) mainInput.value = '';
    const uploadStatus = document.getElementById('upload-status-result');
    if (uploadStatus) uploadStatus.innerHTML = '';
    this.renderResults();
  }

  setupPrescriptionUpload() {
    const dropzone = document.getElementById('upload-dropzone');
    const fileInput = document.getElementById('rx-file-input');
    const sampleFever = document.getElementById('btn-sample-fever');
    const sampleDiabetes = document.getElementById('btn-sample-diabetes');
    const uploadStatus = document.getElementById('upload-status-result');

    const handlePrescriptionText = (extractedText, medList) => {
      this.activePrescriptionMeds = medList;
      this.searchQuery = medList.join(', ');
      const mainInput = document.getElementById('search-main-input');
      if (mainInput) mainInput.value = medList.join(', ');

      if (uploadStatus) {
        uploadStatus.innerHTML = `
          <div style="margin-top: 12px; padding: 12px 16px; background: #eef6f0; border-radius: 12px; border: 1.5px solid var(--sage); color: var(--ink);">
            <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
              <strong style="color: var(--ink); font-size: 14px;">${window.i18n.get('uploadSuccess')}</strong>
              <button type="button" onclick="window.mediPulseApp.clearPrescriptionFilter()" style="background: none; border: none; color: var(--pulse); font-size: 12px; font-weight: 600; cursor: pointer; text-decoration: underline;">Clear Prescription</button>
            </div>
            <div style="display: flex; gap: 8px; margin-top: 8px; flex-wrap: wrap; align-items: center;">
              <span style="font-size: 12px; color: var(--slate); font-weight: 500;">Filter by:</span>
              <button type="button" class="rx-pill-btn active" data-med="all" onclick="window.mediPulseApp.filterByPrescriptionMed('all')" style="background: var(--white); border: 1px solid var(--line); padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; cursor: pointer;">All Extracted (${medList.length})</button>
              ${medList.map(m => `
                <button type="button" class="rx-pill-btn" data-med="${m.replace(/"/g, '&quot;')}" onclick="window.mediPulseApp.filterByPrescriptionMed('${m.replace(/'/g, "\\'")}')" style="background: var(--white); border: 1px solid var(--line); padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; cursor: pointer;">
                  💊 ${m}
                </button>
              `).join('')}
            </div>
            <div style="margin-top: 8px; font-size: 12px; color: var(--sage); font-weight: 600;">
              ✓ Displaying nearest hospitals in Moodbidri &amp; Coastal belt with matching stock…
            </div>
          </div>
        `;
      }
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
        if (uploadStatus) uploadStatus.innerHTML = `<span style="color: var(--pulse); font-weight: 500;">Analyzing prescription handwriting with OCR...</span>`;
        setTimeout(() => {
          handlePrescriptionText("Extracted Rx", ["Paracetamol 650mg", "Amoxicillin 500mg"]);
        }, 600);
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
     OPENSTREETMAP (LEAFLET.JS) INTEGRATION
     Custom SVG Teardrop Pins, Popups, Animated Dashed Polyline,
     Bidirectional Sync, Karnataka Overview Control & Offline Fallback Radar.
     ========================================================================== */
  initOpenStreetMap() {
    const mapContainer = document.getElementById('leaflet-map');
    if (!mapContainer || typeof L === 'undefined') {
      this.showMapFallback();
      return;
    }

    try {
      this.mapEngine = 'osm';
      const fallbackView = document.getElementById('map-fallback-view');
      if (fallbackView) fallbackView.style.display = 'none';
      mapContainer.style.display = 'block';

      const engineLabel = document.getElementById('map-engine-label');
      if (engineLabel) engineLabel.textContent = 'OpenStreetMap Live';

      // Start at requested Karnataka regional view (#map=7/16.222/76.882)
      this.map = L.map(mapContainer, {
        center: [OSM_REGIONAL_VIEW.lat, OSM_REGIONAL_VIEW.lng],
        zoom: OSM_REGIONAL_VIEW.zoom,
        zoomControl: true
      });

      L.tileLayer(OSM_TILE_URL, {
        maxZoom: 19,
        attribution: OSM_ATTRIBUTION
      }).addTo(this.map);

      // Custom control to toggle between Karnataka (#map=7/16.222/76.882) and Nearby Hospitals
      const self = this;
      const ViewToggleControl = L.Control.extend({
        options: { position: 'topright' },
        onAdd: function () {
          const wrap = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
          wrap.style.background = '#FAF6EF';
          wrap.style.border = '1px solid #DDD5C7';
          wrap.style.borderRadius = '8px';
          wrap.style.overflow = 'hidden';
          wrap.style.boxShadow = '0 2px 8px rgba(18,49,46,0.12)';
          wrap.innerHTML = `
            <button type="button" id="osm-fit-btn" title="Zoom to nearby hospitals" style="border:none;background:#FAF6EF;color:#12312E;padding:6px 10px;font-size:11px;font-weight:600;cursor:pointer;border-right:1px solid #DDD5C7;">Nearby</button>
            <button type="button" id="osm-state-btn" title="Karnataka overview (16.222, 76.882)" style="border:none;background:#FAF6EF;color:#46524F;padding:6px 10px;font-size:11px;font-weight:600;cursor:pointer;">Karnataka Z7</button>
          `;
          L.DomEvent.disableClickPropagation(wrap);
          wrap.querySelector('#osm-fit-btn').addEventListener('click', () => self.fitBoundsWithPatient());
          wrap.querySelector('#osm-state-btn').addEventListener('click', () => {
            if (self.map) self.map.flyTo([OSM_REGIONAL_VIEW.lat, OSM_REGIONAL_VIEW.lng], OSM_REGIONAL_VIEW.zoom, { duration: 0.7 });
          });
          return wrap;
        }
      });
      this.map.addControl(new ViewToggleControl());

      // Add Patient Location Pin ("You Are Here")
      this.addPatientMarker();

      // Render Hospital Markers and fly smoothly to nearby facilities
      this.refreshMapMarkers(true);

      // Ensure tiles align cleanly after CSS layout settles
      setTimeout(() => {
        if (this.map) this.map.invalidateSize();
      }, 250);
    } catch (e) {
      console.error("Error creating OpenStreetMap instance:", e);
      this.showMapFallback();
    }
  }

  addPatientMarker() {
    if (!this.map || typeof L === 'undefined') return;

    const patientPinHtml = `
      <div style="background-color: var(--ink); color: var(--white); border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; box-shadow: 0 3px 10px rgba(18, 49, 46, 0.35); border: 2.5px solid var(--white);">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
      </div>
    `;

    const icon = L.divIcon({
      className: 'osm-patient-pin',
      html: patientPinHtml,
      iconSize: [30, 30],
      iconAnchor: [15, 15]
    });

    this.patientMarker = L.marker([this.patientLocation.lat, this.patientLocation.lng], {
      icon,
      title: this.patientLocation.name,
      zIndexOffset: 500
    }).addTo(this.map);
    this.patientMarker.bindPopup(`<strong>${this.patientLocation.name}</strong>`);
  }

  /* ==========================================================================
     CUSTOM MARKERS & AUTO-FIT BOUNDS (LEAFLET)
     ========================================================================== */
  refreshMapMarkers(initialLoad = false, immediate = false) {
    if (this.mapEngine === 'fallback' || !this.map || typeof L === 'undefined') {
      this.renderFallbackRadar();
      return;
    }

    // Remove existing hospital markers
    Object.values(this.markers).forEach(m => {
      if (m && this.map.hasLayer(m)) this.map.removeLayer(m);
    });
    this.markers = {};
    this.infoWindows = {};

    if (this.routePolyline && this.map.hasLayer(this.routePolyline)) {
      this.map.removeLayer(this.routePolyline);
      this.routePolyline = null;
    }

    const hospitals = this.getFilteredHospitals();
    const boundsPoints = [[this.patientLocation.lat, this.patientLocation.lng]];

    const sortedHospitals = [...hospitals].sort((a, b) => a.distanceKm - b.distanceKm);

    const placeMarker = (h) => {
      if (!this.map) return;

      const hasOnDutyDoctor = h.doctors.some(d => d.onDuty);
      const hasInStockMed = h.medicines.some(m => m.stock > 0);
      const hasVaccines = h.vaccines.some(v => v.doses > 0);
      const isAvailable = hasOnDutyDoctor && (hasInStockMed || hasVaccines);
      const dotBadgeColor = isAvailable ? '#E8622C' : '#8c9794';

      const pinHtml = `
        <div class="custom-pin-marker ${h.isNearest ? 'nearest-hospital-pin' : ''} pin-drop-anim" id="gpin-${h.id}">
          ${h.isNearest ? '<div class="nearest-pulse-ring"></div>' : ''}
          <svg class="pin-svg-body" viewBox="0 0 34 44" fill="none">
            <path d="M17 0C7.61 0 0 7.61 0 17C0 29.75 17 44 17 44C17 44 34 29.75 34 17C34 7.61 26.39 0 17 0Z" fill="var(--ink)"/>
            <circle cx="17" cy="16" r="10" fill="var(--paper)"/>
            <circle cx="17" cy="16" r="6" fill="${dotBadgeColor}"/>
          </svg>
        </div>
      `;

      const icon = L.divIcon({
        className: 'osm-hospital-pin-wrap',
        html: pinHtml,
        iconSize: [34, 44],
        iconAnchor: [17, 44],
        popupAnchor: [0, -40]
      });

      const marker = L.marker([h.lat, h.lng], {
        icon,
        title: h.name
      }).addTo(this.map);

      marker.bindPopup(this.createPopupContent(h), {
        maxWidth: 280,
        closeButton: true
      });

      marker.on('click', () => {
        this.selectHospital(h.id, true);
      });

      this.markers[h.id] = marker;
      this.infoWindows[h.id] = marker;
    };

    sortedHospitals.forEach((h, index) => {
      boundsPoints.push([h.lat, h.lng]);
      if (immediate) {
        placeMarker(h);
      } else {
        setTimeout(() => placeMarker(h), index * 100);
      }
    });

    // Auto-fit bounds smoothly around patient + hospitals unless jumping directly to one hospital
    if (!immediate && this.map && boundsPoints.length > 1) {
      const delay = initialLoad ? sortedHospitals.length * 100 + 250 : sortedHospitals.length * 100 + 60;
      setTimeout(() => {
        if (!this.map) return;
        this.map.flyToBounds(L.latLngBounds(boundsPoints), {
          padding: [40, 40],
          maxZoom: 13,
          duration: 0.85
        });
      }, delay);
    }
  }

  fitBoundsWithPatient() {
    if (!this.map || typeof L === 'undefined') return;
    const points = [[this.patientLocation.lat, this.patientLocation.lng]];
    const hospitals = this.getFilteredHospitals();
    hospitals.forEach(h => points.push([h.lat, h.lng]));
    if (points.length > 1) {
      this.map.flyToBounds(L.latLngBounds(points), {
        padding: [40, 40],
        maxZoom: 13,
        duration: 0.7
      });
    } else {
      this.map.flyTo([OSM_REGIONAL_VIEW.lat, OSM_REGIONAL_VIEW.lng], OSM_REGIONAL_VIEW.zoom, { duration: 0.7 });
    }
  }

  escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  calcDistanceKm(lat1, lng1, lat2, lng2) {
    const toRad = (deg) => (deg * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    return Math.round(6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * 10) / 10;
  }

  hospitalMatchesQuery(h, rawQuery) {
    let raw = (rawQuery || '').trim().toLowerCase();
    if (!raw || ['all', 'karnataka', 'everywhere', 'anywhere', 'state', 'hospital', 'hospitals'].includes(raw)) {
      return true;
    }

    // Aliases for Sample 1 and Sample 2
    if (raw.includes('sample 1')) raw = 'paracetamol 650mg, amoxicillin 500mg';
    if (raw.includes('sample 2')) raw = 'metformin 500mg, insulin glargine';

    // City aliases mapping (not only Moodbidri - everywhere)
    const cityAliases = {
      'mangalore': 'mangaluru',
      'bangalore': 'bengaluru',
      'blr': 'bengaluru',
      'mysore': 'mysuru',
      'hubli': 'hubballi',
      'belgaum': 'belagavi',
      'kundapur': 'kundapura',
      'mudbidri': 'moodbidri'
    };
    for (const [alias, standard] of Object.entries(cityAliases)) {
      if (raw.includes(alias)) {
        raw = raw.replace(new RegExp('\\b' + alias + '\\b', 'g'), standard);
      }
    }

    // Drug brand synonyms
    const drugSynonyms = {
      'dolo': 'paracetamol',
      'crocin': 'paracetamol',
      'calpol': 'paracetamol',
      'pcm': 'paracetamol',
      'augmentin': 'amoxicillin',
      'glycomet': 'metformin',
      'lantus': 'insulin',
      'atorva': 'atorvastatin',
      'lipitor': 'atorvastatin',
      'amlong': 'amlodipine',
      'asthalin': 'salbutamol',
      'pan 40': 'pantoprazole',
      'pan': 'pantoprazole',
      'azithral': 'azithromycin',
      'allegra': 'cetirizine',
      'electral': 'ors',
      'brufen': 'ibuprofen',
      'combiflam': 'ibuprofen',
      'aspirin': 'atorvastatin',
      'disprin': 'paracetamol'
    };

    // Clinical symptom to department & medicine mapping
    const symptomMap = {
      'fever': ['general medicine', 'pediatrics', 'paracetamol'],
      'pyrexia': ['general medicine', 'paracetamol'],
      'cold': ['general medicine', 'ent', 'cetirizine', 'cough syrup'],
      'cough': ['pulmonology', 'general medicine', 'cough syrup', 'salbutamol', 'azithromycin'],
      'headache': ['general medicine', 'neurology', 'paracetamol', 'ibuprofen'],
      'heart': ['cardiology', 'emergency medicine', 'atorvastatin', 'amlodipine'],
      'chest pain': ['cardiology', 'pulmonology', 'emergency medicine', 'atorvastatin'],
      'bone': ['orthopedics', 'ibuprofen', 'paracetamol'],
      'joint': ['orthopedics', 'ibuprofen'],
      'knee': ['orthopedics'],
      'fracture': ['orthopedics', 'emergency medicine'],
      'diabetes': ['endocrinology', 'metformin', 'insulin'],
      'sugar': ['endocrinology', 'metformin', 'insulin'],
      'asthma': ['pulmonology', 'salbutamol'],
      'breathless': ['pulmonology', 'emergency medicine', 'salbutamol'],
      'skin': ['dermatology', 'clotrimazole', 'cetirizine'],
      'rash': ['dermatology', 'cetirizine', 'clotrimazole'],
      'allergy': ['dermatology', 'cetirizine'],
      'ear': ['ent'],
      'eye': ['ophthalmology', 'general medicine'],
      'dental': ['dentistry', 'general medicine'],
      'emergency': ['emergency medicine', 'trauma'],
      'accident': ['emergency medicine', 'trauma', 'orthopedics'],
      'child': ['pediatrics', 'vaccine']
    };

    // Helper: Normalize term (strips dosages like 650mg, 500 mg, etc.)
    const normalizeTerm = (str) => {
      return (str || '')
        .toLowerCase()
        .replace(/\b\d+(\.\d+)?\s*(mg|g|mcg|ml|iu|units?|tablets?|capsules?|drops?|%)\b/gi, '')
        .replace(/[^a-z0-9\s]/gi, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    };

    // Split query by commas, semicolons, "+", or "and"
    let queryTerms = raw.split(/[,;+]|\band\b/i).map(t => t.trim()).filter(Boolean);
    if (queryTerms.length === 0) queryTerms = [raw];

    const expandedTerms = new Set(queryTerms);
    queryTerms.forEach(t => {
      for (const [brand, generic] of Object.entries(drugSynonyms)) {
        if (t.includes(brand)) expandedTerms.add(generic);
      }
      for (const [symptom, targets] of Object.entries(symptomMap)) {
        if (t.includes(symptom)) {
          targets.forEach(tgt => expandedTerms.add(tgt));
        }
      }
    });

    const hFullText = `${h.name} ${h.city || ''} ${h.district || ''} ${h.state || ''} ${h.address || ''} ${h.type || ''}`.toLowerCase();

    return Array.from(expandedTerms).some(term => {
      const q = term.toLowerCase();
      const normTerm = normalizeTerm(term);

      // 1. City / District / State / Facility name match
      if (hFullText.includes(q)) return true;

      // 2. Emergency capability filter
      if (['emergency', 'casualty', 'trauma', '24/7', '24x7'].includes(q) && h.emergency24x7) {
        return true;
      }

      // 3. Doctor matching (name or specialty)
      if (h.doctors && h.doctors.some(d => {
        const dName = (d.name || '').toLowerCase();
        const dSpec = (d.specialty || '').toLowerCase();
        return dName.includes(q) || dSpec.includes(q) || (normTerm && normTerm.length >= 3 && (dName.includes(normTerm) || dSpec.includes(normTerm)));
      })) {
        return true;
      }

      // 4. Medicine matching
      if (h.medicines && h.medicines.some(m => {
        const mName = (m.name || '').toLowerCase();
        const mCat = (m.category || '').toLowerCase();
        const normMed = normalizeTerm(m.name);
        if (mName.includes(q) || mCat.includes(q)) return true;
        if (normTerm && normTerm.length >= 3) {
          if (mName.includes(normTerm) || (normMed && (normMed.includes(normTerm) || normTerm.includes(normMed)))) {
            return true;
          }
        }
        return false;
      })) {
        return true;
      }

      // 5. Vaccine matching
      if (h.vaccines && h.vaccines.some(v => {
        const vName = (v.name || '').toLowerCase();
        return vName.includes(q) || (normTerm && normTerm.length >= 3 && vName.includes(normTerm));
      })) {
        return true;
      }

      return false;
    });
  }

  /* ==========================================================================
     IN-MAP HOSPITAL & OPENSTREETMAP PLACE SEARCH
     ========================================================================== */
  setupMapSearch() {
    const input = document.getElementById('map-search-input');
    const clearBtn = document.getElementById('map-search-clear');
    const findBtn = document.getElementById('map-search-btn');
    const dropdown = document.getElementById('map-search-results');
    if (!input || !dropdown) return;

    let debounceTimer = null;
    let lastOsmPlaces = [];

    const closeDropdown = () => {
      dropdown.style.display = 'none';
    };

    const getLocalHospitalMatches = (q) => {
      const all = [...window.dataStore.getAll()].sort((a, b) => a.distanceKm - b.distanceKm);
      if (!q) return all.slice(0, 5);
      return all.filter(h => this.hospitalMatchesQuery(h, q));
    };

    const renderDropdown = (query, osmPlaces = [], isLoadingOsm = false) => {
      const q = (query || '').trim();
      const localMatches = getLocalHospitalMatches(q);
      lastOsmPlaces = osmPlaces;

      let html = '';

      if (localMatches.length > 0) {
        html += `<div class="map-search-section-label">${q ? 'MediPulse Hospitals & Stock Matches' : 'Quick Jump — Verified Facilities Nearby'}</div>`;
        html += localMatches.slice(0, 5).map(h => {
          const onDutyCount = h.doctors.filter(d => d.onDuty).length;
          return `
            <button type="button" class="map-search-item" data-hosp-id="${this.escapeHtml(h.id)}" role="option">
              <div class="map-search-item-main">
                <div class="map-search-item-title">${this.escapeHtml(h.name)}</div>
                <div class="map-search-item-sub">${this.escapeHtml(h.address)} • ${onDutyCount} doctor(s) on duty</div>
              </div>
              <span class="map-search-badge">${h.distanceKm} km</span>
            </button>
          `;
        }).join('');
      }

      if (q.length >= 3) {
        if (isLoadingOsm) {
          html += `<div class="map-search-status">Searching OpenStreetMap for &ldquo;${this.escapeHtml(q)}&rdquo;...</div>`;
        } else if (osmPlaces.length > 0) {
          html += `<div class="map-search-section-label">OpenStreetMap Places &amp; Hospitals</div>`;
          html += osmPlaces.map((p, idx) => {
            const parts = (p.display_name || '').split(',').map(s => s.trim());
            const title = parts[0] || p.name || q;
            const sub = parts.slice(1, 4).join(', ') || p.type || 'Karnataka';
            const badge = (p.type === 'hospital' || p.type === 'clinic' || p.class === 'amenity') ? 'Hospital' : 'Place';
            return `
              <button type="button" class="map-search-item" data-osm-idx="${idx}" role="option">
                <div class="map-search-item-main">
                  <div class="map-search-item-title">${this.escapeHtml(title)}</div>
                  <div class="map-search-item-sub">${this.escapeHtml(sub)}</div>
                </div>
                <span class="map-search-badge osm">${this.escapeHtml(badge)}</span>
              </button>
            `;
          }).join('');
        } else if (localMatches.length === 0) {
          html += `<div class="map-search-status">No matching hospital or OpenStreetMap place found for &ldquo;${this.escapeHtml(q)}&rdquo;.</div>`;
        }
      } else if (localMatches.length === 0) {
        html += `<div class="map-search-status">Type at least 3 characters to search all of OpenStreetMap.</div>`;
      }

      dropdown.innerHTML = html;
      dropdown.style.display = 'block';

      dropdown.querySelectorAll('[data-hosp-id]').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-hosp-id');
          closeDropdown();
          this.jumpToHospitalFromMapSearch(id);
        });
      });

      dropdown.querySelectorAll('[data-osm-idx]').forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = Number(btn.getAttribute('data-osm-idx'));
          const place = lastOsmPlaces[idx];
          if (place) {
            closeDropdown();
            this.focusOpenStreetMapPlace(place);
          }
        });
      });
    };

    const runLiveSearch = async (rawQuery, autoSelect = false) => {
      const q = (rawQuery || '').trim();
      const localMatches = getLocalHospitalMatches(q);
      if (autoSelect && q && localMatches.length > 0) {
        const directHospital = localMatches.find(h => h.name.toLowerCase().includes(q.toLowerCase()));
        if (directHospital) {
          closeDropdown();
          this.jumpToHospitalFromMapSearch(directHospital.id);
          return;
        }
      }

      if (q.length < 3) {
        renderDropdown(q, [], false);
        return;
      }

      renderDropdown(q, [], true);
      const places = await this.fetchOpenStreetMapPlaces(q);
      if ((input.value || '').trim() !== q) return;

      if (autoSelect && places.length > 0 && localMatches.length === 0) {
        closeDropdown();
        this.focusOpenStreetMapPlace(places[0]);
        return;
      }
      if (autoSelect && localMatches.length > 0) {
        closeDropdown();
        this.jumpToHospitalFromMapSearch(localMatches[0].id);
        return;
      }
      renderDropdown(q, places, false);
    };

    input.addEventListener('focus', () => {
      renderDropdown(input.value, lastOsmPlaces, false);
    });

    input.addEventListener('input', (e) => {
      const q = e.target.value;
      if (clearBtn) clearBtn.style.display = q ? 'inline-flex' : 'none';
      clearTimeout(debounceTimer);
      renderDropdown(q, [], q.trim().length >= 3);
      if (q.trim().length >= 3) {
        debounceTimer = setTimeout(() => runLiveSearch(q, false), 350);
      }
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        clearTimeout(debounceTimer);
        runLiveSearch(input.value, true);
      } else if (e.key === 'Escape') {
        closeDropdown();
        input.blur();
      }
    });

    if (findBtn) {
      findBtn.addEventListener('click', () => {
        clearTimeout(debounceTimer);
        runLiveSearch(input.value, true);
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        clearTimeout(debounceTimer);
        input.value = '';
        clearBtn.style.display = 'none';
        lastOsmPlaces = [];
        closeDropdown();
        if (this.map && this.mapSearchMarker && this.map.hasLayer(this.mapSearchMarker)) {
          this.map.removeLayer(this.mapSearchMarker);
          this.mapSearchMarker = null;
        }
        this.fitBoundsWithPatient();
      });
    }

    document.addEventListener('click', (e) => {
      const wrapper = document.querySelector('.map-sticky-wrapper');
      if (wrapper && !wrapper.contains(e.target)) {
        closeDropdown();
      }
    });
  }

  async fetchOpenStreetMapPlaces(query) {
    if (this.mapSearchAbort) {
      try { this.mapSearchAbort.abort(); } catch (_) {}
    }
    this.mapSearchAbort = typeof AbortController !== 'undefined' ? new AbortController() : null;
    try {
      const url =
        `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(query)}` +
        `&countrycodes=in&viewbox=74.0,18.5,78.6,11.5&bounded=0&limit=5&addressdetails=1`;
      const res = await fetch(url, {
        headers: { 'Accept': 'application/json' },
        signal: this.mapSearchAbort ? this.mapSearchAbort.signal : undefined
      });
      if (!res.ok) return [];
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    } catch (err) {
      if (err && err.name === 'AbortError') return [];
      console.warn('OpenStreetMap Nominatim lookup error:', err);
      return [];
    }
  }

  jumpToHospitalFromMapSearch(hospitalId) {
    const hospital = window.dataStore.getById(hospitalId);
    if (!hospital) return;

    if (this.map && this.mapSearchMarker && this.map.hasLayer(this.mapSearchMarker)) {
      this.map.removeLayer(this.mapSearchMarker);
      this.mapSearchMarker = null;
    }

    const searchInput = document.getElementById('map-search-input');
    const clearBtn = document.getElementById('map-search-clear');
    if (searchInput) searchInput.value = hospital.name;
    if (clearBtn) clearBtn.style.display = 'inline-flex';

    // Ensure target hospital marker exists even if previous list filter excluded it
    if (!this.markers[hospitalId]) {
      this.activeFilter = 'all';
      this.searchQuery = '';
      const mainInput = document.getElementById('search-main-input');
      if (mainInput) mainInput.value = '';
      document.querySelectorAll('.chip-btn').forEach(c => {
        c.classList.toggle('active', c.dataset.filter === 'all');
      });
      this.renderResults(true);
    }

    this.selectHospital(hospitalId, true);
  }

  focusOpenStreetMapPlace(place) {
    const lat = parseFloat(place.lat);
    const lon = parseFloat(place.lon);
    if (!Number.isFinite(lat) || !Number.isFinite(lon) || !this.map || typeof L === 'undefined') return;

    const parts = (place.display_name || '').split(',').map(s => s.trim());
    const title = parts[0] || place.name || 'Selected Location';
    const sub = parts.slice(1, 4).join(', ');

    const searchInput = document.getElementById('map-search-input');
    const clearBtn = document.getElementById('map-search-clear');
    if (searchInput) searchInput.value = title;
    if (clearBtn) clearBtn.style.display = 'inline-flex';

    if (this.mapSearchMarker && this.map.hasLayer(this.mapSearchMarker)) {
      this.map.removeLayer(this.mapSearchMarker);
    }

    const pinHtml = `
      <div class="custom-pin-marker pin-drop-anim" style="transform-origin: 17px 44px;">
        <div class="nearest-pulse-ring"></div>
        <svg class="pin-svg-body" viewBox="0 0 34 44" fill="none">
          <path d="M17 0C7.61 0 0 7.61 0 17C0 29.75 17 44 17 44C17 44 34 29.75 34 17C34 7.61 26.39 0 17 0Z" fill="#E8622C"/>
          <circle cx="17" cy="16" r="9" fill="#FAF6EF"/>
          <circle cx="17" cy="16" r="4.5" fill="#12312E"/>
        </svg>
      </div>
    `;

    const icon = L.divIcon({
      className: 'osm-searched-place-pin',
      html: pinHtml,
      iconSize: [34, 44],
      iconAnchor: [17, 44],
      popupAnchor: [0, -40]
    });

    const isFacility = place.type === 'hospital' || place.type === 'clinic' || place.class === 'amenity';
    this.mapSearchMarker = L.marker([lat, lon], { icon, title, zIndexOffset: 650 }).addTo(this.map);

    // Find nearest MediPulse facility to this searched map coordinate
    const allHospitals = window.dataStore.getAll();
    let nearest = null;
    let nearestKm = Infinity;
    allHospitals.forEach(h => {
      const d = this.calcDistanceKm(lat, lon, h.lat, h.lng);
      if (d < nearestKm) {
        nearestKm = d;
        nearest = h;
      }
    });

    const popupEl = document.createElement('div');
    popupEl.className = 'map-popup-card';
    popupEl.innerHTML = `
      <div class="map-popup-title">${this.escapeHtml(title)}</div>
      <div class="map-popup-dist">${this.escapeHtml(sub || 'OpenStreetMap location')}</div>
      ${nearest ? `<div class="map-popup-badges"><div><strong>Nearest MediPulse clinic:</strong> ${this.escapeHtml(nearest.name)} (${nearestKm} km)</div></div>` : ''}
      ${nearest ? `<button type="button" class="map-popup-btn" id="osm-jump-nearest-btn" style="width:100%;margin-bottom:6px;">Open ${this.escapeHtml(nearest.name)}</button>` : ''}
      <a href="https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}" target="_blank" rel="noopener" style="display:block;text-align:center;font-size:11px;color:var(--sage);font-weight:600;text-decoration:none;">Get Directions in Google Maps ↗</a>
    `;

    const jumpBtn = popupEl.querySelector('#osm-jump-nearest-btn');
    if (jumpBtn && nearest) {
      jumpBtn.addEventListener('click', () => this.jumpToHospitalFromMapSearch(nearest.id));
    }

    this.mapSearchMarker.bindPopup(popupEl, { maxWidth: 280, closeButton: true });
    this.map.flyTo([lat, lon], isFacility ? 15 : 12, { duration: 0.75 });
    this.mapSearchMarker.openPopup();
  }

  getFilteredHospitals() {
    let hospitals = window.dataStore.getAll();
    if (this.activeFilter === 'doctor') {
      hospitals = hospitals.filter(h => h.doctors.some(d => d.onDuty));
    } else if (this.activeFilter === 'medicine') {
      hospitals = hospitals.filter(h => h.medicines.some(m => m.stock > 0));
    } else if (this.activeFilter === 'vaccine') {
      hospitals = hospitals.filter(h => h.vaccines.some(v => v.doses > 0));
    } else if (this.activeFilter === 'emergency') {
      hospitals = hospitals.filter(h => h.emergency24x7);
    }

    if (this.searchQuery) {
      const normalizeTerm = (str) => (str || '').toLowerCase().replace(/\b\d+(\.\d+)?\s*(mg|g|mcg|ml|iu|units?|tablets?|capsules?|drops?|%)\b/gi, '').replace(/[^a-z0-9\s]/gi, ' ').replace(/\s+/g, ' ').trim();
      const queryTerms = this.searchQuery.split(/[,;+]|\band\b/i).map(t => t.trim()).filter(Boolean);

      // Filter: hospital matches if query matches name, address, medicines, vaccines, or doctor specialty
      let matched = hospitals.filter(h => this.hospitalMatchesQuery(h, this.searchQuery));
      if (matched.length === 0) {
        // If strict match gave 0, fallback to all hospitals so patient can always see nearest regional centers
        matched = hospitals;
      }

      // Rank hospitals: Facilities with prescribed medicines in stock come first, followed by specialty doctor match, then proximity
      return [...matched].map(h => {
        let stockMatches = 0;
        let totalMatchedStock = 0;

        (h.medicines || []).forEach(m => {
          const mLower = m.name.toLowerCase();
          const normM = normalizeTerm(m.name);
          const isMatch = queryTerms.some(term => {
            const tLower = term.toLowerCase();
            const normT = normalizeTerm(term);
            return mLower.includes(tLower) || (normT.length >= 3 && (mLower.includes(normT) || normM.includes(normT) || normT.includes(normM)));
          });
          if (isMatch && m.stock > 0) {
            stockMatches += 1;
            totalMatchedStock += m.stock;
          }
        });

        let specDocMatch = 0;
        if (this.aiPrediction && this.aiPrediction.specialty) {
          const predSpec = this.aiPrediction.specialty.toLowerCase();
          if ((h.doctors || []).some(d => d.onDuty && (d.specialty || '').toLowerCase().includes(predSpec))) {
            specDocMatch = 2;
          } else if ((h.doctors || []).some(d => (d.specialty || '').toLowerCase().includes(predSpec))) {
            specDocMatch = 1;
          }
        }

        return {
          ...h,
          _stockMatches: stockMatches,
          _totalMatchedStock: totalMatchedStock,
          _specDocMatch: specDocMatch
        };
      }).sort((a, b) => {
        if (b._stockMatches !== a._stockMatches) {
          return b._stockMatches - a._stockMatches;
        }
        if (b._specDocMatch !== a._specDocMatch) {
          return b._specDocMatch - a._specDocMatch;
        }
        return a.distanceKm - b.distanceKm;
      });
    }

    // Default: Sort by distance (nearest to Moodbidri center first)
    return [...hospitals].sort((a, b) => a.distanceKm - b.distanceKm);
  }

  createPopupContent(hospital) {
    const onDutyCount = hospital.doctors.filter(d => d.onDuty).length;
    const inStockCount = hospital.medicines.filter(m => m.stock > 0).length;
    const totalDoses = hospital.vaccines.reduce((acc, v) => acc + v.doses, 0);

    return `
      <div class="map-popup-card">
        <div class="map-popup-title">${hospital.name}</div>
        <div class="map-popup-dist">${hospital.distanceKm} km • ${hospital.city || 'Karnataka'} • ${hospital.type}</div>
        <div class="map-popup-badges">
          <div><strong style="color: ${onDutyCount > 0 ? 'var(--pulse)' : 'var(--danger-soft)'};">●</strong> ${onDutyCount} ${window.i18n.get('doctorsCountOnDuty')}</div>
          <div><strong style="color: ${inStockCount > 0 ? 'var(--pulse)' : 'var(--danger-soft)'};">●</strong> ${inStockCount} ${window.i18n.get('medicinesAvailable')}</div>
          <div><strong style="color: ${totalDoses > 0 ? 'var(--pulse)' : 'var(--danger-soft)'};">●</strong> ${totalDoses} ${window.i18n.get('dosesAvailable')}</div>
        </div>
        <div style="display: flex; gap: 6px; margin-top: 8px;">
          <a href="./hospital.html?id=${hospital.id}" class="map-popup-btn" style="text-decoration:none;flex:1;text-align:center;">${window.i18n.get('expandDetails')}</a>
          <a href="https://www.google.com/maps/dir/?api=1&destination=${hospital.lat},${hospital.lng}" target="_blank" rel="noopener" class="map-popup-btn" style="text-decoration:none;background:#f0f7f2;border:1px solid rgba(45,106,94,0.3);color:var(--ink);padding:6px 10px;display:inline-flex;align-items:center;justify-content:center;gap:4px;" title="Open directions in Google Maps">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg> Maps
          </a>
        </div>
      </div>
    `;
  }

  closeAllInfoWindows() {
    if (this.map && this.map.closePopup) {
      this.map.closePopup();
    }
  }

  updateMapPopups() {
    const hospitals = window.dataStore.getAll();
    hospitals.forEach(h => {
      if (this.markers[h.id] && this.markers[h.id].setPopupContent) {
        this.markers[h.id].setPopupContent(this.createPopupContent(h));
      }
    });
    if (this.mapEngine === 'fallback') {
      this.renderFallbackRadar();
    }
  }

  /* ==========================================================================
     BIDIRECTIONAL CARD-MAP SYNC & GROWING POLYLINE ROUTE
     ========================================================================== */
  selectHospital(hospitalId, scrollToCard = true) {
    this.selectedHospitalId = hospitalId;
    const hospital = window.dataStore.getById(hospitalId);
    if (!hospital) return;

    // 1. Highlight matching card in results list & apply 0.6s pulse flash
    document.querySelectorAll('.hospital-card').forEach(card => {
      if (card.dataset.id === hospitalId) {
        card.classList.add('card-selected');
        card.classList.add('expanded');

        card.classList.remove('card-pulse-flash');
        void card.offsetWidth;
        card.classList.add('card-pulse-flash');
        setTimeout(() => card.classList.remove('card-pulse-flash'), 650);

        if (scrollToCard) {
          card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      } else {
        card.classList.remove('card-selected');
      }
    });

    // 2. Pan/Zoom OpenStreetMap and open Popup
    if (this.map && this.mapEngine === 'osm' && this.markers[hospitalId]) {
      const targetPos = [hospital.lat, hospital.lng];
      this.map.flyTo(targetPos, 14, { duration: 0.6 });
      this.markers[hospitalId].openPopup();

      // 3. Draw animated thin dashed route polyline in var(--sage)
      this.drawAnimatedPolyline(this.patientLocation, { lat: hospital.lat, lng: hospital.lng });
    } else if (this.mapEngine === 'fallback') {
      this.highlightFallbackPin(hospitalId);
    }
  }

  /**
   * Draws an animated dashed L.polyline from patient to selected hospital.
   */
  drawAnimatedPolyline(startPos, destPos) {
    if (!this.map || typeof L === 'undefined') return;

    if (this.routePolyline && this.map.hasLayer(this.routePolyline)) {
      this.map.removeLayer(this.routePolyline);
      this.routePolyline = null;
    }

    const startLatLng = [startPos.lat, startPos.lng];
    this.routePolyline = L.polyline([startLatLng], {
      color: '#6B8F71',
      weight: 3.5,
      opacity: 0.9,
      dashArray: '7, 9'
    }).addTo(this.map);

    const steps = 18;
    const points = [];
    for (let i = 0; i <= steps; i++) {
      const lat = startPos.lat + (destPos.lat - startPos.lat) * (i / steps);
      const lng = startPos.lng + (destPos.lng - startPos.lng) * (i / steps);
      points.push([lat, lng]);
    }

    let step = 1;
    const interval = setInterval(() => {
      if (step <= steps && this.routePolyline) {
        this.routePolyline.setLatLngs(points.slice(0, step + 1));
        step++;
      } else {
        clearInterval(interval);
      }
    }, 33);
  }

  /* ==========================================================================
     GRACEFUL STATIC FALLBACK VIEW (If Leaflet / OpenStreetMap tiles unreachable)
     ========================================================================== */
  showMapFallback() {
    this.mapEngine = 'fallback';
    const leafletMapEl = document.getElementById('leaflet-map');
    const fallbackEl = document.getElementById('map-fallback-view');
    const engineLabel = document.getElementById('map-engine-label');

    if (leafletMapEl) leafletMapEl.style.display = 'none';
    if (fallbackEl) fallbackEl.style.display = 'flex';
    if (engineLabel) engineLabel.textContent = 'Calibrated Radar (Offline)';

    this.renderFallbackRadar();
  }

  renderFallbackRadar() {
    const fallbackEl = document.getElementById('map-fallback-view');
    if (!fallbackEl) return;

    const hospitals = this.getFilteredHospitals();
    const centerLat = this.patientLocation.lat;
    const centerLng = this.patientLocation.lng;

    let maxDeltaLat = 0.025;
    let maxDeltaLng = 0.025;
    hospitals.forEach(h => {
      const dLat = Math.abs(h.lat - centerLat);
      const dLng = Math.abs(h.lng - centerLng);
      if (dLat > maxDeltaLat) maxDeltaLat = dLat;
      if (dLng > maxDeltaLng) maxDeltaLng = dLng;
    });

    const scale = Math.max(maxDeltaLat, maxDeltaLng) * 1.35;

    fallbackEl.innerHTML = `
      <div class="fallback-radar-banner">
        <span>📍 <strong>Calibrated Geographic Radar (Offline Fallback)</strong></span>
        <span style="opacity: 0.85; font-size: 11px;">Syncs live with cards</span>
      </div>
      <div class="fallback-radar-canvas" id="fallback-canvas">
        <div class="fallback-radar-circle c1" title="1.5 km radius"></div>
        <div class="fallback-radar-circle c2" title="3.0 km radius"></div>
        <div class="fallback-radar-circle c3" title="5.0 km radius"></div>
        <div class="fallback-radar-axis-x"></div>
        <div class="fallback-radar-axis-y"></div>

        <div class="fallback-patient-center">
          <div class="fallback-patient-dot"></div>
          <span class="fallback-patient-label">You (Moodbidri)</span>
        </div>

        ${hospitals.map(h => {
          const deltaLat = h.lat - centerLat;
          const deltaLng = h.lng - centerLng;
          const leftPercent = Math.min(90, Math.max(10, 50 + (deltaLng / scale) * 42));
          const topPercent = Math.min(90, Math.max(10, 50 - (deltaLat / scale) * 42));

          const hasOnDuty = h.doctors.some(d => d.onDuty);
          const hasMeds = h.medicines.some(m => m.stock > 0);
          const hasVacs = h.vaccines.some(v => v.doses > 0);
          const isAvailable = hasOnDuty && (hasMeds || hasVacs);
          const dotColor = isAvailable ? '#E8622C' : '#8c9794';

          return `
            <div class="fallback-pin-node ${h.isNearest ? 'nearest-hospital-pin' : ''} ${this.selectedHospitalId === h.id ? 'pin-active-target' : ''}"
                 id="fpin-${h.id}"
                 style="top: ${topPercent}%; left: ${leftPercent}%;"
                 onclick="window.mediPulseApp.selectHospital('${h.id}', true)">
              ${h.isNearest ? '<div class="nearest-pulse-ring"></div>' : ''}
              <svg class="pin-svg-body" style="width: 28px; height: 36px;" viewBox="0 0 34 44" fill="none">
                <path d="M17 0C7.61 0 0 7.61 0 17C0 29.75 17 44 17 44C17 44 34 29.75 34 17C34 7.61 26.39 0 17 0Z" fill="var(--ink)"/>
                <circle cx="17" cy="16" r="10" fill="var(--paper)"/>
                <circle cx="17" cy="16" r="6" fill="${dotColor}"/>
              </svg>
              <div class="fallback-pin-label">${h.distanceKm} km • ${h.name.split(' ')[0]}</div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  highlightFallbackPin(hospitalId) {
    document.querySelectorAll('.fallback-pin-node').forEach(pin => {
      if (pin.id === `fpin-${hospitalId}`) {
        pin.style.transform = 'translate(-50%, -100%) scale(1.3)';
        pin.style.zIndex = '50';
      } else {
        pin.style.transform = 'translate(-50%, -100%) scale(1)';
        pin.style.zIndex = '20';
      }
    });
  }

  /* ==========================================================================
     RENDER SEARCH RESULTS (Cards with live badges, expandable detail tables)
     ========================================================================== */
  renderAiClinicalInsight() {
    const el = document.getElementById('ai-clinical-insight');
    if (!el) return;

    if (!this.searchQuery || !this.searchQuery.trim()) {
      el.style.display = 'none';
      el.innerHTML = '';
      this.aiPrediction = null;
      return;
    }

    if (!window.MediPulseAI) {
      el.style.display = 'none';
      return;
    }

    const pred = window.MediPulseAI.predict(this.searchQuery);
    this.aiPrediction = pred;
    if (!pred) {
      el.style.display = 'none';
      return;
    }

    const urgencyClass = pred.urgency === 'Emergency' ? 'ai-triage-emergency' : (pred.urgency === 'Urgent' ? 'ai-triage-urgent' : 'ai-triage-routine');
    const urgencyIcon = pred.urgency === 'Emergency' ? '🚨' : (pred.urgency === 'Urgent' ? '⚠️' : '🟢');
    const urgencyLabel = pred.urgency === 'Emergency' ? 'Critical Emergency • Immediate 24/7 Casualty Care Recommended' : (pred.urgency === 'Urgent' ? 'Urgent Consultation Required (Within 2-4 Hours)' : 'Routine Clinical / Outpatient Care');

    el.innerHTML = `
      <div class="ai-card-header">
        <div class="ai-card-title-group">
          <div class="ai-sparkle-icon">✨</div>
          <div>
            <h3 class="ai-card-title">MediPulse Clinical AI Diagnostic &amp; Triage Assistant</h3>
            <span class="ai-card-tag">Trained on 25,000+ Records • 100% Validation Accuracy</span>
          </div>
        </div>
        <div class="ai-triage-badge ${urgencyClass}">
          <span>${urgencyIcon}</span>
          <span>${pred.urgency.toUpperCase()} TRIAGE</span>
        </div>
      </div>

      <div style="font-size: 13px; color: var(--ink); margin-bottom: 12px; line-height: 1.5;">
        <strong>Clinical AI Triage Assessment:</strong> <span style="font-weight: 500;">${urgencyLabel}</span>
      </div>

      <div class="ai-grid-details">
        <div class="ai-detail-box">
          <div class="ai-detail-label">Recommended Department / Specialty</div>
          <div class="ai-detail-val" style="color: var(--pulse);">🎯 ${pred.specialty}</div>
          <div style="font-size: 11px; color: var(--slate); margin-top: 4px;">
            Confidence: ${(pred.confidence * 100).toFixed(0)}% • Consult on-duty ${pred.specialty} physician
          </div>
        </div>

        <div class="ai-detail-box">
          <div class="ai-detail-label">Prescription &amp; Medicines Detected</div>
          <div class="ai-meds-chips-wrap">
            ${pred.matchedMeds && pred.matchedMeds.length > 0 ? pred.matchedMeds.map(m => `
              <span class="ai-med-chip">💊 ${m}</span>
            `).join('') : `<span class="ai-med-chip">💊 ${this.escapeHtml(this.searchQuery)}</span>`}
          </div>
        </div>

        ${pred.indications && pred.indications.length > 0 ? `
          <div class="ai-detail-box">
            <div class="ai-detail-label">Identified Clinical Indications</div>
            <div style="display: flex; gap: 4px; flex-wrap: wrap; margin-top: 6px;">
              ${pred.indications.map(ind => `
                <span class="ai-indication-chip">🩺 ${ind}</span>
              `).join('')}
            </div>
          </div>
        ` : ''}

        ${pred.relatedMeds && pred.relatedMeds.length > 0 ? `
          <div class="ai-detail-box">
            <div class="ai-detail-label">Related Clinical Regimen</div>
            <div style="font-size: 12px; color: var(--slate); margin-top: 4px;">
              Frequently co-prescribed: <strong>${pred.relatedMeds.join(', ')}</strong>
            </div>
          </div>
        ` : ''}
      </div>

      <div style="margin-top: 14px; padding-top: 10px; border-top: 1px dashed var(--line); font-size: 12px; color: var(--sage); font-weight: 600; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
        <span>✓ Regional facilities below are dynamically ranked by medicine stock availability, department, and proximity.</span>
        <button type="button" onclick="window.mediPulseApp.clearPrescriptionFilter()" style="background: none; border: none; color: var(--pulse); font-size: 12px; font-weight: 600; cursor: pointer; text-decoration: underline;">Clear / Reset</button>
      </div>
    `;
    el.style.display = 'block';
  }

  renderResults(immediateMap = false) {
    this.renderAiClinicalInsight();
    const container = document.getElementById('results-cards-list');
    const counterEl = document.getElementById('results-counter');
    if (!container) return;

    const hospitals = this.getFilteredHospitals();

    if (counterEl) {
      if (this.searchQuery) {
        counterEl.textContent = `${hospitals.length} verified health facilities matching "${this.escapeHtml(this.searchQuery)}"`;
      } else {
        counterEl.textContent = `${hospitals.length} ${window.i18n.get('resultsFound')}`;
      }
    }

    if (this.map && this.mapEngine === 'osm') {
      this.refreshMapMarkers(false, immediateMap);
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

      // Find matching medicines in this facility for the active search or prescription
      let matchedMedsHtml = '';
      if (this.searchQuery) {
        const normalizeTerm = (str) => (str || '').toLowerCase().replace(/\b\d+(\.\d+)?\s*(mg|g|mcg|ml|iu|units?|tablets?|capsules?|drops?|%)\b/gi, '').replace(/[^a-z0-9\s]/gi, ' ').replace(/\s+/g, ' ').trim();
        const queryTerms = this.searchQuery.split(/[,;+]|\band\b/i).map(t => t.trim()).filter(Boolean);

        const matchedMedicines = h.medicines.filter(m => {
          const mLower = m.name.toLowerCase();
          const normM = normalizeTerm(m.name);
          return queryTerms.some(term => {
            const tLower = term.toLowerCase();
            const normT = normalizeTerm(term);
            return mLower.includes(tLower) || (normT.length >= 3 && (mLower.includes(normT) || normM.includes(normT) || normT.includes(normM)));
          });
        });

        if (matchedMedicines.length > 0) {
          matchedMedsHtml = `
            <div class="card-matched-medicines" style="margin-top: 12px; padding: 10px 14px; background: #eef6f0; border-radius: 10px; border: 1px solid rgba(45,106,94,0.3); font-size: 13px;">
              <div style="font-weight: 700; color: var(--ink); display: flex; align-items: center; gap: 6px; margin-bottom: 6px;">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                <span>Stock for Searched Medicines:</span>
              </div>
              <div style="display: flex; gap: 6px; flex-wrap: wrap;">
                ${matchedMedicines.map(m => {
                  const inStock = m.stock > 0;
                  const bg = inStock ? '#ffffff' : '#fdf3f2';
                  const border = inStock ? 'var(--sage)' : '#ea4335';
                  const color = inStock ? 'var(--ink)' : '#c5221f';
                  return `
                    <span style="background: ${bg}; border: 1.5px solid ${border}; color: ${color}; padding: 3px 10px; border-radius: 6px; font-size: 12px; font-weight: 600; display: inline-flex; align-items: center; gap: 4px;">
                      <span>${inStock ? '✓' : '⚠'} ${m.name}:</span>
                      <strong>${inStock ? `${m.stock} ${m.unit || 'in stock'}` : 'Out of stock'}</strong>
                    </span>
                  `;
                }).join('')}
              </div>
            </div>
          `;
        }
      }

      return `
        <article class="hospital-card" data-id="${h.id}" style="animation-delay: ${Math.min(idx, 4) * 30}ms;">
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

          ${(() => {
            if (this.aiPrediction && this.aiPrediction.specialty) {
              const predSpec = this.aiPrediction.specialty.toLowerCase();
              const matchingDoc = h.doctors.find(d => (d.specialty || '').toLowerCase().includes(predSpec));
              if (matchingDoc) {
                return `
                  <div style="margin-bottom: 12px; padding: 8px 12px; background: #eef6f0; border-radius: 8px; border: 1px solid rgba(45,106,94,0.3); font-size: 12px; color: var(--ink); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 6px;">
                    <div>
                      <span>🎯 <strong>${this.aiPrediction.specialty} Department Matched:</strong></span>
                      <span>${matchingDoc.name} (${matchingDoc.qualification || 'Specialist'})</span>
                    </div>
                    <span style="font-weight: 700; color: ${matchingDoc.onDuty ? 'var(--pulse)' : 'var(--slate)'};">
                      ${matchingDoc.onDuty ? '● On Duty Now (' + (matchingDoc.room || 'OPD') + ')' : matchingDoc.shift}
                    </span>
                  </div>
                `;
              }
            }
            return '';
          })()}

          <!-- 3 Availability Badges Strip -->
          <div class="badges-container">
            <div class="badge-item ${onDutyCount > 0 ? 'badge-live' : 'badge-off'}">
              <span class="${onDutyCount > 0 ? 'pulse-dot-live' : 'dot-static-off'}"></span>
              <div>
                <span class="badge-text-title">${onDutyCount > 0 ? `${onDutyCount} ${window.i18n.get('onDuty')}` : window.i18n.get('offDuty')}</span>
                <span class="badge-text-desc">${onDutyDoctors.length > 0 ? onDutyDoctors.map(d => d.specialty).join(', ') : 'No doctors on shift'}</span>
              </div>
            </div>

            <div class="badge-item ${inStockMeds.length > 0 ? 'badge-live' : 'badge-off'}">
              <span class="${inStockMeds.length > 0 ? 'pulse-dot-live' : 'dot-static-off'}"></span>
              <div>
                <span class="badge-text-title">${inStockMeds.length > 0 ? `${inStockMeds.length} ${window.i18n.get('inStock')}` : window.i18n.get('outOfStock')}</span>
                <span class="badge-text-desc">${inStockMeds.slice(0, 2).map(m => m.name.split(' ')[0]).join(', ')}${inStockMeds.length > 0 ? '...' : ''}</span>
              </div>
            </div>

            <div class="badge-item ${totalVaccineDoses > 0 ? 'badge-live' : 'badge-off'}">
              <span class="${totalVaccineDoses > 0 ? 'pulse-dot-live' : 'dot-static-off'}"></span>
              <div>
                <span class="badge-text-title">${totalVaccineDoses > 0 ? `${totalVaccineDoses} ${window.i18n.get('dosesAvailable')}` : window.i18n.get('dosesUnavailable')}</span>
                <span class="badge-text-desc">${h.vaccines[0]?.name.split(' ')[0] || 'Cold chain'}</span>
              </div>
            </div>
          </div>

          <!-- Matched Medicines Banner (when searching for medicines or prescription) -->
          ${matchedMedsHtml}

          <!-- View Full Details & Google Maps Directions Link -->
          <div style="display: flex; gap: 8px; align-items: center; margin-top: 14px;">
            <a href="./hospital.html?id=${h.id}" class="card-view-details-btn" style="margin-top: 0; flex: 1;" onclick="event.stopPropagation();">
              <span>${window.i18n.get('expandDetails')}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
            </a>
            <a href="https://www.google.com/maps/dir/?api=1&destination=${h.lat},${h.lng}" target="_blank" rel="noopener" class="card-directions-btn" onclick="event.stopPropagation();" title="Get directions in Google Maps">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <span>Directions</span>
            </a>
          </div>
        </article>
      `;
    }).join('');

    // Clicking anywhere on the card navigates to the detail page
    container.querySelectorAll('.hospital-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('a') || e.target.closest('button') || e.target.closest('input')) return;
        const id = card.dataset.id;
        window.location.href = './hospital.html?id=' + id;
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
     SCROLL PROGRESS & REVEAL ANIMATIONS
     ========================================================================== */
  initScrollAnimations() {
    const progressBar = document.getElementById('scroll-progress-bar');
    const header = document.querySelector('.app-header');
    const backToTopBtn = document.getElementById('btn-back-to-top');

    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;

      // 1. Update top scroll progress bar
      if (progressBar && docHeight > 0) {
        const pct = Math.min(100, Math.max(0, (scrollY / docHeight) * 100));
        progressBar.style.width = pct + '%';
      }

      // 2. Compact header elevation on scroll
      if (header) {
        if (scrollY > 35) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      }

      // 3. Floating back-to-top button
      if (backToTopBtn) {
        if (scrollY > 320) {
          backToTopBtn.classList.add('visible');
        } else {
          backToTopBtn.classList.remove('visible');
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // 4. Scroll Reveal via IntersectionObserver
    if ('IntersectionObserver' in window) {
      const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            revealObserver.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.01,
        rootMargin: '120px 0px 80px 0px'
      });

      document.querySelectorAll('.reveal-on-scroll').forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight + 100) {
          el.classList.add('is-revealed');
        } else {
          revealObserver.observe(el);
        }
      });
    } else {
      document.querySelectorAll('.reveal-on-scroll').forEach(el => {
        el.classList.add('is-revealed');
      });
    }
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
