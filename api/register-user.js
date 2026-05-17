<div id="rucking-calc-master" style="background:#111218; color:#fff; padding:25px; border-radius:15px; border:2px solid #00ff8c; font-family:'Courier New', monospace; max-width:100%; width:95%; margin:15px auto; box-sizing:border-box; box-shadow:0px 10px 30px rgba(0,0,0,0.8);">

    <h2 style="text-align:center; color:#00ff8c; margin:0 0 5px 0; font-size:1.8rem; font-weight:900; letter-spacing:1px; text-transform:uppercase;">🔱 RUCKING CALCULATOR 🔱</h2>
    <p style="text-align:center; color:#ffcc00; font-size:14px; font-weight:bold; margin:0 0 20px 0; border-bottom:2px solid #333; padding-bottom:10px;">TACTICAL INTERFACE | FAIL-SAFE ACTIVE</p>

    <div style="margin-bottom:15px;">
        <label style="display:block; font-size:1.1rem; font-weight:900; color:#00ff8c; margin-bottom:5px; letter-spacing:1px;">🎖️ OPERATOR TYPE *</label>
        <select id="rc_op_type" style="width:100%; padding:12px; border-radius:5px; border:1px solid #444; background:#222; color:#ffffff; font-weight:900; font-size:1.1rem;">
            <option value="civilian" selected>Civilian (Standard)</option>
            <option value="military">Military / Elite (Para SF/Rangers)</option>
        </select>
    </div>

    <div style="margin-bottom:15px;">
        <label style="display:block; font-size:1.1rem; font-weight:900; color:#ffcc00; margin-bottom:5px; letter-spacing:1px;">🛡️ OPERATOR NAME *</label>
        <input type="text" id="rc_username" placeholder="Required for Bunker Sync" style="width:100%; padding:12px; border-radius:5px; border:1px solid #444; background:#222; color:#ffffff; font-weight:900; font-size:1.1rem; box-sizing:border-box;">
    </div>

    <div style="display:flex; gap:10px; margin-bottom:15px;">
        <div style="flex:1;">
            <label style="display:block; font-size:1.1rem; font-weight:900; color:#00ff8c; margin-bottom:5px; letter-spacing:1px;">👤 GENDER *</label>
            <select id="rc_gender" style="width:100%; padding:12px; border-radius:5px; border:1px solid #444; background:#222; color:#ffffff; font-weight:900; font-size:1.1rem;">
                <option value="male" selected>Male</option>
                <option value="female">Female</option>
            </select>
        </div>
        <div style="flex:1;">
            <label style="display:block; font-size:1.1rem; font-weight:900; color:#ffcc00; margin-bottom:5px; letter-spacing:1px;">📅 AGE *</label>
            <input type="number" id="rc_age" placeholder="Age" style="width:100%; padding:12px; border-radius:5px; border:1px solid #444; background:#222; color:#ffffff; font-weight:900; font-size:1.1rem;">
        </div>
    </div>

    <div style="margin-bottom:15px;">
        <label style="display:block; font-size:1.1rem; font-weight:900; color:#ffcc00; margin-bottom:5px; letter-spacing:1px;">🌍 COUNTRY *</label>
        <input type="text" id="rc_country" placeholder="e.g. India" style="width:100%; padding:12px; border-radius:5px; border:1px solid #444; background:#222; color:#ffffff; font-weight:900; font-size:1.1rem;">
    </div>

    <div style="margin-bottom:15px;">
        <label style="display:block; font-size:1.1rem; font-weight:900; color:#ffcc00; margin-bottom:5px; letter-spacing:1px;">📏 HEIGHT (cm) *</label>
        <input type="number" id="rc_ht" placeholder="e.g. 170" style="width:100%; padding:12px; border-radius:5px; border:1px solid #444; background:#222; color:#ffffff; font-weight:900; font-size:1.1rem;">
    </div>

    <div style="margin-bottom:15px;">
        <label style="display:block; font-size:1.1rem; font-weight:900; color:#ffcc00; margin-bottom:5px; letter-spacing:1px;">🏋️ BODY WEIGHT *</label>
        <div style="display:flex; gap:5px;">
            <input type="number" id="rc_bw" placeholder="Weight" style="flex:3; padding:12px; border-radius:5px; border:1px solid #444; background:#222; color:#ffffff; font-weight:900; font-size:1.1rem;">
            <select id="rc_bw_unit" style="flex:1; padding:12px; border-radius:5px; border:1px solid #444; background:#222; color:#ffffff; font-weight:900; font-size:1.1rem;">
                <option value="kg" selected>KG</option><option value="lb">LB</option>
            </select>
        </div>
    </div>

    <div style="margin-bottom:15px;">
        <label style="display:block; font-size:1.1rem; font-weight:900; color:#ffcc00; margin-bottom:5px; letter-spacing:1px;">🎒 LOAD WEIGHT *</label>
        <div style="display:flex; gap:5px;">
            <input type="number" id="rc_lw" placeholder="Load" style="flex:3; padding:12px; border-radius:5px; border:1px solid #444; background:#222; color:#ffffff; font-weight:900; font-size:1.1rem;">
            <select id="rc_lw_unit" style="flex:1; padding:12px; border-radius:5px; border:1px solid #444; background:#222; color:#ffffff; font-weight:900; font-size:1.1rem;">
                <option value="kg" selected>KG</option><option value="lb">LB</option>
            </select>
        </div>
    </div>

    <div style="display:flex; gap:10px; margin-bottom:15px;">
        <div style="flex:1;">
            <label style="display:block; font-size:1.1rem; font-weight:900; color:#ffcc00; margin-bottom:5px; letter-spacing:1px;">🛣️ DIST (km) *</label>
            <input type="number" id="rc_dist" placeholder="5.0" step="0.01" style="width:100%; padding:12px; border-radius:5px; border:1px solid #444; background:#222; color:#ffffff; font-weight:900; font-size:1.1rem;">
        </div>
        <div style="flex:1;">
            <label style="display:block; font-size:1.1rem; font-weight:900; color:#ffcc00; margin-bottom:5px; letter-spacing:1px;">⏱️ TIME (min) *</label>
            <input type="number" id="rc_time" placeholder="60" style="width:100%; padding:12px; border-radius:5px; border:1px solid #444; background:#222; color:#ffffff; font-weight:900; font-size:1.1rem;">
        </div>
    </div>

    <div style="margin-bottom:15px;">
        <label style="display:block; font-size:1.1rem; font-weight:900; color:#00ff8c; margin-bottom:5px; letter-spacing:1px;">⛰️ SLOPE (%)</label>
        <select id="rc_slope" style="width:100%; padding:12px; border-radius:5px; border:1px solid #444; background:#222; color:#ffffff; font-weight:900; font-size:1.1rem;">
            <option value="0" selected>0% (Flat)</option><option value="1">1%</option><option value="3">3%</option><option value="5">5%</option><option value="10">10%</option>
        </select>
    </div>

    <div style="margin-bottom:25px;">
        <label style="display:block; font-size:1.1rem; font-weight:900; color:#00ff8c; margin-bottom:5px; letter-spacing:1px;">🌲 TERRAIN FACTOR</label>
        <select id="rc_terr" style="width:100%; padding:12px; border-radius:5px; border:1px solid #444; background:#222; color:#ffffff; font-weight:900; font-size:1.1rem;">
            <option value="1.0">Paved (1.0)</option><option value="1.2">Grass (1.2)</option><option value="1.5">Sand (1.5)</option><option value="1.8">Rocky (1.8)</option>
        </select>
    </div>

    <button id="rc_btn" style="width:100%; padding:18px; border-radius:8px; border:none; background:#00ff8c; color:#000; font-size:1.5rem; font-weight:900; cursor:pointer; text-transform:uppercase; transition: 0.3s; box-shadow: 0 5px 15px rgba(0, 255, 140, 0.4);">🔥 CALCULATE METRICS</button>

    <div id="rc_results" style="display:none; margin-top:25px; padding:20px; background:#0a0a0a; border:2px solid #333; border-left:6px solid #00ff8c; border-radius:10px;">
        <div style="display:flex; justify-content:space-between; margin-bottom:12px; border-bottom:1px solid #222; padding-bottom:8px;"><span style="color:#ffcc00; font-weight:900; font-size:1.2rem; letter-spacing:1px;">🛡️ OPERATOR</span><span style="color:#ffffff; font-weight:900; font-size:1.2rem;" id="rc_out_username">-</span></div>
        <div style="display:flex; justify-content:space-between; margin-bottom:12px; border-bottom:1px solid #222; padding-bottom:8px;"><span style="color:#ffcc00; font-weight:900; font-size:1.2rem; letter-spacing:1px;">⚖️ BMI</span><span style="color:#ffffff; font-weight:900; font-size:1.2rem;" id="rc_out_bmi">0</span></div>
        <div style="display:flex; justify-content:space-between; margin-bottom:12px; border-bottom:1px solid #222; padding-bottom:8px;"><span style="color:#ffcc00; font-weight:900; font-size:1.4rem; letter-spacing:1px;">🔥 CALORIES</span><span style="color:#00ff8c; font-weight:900; font-size:1.8rem;"><span id="rc_out_cal">0</span> <small style="color:#ffffff; font-size:14px;">KCAL</small></span></div>
        <div style="display:flex; justify-content:space-between; margin-bottom:12px; border-bottom:1px solid #222; padding-bottom:8px;"><span style="color:#ffcc00; font-weight:900; font-size:1.4rem; letter-spacing:1px;">📦 VOLUME</span><span style="color:#00ff8c; font-weight:900; font-size:1.8rem;"><span id="rc_out_vol">0</span> <small style="color:#ffffff; font-size:14px; text-transform:uppercase;" id="rc_out_vunit">KG·KM</small></span></div>
        <div style="display:flex; justify-content:space-between;"><span style="color:#ffcc00; font-weight:900; font-size:1.2rem; letter-spacing:1px;">🏃‍♂️ PACE</span><span style="color:#ffffff; font-weight:900; font-size:1.5rem;" id="rc_out_pace">0:00 min/km</span></div>
        
        <div style="color:#ffcc00; font-size:14px; text-align:center; font-weight:900; margin-top:15px; border-top:1px dashed #444; padding-top:10px; letter-spacing:1px;">
            ⚡ EPOC AFTERBURN ACTIVE (FAT AS FUEL MODE)
        </div>

        <button id="rc_save_btn" style="width:100%; margin-top:20px; padding:15px; border-radius:8px; border:2px solid #00ff8c; background:transparent; color:#00ff8c; font-size:1.3rem; font-weight:900; cursor:pointer; text-transform:uppercase; letter-spacing:1px; transition: 0.3s;">⚡ INITIATE BUNKER SYNC 💥</button>
    </div>
</div>

<script type="module">
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
  import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

  const firebaseConfig = {
    apiKey: "AIzaSyDpMAprPTTiSA9GEtwXRcQFdDsOO09CUFw",
    authDomain: "ruckingindia-bunker.firebaseapp.com",
    projectId: "ruckingindia-bunker",
    storageBucket: "ruckingindia-bunker.firebasestorage.app",
    messagingSenderId: "480067002573",
    appId: "1:480067002573:web:ad898357c75bd278bb8984"
  };

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

  const UI = {
    username: document.getElementById('rc_username'),
    opType: document.getElementById('rc_op_type'),
    age: document.getElementById('rc_age'),
    country: document.getElementById('rc_country'),
    gender: document.getElementById('rc_gender'),
    ht: document.getElementById('rc_ht'),
    bw: document.getElementById('rc_bw'),
    bwu: document.getElementById('rc_bw_unit'),
    lw: document.getElementById('rc_lw'),
    lwu: document.getElementById('rc_lw_unit'),
    dist: document.getElementById('rc_dist'),
    time: document.getElementById('rc_time'),
    slope: document.getElementById('rc_slope'),
    terr: document.getElementById('rc_terr'),
    calcBtn: document.getElementById('rc_btn'),
    saveBtn: document.getElementById('rc_save_btn'),
    resBox: document.getElementById('rc_results'),
    outName: document.getElementById('rc_out_username'),
    outBmi: document.getElementById('rc_out_bmi'),
    outCal: document.getElementById('rc_out_cal'),
    outVol: document.getElementById('rc_out_vol'),
    outVunit: document.getElementById('rc_out_vunit'),
    outPace: document.getElementById('rc_out_pace')
  };

  UI.calcBtn.onclick = () => {
    // 1. Validation
    const required = [UI.username, UI.age, UI.country, UI.ht, UI.bw, UI.lw, UI.dist, UI.time];
    for (let f of required) { if (!f.value.trim()) { alert("🔱 COMMANDER: Missing Critical Intel!"); f.focus(); return; } }

    // 2. Strike System
    let strikes = parseInt(localStorage.getItem('rc_strikes_v3')) || 0;
    if (strikes >= 5) { alert("⛔ ACCESS REVOKED: Permanent ban active."); UI.saveBtn.style.display = 'none'; return; }

    // 3. Variables
    const bw_kg = UI.bwu.value === 'lb' ? parseFloat(UI.bw.value) * 0.453592 : parseFloat(UI.bw.value);
    const l_kg = UI.lwu.value === 'lb' ? parseFloat(UI.lw.value) * 0.453592 : parseFloat(UI.lw.value);
    const d = parseFloat(UI.dist.value);
    const t = parseFloat(UI.time.value);
    const paceMin = t / d;
    const speed_kmh = 60 / paceMin;

    // 4. FAIL-SAFE LOGIC (Hard Locked)
    let isFake = false;
    let errorMsg = "⚠️ INPUT RIGHT DATA ACCORDING TO HUMAN MECHANICAL BODY CONDITION:\n\n";
    if (l_kg > 65) { isFake = true; errorMsg += "- Max vertical spine load (65kg) exceeded.\n"; }
    if (speed_kmh > 11.3) { isFake = true; errorMsg += "- Pace too fast (>11.3km/h is running).\n"; }
    if (UI.opType.value === 'civilian' && l_kg > 45) { isFake = true; errorMsg += "- Civilian mechanical limit is 45kg.\n"; }

    if (isFake) {
        strikes++;
        localStorage.setItem('rc_strikes_v3', strikes);
        UI.resBox.style.display = 'none';
        alert(errorMsg + `\nSTRIKE: ${strikes}/5.`); return;
    }

    // 5. MATH (Atma Fixed)
    const h_m = parseFloat(UI.ht.value) / 100;
    const v = speed_kmh / 3.6; // speed in m/s
    const η = parseFloat(UI.terr.value);
    const G = parseFloat(UI.slope.value);

    // Full Pandolf Equation: Metabolic Rate (Watts)
    const watts = 1.5 * bw_kg + 2.0 * (bw_kg + l_kg) * Math.pow(l_kg / bw_kg, 2) + η * (bw_kg + l_kg) * (1.5 * v * v + 0.35 * v * G);
    // Energy Calculation with 15% EPOC/Tactical boost
    const calories = Math.round((watts * (t / 60) * 0.8604) * 1.15);

    UI.outName.innerText = UI.username.value.toUpperCase();
    UI.outBmi.innerText = (bw_kg / (h_m * h_m)).toFixed(1);
    UI.outCal.innerText = calories;
    
    // UI DISPLAY ONLY: Shows values in selected units
    UI.outVol.innerText = UI.bwu.value === 'lb' ? ((bw_kg+l_kg)*d * 2.20462).toFixed(1) : ((bw_kg+l_kg)*d).toFixed(1);
    UI.outVunit.innerText = UI.bwu.value === 'lb' ? 'LB·KM' : 'KG·KM';
    
    UI.outPace.innerText = Math.floor(paceMin) + ":" + (Math.round((paceMin - Math.floor(paceMin)) * 60)).toString().padStart(2, '0');
    UI.resBox.style.display = 'block';
  };

  UI.saveBtn.onclick = async () => {
    const user = auth.currentUser;
    if (!user) { alert("⚠️ Operator login required!"); return; }
    
    UI.saveBtn.innerText = "📡 SYNCING...";
    UI.saveBtn.disabled = true;

    try {
        const idToken = await user.getIdToken(true);
        
        // Re-calculating raw fields to ensure strict database standardization
        const bw_kg = UI.bwu.value === 'lb' ? parseFloat(UI.bw.value) * 0.453592 : parseFloat(UI.bw.value);
        const l_kg = UI.lwu.value === 'lb' ? parseFloat(UI.lw.value) * 0.453592 : parseFloat(UI.lw.value);
        const d = parseFloat(UI.dist.value);
        
        // RECTIFIED MATRIX: Volume calculation is normalized strictly to KG-KM for DB consistency
        const standardVolumeKgKm = parseFloat(((bw_kg + l_kg) * d).toFixed(1));

        const ruckingData = {
            operatorName: UI.username.value,
            operatorType: UI.opType.value,
            age: parseInt(UI.age.value),
            country: UI.country.value,
            gender: UI.gender.value,
            loadWeight: l_kg, // Strictly standardized in KG
            loadWeightUnit: "kg",
            pace: UI.outPace.innerText,
            caloriesBurned: parseInt(UI.outCal.innerText),
            volumeMoved: standardVolumeKgKm, // Normalized standard entry
            volumeUnit: "KG-KM",
            heightCm: parseFloat(UI.ht.value),
            bodyWeight: bw_kg, // Strictly standardized in KG
            bodyWeightUnit: "kg",
            distanceKm: d,
            durationMin: parseInt(UI.time.value),
            timestamp: new Date().toISOString() 
        };

        const response = await fetch('https://rucking-bridge-4cal.vercel.app/api/submit-entry', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idToken, ruckingData })
        });

        if (response.ok) {
            UI.saveBtn.innerText = "✅ SECURED";
            UI.saveBtn.style.background = "#00ff8c"; 
            UI.saveBtn.style.color = "#000";
            alert("💥 MISSION ACCOMPLISHED!");
        } else { 
            throw new Error();
        }
    } catch (e) {
        alert("❌ SYNC FAILED");
        UI.saveBtn.disabled = false;
        UI.saveBtn.innerText = "⚡ INITIATE BUNKER SYNC";
    }
  };
</script>