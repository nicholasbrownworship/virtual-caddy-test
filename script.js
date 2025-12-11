// ---------- STORAGE CONFIG ----------

const STORAGE_KEY = "golf_dashboard_rounds_v1";

// ---------- SAMPLE DATA ----------

const defaultRounds = [
  {
    date: "2025-11-15",
    course: "Diamond Hills CC",
    tees: "White",
    score: 82,
    holes: 18,
    fir_hit: 9,
    fir_possible: 14,
    gir_hit: 8,
    gir_possible: 18,
    up_and_down_success: 4,
    up_and_down_attempts: 9,
    sand_saves_success: 1,
    sand_saves_attempts: 3,
    putts: 32,
    three_putts: 3,
    penalty_strokes: 2,
    par3_score: 12,
    par3_holes: 4,
    par4_score: 54,
    par4_holes: 10,
    par5_score: 16,
    par5_holes: 4
  },
  {
    date: "2025-11-23",
    course: "Harrison CC",
    tees: "Blue",
    score: 84,
    holes: 18,
    fir_hit: 7,
    fir_possible: 14,
    gir_hit: 7,
    gir_possible: 18,
    up_and_down_success: 3,
    up_and_down_attempts: 10,
    sand_saves_success: 0,
    sand_saves_attempts: 2,
    putts: 34,
    three_putts: 2,
    penalty_strokes: 3,
    par3_score: 13,
    par3_holes: 4,
    par4_score: 55,
    par4_holes: 10,
    par5_score: 16,
    par5_holes: 4
  },
  {
    date: "2025-12-02",
    course: "Holiday Island GC",
    tees: "White",
    score: 80,
    holes: 18,
    fir_hit: 10,
    fir_possible: 14,
    gir_hit: 9,
    gir_possible: 18,
    up_and_down_success: 5,
    up_and_down_attempts: 9,
    sand_saves_success: 1,
    sand_saves_attempts: 2,
    putts: 30,
    three_putts: 1,
    penalty_strokes: 1,
    par3_score: 11,
    par3_holes: 4,
    par4_score: 52,
    par4_holes: 10,
    par5_score: 17,
    par5_holes: 4
  }
];

let rounds = [];

// ---------- PLAYER PROFILE ----------

const playerProfile = {
  name: "Nick",
  handicap_estimate: 10,
  stock_shot_shape: "slight draw",
  typical_miss: "pull hook",
  aggression_level: "moderate",
  course_management_style: "avoid_big_numbers_first",
  notes:
    "Comfortable hitting knockdown wedges, prefers conservative lines off the tee when hazards are in play."
};

// ---------- BAG DATA (for the caddy) ----------
// Tweak these to match your real yardages.

const bag = [
  {
    club: "Driver",
    type: "wood",
    stock_carry: 280,
    max_carry: 295
  },
  {
    club: "3 Wood",
    type: "wood",
    stock_carry: 240,
    max_carry: 255
  },
  {
    club: "4 Hybrid",
    type: "hybrid",
    stock_carry: 215,
    max_carry: 225
  },
  {
    club: "5 Iron",
    type: "iron",
    stock_carry: 190,
    max_carry: 200
  },
  {
    club: "6 Iron",
    type: "iron",
    stock_carry: 175,
    max_carry: 185
  },
  {
    club: "7 Iron",
    type: "iron",
    stock_carry: 155,
    max_carry: 165
  },
  {
    club: "8 Iron",
    type: "iron",
    stock_carry: 145,
    max_carry: 155
  },
  {
    club: "9 Iron",
    type: "iron",
    stock_carry: 135,
    max_carry: 145
  },
  {
    club: "Pitching Wedge",
    type: "wedge",
    stock_carry: 125,
    max_carry: 135
  },
  {
    club: "Gap Wedge",
    type: "wedge",
    stock_carry: 110,
    max_carry: 120
  },
  {
    club: "Sand Wedge",
    type: "wedge",
    stock_carry: 95,
    max_carry: 105
  },
  {
    club: "Lob Wedge",
    type: "wedge",
    stock_carry: 80,
    max_carry: 90
  }
];

// ---------- STORAGE HELPERS ----------

function loadRoundsFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      rounds = [...defaultRounds];
      return;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length) {
      rounds = parsed;
    } else {
      rounds = [...defaultRounds];
    }
  } catch (e) {
    console.warn("Failed to load rounds from storage, using defaults.", e);
    rounds = [...defaultRounds];
  }
}

function saveRoundsToStorage() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rounds));
  } catch (e) {
    console.warn("Failed to save rounds to storage.", e);
  }
}

function resetRoundsToDefault() {
  rounds = [...defaultRounds];
  saveRoundsToStorage();
}

// ---------- CALC HELPERS ----------

function calcSummary(roundsArr) {
  if (!roundsArr.length) {
    return null;
  }

  const totalRounds = roundsArr.length;
  let scoringTotal = 0;
  let firHit = 0;
  let firPossible = 0;
  let girHit = 0;
  let girPossible = 0;
  let upDownSuccess = 0;
  let upDownAttempts = 0;
  let sandSuccess = 0;
  let sandAttempts = 0;
  let puttsTotal = 0;
  let threePuttsTotal = 0;
  let penaltyTotal = 0;

  let par3Score = 0,
    par3Holes = 0;
  let par4Score = 0,
    par4Holes = 0;
  let par5Score = 0,
    par5Holes = 0;

  roundsArr.forEach((r) => {
    scoringTotal += r.score || 0;
    firHit += r.fir_hit || 0;
    firPossible += r.fir_possible || 0;
    girHit += r.gir_hit || 0;
    girPossible += r.gir_possible || 0;
    upDownSuccess += r.up_and_down_success || 0;
    upDownAttempts += r.up_and_down_attempts || 0;
    sandSuccess += r.sand_saves_success || 0;
    sandAttempts += r.sand_saves_attempts || 0;
    puttsTotal += r.putts || 0;
    threePuttsTotal += r.three_putts || 0;
    penaltyTotal += r.penalty_strokes || 0;

    par3Score += r.par3_score || 0;
    par3Holes += r.par3_holes || 0;
    par4Score += r.par4_score || 0;
    par4Holes += r.par4_holes || 0;
    par5Score += r.par5_score || 0;
    par5Holes += r.par5_holes || 0;
  });

  const scoringAverage = scoringTotal / totalRounds;
  const firPercentage = firPossible ? (firHit / firPossible) * 100 : 0;
  const girPercentage = girPossible ? (girHit / girPossible) * 100 : 0;
  const upAndDownPercentage = upDownAttempts
    ? (upDownSuccess / upDownAttempts) * 100
    : 0;
  const sandSavePercentage = sandAttempts
    ? (sandSuccess / sandAttempts) * 100
    : 0;
  const puttsPerRound = totalRounds ? puttsTotal / totalRounds : 0;
  const threePuttRate = totalRounds ? threePuttsTotal / totalRounds : 0;
  const penaltyStrokesPerRound = totalRounds ? penaltyTotal / totalRounds : 0;

  const par3Avg = par3Holes ? par3Score / par3Holes : 0;
  const par4Avg = par4Holes ? par4Score / par4Holes : 0;
  const par5Avg = par5Holes ? par5Score / par5Holes : 0;

  return {
    sample_size_rounds: totalRounds,
    scoring_average: scoringAverage,
    fir_percentage: firPercentage,
    gir_percentage: girPercentage,
    up_and_down_percentage: upAndDownPercentage,
    sand_save_percentage: sandSavePercentage,
    putts_per_round: puttsPerRound,
    three_putt_rate: threePuttRate,
    penalty_strokes_per_round: penaltyStrokesPerRound,
    par3_avg: par3Avg,
    par4_avg: par4Avg,
    par5_avg: par5Avg
  };
}

function formatPercent(val, decimals = 0) {
  return `${val.toFixed(decimals)}%`;
}

function formatNumber(val, decimals = 1) {
  return val.toFixed(decimals);
}

// ---------- DOM BINDING: PROFILE & STATS ----------

function updateProfileUI(profile, summary) {
  const initials =
    profile.name &&
    profile.name
      .split(" ")
      .map((p) => p[0])
      .join("")
      .toUpperCase();

  document.getElementById("profileInitials").textContent =
    initials || "PL";
  document.getElementById("playerName").textContent =
    profile.name || "Player";

  document.getElementById("handicapEstimate").textContent =
    profile.handicap_estimate ?? "—";
  document.getElementById("handicapBadge").textContent =
    "HCP: " + (profile.handicap_estimate ?? "—");

  document.getElementById("stockShotTag").textContent =
    "Stock: " + (profile.stock_shot_shape || "—");
  document.getElementById("missTag").textContent =
    "Miss: " + (profile.typical_miss || "—");
  document.getElementById("styleTag").textContent =
    "Style: " + (profile.course_management_style || "—");

  document.getElementById("shotShape").textContent =
    profile.stock_shot_shape || "—";
  document.getElementById("aggression").textContent =
    profile.aggression_level || "—";

  if (summary) {
    document.getElementById(
      "roundSampleLabel"
    ).textContent = `Based on last ${summary.sample_size_rounds} rounds`;
  } else {
    document.getElementById("roundSampleLabel").textContent =
      "Add a round to start tracking.";
  }
}

function updateSummaryStatsUI(summary) {
  if (!summary) {
    document.getElementById("statScoringAvg").textContent = "—";
    document.getElementById("statFIR").textContent = "—";
    document.getElementById("statGIR").textContent = "—";
    document.getElementById("statPutts").textContent = "—";
    document.getElementById("statThreePuttRate").textContent = "—";
    document.getElementById("statPenalties").textContent = "—";
    document.getElementById("statPar3Avg").textContent = "—";
    document.getElementById("statPar4Avg").textContent = "—";
    document.getElementById("statPar5Avg").textContent = "—";
    return;
  }

  document.getElementById("statScoringAvg").textContent = formatNumber(
    summary.scoring_average,
    1
  );
  document.getElementById("statFIR").textContent = formatPercent(
    summary.fir_percentage,
    0
  );
  document.getElementById("statGIR").textContent = formatPercent(
    summary.gir_percentage,
    0
  );
  document.getElementById("statPutts").textContent = formatNumber(
    summary.putts_per_round,
    1
  );
  document.getElementById(
    "statThreePuttRate"
  ).textContent = formatNumber(summary.three_putt_rate, 2);
  document.getElementById(
    "statPenalties"
  ).textContent = formatNumber(summary.penalty_strokes_per_round, 1);

  document.getElementById("statPar3Avg").textContent = formatNumber(
    summary.par3_avg,
    2
  );
  document.getElementById("statPar4Avg").textContent = formatNumber(
    summary.par4_avg,
    2
  );
  document.getElementById("statPar5Avg").textContent = formatNumber(
    summary.par5_avg,
    2
  );

  document.getElementById(
    "statScoringNote"
  ).textContent = `Target: shave 2–3 strokes from this number.`;
}

function updateRoundsTable(roundsArr) {
  const tbody = document.getElementById("roundsTableBody");
  tbody.innerHTML = "";

  roundsArr.forEach((r) => {
    const tr = document.createElement("tr");

    const firPct = r.fir_possible
      ? (r.fir_hit / r.fir_possible) * 100
      : 0;
    const girPct = r.gir_possible
      ? (r.gir_hit / r.gir_possible) * 100
      : 0;

    const courseLabel = r.tees
      ? `${r.course} (${r.tees})`
      : r.course;

    tr.innerHTML = `
      <td>${r.date}</td>
      <td><span class="round-tag">${courseLabel}</span></td>
      <td>${r.score}</td>
      <td>${firPct.toFixed(0)}%</td>
      <td>${girPct.toFixed(0)}%</td>
      <td>${r.putts ?? "—"}</td>
      <td>${r.three_putts ?? "—"}</td>
      <td>${r.penalty_strokes ?? 0}</td>
    `;

    tbody.appendChild(tr);
  });

  const badge = document.getElementById("roundCountBadge");
  badge.textContent = `${roundsArr.length} Round${roundsArr.length === 1 ? "" : "s"}`;
}

// ---------- FORM HELPERS (Add Round) ----------

function valNum(id, fallback = 0) {
  const el = document.getElementById(id);
  if (!el) return fallback;
  const v = parseFloat(el.value);
  return Number.isNaN(v) ? fallback : v;
}

function valStr(id, fallback = "") {
  const el = document.getElementById(id);
  if (!el) return fallback;
  const v = el.value.trim();
  return v || fallback;
}

function clearRoundForm() {
  const form = document.getElementById("roundForm");
  if (form) form.reset();
}

function handleRoundFormSubmit(event) {
  event.preventDefault();

  const date = valStr("roundDate");
  const course = valStr("roundCourse");
  const score = valNum("roundScore");

  if (!date || !course || !score) {
    alert("Please enter at least date, course, and score.");
    return;
  }

  const tees = valStr("roundTees", "");

  const firHit = valNum("firHit", 0);
  const firPossible = valNum("firPossible", 14);
  const girHit = valNum("girHit", 0);
  const girPossible = valNum("girPossible", 18);

  const upDownSuccess = valNum("upDownSuccess", 0);
  const upDownAttempts = valNum("upDownAttempts", 0);
  const sandSuccess = valNum("sandSuccess", 0);
  const sandAttempts = valNum("sandAttempts", 0);

  const putts = valNum("putts", 0);
  const threePutts = valNum("threePutts", 0);
  const penalties = valNum("penalties", 0);
  const holes = valNum("holes", 18);

  const par3Score = valNum("par3Score", 0);
  const par3Holes = valNum("par3Holes", 0);
  const par4Score = valNum("par4Score", 0);
  const par4Holes = valNum("par4Holes", 0);
  const par5Score = valNum("par5Score", 0);
  const par5Holes = valNum("par5Holes", 0);

  const newRound = {
    date,
    course,
    tees,
    score,
    holes,
    fir_hit: firHit,
    fir_possible: firPossible,
    gir_hit: girHit,
    gir_possible: girPossible,
    up_and_down_success: upDownSuccess,
    up_and_down_attempts: upDownAttempts,
    sand_saves_success: sandSuccess,
    sand_saves_attempts: sandAttempts,
    putts,
    three_putts: threePutts,
    penalty_strokes: penalties,
    par3_score: par3Score,
    par3_holes: par3Holes,
    par4_score: par4Score,
    par4_holes: par4Holes,
    par5_score: par5Score,
    par5_holes: par5Holes
  };

  rounds.push(newRound);
  saveRoundsToStorage();

  const summary = calcSummary(rounds);

  updateProfileUI(playerProfile, summary);
  updateSummaryStatsUI(summary);
  updateRoundsTable(rounds);

  clearRoundForm();
}

// ---------- VIRTUAL CADDY ENGINE ----------

function getAdjustedDistance(distance, windDir, windSpeed, lie) {
  let adjusted = distance;

  // Wind adjustment – rough but practical
  if (windDir === "into") {
    adjusted += windSpeed * 0.8; // into wind: plays longer
  } else if (windDir === "down") {
    adjusted -= windSpeed * 0.5; // downwind: plays shorter
  }

  // Lie penalty
  if (lie === "rough") {
    adjusted += 5; // ball comes out slower
  } else if (lie === "sand") {
    adjusted += 10;
  } else if (lie === "recovery") {
    adjusted += 15; // likely a punch / limited club
  }

  return adjusted;
}

function pickClub(adjustedDistance, shotNumber, troubleLong, aggression) {
  // Short game logic first
  if (adjustedDistance <= 40) {
    if (adjustedDistance <= 15) {
      return {
        club: "Sand Wedge",
        swing: "chip",
        note: "Treat this like a chip/pitch, focus on landing spot not full carry."
      };
    }
    return {
      club: "Gap Wedge",
      swing: "pitch",
      note: "Small, controlled pitch. Prioritize solid contact over max spin."
    };
  }

  // For full swings, choose the club whose stock_carry is closest to adjustedDistance
  let best = null;
  let bestDiff = Infinity;

  bag.forEach((c) => {
    const diff = Math.abs(c.stock_carry - adjustedDistance);
    if (diff < bestDiff) {
      bestDiff = diff;
      best = c;
    }
  });

  if (!best) return null;

  // If trouble long is death (water/OB), bias slightly shorter (take less club or softer swing)
  let swing = "stock";
  let extraNote = "";

  if (troubleLong === "water" || troubleLong === "ob") {
    if (best.stock_carry > adjustedDistance + 8) {
      // okay, we have cushion
      extraNote =
        "Be very aware of the long trouble. Pick a target that keeps a miss short or middle.";
    } else {
      // might be hot – suggest smoother swing or 1 club less
      swing = "smooth";
      extraNote =
        "Long is dead. Favor a smooth swing or one less club, and play to the front/safer part of green.";
    }
  } else if (aggression === "aggressive") {
    swing = "full";
    extraNote =
      "You selected attacking mindset. Commit to the swing, but pick a target that still keeps your big miss in play.";
  } else if (aggression === "conservative") {
    swing = "smooth";
    extraNote =
      "Conservative choice—focus on center-of-green or widest fairway section, not the hero line.";
  }

  return {
    club: best.club,
    swing,
    note: extraNote
  };
}

function buildTargetStrategy(input) {
  const { troubleLeft, troubleRight, stockMiss, windDir } = input;

  let line = "Aim at center target.";
  let safetyNotes = [];

  // Avoid trouble sides first
  if (
    troubleLeft === "water" ||
    troubleLeft === "ob" ||
    troubleLeft === "bunker"
  ) {
    line = "Favor the right side of your target.";
    safetyNotes.push("Avoid the left—too much trouble there.");
  } else if (
    troubleRight === "water" ||
    troubleRight === "ob" ||
    troubleRight === "bunker"
  ) {
    line = "Favor the left side of your target.";
    safetyNotes.push("Avoid the right—too much trouble there.");
  }

  // Factor in typical miss
  if (stockMiss === "pull hook") {
    safetyNotes.push("You tend to miss left—aim a little more right than you think.");
  } else if (stockMiss === "push fade") {
    safetyNotes.push("You tend to miss right—aim a little more left than you think.");
  }

  // Wind cross
  if (windDir === "cross_left") {
    safetyNotes.push("Wind is pushing left-to-right—allow for drift right.");
  } else if (windDir === "cross_right") {
    safetyNotes.push("Wind is pushing right-to-left—allow for drift left.");
  }

  return {
    line,
    safetyNotes
  };
}

// ---------- CADDY FORM HANDLERS ----------

function caddyValNum(id, fallback = 0) {
  const el = document.getElementById(id);
  if (!el) return fallback;
  const v = parseFloat(el.value);
  return Number.isNaN(v) ? fallback : v;
}

function caddyValStr(id, fallback = "") {
  const el = document.getElementById(id);
  if (!el) return fallback;
  const v = el.value.trim();
  return v || fallback;
}

function handleCaddyFormSubmit(event) {
  event.preventDefault();

  const distance = caddyValNum("caddyDistance");
  if (!distance) {
    alert("Enter a distance to the pin.");
    return;
  }

  const par = caddyValStr("caddyPar", "4");
  const shotNumber = caddyValStr("caddyShotNumber", "2");
  const mindset = caddyValStr("caddyAggression", "normal");
  const lie = caddyValStr("caddyLie", "fairway");
  const windDir = caddyValStr("caddyWind", "calm");
  const windSpeed = caddyValNum("caddyWindSpeed", 0);
  const fairwayWidth = caddyValNum("caddyFairwayWidth", 0);
  const troubleLeft = caddyValStr("caddyTroubleLeft", "none");
  const troubleRight = caddyValStr("caddyTroubleRight", "none");
  const troubleShort = caddyValStr("caddyTroubleShort", "none");
  const troubleLong = caddyValStr("caddyTroubleLong", "none");

  const adjusted = getAdjustedDistance(distance, windDir, windSpeed, lie);
  const suggestion = pickClub(adjusted, shotNumber, troubleLong, mindset);

  const outputEl = document.getElementById("caddyOutput");
  if (!suggestion) {
    outputEl.style.display = "block";
    outputEl.innerHTML = `
      <h3>No Suggestion</h3>
      <p>Couldn't map that distance to your current bag. Check your bag data or try again.</p>
    `;
    return;
  }

  const target = buildTargetStrategy({
    troubleLeft,
    troubleRight,
    stockMiss: playerProfile.typical_miss || "pull hook",
    windDir
  });

  // Build explanation
  const lines = [];

  lines.push(
    `<p><span class="highlight">${suggestion.club}</span> with a <span class="highlight">${suggestion.swing} swing</span> for <span class="highlight">${Math.round(
      adjusted
    )} yds effective</span> (adjusted for wind & lie).</p>`
  );

  lines.push(`<p><strong>Target line:</strong> ${target.line}</p>`);

  if (suggestion.note) {
    lines.push(`<p>${suggestion.note}</p>`);
  }

  if (target.safetyNotes.length) {
    lines.push(
      `<p><strong>Safety:</strong> ${target.safetyNotes.join(" ")} ${
        troubleShort !== "none"
          ? "Be very aware of the short trouble as well."
          : ""
      }</p>`
    );
  } else if (troubleShort !== "none" || troubleLong !== "none") {
    lines.push(
      `<p><strong>Safety:</strong> Respect ${
        troubleShort !== "none" ? "the short" : ""
      } ${troubleShort !== "none" && troubleLong !== "none" ? "and" : ""} ${
        troubleLong !== "none" ? "long" : ""
      } trouble. Favor a miss that stays in play.</p>`
    );
  }

  // Mindset-specific final note
  if (mindset === "aggressive") {
    lines.push(
      `<p>You're in <span class="highlight">attack mode</span>. Take dead aim only if your dispersion won't bring the big miss into the worst trouble.</p>`
    );
  } else if (mindset === "conservative") {
    lines.push(
      `<p>You're in <span class="highlight">conservative mode</span>. Play for the fat part of the fairway/green and accept a longer putt or next shot.</p>`
    );
  } else {
    lines.push(
      `<p>Normal mindset: solid contact and good target selection will beat hero shots 9 times out of 10.</p>`
    );
  }

  outputEl.style.display = "block";
  outputEl.innerHTML = `<h3>Caddy Suggestion</h3>${lines.join("")}`;
}

function clearCaddyOutput() {
  const outputEl = document.getElementById("caddyOutput");
  if (outputEl) {
    outputEl.style.display = "none";
    outputEl.innerHTML = "";
  }
  const form = document.getElementById("caddyForm");
  if (form) form.reset();
}

// ---------- INIT ----------

document.addEventListener("DOMContentLoaded", () => {
  loadRoundsFromStorage();

  const summary = calcSummary(rounds);

  updateProfileUI(playerProfile, summary);
  updateSummaryStatsUI(summary);
  updateRoundsTable(rounds);

  const roundForm = document.getElementById("roundForm");
  if (roundForm) {
    roundForm.addEventListener("submit", handleRoundFormSubmit);
  }

  const resetBtn = document.getElementById("resetRoundsBtn");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      if (
        confirm(
          "Reset to sample data? This will overwrite your saved rounds in this browser."
        )
      ) {
        resetRoundsToDefault();
        const summary = calcSummary(rounds);
        updateProfileUI(playerProfile, summary);
        updateSummaryStatsUI(summary);
        updateRoundsTable(rounds);
      }
    });
  }

  const caddyForm = document.getElementById("caddyForm");
  if (caddyForm) {
    caddyForm.addEventListener("submit", handleCaddyFormSubmit);
  }

  const clearCaddyBtn = document.getElementById("clearCaddyBtn");
  if (clearCaddyBtn) {
    clearCaddyBtn.addEventListener("click", clearCaddyOutput);
  }
});
