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
    this.setupVoiceSearch();
    this.setupPrescriptionUpload();
    this.setupFilterChips();
    this.setupHowItWorksObserver();
    this.setupAdminDashboard();

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
  refreshMapMarkers(initialLoad = false) {
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

    sortedHospitals.forEach((h, index) => {
      boundsPoints.push([h.lat, h.lng]);

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

      setTimeout(() => {
        if (!this.map) return;
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
      }, index * 100);
    });

    // Auto-fit bounds smoothly around patient + hospitals
    if (this.map && boundsPoints.length > 1) {
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
      hospitals = hospitals.filter(h => {
        const matchesName = h.name.toLowerCase().includes(this.searchQuery);
        const matchesDoctor = h.doctors.some(d => d.name.toLowerCase().includes(this.searchQuery) || d.specialty.toLowerCase().includes(this.searchQuery));
        const matchesMed = h.medicines.some(m => m.name.toLowerCase().includes(this.searchQuery) || m.category.toLowerCase().includes(this.searchQuery));
        const matchesVac = h.vaccines.some(v => v.name.toLowerCase().includes(this.searchQuery));
        return matchesName || matchesDoctor || matchesMed || matchesVac;
      });
    }
    return hospitals;
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
        <a href="./hospital.html?id=${hospital.id}" class="map-popup-btn" style="text-decoration:none;display:block;">${window.i18n.get('expandDetails')}</a>
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

    if (this.map && this.mapEngine === 'osm') {
      this.refreshMapMarkers();
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

      return `
        <article class="hospital-card" data-id="${h.id}" style="animation-delay: ${idx * 60}ms;">
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

          <!-- View Full Details Link -->
          <a href="./hospital.html?id=${h.id}" class="card-view-details-btn" onclick="event.stopPropagation();">
            <span>${window.i18n.get('expandDetails')}</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
          </a>
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
