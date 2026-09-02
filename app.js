let dictionary;

const APP_VERSION = "v0.2.11";
const APP_UPDATED = "2026-09-02 10:57 JST";
const ISSUE_REPOSITORY = "tanakarx78-cyber/poe-item-jp2en-preview";

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
  ["フラクチャーアイテム", "Fractured Item"], ["合成アイテム", "Synthesised Item"],
  ["シンセサイズアイテム", "Synthesised Item"], ["シンセシスアイテム", "Synthesised Item"],
  ["合成されたアイテム", "Synthesised Item"]
]);
const manualExact = new Map([
  // The client uses 確率 in this unique-mod line while the trade data uses 率.
  ["ブロック確率が幸運になる", "Chance to Block is Lucky"],
  ["ブロック率が幸運になる", "Chance to Block is Lucky"],
  ["アビス", "Abyss"],
  ["上品な傲慢", "Elegant Hubris"],
  ["範囲内のパッシブは永遠の帝国に征服される", "Passives in radius are Conquered by the Eternal Empire"],
  ["範囲内のパッシブはエターナル帝国に征服される", "Passives in radius are Conquered by the Eternal Empire"]
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
  ["コスト・リザーブ倍率", "Cost & Reservation Multiplier"], ["品質による追加の効果", "Additional Effects From Quality"],
  ["タリスマンティア", "Talisman Tier"], ["メモリーストランド", "Memory Strands"],
  ["クラスタージュエルスキル", "Cluster Jewel Skill"], ["クラスタージュエルノード数", "Cluster Jewel Node Count"],
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
const metadataTags = new Map([
  ["防御", "Defences"], ["防御力", "Defences"], ["アーマー", "Armour"],
  ["回避", "Evasion"], ["回避力", "Evasion"], ["エナジーシールド", "Energy Shield"],
  ["元素", "Elemental"], ["火", "Fire"], ["冷気", "Cold"], ["雷", "Lightning"],
  ["混沌", "Chaos"], ["耐性", "Resistance"], ["ダメージ", "Damage"],
  ["攻撃", "Attack"], ["アタック", "Attack"], ["キャスター", "Caster"],
  ["スペル", "Spell"], ["クリティカル", "Critical"], ["マナ", "Mana"],
  ["ライフ", "Life"], ["スピード", "Speed"], ["範囲", "Area"],
  ["状態異常", "Ailment"], ["プレフィックス", "Prefix"], ["サフィックス", "Suffix"],
  ["スケールできない値", "Unscalable Value"]
]);
const metadataAffixAliases = new Map([
  // Some Japanese client builds show the seal suffix with an extra "ジア".
  ["アジアカの", "アシカの"]
]);
const characterClasses = new Map([
  ["マローダー", "Marauder"], ["レンジャー", "Ranger"], ["ウィッチ", "Witch"],
  ["デュエリスト", "Duelist"], ["テンプラー", "Templar"], ["シャドウ", "Shadow"], ["サイオン", "Scion"]
]);
const gemTags = new Map([
  ["アタック", "Attack"], ["キャスター", "Caster"], ["スペル", "Spell"], ["サポート", "Support"],
  ["クリティカル", "Critical"], ["投射物", "Projectile"], ["範囲", "Area"], ["効果範囲", "AoE"],
  ["近接", "Melee"], ["ストライク", "Strike"], ["スラム", "Slam"], ["持続時間", "Duration"],
  ["ミニオン", "Minion"], ["トーテム", "Totem"], ["トラップ", "Trap"], ["マイン", "Mine"],
  ["呪い", "Curse"], ["オーラ", "Aura"], ["物理", "Physical"], ["火", "Fire"],
  ["冷気", "Cold"], ["雷", "Lightning"], ["混沌", "Chaos"], ["移動", "Movement"],
  ["チャネリング", "Channelling"], ["トリガー", "Trigger"], ["ガード", "Guard"], ["ウォークライ", "Warcry"],
  ["ブリンク", "Blink"], ["ブランド", "Brand"], ["弓", "Bow"], ["オーブ", "Orb"]
]);
const supportedSkillContexts = new Map([
  ["ソケットされたジェム", "Socketed Gems"],
  ["ヘルメットにソケットされたスキル", "Skills Socketed in your Helmet"],
  ["グローブにソケットされたスキル", "Skills Socketed in your Gloves"],
  ["ブーツにソケットされたスキル", "Skills Socketed in your Boots"],
  ["パッシブツリーによって付与されたスキル", "Skills granted by your Passive Tree"],
  ["装備中の鎧によるスキル", "Skills from Equipped Body Armour"],
  ["サポートされたジェム", "Socketed Gems"],
  ["ソケットされたスペル", "Socketed Spells"],
  ["ソケットされたスラムジェム", "Socketed Slam Gems"]
]);

function normalize(text) {
  return text.replace(/\r\n?/g, "\n").replace(/[：]/g, ":").replace(/[（）]/g, match => match === "（" ? "(" : ")").trim();
}

function applyTemplate(template, match) {
  const captures = match.slice(1).filter(value => value !== undefined);
  return template.replace(/\$(\d+)/g, (_, n) => {
    const value = match[Number(n)] ?? (captures.length === 1 ? captures[0] : "");
    return exactLookup(value) || value;
  });
}

function exactLookup(value) {
  return dictionary?.keystoneNames?.[value]
    || dictionary?.exact?.[value]
    || dictionary?.exact?.[value.replace(/\(/g, "（").replace(/\)/g, "）")];
}

function ruleInputVariants(text) {
  const variants = [text];
  const withoutDisplayAlias = text.replace(/^([^()\d]+)\([^)]*[ぁ-んァ-ヶ一-龯][^)]*\)(?=(?:と)?の)/, "$1");
  if (withoutDisplayAlias !== text) variants.unshift(withoutDisplayAlias);
  for (const variant of [...variants]) {
    const conquered = variant.replace(/(範囲内のパッシブ(?:スキル)?は[^\n]+に)支配される/g, "$1征服される");
    if (conquered !== variant) variants.unshift(conquered);
  }
  return [...new Set(variants)];
}

function translateByRule(text) {
  const variants = ruleInputVariants(text);
  if (/(?:により|によって|に)サポートされる$/.test(text)) {
    const withoutDisplayAlias = text.replace(/([ぁ-んァ-ヶ一-龯々ー]+)\([^()]*-[^()]*\)(?=(?:により|によって|に)サポートされる)/g, "$1");
    if (withoutDisplayAlias !== text) variants.unshift(withoutDisplayAlias);
  }
  for (const variant of variants) {
    for (const rule of dictionary.rules || []) {
      const match = rule.regex.exec(variant);
      if (match) return applyTemplate(rule.en, match);
    }
  }
}

function translateSupportName(name) {
  const exact = exactLookup(name);
  if (exact) return exact;
  const canonical = `ソケットされたジェムはレベル1${name}によりサポートされる`;
  const translated = translateByRule(canonical);
  const match = translated?.match(/^Socketed Gems are [Ss]upported by Level 1 (.+)$/);
  return match && !containsJapanese(match[1]) ? match[1] : undefined;
}

function translateSupportedByLevel(text) {
  const match = text.match(/^(.+?)はレベル\s*([+−-]?[\d.,]+(?:\([+−-]?[\d.,]+(?:\s*[-–]\s*[+−-]?[\d.,]+)?\))?)\s*(.+?)(?:により|によって|に)サポートされる$/);
  if (!match || !supportedSkillContexts.has(match[1])) return;
  const supportName = match[3].replace(/\([^()]*-[^()]*\)$/, "").trim();
  const translatedSupport = translateSupportName(supportName);
  const levelLabel = /^(?:ソケットされたジェム|サポートされたジェム)$/.test(match[1]) ? "Level" : "level";
  const translated = `${supportedSkillContexts.get(match[1])} are Supported by ${levelLabel} ${match[2]} ${translatedSupport || supportName}`;
  return { text: translated, converted: Boolean(translatedSupport), incomplete: !translatedSupport, kind: "mod", source: text };
}

function containsJapanese(text) {
  return /[ぁ-んァ-ヶ一-龯々]/.test(text);
}

function translateBuffStat(text) {
  let normalized = text.replace(/^(.+?)([+−-][\d.,]+(?:\([^)]+\))?(?:\s+\(augmented\))?)$/, "$1 $2");
  normalized = normalized.replace(/^(.+?)([+−-]?[\d.,]+(?:\([^)]+\))?(?:\s+\(augmented\))?%)(増加|減少|上昇|低下)$/, "$1が$2$3する");
  return manualExact.get(normalized) || exactLookup(normalized) || translateByRule(normalized);
}

function translateModifierType(value) {
  const type = value.trim();
  return dictionary.modifierTypes?.[type]
    || ({
      "プレフィックスモッド": "Prefix Modifier", "サフィックスモッド": "Suffix Modifier",
      "マスタークラフトモッド": "Master Crafted Modifier"
    }[type])
    || type.replace(/[ぁ-んァ-ヶ一-龯々ー]+モッド/g, "Modifier");
}

function translateMetadataTag(value) {
  const tag = value.trim();
  return dictionary.modTags?.[tag]
    || dictionary.modTags?.[`${tag}力`]
    || metadataTags.get(tag)
    || fixed.get(tag)
    || tag;
}

function pickAffix(name, type, options = {}) {
  const lookupName = metadataAffixAliases.get(name) || name;
  const candidates = dictionary.affixNames?.[lookupName] || dictionary.affixNames?.[name];
  if (!Array.isArray(candidates) || !candidates.length) return undefined;
  let filtered = candidates.filter(candidate => !type || candidate.type === type);
  if (!filtered.length) filtered = candidates;
  const domain = options.affixDomain || (options.isCluster ? "affliction_jewel" : "item");
  const domainCandidates = filtered.filter(candidate => candidate.domain === domain);
  if (domainCandidates.length) filtered = domainCandidates;
  return filtered[0];
}

function affixDomainForItem(text) {
  if (/クラスタージュエル/.test(text)) return "affliction_jewel";
  if (/アイテムクラス:\s*アビスジュエル/.test(text)) return "abyss_jewel";
  if (/アイテムクラス:\s*チャーム/.test(text)) return "affliction_charm";
  if (/アイテムクラス:\s*ティンクチャー/.test(text)) return "tincture";
  if (/アイテムクラス:\s*[^\n]*フラスコ/.test(text)) return "flask";
  return "item";
}

function translateAffixName(name, type, options = {}) {
  return pickAffix(name, type, options)?.name || "";
}

function translateTierOrRank(value) {
  return value
    .replace(/\(\s*ティア\s*:\s*/gi, "(Tier: ")
    .replace(/\(\s*ランク\s*:\s*/gi, "(Rank: ");
}

function translateAdvancedMetadata(inner, options = {}) {
  const normalized = inner.trim()
    .replace(/[「」『』]/g, '"')
    .replace(/[：]/g, ":")
    .replace(/[（）]/g, match => match === "（" ? "(" : ")");
  const parts = normalized.split(/\s+[-—]\s+/);
  let heading = parts.shift() || "";
  const quoted = heading.match(/"([^"]*)"/);
  const quotedName = quoted?.[1]?.trim() || "";
  const unquotedHeading = heading.replace(/\s*"[^"]*"\s*/, " ").trim();
  const influence = [
    ["シアリング・エグザーク", "Searing Exarch"],
    ["Searing Exarch", "Searing Exarch"],
    ["イーター・オブ・ワールズ", "Eater of Worlds"],
    ["Eater of Worlds", "Eater of Worlds"]
  ].find(([name]) => unquotedHeading.includes(name));
  if (influence) {
    const label = quotedName || unquotedHeading.match(/\(\s*([^):]+)\s*\)/)?.[1]?.trim();
    const tier = {
      "小": "Lesser", "大": "Greater", "特大": "Grand", "希少": "Exceptional", "格別": "Exceptional",
      "精巧": "Exquisite", "完璧": "Perfect", "下級": "Lesser", "上級": "Greater",
      "Lesser": "Lesser", "Greater": "Greater", "Grand": "Grand",
      "Exceptional": "Exceptional", "Exquisite": "Exquisite", "Perfect": "Perfect"
    }[label] || label;
    heading = `${influence[1]} Implicit Modifier${tier ? ` (${tier})` : ""}`;
  } else {
    const prefixHint = /(?:^|\s)(?:Prefix|プレフィックス(?:モッド)?)(?:\s|$)/i.test(unquotedHeading);
    const suffixHint = /(?:^|\s)(?:Suffix|サフィックス(?:モッド)?)(?:\s|$)/i.test(unquotedHeading);
    const fractured = /(?:^|\s)(?:Fractured|フラクチャー(?:モッド)?)(?:\s|$)/i.test(unquotedHeading);
    const masterCrafted = /(?:Master\s+Crafted|マスタークラフト)/i.test(unquotedHeading);
    const typeHint = prefixHint ? "Prefix" : suffixHint ? "Suffix" : undefined;
    const affixDomain = masterCrafted ? "crafted" : options.affixDomain;
    const affix = quotedName ? pickAffix(quotedName, typeHint, { ...options, affixDomain }) : undefined;
    const affixType = typeHint || affix?.type;
    const japaneseType = unquotedHeading.match(/(プレフィックスモッド|サフィックスモッド|暗黙モッド|クラフトモッド|エンチャントモッド|明示モッド|ユニークモッド|フラクチャーモッド|痕跡暗黙モッド|マスタークラフトモッド)/)?.[1];
    const translatedType = japaneseType ? translateModifierType(japaneseType) : "";
    let modifierType = translatedType;
    if (masterCrafted) modifierType = `Master Crafted${affixType ? ` ${affixType}` : ""} Modifier`;
    else if (fractured) modifierType = `Fractured${affixType ? ` ${affixType}` : ""} Modifier`;
    else if (!modifierType) {
      const englishType = unquotedHeading.match(/(?:Master\s+Crafted|Fractured|Prefix|Suffix|Implicit|Unique|Crafted|Enchantment|Explicit|Vestigial)\s+Modifier/i)?.[0];
      modifierType = englishType || (affixType ? `${affixType} Modifier` : "Modifier");
    } else if ((modifierType === "Modifier" || /^(?:Prefix|Suffix) Modifier$/i.test(modifierType)) && affixType) {
      modifierType = `${affixType} Modifier`;
    }
    heading = `${modifierType}${affix?.name ? ` "${affix.name}"` : ""}`;
    const tierOrRank = unquotedHeading.match(/\((?:\s*(?:ティア|Tier|ランク|Rank)\s*:\s*[^)]+)\)/i)?.[0];
    if (tierOrRank) heading += ` ${translateTierOrRank(tierOrRank)}`;
  }
  parts.unshift(heading);
  if (parts[1]) {
    parts[1] = parts[1].split(/[、,・]/).map(translateMetadataTag).join(", ");
  }
  if (parts[2]) parts[2] = parts[2]
    .replace(/^スケールできない値$/, "Unscalable Value")
    .replace(/^(\d+(?:\.\d+)?)%(?:増加|上昇)$/, "$1% increased")
    .replace(/^(\d+(?:\.\d+)?)%(?:減少|低下)$/, "$1% reduced");
  return parts.join(" - ");
}

function foilType(value) {
  if (exactLookup(value)) return exactLookup(value);
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
  const prefixes = Object.entries(dictionary.namePrefixes || {})
    .sort(([left], [right]) => right.length - left.length);
  for (const [jp, en] of prefixes) {
    if (!value.startsWith(jp)) continue;
    const suffix = value.slice(jp.length);
    const separated = /^[\s・]/.test(suffix);
    const compactSynthesised = en === "Synthesised" && Boolean(suffix) && !/^[\s・]/.test(suffix);
    if (!separated && !compactSynthesised) continue;
    const name = exactLookup(suffix.replace(/^[\s・]+/, ""));
    if (name) return `${en} ${name}`;
  }
}

function baseNameFromDisplayName(value) {
  // Keep a synthesised base intact; stripping it to the ordinary base would
  // lose the marker that PoB uses to identify the special item base.
  if (prefixedItemName(value)) return value;
  let found = "";
  for (const base of Object.keys(dictionary.baseNames || {})) {
    if (value.endsWith(base) && base.length > found.length) found = base;
  }
  return found;
}

function normalizeClusterLine(line, isClusterBlock) {
  return isClusterBlock ? line.replace(/\s+\(enchant\)$/i, "") : line;
}

function convertLine(line, options = {}) {
  let original = line.trim().replace(/^##\s*/, "");
  if (!original) return { text: "", converted: true, kind: "empty" };
  if (/^-{5,}$/.test(original)) return { text: separator, converted: true, kind: "separator" };
  if (/^(?:メモ|Note):/i.test(original)) return { text: "", converted: true, omitted: true, ignored: true, kind: "tail", source: original };
  if (/^\(.*\)$/.test(original)) return { text: "", converted: true, omitted: true, ignored: true, kind: "tail", source: original };
  const advanced = original.match(/^\{\s*(.*?)\s*\}$/);
  if (advanced) return { text: `{ ${translateAdvancedMetadata(advanced[1], options)} }`, converted: true, kind: "metadata" };
  const localizedLabel = original.match(/^\[([^|\]]+)\|[^\]]+\](.*)$/);
  if (localizedLabel) original = localizedLabel[1] + localizedLabel[2];
  const tagMatch = original.match(/\s+(\((?:enchant|implicit|fractured|crafted)\))$/i);
  const tag = tagMatch?.[1] || "";
  const clean = original.replace(/\s+(\((?:enchant|implicit|fractured|crafted)\))$/i, "")
    .replace(/\s*[-—]\s*(?:プレフィックス|サフィックス|スケールできない値)\s*$/, "");

  if (options.isMercenaryWarrant) {
    const support = clean.match(/^(.+?)\s*\(ティア:\s*(\d+)\)$/);
    if (support) {
      const name = dictionary.mercenarySupports?.[support[1]] || exactLookup(support[1]);
      if (name) return { text: `${name} (Tier: ${support[2]})`, converted: true, kind: "property" };
    }
    const build = clean.match(/^ビルド:\s*(.+)$/);
    if (build) {
      const rawName = build[1].trim();
      const infamous = rawName.match(/^(?:悪名高い|悪名高き|インファマス)\s*(.+)$/);
      const japaneseName = (infamous?.[1] || rawName).trim();
      const englishName = dictionary.mercenaryBuilds?.[rawName] || dictionary.mercenaryBuilds?.[japaneseName] || exactLookup(japaneseName);
      const value = englishName || rawName;
      return { text: `Build: ${value}`, converted: Boolean(englishName), incomplete: !englishName, kind: "property", source: original };
    }
    const level = clean.match(/^傭兵のレベル:\s*(\d+)$/);
    if (level) return { text: `Mercenary Level: ${level[1]}`, converted: true, kind: "property" };
    const skill = dictionary.mercenarySkills?.[clean] || dictionary.mercenarySkills?.[clean.replaceAll(":", "：")];
    if (skill) return { text: skill, converted: true, kind: "property" };
  }

  const directRule = translateByRule(clean);
  if (/(?:により|によって|に)サポートされる$/.test(clean) && directRule && !containsJapanese(directRule) && !/\b[Ll]evel\s+\d\s+\d/.test(directRule)) {
    return { text: `${directRule}${tag ? ` ${tag}` : ""}`, converted: true, kind: "mod" };
  }
  const supportedByLevel = translateSupportedByLevel(clean);
  if (supportedByLevel) {
    if (tag) supportedByLevel.text += ` ${tag}`;
    return supportedByLevel;
  }

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
  const displayTags = clean.split(/\s*[,、]\s*/);
  if (displayTags.length > 1 && displayTags.every(value => gemTags.has(value))) {
    return { text: displayTags.map(value => gemTags.get(value)).join(", "), converted: true, kind: "property" };
  }
  const exact = manualExact.get(clean) || exactLookup(clean);
  if (exact) return { text: `${exact}${tag ? ` ${tag}` : ""}`, converted: true, kind: "known" };
  const allGemLevels = clean.match(/^全ての(.+?)(?:\([^()]*-[^()]*\))?ジェムのレベル\s*([+−-]?\d+)$/);
  const allGemName = allGemLevels && exactLookup(allGemLevels[1]);
  if (allGemName) return { text: `${allGemLevels[2]} to Level of all ${allGemName} Gems${tag ? ` ${tag}` : ""}`, converted: true, kind: "mod" };
  const dragonfangGem = clean.match(/^\+(.+?)(?:\([^()]*-[^()]*\))? to Level of all (\d+) Gems$/);
  const gemName = dragonfangGem && exactLookup(dragonfangGem[1]);
  if (gemName) return { text: `+${dragonfangGem[2]} to Level of all ${gemName} Gems`, converted: true, kind: "mod" };
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
      let translatedValue = value;
      if (key === "半径") translatedValue = value.replace(/^(小|中|大|変更可能)/, match => ({ 小:"Small", 中:"Medium", 大:"Large", 変更可能:"Variable" }[match]));
      if (key === "個数制限") {
        const limited = value.match(/^(.+?)(\d+)つのみ$/);
        if (limited) translatedValue = `${limited[2]} ${exactLookup(limited[1]) || limited[1]}`;
      }
      translatedValue = translatedValue.replace(/最大/g, "Max").replace(/メートル/g, "metres");
      return { text: `${fixed.get(key)}: ${translatedValue}`.trimEnd(), converted: true, kind: "property" };
    }
    if (/^[A-Za-z][A-Za-z ]*$/.test(key)) {
      return { text: `${key}: ${value.replace(/メートル/g, "metres")}`.trimEnd(), converted: true, kind: "property" };
    }
  }

  const translatedRule = directRule || translateByRule(clean);
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

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, character => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[character]));
}

function renderOutput(result) {
  const unknown = new Map();
  for (const item of result.criticalUnknown) unknown.set(item.line, (unknown.get(item.line) || 0) + 1);
  return result.output.split("\n").map(line => {
    const count = unknown.get(line) || 0;
    if (count) { unknown.set(line, count - 1); return `<span class="unknown-required">${escapeHtml(line)}</span>`; }
    return escapeHtml(line);
  }).join("\n");
}

function modLineKey(line) {
  return line.trim()
    .replace(/([+−-]?)\d+(?:\.\d+)?(?=\([+−-]?\d)/g, "$1")
    .replace(/[+−-]?\d+(?:\.\d+)?(?:[-–][+−-]?\d+(?:\.\d+)?)?/g, "#")
    .replace(/\s+/g, " ");
}

function normalizePobModOrder(results) {
  for (let i = 0; i < results.length; i++) {
    const metadata = results[i].text.match(/^\{ .*?(Prefix|Suffix) Modifier "([^"]+)"/);
    if (!metadata) continue;
    let end = i + 1;
    while (end < results.length && /^(?:mod|raw|known)$/.test(results[end].kind)) end++;
    const actual = results.slice(i + 1, end);
    if (actual.length < 2) continue;
    const actualKeys = actual.map(result => modLineKey(result.text)).sort().join("\n");
    const layout = (dictionary.affixLayouts?.[metadata[2]] || []).find(candidate =>
      candidate.type === metadata[1]
      && candidate.lines.length === actual.length
      && candidate.lines.map(modLineKey).sort().join("\n") === actualKeys
    );
    if (!layout) continue;
    const pool = [...actual];
    const ordered = layout.lines.map(line => pool.splice(pool.findIndex(result => modLineKey(result.text) === modLineKey(line)), 1)[0]);
    results.splice(i + 1, actual.length, ...ordered);
  }
}

function convert(text) {
  let converted = 0;
  const criticalUnknown = [];
  const ignored = [];
  const blocks = normalize(text).split(/\n-{5,}\n/);
  const outputBlocks = [];
  const multilineRules = dictionary.rules.filter(rule => rule.regex.source.includes("\\n"));
  const multilineExact = Object.entries(dictionary.exact || {}).filter(([jp]) => jp.includes("\n"));
  const itemIsCluster = blocks.some(block => /クラスタージュエル/.test(block));
  const itemIsMercenaryWarrant = blocks.some(block => /傭兵の召喚状|Mercenary Warrant/.test(block));
  const mercenaryBuildBlock = itemIsMercenaryWarrant ? blocks.findIndex(block => /(?:^|\n)ビルド\s*[：:]/.test(block)) : -1;
  const affixDomain = affixDomainForItem(normalize(text));
  const laterBoundary = blocks.map((block, index) => index > 0 && block.split("\n").some(isTerminalLine));
  let seenMod = false;
  for (let blockIndex = 0; blockIndex < blocks.length; blockIndex++) {
    const block = blocks[blockIndex];
    const lines = block.split("\n").map(line => line.trim().replace(/^##\s*/, "")).filter(Boolean);
    const isClusterBlock = itemIsCluster;
    const rarityIndex = lines.findIndex(line => /^レアリティ:\s*(?:ノーマル|マジック|レア)$/.test(line.replace("：", ":")));
    const rarity = rarityIndex >= 0 && lines[rarityIndex].replace("：", ":").split(":")[1].trim();
    if (rarity === "レア") {
      const baseIndex = lines.findIndex((line, index) => index > rarityIndex + 1
        && (dictionary.exact[line] || prefixedItemName(line)));
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
      if (/^\(/.test(lines[i])) {
        let reminderEnd = i;
        while (reminderEnd < lines.length && !/\)$/.test(lines[reminderEnd])) reminderEnd++;
        if (reminderEnd < lines.length) {
          for (let ignoredIndex = i; ignoredIndex <= reminderEnd; ignoredIndex++) {
            explicitlyIgnored.push({ source: lines[ignoredIndex], kind: "tail" });
          }
          i = reminderEnd;
          continue;
        }
      }
      let matched = false;
      for (const [jp, en] of multilineExact) {
        const lineCount = jp.split("\n").length;
        if (lines.slice(i, i + lineCount).map(line => normalizeClusterLine(line, isClusterBlock)).join("\n") !== jp) continue;
        results.push({ text: en, converted: true, kind: "mod" });
        converted += lineCount;
        seenMod = true;
        i += lineCount - 1;
        matched = true;
        break;
      }
      if (matched) continue;
      for (const rule of multilineRules) {
        const lineCount = (rule.regex.source.match(/\\n/g) || []).length + 1;
        const candidates = ruleInputVariants(lines.slice(i, i + lineCount).join("\n"));
        const match = candidates.map(candidate => rule.regex.exec(candidate)).find(Boolean);
        if (!match) continue;
        results.push({ text: applyTemplate(rule.en, match), converted: true });
        i += lineCount - 1;
        matched = true;
        break;
      }
      if (!matched) {
        const result = convertLine(normalizeClusterLine(lines[i], isClusterBlock), { isCluster: isClusterBlock, affixDomain, isMercenaryWarrant: itemIsMercenaryWarrant });
        if (result.omitted) explicitlyIgnored.push(result);
        else if (result.text) results.push(result);
      }
    }
    if (itemIsMercenaryWarrant && blockIndex === mercenaryBuildBlock - 1 && results.length === 1 && results[0].kind === "unknown") {
      results[0] = { ...results[0], converted: true, preserveJapanese: true, kind: "mercenary-name" };
    }
    for (const result of results) {
      if (result.converted && !result.preserveJapanese && containsJapanese(result.text)) {
        result.converted = false;
        result.incomplete = true;
        result.source ||= result.text;
      }
    }
    explicitlyIgnored.forEach(result => ignored.push({ line: result.source || result.text, category: "tail", block: blockIndex + 1 }));
    const hasMetadata = results.some(result => result.kind === "metadata");
    const blockHasMod = results.some(result => result.kind === "mod" || (result.kind === "known" && blockIndex > 0));
    const ignoredBlock = !hasMetadata && isIgnorableBlock(results, hasLaterBoundary, seenMod || blockHasMod, blockIndex === blocks.length - 1);
    if (ignoredBlock) {
      results.forEach(result => ignored.push({ line: result.source || result.text, category: "tail", block: blockIndex + 1 }));
      continue;
    }
    let trailingFlavor = 0;
    for (let i = results.length - 1; i >= 0 && results[i].kind === "unknown" && isNarrativeLine(results[i].source || results[i].text); i--) trailingFlavor++;
    if (!hasMetadata && hasLaterBoundary && trailingFlavor >= 2) {
      results.splice(-trailingFlavor).forEach(result => ignored.push({ line: result.source || result.text, category: "tail", block: blockIndex + 1 }));
    }
    normalizePobModOrder(results);
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
      if (result.kind === "unknown" || result.incomplete) {
        const category = result.kind === "mod" ? "mod"
          : result.kind === "property" ? "property"
          : result.kind === "header" ? "header"
          : result.kind === "metadata" ? "metadata"
          : blockIndex === 0 ? "header"
          : firstMod >= 0 && resultIndex >= firstMod ? "mod"
          : hasProperty ? "property"
          : /:/.test(result.source || result.text) ? "property"
          : hasState ? "state"
          : blockIndex > 0 ? "mod"
          : "unknown-structure";
        criticalUnknown.push({ line: result.incomplete ? result.text : result.source || result.text, category, block: blockIndex + 1, source: result.source });
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

function sanitizeReportSource(source) {
  return normalize(source).split("\n")
    .filter(line => !/^(?:メモ|Note):/i.test(line.trim()) && !/~b\/o\b/i.test(line))
    .join("\n");
}

function buildIssueBody(result, source, userAgent = "") {
  return [
    "## 環境",
    `- Version: ${APP_VERSION}`,
    `- Updated: ${APP_UPDATED}`,
    userAgent ? `- Browser: ${userAgent}` : "",
    "",
    "## 未変換レポート",
    "```text",
    formatReport(result),
    "```",
    "",
    "## 日本語の元データ（取引メモ除外済み）",
    "```text",
    sanitizeReportSource(source),
    "```",
    "",
    "## 英語変換結果",
    "```text",
    result.output,
    "```",
    "",
    "## 補足",
    "ここへ症状やPoBでの表示結果を追記してください。"
  ].filter(line => line !== "").join("\n");
}

function buildIssueUrl(result, body) {
  const itemClass = result.output.match(/^Item Class:\s*(.+)$/m)?.[1] || "Unknown item";
  const url = new URL(`https://github.com/${ISSUE_REPOSITORY}/issues/new`);
  url.searchParams.set("title", `[未変換] ${itemClass} / ${result.criticalUnknown.length}行`);
  url.searchParams.set("body", body);
  return url.toString();
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
  let lastResult;
  const resizeInput = () => {
    const input = $("input");
    const { scrollX, scrollY } = window;
    input.style.height = "auto";
    input.style.height = `${input.scrollHeight}px`;
    window.scrollTo(scrollX, scrollY);
    requestAnimationFrame(() => window.scrollTo(scrollX, scrollY));
  };
  $("input").addEventListener("input", resizeInput);
  $("convert").addEventListener("click", () => {
    const result = convert($("input").value);
    lastResult = result;
    $("output").value = result.output;
    $("output-display").innerHTML = renderOutput(result);
    if ($("report-output")) $("report-output").value = formatReport(result);
    if ($("report-panel")) $("report-panel").hidden = false;
    $("copy").disabled = !result.output;
    if ($("copy-report")) $("copy-report").disabled = false;
    if ($("github-report")) $("github-report").disabled = !result.criticalUnknown.length;
    $("summary").className = `summary${result.criticalUnknown.length ? " warning" : ""}`;
    if (result.criticalUnknown.length) {
      const preview = result.criticalUnknown.slice(0, 4).map(item => `[${item.category}] ${item.line}`).join(" / ");
      $("summary").textContent = `PoB必須項目の未変換 ${result.criticalUnknown.length}行（コピー可能・赤文字表示） / PoB非依存項目を${result.ignored.length}行除外: ${preview}`;
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
  $("github-report")?.addEventListener("click", () => {
    if (!lastResult?.criticalUnknown.length) return;
    $("issue-report").value = buildIssueBody(lastResult, $("input").value, navigator.userAgent);
    $("issue-dialog").showModal();
  });
  $("issue-cancel")?.addEventListener("click", () => $("issue-dialog").close());
  $("issue-open")?.addEventListener("click", async () => {
    const report = $("issue-report");
    let body = report.value;
    let url = buildIssueUrl(lastResult, body);
    const issueTab = window.open("about:blank", "_blank");
    if (!issueTab) {
      $("summary").className = "summary warning";
      $("summary").textContent = "GitHubを開けませんでした。ポップアップを許可してください";
      return;
    }
    issueTab.opener = null;
    if (url.length > 7000) {
      await copyField(report, "長いレポートをコピーしました。GitHubの本文欄へ貼り付けてください");
      body = "レポートが長いためクリップボードへコピーしました。この文章を消して貼り付けてください。";
      url = buildIssueUrl(lastResult, body);
    }
    issueTab.location.href = url;
    $("issue-dialog").close();
  });
  $("paste").addEventListener("click", async () => {
    try {
      $("input").value = await navigator.clipboard.readText();
      resizeInput();
      $("output").value = "";
      $("output-display").innerHTML = "";
      if ($("report-output")) $("report-output").value = "";
      if ($("report-panel")) $("report-panel").hidden = true;
      $("copy").disabled = true;
      if ($("copy-report")) $("copy-report").disabled = true;
      if ($("github-report")) $("github-report").disabled = true;
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
    resizeInput();
    $("output").value = "";
    $("output-display").innerHTML = "";
    if ($("report-output")) $("report-output").value = "";
    if ($("report-panel")) $("report-panel").hidden = true;
    $("copy").disabled = true;
    if ($("copy-report")) $("copy-report").disabled = true;
    if ($("github-report")) $("github-report").disabled = true;
    $("summary").className = "summary";
    $("summary").textContent = "リセットしました";
    $("input").focus();
  });
  loadDictionary();
}

if (typeof module !== "undefined") module.exports = { convert, convertLine, formatReport, sanitizeReportSource, buildIssueBody, buildIssueUrl, normalize, setDictionary: value => { dictionary = value; } };
