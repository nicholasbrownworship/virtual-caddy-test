// ---------- SAMPLE DATA (you can replace this later) ----------

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

const rounds = [
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

// Practice focus rules – same logic we talked about earlier.
const practiceFocusRules = [
  {
    id: "focus_short_game",
    conditions: {
      up_and_down_percentage_max: 40, // %
      gir_percentage_min: 35 // %
    },
    recommendation: "Short Game Priority",
    details:
      "GIR is serviceable, but you're not converting misses. Spend ~60% of practice on chips, pitches, and bunker play inside 30 yards.",
    metricLabel: "Up & Down %",
    metricKey: "up_and_down_percentage"
  },
  {
    id: "focus_tee_ball",
    conditions: {
      fir_percentage_max: 50,
      penalty_strokes_per_round_min: 1.5
    },
    recommendation: "Tee Shot & Target Selection",
    details:
      "Too many missed fairways and penalties. Dial in a fairway finder and tighten when you choose driver vs. 3-wood/hybrid.",
    metricLabel: "FIR & Penalties",
    metricKeys: ["fir_percentage", "penalty_strokes_per_round"]
  },
  {
    id: "focus_putting",
    conditions: {
      three_putt_rate_min: 0.8
    },
    recommendation: "Lag Putting & 6-Footers",
    details:
      "Three-putts are bleeding strokes. Work on 30–40 ft lag putts and 4–8 ft make range to clean up the card.",
    metricLabel: "3-Putt Rate",
    metricKey: "three_putt_rate"
  }
];

// ---------- CALC HELPERS ----------

function calcSummary(rounds) {
  if (!rounds.length) {
    return null;
  }

  const totalRounds = rounds.length;
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

  rounds.forEach((r) => {
    scoringTotal += r.score;
    firHit += r.fir_hit;
    firPossible += r.fir_possible;
    girHit += r.gir_hit;
    girPossible += r.gir_possible;
    upDownSuccess += r.up_and_down_success;
    upDownAttempts += r.up_and_down_attempts;
    sandSuccess += r.sand_saves_success;
    sandAttempts += r.sand_saves_attempts;
    puttsTotal += r.putts;
    threePuttsTotal += r.three_putts;
    penaltyTotal += r.penalty_strokes;

    par3Score += r.par3_score;
    par3Holes += r.par3_holes;
    par4Score += r.par4_score;
    par4Holes += r.par4_holes;
    par5Score += r.par5_score;
    par5Holes += r.par5_holes;
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
  const puttsPerRound = puttsTotal / totalRounds;
  const threePuttRate = threePuttsTotal / totalRounds;
  const penaltyStrokesPerRound = penaltyTotal / totalRounds;

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

// ---------- PRACTICE FOCUS ENGINE ----------

function doesSummaryMatchConditions(summary, conditions) {
  if (!conditions) return true;

  // For each *possible* key, check if there's a bound and compare.
  if (
    conditions.up_and_down_percentage_max !== undefined &&
    summary.up_and_down_percentage > conditions.up_and_down_percentage_max
  ) {
    return false;
  }

  if (
    conditions.gir_percentage_min !== undefined &&
    summary.gir_percentage < conditions.gir_percentage_min
  ) {
    return false;
  }

  if (
    conditions.fir_percentage_max !== undefined &&
    summary.fir_percentage > conditions.fir_percentage_max
  ) {
    return false;
  }

  if (
    conditions.penalty_strokes_per_round_min !== undefined &&
    summary.penalty_strokes_per_round <
      conditions.penalty_strokes_per_round_min
  ) {
    return false;
  }

  if (
    conditions.three_putt_rate_min !== undefined &&
    summary.three_putt_rate < conditions.three_putt_rate_min
  ) {
    return false;
  }

  return true;
}

function getPracticeFocus(summary) {
  if (!summary) return [];

  const matches = [];

  practiceFocusRules.forEach((rule) => {
    if (doesSummaryMatchConditions(summary, rule.conditions)) {
      matches.push(rule);
    }
  });

  return matches;
}

// ---------- DOM BINDING ----------

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
  }
}

function updateSummaryStatsUI(summary) {
  if (!summary) return;

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

function updateRoundsTable(rounds) {
  const tbody = document.getElementById("roundsTableBody");
  tbody.innerHTML = "";

  rounds.forEach((r) => {
    const tr = document.createElement("tr");

    const firPct = r.fir_possible
      ? (r.fir_hit / r.fir_possible) * 100
      : 0;
    const girPct = r.gir_possible
      ? (r.gir_hit / r.gir_possible) * 100
      : 0;

    tr.innerHTML = `
      <td>${r.date}</td>
      <td>
        <span class="round-tag">${r.course}</span>
      </td>
      <td>${r.score}</td>
      <td>${firPct.toFixed(0)}%</td>
      <td>${girPct.toFixed(0)}%</td>
      <td>${r.putts}</td>
      <td>${r.three_putts}</td>
      <td>${r.penalty_strokes}</td>
    `;

    tbody.appendChild(tr);
  });

  const badge = document.getElementById("roundCountBadge");
  badge.textContent = `${rounds.length} Rounds`;
}

function updatePracticeFocusUI(summary, focusRulesMatched) {
  const container = document.getElementById("focusList");
  container.innerHTML = "";

  if (!summary) {
    container.innerHTML =
      "<p class='focus-body'>Add at least one round to generate practice recommendations.</p>";
    return;
  }

  if (!focusRulesMatched.length) {
    const div = document.createElement("div");
    div.className = "focus-card";
    div.innerHTML = `
      <div class="focus-title-row">
        <div class="focus-title">Balanced Bag</div>
        <span class="focus-tag">Keep Going</span>
      </div>
      <div class="focus-body">
        None of the current rules are firing hard, which means you're reasonably balanced. 
        Keep tracking rounds so the Virtual Caddy can spot a clear weakness to exploit.
      </div>
    `;
    container.appendChild(div);
    return;
  }

  focusRulesMatched.forEach((rule) => {
    const div = document.createElement("div");
    div.className = "focus-card";

    let metricLine = "";
    if (rule.metricKey && summary[rule.metricKey] !== undefined) {
      const val = summary[rule.metricKey];
      const formatted =
        rule.metricKey.includes("percentage") || rule.metricKey.includes("rate")
          ? formatNumber(val, 1)
          : formatNumber(val, 1);
      metricLine = `<div class="focus-metric"><strong>${rule.metricLabel}:</strong> ${formatted}</div>`;
    } else if (rule.metricKeys && rule.metricKeys.length) {
      const parts = rule.metricKeys
        .map((key) => {
          const label =
            key === "fir_percentage"
              ? "FIR"
              : key === "penalty_strokes_per_round"
              ? "Penalties/Rd"
              : key;
          const val = summary[key];
          if (val === undefined) return null;
          const formatted = key.includes("percentage")
            ? formatPercent(val, 0)
            : formatNumber(val, 1);
          return `${label}: ${formatted}`;
        })
        .filter(Boolean);
      if (parts.length) {
        metricLine = `<div class="focus-metric"><strong>${rule.metricLabel}:</strong> ${parts.join(
          " · "
        )}</div>`;
      }
    }

    div.innerHTML = `
      <div class="focus-title-row">
        <div class="focus-title">${rule.recommendation}</div>
        <span class="focus-tag">Priority Block</span>
      </div>
      <div class="focus-body">
        ${rule.details}
      </div>
      ${metricLine}
    `;

    container.appendChild(div);
  });
}

// ---------- INIT ----------

document.addEventListener("DOMContentLoaded", () => {
  const summary = calcSummary(rounds);
  const focus = getPracticeFocus(summary);

  updateProfileUI(playerProfile, summary);
  updateSummaryStatsUI(summary);
  updateRoundsTable(rounds);
  updatePracticeFocusUI(summary, focus);
});
