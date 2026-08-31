let dictionary;

const $ = id => document.getElementById(id);
const separator = "--------";
const itemTypes = new Map([
  ["弓", "Bow"], ["片手剣", "One Handed Sword"], ["両手剣", "Two Handed Sword"],
  ["爪", "Claw"], ["鉤爪", "Claw"], ["短剣", "Dagger"], ["ルーンの短剣", "Rune Dagger"],
  ["刺突剣", "Thrusting One Handed Sword"],
  ["片手斧", "One Handed Axe"], ["両手斧", "Two Handed Axe"],
  ["片手棍", "One Handed Mace"], ["片手メイス", "One Handed Mace"],
  ["両手棍", "Two Handed Mace"], ["両手メイス", "Two Handed Mace"],
  ["セプター", "Sceptre"], ["杖", "Staff"], ["スタッフ", "Staff"],
  ["戦闘杖", "Warstaff"], ["ウォースタッフ", "Warstaff"], ["ワンド", "Wand"], ["釣り竿", "Fishing Rod"]
]);
const stateWords = new Map([
  ["ミラー状態", "Mirrored"], ["コラプト状態", "Corrupted"], ["未鑑定", "Unidentified"],
  ["シェイパーアイテム", "Shaper Item"], ["エルダーアイテム", "Elder Item"],
  ["ハンターアイテム", "Hunter Item"], ["ウォーロードアイテム", "Warlord Item"],
  ["レディーマーアイテム", "Redeemer Item"], ["レデンプターアイテム", "Redeemer Item"],
  ["クルセイダーアイテム", "Crusader Item"], ["シアリング・エグザークのアイテム", "Searing Exarch Item"],
  ["イーター・オブ・ワールズのアイテム", "Eater of Worlds Item"],
  ["フラクチャーアイテム", "Fractured Item"], ["合成アイテム", "Synthesised Item"]
]);
const manualExact = new Map([
  // The client uses 確率 in this unique-mod line while the trade data uses 率.
  ["ブロック確率が幸運になる", "Chance to Block is Lucky"],
  ["ブロック率が幸運になる", "Chance to Block is Lucky"]
]);
const fixed = new Map([
  ["アイテムクラス", "Item Class"], ["レアリティ", "Rarity"],
  ["品質", "Quality"], ["物理ダメージ", "Physical Damage"],
  ["元素ダメージ", "Elemental Damage"], ["クリティカル率", "Critical Strike Chance"],
  ["秒間アタック回数", "Attacks per Second"], ["武器攻撃距離", "Weapon Range"],
  ["アーマー", "Armour"], ["回避力", "Evasion Rating"], ["回避値", "Evasion Rating"],
  ["エナジーシールド", "Energy Shield"], ["ブロック率", "Chance to Block"],
  ["ワード", "Ward"], ["装備要求", "Requirements"], ["レベル", "Level"],
  ["筋力", "Str"], ["器用さ", "Dex"], ["知性", "Int"], ["ソケット", "Sockets"],
  ["アイテムレベル", "Item Level"], ["個数制限", "Limited to"], ["半径", "Radius"],
  ["タリスマンティア", "Talisman Tier"], ["メモリーストランド", "Memory Strands"],
  ["幽体化度", "Intangibility"], ["Intangibility", "Intangibility"],
  ["コラプト状態", "Corrupted"],
  ["ミラー状態", "Mirrored"], ["未鑑定", "Unidentified"]
]);
const foilColors = new Map([
  ["紫水晶", "Amethyst"], ["ルビー", "Ruby"], ["エメラルド", "Emerald"],
  ["真珠", "Pearl"], ["黄玉", "Topaz"], ["琥珀", "Aureate"],
  ["夕焼け", "Sunset"], ["紺碧", "Cobalt"], ["緑青", "Verdant"]
]);
const catalystQualities = new Map([
  ["アタックモッド", "Attack Modifiers"], ["スピードモッド", "Speed Modifiers"],
  ["ライフ・マナモッド", "Life and Mana Modifiers"], ["キャスターモッド", "Caster Modifiers"],
  ["能力値モッド", "Attribute Modifiers"], ["物理・混沌ダメージモッド", "Physical and Chaos Damage Modifiers"],
  ["耐性モッド", "Resistance Modifiers"], ["防御モッド", "Defence Modifiers"],
  ["防御力モッド", "Defence Modifiers"], ["元素ダメージモッド", "Elemental Damage Modifiers"],
  ["クリティカルモッド", "Critical Modifiers"]
]);
const characterClasses = new Map([
  ["マローダー", "Marauder"], ["レンジャー", "Ranger"], ["ウィッチ", "Witch"],
  ["デュエリスト", "Duelist"], ["テンプラー", "Templar"], ["シャドウ", "Shadow"], ["サイオン", "Scion"]
]);

function normalize(text) {
  return text.replace(/\r\n?/g, "\n").replace(/[：]/g, ":").trim();
}

function applyTemplate(template, match) {
  return template.replace(/\$(\d+)/g, (_, n) => {
    const value = match[Number(n)] ?? "";
    return dictionary?.exact?.[value] || value;
  });
}

function translateByRule(text) {
  for (const rule of dictionary.rules || []) {
    const match = rule.regex.exec(text);
    if (match) return applyTemplate(rule.en, match);
  }
}

function translateBuffStat(text) {
  let normalized = text.replace(/^(.+?)([+−-][\d.,]+(?:\([^)]+\))?(?:\s+\(augmented\))?)$/, "$1 $2");
  normalized = normalized.replace(/^(.+?)([+−-]?[\d.,]+(?:\([^)]+\))?(?:\s+\(augmented\))?%)(増加|減少|上昇|低下)$/, "$1が$2$3する");
  return manualExact.get(normalized) || dictionary.exact?.[normalized] || translateByRule(normalized);
}

function translateAdvancedMetadata(inner) {
  const parts = inner.trim().split(/\s+[-—]\s+/);
  parts[0] = dictionary.modifierTypes?.[parts[0]]
    || parts[0].replace(/[ぁ-んァ-ヶ一-龯々ー]+モッド/g, "Modifier");
  if (parts[1]) {
    parts[1] = parts[1].split(/[、,]/).map(value => {
      const tag = value.trim();
      return dictionary.modTags?.[tag] || dictionary.modTags?.[`${tag}力`] || tag;
    }).join(", ");
  }
  return parts.join(" - ");
}

function foilType(value) {
  if (dictionary?.exact?.[value]) return dictionary.exact[value];
  const celestial = value.match(/^天体の(.+)$/);
  if (celestial && foilColors.has(celestial[1])) return `Celestial ${foilColors.get(celestial[1])}`;
  return value;
}

function isFoilLine(line) {
  return /^フォイルユニーク(?:\s*[（(].*[）)])?$/.test(line);
}

function isStateLine(line) {
  const clean = line.trim().replace(/^##\s*/, "");
  return stateWords.has(clean) || isFoilLine(clean);
}

function isTerminalLine(line) {
  const clean = line.trim().replace(/^##\s*/, "");
  return isStateLine(clean) || Boolean(dictionary.tailExact?.[clean]) || /^(?:メモ|Note):/i.test(clean);
}

function isKnownFlavourBlock(lines) {
  if (!dictionary.flavourExact || !lines.length) return false;
  const key = lines.map(line => line.trim()).filter(Boolean).join("\n");
  return Object.prototype.hasOwnProperty.call(dictionary.flavourExact, key);
}

function prefixedItemName(value) {
  for (const [jp, en] of Object.entries(dictionary.namePrefixes || {})) {
    if (!value.startsWith(jp)) continue;
    const suffix = value.slice(jp.length);
    if (!/^[\s・]/.test(suffix)) continue;
    const name = dictionary.exact?.[suffix.replace(/^[\s・]+/, "")];
    if (name) return `${en} ${name}`;
  }
}

function baseNameFromDisplayName(value) {
  let found = "";
  for (const base of Object.keys(dictionary.baseNames || {})) {
    if (value.endsWith(base) && base.length > found.length) found = base;
  }
  return found;
}

function convertLine(line) {
  let original = line.trim().replace(/^##\s*/, "");
  if (!original) return { text: "", converted: true, kind: "empty" };
  if (/^-{5,}$/.test(original)) return { text: separator, converted: true, kind: "separator" };
  if (/^(?:メモ|Note):/i.test(original)) return { text: "", converted: true, omitted: true, ignored: true, kind: "tail", source: original };
  if (/^\(.*\)$/.test(original)) return { text: "", converted: true, omitted: true, ignored: true, kind: "tail", source: original };
  const advanced = original.match(/^\{\s*(.*?)\s*\}$/);
  if (advanced) return { text: `{ ${translateAdvancedMetadata(advanced[1])} }`, converted: true, kind: "metadata" };
  const localizedLabel = original.match(/^\[([^|\]]+)\|[^\]]+\](.*)$/);
  if (localizedLabel) original = localizedLabel[1] + localizedLabel[2];
  const tagMatch = original.match(/\s+(\((?:enchant|implicit|fractured|crafted)\))$/i);
  const tag = tagMatch?.[1] || "";
  const clean = original.replace(/\s+(\((?:enchant|implicit|fractured|crafted)\))$/i, "")
    .replace(/\s*[-—]\s*(?:プレフィックス|サフィックス|スケールできない値)\s*$/, "");

  if (itemTypes.has(clean)) return { text: itemTypes.get(clean), converted: true, kind: "property" };
  if (dictionary.classes?.[clean]) return { text: dictionary.classes[clean], converted: true, kind: "property" };
  if (stateWords.has(clean)) return { text: stateWords.get(clean), converted: true, kind: "state" };
  if (clean === "フォイルユニーク") return { text: "Foil Unique", converted: true, kind: "state" };
  const foil = clean.match(/^フォイルユニーク\s*[（(](.*?)[）)]$/);
  if (foil) return { text: `Foil Unique (${foilType(foil[1])})`, converted: true, kind: "state" };
  const classRequirement = clean.match(/^クラス::\s*(.+?)(\s+\(unmet\))?$/);
  if (classRequirement) {
    const className = characterClasses.get(classRequirement[1]) || classRequirement[1];
    return { text: `Class:: ${className}${classRequirement[2] || ""}`, converted: true, kind: "property" };
  }
  const flaskDuration = clean.match(/^([\d.,]+(?:\s+\(augmented\))?)秒間持続$/);
  if (flaskDuration) return { text: `Lasts ${flaskDuration[1]} Seconds`, converted: true, kind: "property" };
  const flaskCharges = clean.match(/^使用時に([\d.,]+)中([\d.,]+(?:\s+\(augmented\))?)チャージを消費$/);
  if (flaskCharges) return { text: `Consumes ${flaskCharges[2]} of ${flaskCharges[1]} Charges on use`, converted: true, kind: "property" };
  const currentCharges = clean.match(/^現在([\d.,]+)チャージ$/);
  if (currentCharges) return { text: `Currently has ${currentCharges[1]} Charges`, converted: true, kind: "property" };
  const recovery = clean.match(/^([+−-]?[\d.,]+(?:\([^)]+\))?(?:\s+\(augmented\))?)秒間で([+−-]?[\d.,]+(?:\([^)]+\))?(?:\s+\(augmented\))?)(ライフ|マナ)回復$/);
  if (recovery) return { text: `Recovers ${recovery[2]} ${recovery[3] === "ライフ" ? "Life" : "Mana"} over ${recovery[1]} Seconds`, converted: true, kind: "property" };
  const buff = clean.match(/^バフは(.+)を付与する$/);
  if (buff) {
    const translated = translateBuffStat(buff[1]);
    if (translated) return { text: `Buff grants ${translated}${tag ? ` ${tag}` : ""}`, converted: true, kind: "property" };
  }
  if (dictionary.tailExact?.[clean]) return { text: "", converted: true, omitted: true, ignored: true, kind: "tail", source: original };
  const exact = manualExact.get(clean) || dictionary.exact?.[clean];
  if (exact) return { text: `${exact}${tag ? ` ${tag}` : ""}`, converted: true, kind: "known" };
  const prefixedName = prefixedItemName(clean);
  if (prefixedName) return { text: prefixedName, converted: true, kind: "known" };

  const colon = clean.indexOf(":");
  if (colon >= 0) {
    const key = clean.slice(0, colon).trim();
    const value = clean.slice(colon + 1).trim();
    if (key === "アイテムクラス") return { text: `Item Class: ${dictionary.classes[value] || value}`, converted: true, kind: "header" };
    if (key === "レアリティ") return { text: `Rarity: ${dictionary.rarities[value] || value}`, converted: true, kind: "header" };
    const catalyst = key.match(/^品質 \((.+)\)$/);
    if (catalyst && catalystQualities.has(catalyst[1])) {
      return { text: `Quality (${catalystQualities.get(catalyst[1])}): ${value}`, converted: true, kind: "property" };
    }
    if (fixed.has(key)) {
      const translatedValue = (key === "半径" ? ({ 小:"Small", 中:"Medium", 大:"Large" }[value] || value) : value)
        .replace(/メートル/g, "metres");
      return { text: `${fixed.get(key)}: ${translatedValue}`.trimEnd(), converted: true, kind: "property" };
    }
    if (/^[A-Za-z][A-Za-z ]*$/.test(key)) {
      return { text: `${key}: ${value.replace(/メートル/g, "metres")}`.trimEnd(), converted: true, kind: "property" };
    }
  }

  const translatedRule = translateByRule(clean);
  if (translatedRule) return { text: `${translatedRule}${tag ? ` ${tag}` : ""}`, converted: true, kind: "mod" };

  if (![...clean].some(c => /[ぁ-んァ-ヶ一-龯]/.test(c))) return { text: clean, converted: true, kind: "raw" };
  return { text: clean, converted: false, kind: "unknown", source: original };
}

function isNarrativeLine(line) {
  return line.length >= 4 && !/[\d:+%=-]/.test(line) && /[。！？、]$/.test(line);
}

function isNarrativeText(line) {
  return line.length >= 4 && !/[\d:+%=-]/.test(line);
}

function isIgnorableBlock(results, hasLaterBoundary, hasPriorMod, isLastBlock) {
  const unknown = results.filter(result => result.kind === "unknown");
  return unknown.length >= 2 && unknown.length === results.length && (hasLaterBoundary || isLastBlock) && hasPriorMod
    && unknown.every(result => isNarrativeText(result.source || result.text))
    && unknown.some(result => isNarrativeLine(result.source || result.text));
}

function convert(text) {
  let converted = 0;
  const criticalUnknown = [];
  const ignored = [];
  const blocks = normalize(text).split(/\n-{5,}\n/);
  const outputBlocks = [];
  const multilineRules = dictionary.rules.filter(rule => rule.regex.source.includes("\\n"));
  const laterBoundary = blocks.map((block, index) => index > 0 && block.split("\n").some(isTerminalLine));
  let seenMod = false;
  for (let blockIndex = 0; blockIndex < blocks.length; blockIndex++) {
    const block = blocks[blockIndex];
    const lines = block.split("\n").map(line => line.trim().replace(/^##\s*/, "")).filter(Boolean);
    const rarityIndex = lines.findIndex(line => /^レアリティ:\s*(?:ノーマル|マジック|レア)$/.test(line.replace("：", ":")));
    const rarity = rarityIndex >= 0 && lines[rarityIndex].replace("：", ":").split(":")[1].trim();
    if (rarity === "レア") {
      const baseIndex = lines.findIndex((line, index) => index > rarityIndex + 1 && dictionary.exact[line]);
      if (baseIndex > rarityIndex + 1) lines[rarityIndex + 1] = "Rare Item";
    } else if ((rarity === "ノーマル" || rarity === "マジック") && lines[rarityIndex + 1]) {
      const base = baseNameFromDisplayName(lines[rarityIndex + 1]);
      if (base) lines[rarityIndex + 1] = base;
    }
    const hasLaterBoundary = laterBoundary.slice(blockIndex + 1).some(Boolean);
    if (blockIndex > 0 && isKnownFlavourBlock(lines)) {
      lines.forEach(line => ignored.push({ line, category: "flavour", block: blockIndex + 1 }));
      continue;
    }
    const results = [];
    const explicitlyIgnored = [];
    for (let i = 0; i < lines.length; i++) {
      let matched = false;
      for (const rule of multilineRules) {
        const lineCount = (rule.regex.source.match(/\\n/g) || []).length + 1;
        const match = rule.regex.exec(lines.slice(i, i + lineCount).join("\n"));
        if (!match) continue;
        results.push({ text: applyTemplate(rule.en, match), converted: true });
        i += lineCount - 1;
        matched = true;
        break;
      }
      if (!matched) {
        const result = convertLine(lines[i]);
        if (result.omitted) explicitlyIgnored.push(result);
        else if (result.text) results.push(result);
      }
    }
    explicitlyIgnored.forEach(result => ignored.push({ line: result.source || result.text, category: "tail", block: blockIndex + 1 }));
    const blockHasMod = results.some(result => result.kind === "mod" || (result.kind === "known" && blockIndex > 0));
    const ignoredBlock = isIgnorableBlock(results, hasLaterBoundary, seenMod || blockHasMod, blockIndex === blocks.length - 1);
    if (ignoredBlock) {
      results.forEach(result => ignored.push({ line: result.source || result.text, category: "tail", block: blockIndex + 1 }));
      continue;
    }
    let trailingFlavor = 0;
    for (let i = results.length - 1; i >= 0 && results[i].kind === "unknown" && isNarrativeLine(results[i].source || results[i].text); i--) trailingFlavor++;
    if (hasLaterBoundary && trailingFlavor >= 2) {
      results.splice(-trailingFlavor).forEach(result => ignored.push({ line: result.source || result.text, category: "tail", block: blockIndex + 1 }));
    }
    const firstMod = results.findIndex(result => result.kind === "mod");
    const hasProperty = results.some(result => result.kind === "property");
    const hasState = results.some(result => result.kind === "state");
    for (let resultIndex = 0; resultIndex < results.length; resultIndex++) {
      const result = results[resultIndex];
      if (result.kind === "unknown" && hasState && isNarrativeLine(result.source || result.text)) {
        result.omitted = true;
        ignored.push({ line: result.source || result.text, category: "tail", block: blockIndex + 1 });
        continue;
      }
      if (result.converted) converted++;
      if (result.kind === "unknown") {
        const category = blockIndex === 0 ? "header"
          : firstMod >= 0 && resultIndex >= firstMod ? "mod"
          : hasProperty ? "property"
          : /:/.test(result.source || result.text) ? "property"
          : hasState ? "state"
          : blockIndex > 0 ? "mod"
          : "unknown-structure";
        criticalUnknown.push({ line: result.source || result.text, category, block: blockIndex + 1 });
      }
    }
    const outputLines = results.filter(result => !result.omitted).map(result => result.text);
    if (outputLines.length) outputBlocks.push(outputLines.join("\n"));
    if (blockHasMod) seenMod = true;
  }
  const output = outputBlocks.join(`\n${separator}\n`);
  return { output, converted, criticalUnknown, ignored, unknown: criticalUnknown.map(item => item.line) };
}

function formatReport(result) {
  const section = (title, items) => [
    `${title}: ${items.length}行`,
    ...(items.length ? items.map(item => `- [${item.category} / block ${item.block ?? "?"}] ${item.line}`) : ["- なし"])
  ];
  return [
    "PoE JP → EN 未変換レポート",
    "",
    ...section("PoB必須項目の未変換", result.criticalUnknown),
    "",
    ...section("PoB非依存として除外", result.ignored)
  ].join("\n");
}

async function copyField(field, successMessage) {
  try {
    await navigator.clipboard.writeText(field.value);
    $("summary").className = "summary";
    $("summary").textContent = successMessage;
  } catch {
    field.select();
    const copied = document.execCommand("copy");
    field.setSelectionRange(0, 0);
    $("summary").className = `summary${copied ? "" : " warning"}`;
    $("summary").textContent = copied ? successMessage : "コピーできませんでした。欄内から手動でコピーしてください";
  }
}

async function loadDictionary() {
  const status = $("status");
  try {
    if (window.POE_DICTIONARY) dictionary = window.POE_DICTIONARY;
    else {
      const response = await fetch("dictionary.json", { cache: "no-cache" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      dictionary = await response.json();
    }
    if (!dictionary.rules?.length || !Object.keys(dictionary.exact || {}).length) throw new Error("辞書が空です");
    dictionary.rules = dictionary.rules.map(rule => ({ ...rule, regex: new RegExp(rule.jp) }));
    status.textContent = `辞書準備完了: 固有表記 ${Object.keys(dictionary.exact).length.toLocaleString()}件 / Mod ${dictionary.rules.length.toLocaleString()}件 / 種別 ${Object.keys(dictionary.modifierTypes || {}).length}件 / タグ ${Object.keys(dictionary.modTags || {}).length}件`;
    $("convert").disabled = false;
  } catch (error) {
    status.textContent = `辞書読み込み失敗: ${error.message}`;
    status.classList.add("warning");
  }
}

if (typeof document !== "undefined") {
  $("convert").addEventListener("click", () => {
    const result = convert($("input").value);
    $("output").value = result.output;
    if ($("report-output")) $("report-output").value = formatReport(result);
    if ($("report-panel")) $("report-panel").hidden = false;
    $("copy").disabled = !result.output || result.criticalUnknown.length > 0;
    if ($("copy-report")) $("copy-report").disabled = false;
    $("summary").className = `summary${result.criticalUnknown.length ? " warning" : ""}`;
    if (result.criticalUnknown.length) {
      const preview = result.criticalUnknown.slice(0, 4).map(item => `[${item.category}] ${item.line}`).join(" / ");
      $("summary").textContent = `PoB必須項目の未変換 ${result.criticalUnknown.length}行（コピー不可） / PoB非依存項目を${result.ignored.length}行除外: ${preview}`;
    } else {
      $("summary").textContent = `変換完了: ${result.converted}行 / PoB非依存項目を${result.ignored.length}行除外`;
    }
  });
  $("copy").addEventListener("click", async () => {
    const output = $("output");
    if (!output.value) return;
    await copyField(output, "変換結果をコピーしました");
  });
  $("copy-report")?.addEventListener("click", async () => {
    const report = $("report-output");
    if (!report.value) return;
    await copyField(report, "未変換レポートをコピーしました");
  });
  $("paste").addEventListener("click", async () => {
    try {
      $("input").value = await navigator.clipboard.readText();
      $("output").value = "";
      if ($("report-output")) $("report-output").value = "";
      if ($("report-panel")) $("report-panel").hidden = true;
      $("copy").disabled = true;
      if ($("copy-report")) $("copy-report").disabled = true;
      $("summary").className = "summary";
      $("summary").textContent = "クリップボードから貼り付けました";
    } catch {
      $("summary").className = "summary warning";
      $("summary").textContent = "貼り付けが許可されませんでした。入力欄で Ctrl+V を使用してください";
      $("input").focus();
    }
  });
  $("reset").addEventListener("click", () => {
    $("input").value = "";
    $("output").value = "";
    if ($("report-output")) $("report-output").value = "";
    if ($("report-panel")) $("report-panel").hidden = true;
    $("copy").disabled = true;
    if ($("copy-report")) $("copy-report").disabled = true;
    $("summary").className = "summary";
    $("summary").textContent = "リセットしました";
    $("input").focus();
  });
  loadDictionary();
}

if (typeof module !== "undefined") module.exports = { convert, convertLine, formatReport, normalize, setDictionary: value => { dictionary = value; } };
