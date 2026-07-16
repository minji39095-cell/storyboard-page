import React, { useState, useMemo } from 'react';
import { Copy, Plus, Trash, AlertCircle } from 'lucide-react';

// 1. Token Registry structure for CHARACTER, PRODUCT, BG, PROPS.
export const TOKEN_REGISTRY = {
  CHARACTER: {
    woman: {
      en: 'a professional 20-something woman',
      opposite: 'a young man',
      forbidden: ['man', 'boy', 'elderly', 'beard', 'mustache', 'gentleman']
    },
    man: {
      en: 'a sharp 20-something man',
      opposite: 'a young woman',
      forbidden: ['woman', 'girl', 'dress', 'skirt', 'heels', 'female']
    },
    model: {
      en: 'an elegant fashion model',
      opposite: 'a rustic laborer',
      forbidden: ['dirty clothes', 'rough hands', 'workwear']
    },
    customer: {
      en: 'a satisfied customer',
      opposite: 'a competitor',
      forbidden: ['bored face', 'annoyed expression']
    }
  },
  PRODUCT: {
    serum_bottle: {
      en: 'a sleek glass cosmetic serum bottle with a metallic dropper',
      opposite: 'a generic soda can',
      forbidden: ['soda', 'beverage', 'plastic cup', 'can']
    },
    cream_jar: {
      en: 'a luxurious frosted cream jar with a gold cap',
      opposite: 'a cardboard carton',
      forbidden: ['box', 'carton', 'plastic pouch']
    },
    perfume: {
      en: 'an exquisite crystal perfume bottle with a mist spray nozzle',
      opposite: 'a spray paint can',
      forbidden: ['industrial spray', 'aerosol']
    },
    can: {
      en: 'a chilled aluminum beverage can covered with condensation',
      opposite: 'a luxury cosmetic bottle',
      forbidden: ['dropper', 'serum', 'cream jar']
    },
    watch: {
      en: 'a premium luxury wristwatch with a sapphire dial',
      opposite: 'a cheap digital clock',
      forbidden: ['led screen', 'plastic strap']
    }
  },
  BG: {
    luxury_bathroom: {
      en: 'a high-end luxury bathroom with white marble tiling and soft backlight',
      opposite: 'a dark outdoor forest',
      forbidden: ['trees', 'mud', 'grass', 'forest', 'street']
    },
    clean_kitchen: {
      en: 'a modern clean kitchen with quartz countertops and warm spotlighting',
      opposite: 'a messy garage workshop',
      forbidden: ['cars', 'tires', 'tools', 'grease', 'bedroom']
    },
    modern_office: {
      en: 'a sleek minimalist office with glass partitions and city views',
      opposite: 'a sandy beach',
      forbidden: ['beach', 'ocean', 'palm trees', 'sand', 'resort']
    },
    nature_forest: {
      en: 'a serene sun-dappled green forest with tall pine trees',
      opposite: 'a crowded city street',
      forbidden: ['cars', 'buildings', 'neon signs', 'concrete', 'indoor']
    },
    neon_street: {
      en: 'a vibrant wet city street illuminated by colorful neon store signs at night',
      opposite: 'a bright sunny classroom',
      forbidden: ['desks', 'blackboard', 'whiteboard', 'students', 'daylight']
    },
    studio: {
      en: 'a professional photography studio with a clean solid gray backdrop',
      opposite: 'an organic outdoor setting',
      forbidden: ['nature', 'forest', 'beach', 'furniture']
    }
  },
  PROPS: {
    glasses: {
      en: 'stylish black-rimmed reading glasses',
      opposite: 'sunglasses',
      forbidden: ['shades', 'tinted lenses', 'goggles']
    },
    coffee_cup: {
      en: 'a steaming white ceramic coffee mug',
      opposite: 'a wine glass',
      forbidden: ['wine', 'champagne', 'beer mug']
    },
    shopping_bag: {
      en: 'an elegant matte-paper shopping bag with ribbon handles',
      opposite: 'a plastic grocery bag',
      forbidden: ['grocery', 'plastic bag', 'supermarket']
    },
    smartphone: {
      en: 'a bezel-less modern smartphone with a glowing screen',
      opposite: 'a vintage rotary telephone',
      forbidden: ['rotary dial', 'corded phone']
    },
    towel: {
      en: 'a fluffy white folded microfiber towel',
      opposite: 'a dirty rag',
      forbidden: ['dirt', 'grease', 'rag']
    },
    chair: {
      en: 'an ergonomic modern office chair with black mesh support',
      opposite: 'a bar stool',
      forbidden: ['stool', 'sofa', 'couch']
    },
    table: {
      en: 'a polished wooden table with clean edges',
      opposite: 'a metallic mesh desk',
      forbidden: ['metal mesh', 'workbench']
    },
    counter: {
      en: 'a sleek polished marble countertop',
      opposite: 'a rustic wooden plank',
      forbidden: ['plank', 'logs', 'dirt']
    }
  }
};

// 5. Lexicon map for auto-replacement of "counter", "glasses", "A woman", etc.
export const LEXICON_MAP = {
  'counter': 'polished marble countertop',
  'glasses': 'stylish black-rimmed reading glasses',
  'A woman': 'A professional 20-something woman',
  'a woman': 'a professional 20-something woman',
  'woman': 'young woman',
  'man': 'young man',
  'chair': 'ergonomic office chair',
  'table': 'polished wooden table',
  'water': 'crystalline mineral water',
  'product': 'cosmetic product container'
};

// 6. Macro action expansions for "put_into", "rise_from_chair", and "wear_glasses".
export const MACRO_ACTIONS = {
  put_into: [
    { action: 'reaches for the product', offset: 0.1 },
    { action: 'picks up the product', offset: 0.4 },
    { action: 'places the product carefully into the bag', offset: 0.8 }
  ],
  rise_from_chair: [
    { action: 'places hands on the armrests of the chair', offset: 0.2 },
    { action: 'pushes upward, leaning forward slightly', offset: 0.5 },
    { action: 'stands up completely, straightening their posture', offset: 0.9 }
  ],
  wear_glasses: [
    { action: 'holds the glasses by the temples', offset: 0.15 },
    { action: 'lifts the glasses towards their face', offset: 0.5 },
    { action: 'slides the glasses onto their nose bridge, settling them comfortably', offset: 0.85 }
  ]
};

// Helper function to resolve descriptions from the Token Registry (with fallback to literal styling)
export function getDesc(type, val) {
  if (!val) return '';
  if (Array.isArray(val)) {
    return val.map(v => getDesc(type, v)).filter(Boolean).join(', ');
  }
  const registryGroup = TOKEN_REGISTRY[type];
  if (registryGroup && registryGroup[val]) {
    return registryGroup[val].en;
  }
  // Fallback: replace underscores with spaces
  return String(val).replace(/_/g, ' ');
}

// Auto-replacement implementation using lexicon map
export function applyLexiconReplacement(text) {
  if (!text) return '';
  let result = text;
  // Sort keys by length descending to replace longer matches first
  const keys = Object.keys(LEXICON_MAP).sort((a, b) => b.length - a.length);
  for (const key of keys) {
    const isCaseSensitive = key[0] === key[0].toUpperCase() && key[0] !== key[0].toLowerCase();
    const escapedKey = key.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`\\b${escapedKey}\\b`, isCaseSensitive ? 'g' : 'gi');
    result = result.replace(regex, LEXICON_MAP[key]);
  }
  return result;
}

// 2. State machine parser that receives clip_id, duration, state_before, state_after, beats, camera (framing, move)
// 3. Keep-state sentences and change-state sentences + causal proof expressions
export function parsePromptState({
  clip_id: _clip_id = 'clip_001',
  duration = 3.0,
  state_before = {},
  state_after = {},
  beats = [],
  camera = {}
}) {
  const framing = typeof camera === 'string' ? camera : (camera?.framing || 'medium shot');
  const move = typeof camera === 'string' ? '' : (camera?.move || '');

  // Normalize beats
  let expandedBeats = [];
  const normalizedBeats = beats.map((b, index) => {
    if (typeof b === 'string') {
      return {
        action: b,
        time: Number((index * (duration / Math.max(1, beats.length))).toFixed(2)),
        duration: Number((duration / Math.max(1, beats.length)).toFixed(2))
      };
    }
    return {
      action: b.action || '',
      time: typeof b.time === 'number' ? b.time : Number((index * (duration / Math.max(1, beats.length))).toFixed(2)),
      duration: typeof b.duration === 'number' ? b.duration : 1.0
    };
  });

  // Expand macro actions
  for (const b of normalizedBeats) {
    if (MACRO_ACTIONS[b.action]) {
      const subBeats = MACRO_ACTIONS[b.action].map(sub => ({
        action: sub.action,
        time: Number((b.time + sub.offset * b.duration).toFixed(2)),
        isMacroSub: true,
        macroParent: b.action
      }));
      expandedBeats.push(...subBeats);
    } else {
      expandedBeats.push({ ...b, isMacroSub: false });
    }
  }
  // Sort expanded beats by time
  expandedBeats.sort((a, b) => a.time - b.time);

  // 1. Initial State Description
  const beforeChar = getDesc('CHARACTER', state_before.character) || 'a subject';
  const beforeBg = getDesc('BG', state_before.bg) || 'the scene';
  const beforeProduct = getDesc('PRODUCT', state_before.product);
  const beforeProps = Array.isArray(state_before.props) ? state_before.props : (state_before.props ? [state_before.props] : []);
  const beforePropsDesc = getDesc('PROPS', beforeProps);

  let initialDesc = `Initially, ${beforeChar} is seen in ${beforeBg}`;
  if (state_before.posture) initialDesc += `, in a ${state_before.posture} posture`;
  if (state_before.expression) initialDesc += `, exhibiting a ${state_before.expression} expression`;
  initialDesc += '.';

  if (beforeProduct) {
    initialDesc += ` The ${beforeProduct} is located ${state_before.position || 'in the frame'}.`;
  }
  if (beforePropsDesc) {
    initialDesc += ` The subject has ${beforePropsDesc}.`;
  }

  // 2. Keep-State Sentences (unchanged items)
  const keptSentences = [];
  if (state_before.bg && state_before.bg === state_after.bg) {
    keptSentences.push(`The background environment (${getDesc('BG', state_before.bg)}) remains completely unchanged throughout the clip.`);
  }
  if (state_before.character && state_before.character === state_after.character) {
    keptSentences.push(`The character's appearance (${getDesc('CHARACTER', state_before.character)}) is held constant.`);
  }
  if (state_before.product && state_before.product === state_after.product) {
    keptSentences.push(`The product (${getDesc('PRODUCT', state_before.product)}) maintains its starting design and position.`);
  }
  const afterProps = Array.isArray(state_after.props) ? state_after.props : (state_after.props ? [state_after.props] : []);
  const keptProps = beforeProps.filter(p => afterProps.includes(p));
  if (keptProps.length > 0) {
    keptSentences.push(`The subject continuously carries ${getDesc('PROPS', keptProps)}.`);
  }

  // 3. Change-State Sentences + Causal Proof Expressions
  const changeSentences = [];

  // Posture change
  if (state_before.posture && state_after.posture && state_before.posture !== state_after.posture) {
    const hasRise = expandedBeats.some(b => b.action.includes('stand') || b.action.includes('rise') || b.macroParent === 'rise_from_chair');
    const causalAction = hasRise ? 'the character rises from the chair' : 'the character changes posture';
    changeSentences.push(`Because ${causalAction}, the posture transitions from ${state_before.posture} to ${state_after.posture}.`);
  }

  // Props added
  const addedProps = afterProps.filter(p => !beforeProps.includes(p));
  if (addedProps.length > 0) {
    for (const p of addedProps) {
      const propDesc = getDesc('PROPS', p);
      const hasWear = expandedBeats.some(b => b.action.includes(p) || b.action.includes('wear') || b.macroParent === `wear_${p}`);
      const causalAction = hasWear ? `the character puts on the ${p}` : `the character interacts with the ${p}`;
      changeSentences.push(`Because ${causalAction}, the character is now holding or wearing the ${propDesc}.`);
    }
  }

  // Props removed
  const removedProps = beforeProps.filter(p => !afterProps.includes(p));
  if (removedProps.length > 0) {
    for (const p of removedProps) {
      const propDesc = getDesc('PROPS', p);
      const hasPut = expandedBeats.some(b => b.action.includes(p) || b.action.includes('put') || b.action.includes('place') || b.macroParent === 'put_into');
      const causalAction = hasPut ? `the character puts away the ${p}` : `the character removes the ${p}`;
      changeSentences.push(`Because ${causalAction}, the character is no longer holding or wearing the ${propDesc}.`);
    }
  }

  // Expression change
  if (state_before.expression && state_after.expression && state_before.expression !== state_after.expression) {
    const hasSmile = state_after.expression === 'smiling' || state_after.expression === 'happy';
    const causalAction = hasSmile ? 'the character smiles warmly' : 'the character changes expression';
    changeSentences.push(`Because ${causalAction}, the expression transitions from ${state_before.expression} to ${state_after.expression}.`);
  }

  // Position change
  if (state_before.position && state_after.position && state_before.position !== state_after.position) {
    changeSentences.push(`Because the character moves across the space, the position shifts from ${state_before.position} to ${state_after.position}.`);
  }

  // 4. Temporal progression description
  let progressionText = '';
  if (expandedBeats.length > 0) {
    const beatTexts = expandedBeats.map(b => `at ${b.time.toFixed(1)}s, ${b.action}`);
    progressionText = `The motion sequence unfolds as follows: ${beatTexts.join(', ')}.`;
  }

  // 5. Camera styling sentence
  let cameraText = `The shot is framed in a ${framing}`;
  if (move) {
    cameraText += `, with a dynamic camera movement: ${move}`;
  }
  cameraText += '.';

  // Combine into positive prompt
  const combinedPositiveParts = [
    initialDesc,
    progressionText,
    keptSentences.join(' '),
    changeSentences.join(' '),
    cameraText
  ].filter(Boolean);

  const finalPositive = combinedPositiveParts.join(' ');
  return applyLexiconReplacement(finalPositive);
}

// 4. Negative prompt compiler following strict derivation rules:
//    negative = baseline + state_opposite_block + forbidden_elements_block - current_state_conflicting_items.
export function compileNegativePrompt(state_after = {}, state_before = {}) {
  const baseline = [
    'bad quality', 'blurry', 'low resolution', 'deformed', 'extra limbs', 
    'bad anatomy', 'text', 'watermark', 'signature', 'amateur', 
    'out of focus', 'oversaturated', 'distorted'
  ];

  const stateOppositeBlock = [];
  const forbiddenElementsBlock = [];
  const currentStateItems = [];

  // Helper to extract keywords to subtract from negative prompt
  function addCurrentStateKeywords(type, val) {
    if (!val) return;
    if (Array.isArray(val)) {
      val.forEach(v => addCurrentStateKeywords(type, v));
      return;
    }
    currentStateItems.push(val.toLowerCase());
    const resolved = getDesc(type, val);
    if (resolved) {
      resolved.toLowerCase().split(/\s+/).forEach(w => {
        const cleaned = w.replace(/[^a-z0-9]/g, '');
        if (cleaned.length > 2) currentStateItems.push(cleaned);
      });
    }
  }

  // Helper to extract opposites and forbidden elements
  function processToken(type, val) {
    if (!val) return;
    if (Array.isArray(val)) {
      val.forEach(v => processToken(type, v));
      return;
    }
    const registryGroup = TOKEN_REGISTRY[type];
    if (registryGroup && registryGroup[val]) {
      const item = registryGroup[val];
      if (item.opposite) {
        stateOppositeBlock.push(item.opposite);
      }
      if (item.forbidden && Array.isArray(item.forbidden)) {
        forbiddenElementsBlock.push(...item.forbidden);
      }
    }
  }

  // Active elements are the union of state_before and state_after
  const allKeys = new Set([...Object.keys(state_before), ...Object.keys(state_after)]);
  for (const key of allKeys) {
    let type = key.toUpperCase();
    if (['CHARACTER', 'PRODUCT', 'BG', 'PROPS'].includes(type)) {
      processToken(type, state_before[key]);
      processToken(type, state_after[key]);
      addCurrentStateKeywords(type, state_before[key]);
      addCurrentStateKeywords(type, state_after[key]);
    }
    if (state_before[key]) addCurrentStateKeywords(type, state_before[key]);
    if (state_after[key]) addCurrentStateKeywords(type, state_after[key]);
  }

  // Combine baseline + opposite + forbidden
  let rawNegativeList = [
    ...baseline,
    ...stateOppositeBlock,
    ...forbiddenElementsBlock
  ];

  // Remove duplicates
  rawNegativeList = Array.from(new Set(rawNegativeList));

  // Subtract current_state_conflicting_items (case-insensitive substring check)
  const finalNegativeList = rawNegativeList.filter(negItem => {
    const negClean = negItem.toLowerCase();
    for (const posItem of currentStateItems) {
      if (negClean.includes(posItem) || posItem.includes(negClean)) {
        return false;
      }
    }
    return true;
  });

  return finalNegativeList.join(', ');
}

// 7. i2v mode prompts and first frame checklist generator
export function generateI2VPrompt({ state_before = {}, state_after = {}, beats = [], camera = {} }) {
  const cameraMove = typeof camera === 'string' ? '' : (camera?.move || '');
  
  const normalizedBeats = beats.map(b => (typeof b === 'string' ? { action: b } : b));
  const expandedActions = [];
  for (const b of normalizedBeats) {
    if (MACRO_ACTIONS[b.action]) {
      expandedActions.push(...MACRO_ACTIONS[b.action].map(sub => sub.action));
    } else if (b.action) {
      expandedActions.push(b.action);
    }
  }

  let motionDesc = '';
  if (expandedActions.length > 0) {
    motionDesc = `the subject ${expandedActions.join(', then ')}`;
  } else {
    if (state_before.posture !== state_after.posture) {
      motionDesc = `the subject transitions from ${state_before.posture} to ${state_after.posture}`;
    } else {
      motionDesc = `the subject remains static with subtle natural movement`;
    }
  }

  let cameraDesc = '';
  if (cameraMove) {
    cameraDesc = ` The camera performs a ${cameraMove}.`;
  }

  const rawPrompt = `Starting from the static first frame, ${motionDesc}.${cameraDesc} Maintain high visual consistency with the initial image.`;
  return applyLexiconReplacement(rawPrompt);
}

export function generateFirstFrameChecklist({ state_before = {}, camera = {} }) {
  const checklist = [];
  
  if (state_before.character) {
    const desc = getDesc('CHARACTER', state_before.character);
    checklist.push({
      id: 'character',
      label: 'Character Setup',
      value: `Ensure the character (${desc}) is clearly visible in the posture: '${state_before.posture || 'default'}'.`
    });
  }
  
  if (state_before.bg) {
    const desc = getDesc('BG', state_before.bg);
    checklist.push({
      id: 'bg',
      label: 'Background Environment',
      value: `Render the background environment matching '${desc}' exactly.`
    });
  }

  if (state_before.product) {
    const desc = getDesc('PRODUCT', state_before.product);
    checklist.push({
      id: 'product',
      label: 'Product Placement',
      value: `Verify the product (${desc}) is in the frame and placed '${state_before.position || 'as described'}'.`
    });
  }

  const propsBefore = Array.isArray(state_before.props) ? state_before.props : (state_before.props ? [state_before.props] : []);
  if (propsBefore.length > 0) {
    const desc = propsBefore.map(p => getDesc('PROPS', p)).join(', ');
    checklist.push({
      id: 'props',
      label: 'Initial Props/Accessories',
      value: `Equip the character or scene with: ${desc}.`
    });
  }

  const framing = typeof camera === 'string' ? camera : (camera?.framing || 'medium shot');
  if (framing) {
    checklist.push({
      id: 'framing',
      label: 'Camera Framing',
      value: `Set composition framing to a clean '${framing}'.`
    });
  }

  checklist.push({
    id: 'aesthetic',
    label: 'Aesthetic & Focus',
    value: 'Ensure sharp focus, clean lighting, high resolution, and absolutely zero motion blur or intermediate action warping.'
  });

  return checklist;
}

// 8. Validation Linter checks:
//    - negative-positive contradictions
//    - beat count threshold (beats.length > 2 -> warning & suggest split)
//    - multiple camera moves
//    - audio leftovers (dialogue/voiceover)
//    - typography/logo warnings
//    - unmanaged props
//    - token mismatch
//    - i2v posture mismatch
export function validatePromptState({
  state_before = {},
  state_after = {},
  beats = [],
  camera = {},
  compiledPositivePrompt = '',
  compiledNegativePrompt = ''
}) {
  const errors = [];
  const warnings = [];
  const suggestions = [];

  // Beat count threshold
  if (beats.length > 2) {
    warnings.push({
      code: 'BEATS_EXCEEDED',
      message: `Beat count of ${beats.length} exceeds the recommended threshold of 2 beats.`,
      suggestion: 'Split this clip into multiple shorter clips to maintain motion coherence.'
    });
    suggestions.push('Split this clip into two or more separate frames with simpler actions.');
  }

  // Multiple camera moves
  const cameraMove = typeof camera === 'string' ? '' : (camera?.move || '');
  if (cameraMove) {
    const moveKeywords = ['pan', 'zoom', 'dolly', 'track', 'tilt', 'crane', 'pedestal', 'roll', 'truck', 'push-in', 'pull-out'];
    const matchedMoves = moveKeywords.filter(m => cameraMove.toLowerCase().includes(m));
    if (matchedMoves.length > 1) {
      warnings.push({
        code: 'MULTIPLE_CAMERA_MOVES',
        message: `Multiple camera movement types detected in "${cameraMove}" (found: ${matchedMoves.join(', ')}).`,
        suggestion: 'AI video generators perform best with a single clean direction of camera motion.'
      });
      suggestions.push('Simplify camera settings to a single movement direction.');
    }
  }

  // Audio leftovers
  const audioKeywords = ['says', 'speaks', 'dialogue', 'voiceover', 'audio', 'sound', 'music', 'whisper', 'hear', 'noise', 'listen', 'talking'];
  const hasQuotes = /["'“”]/.test(compiledPositivePrompt);
  const foundAudio = audioKeywords.filter(w => new RegExp(`\\b${w}\\b`, 'i').test(compiledPositivePrompt));
  if (foundAudio.length > 0 || hasQuotes) {
    warnings.push({
      code: 'AUDIO_LEFTOVERS',
      message: 'Dialogue or audio-related terms detected in visual description.',
      suggestion: 'Remove speech quotes, dialogue instructions, and audio cues, as text-to-video engines produce silent video.'
    });
  }

  // Typography/logo warnings
  const logoKeywords = ['logo', 'brand', 'trademark', 'text', 'writing', 'typography', 'words', 'label', 'signage'];
  const foundLogos = logoKeywords.filter(w => new RegExp(`\\b${w}\\b`, 'i').test(compiledPositivePrompt));
  if (foundLogos.length > 0) {
    warnings.push({
      code: 'TYPOGRAPHY_WARNING',
      message: `Typography or brand logo indicators found (found: ${foundLogos.join(', ')}).`,
      suggestion: 'AI video generation models often render gibberish text or violate trademark rules. Use generic descriptions instead.'
    });
  }

  // Unmanaged props
  const propsBefore = Array.isArray(state_before.props) ? state_before.props : (state_before.props ? [state_before.props] : []);
  const propsAfter = Array.isArray(state_after.props) ? state_after.props : (state_after.props ? [state_after.props] : []);
  const allProps = Array.from(new Set([...propsBefore, ...propsAfter]));
  
  const positiveLower = compiledPositivePrompt.toLowerCase();
  for (const prop of allProps) {
    const propDesc = getDesc('PROPS', prop).toLowerCase();
    const isMentioned = positiveLower.includes(prop.toLowerCase()) || (propDesc && positiveLower.includes(propDesc));
    if (!isMentioned) {
      warnings.push({
        code: 'UNMANAGED_PROP',
        message: `Prop "${prop}" is declared in before/after states but not referenced in action beats or compiled description.`,
        suggestion: `Explicitly describe how the character interacts with the ${prop} or remove it from the state.`
      });
      suggestions.push(`Add a beat action explaining what happens to the "${prop}" prop.`);
    }
  }

  // Token mismatch
  const checkTokenInRegistry = (type, val) => {
    if (!val) return;
    if (Array.isArray(val)) {
      val.forEach(v => checkTokenInRegistry(type, v));
      return;
    }
    if (!TOKEN_REGISTRY[type] || !TOKEN_REGISTRY[type][val]) {
      warnings.push({
        code: 'TOKEN_MISMATCH',
        message: `Token "${val}" in category "${type}" is missing from Token Registry.`,
        suggestion: `Register "${val}" in TOKEN_REGISTRY or ensure the fallback rendering matches expectations.`
      });
    }
  };

  if (state_before.character) checkTokenInRegistry('CHARACTER', state_before.character);
  if (state_after.character) checkTokenInRegistry('CHARACTER', state_after.character);
  if (state_before.product) checkTokenInRegistry('PRODUCT', state_before.product);
  if (state_after.product) checkTokenInRegistry('PRODUCT', state_after.product);
  if (state_before.bg) checkTokenInRegistry('BG', state_before.bg);
  if (state_after.bg) checkTokenInRegistry('BG', state_after.bg);
  
  propsBefore.forEach(p => checkTokenInRegistry('PROPS', p));
  propsAfter.forEach(p => checkTokenInRegistry('PROPS', p));

  // Negative-positive contradictions
  const posWords = new Set(
    compiledPositivePrompt.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 3)
  );
  
  const negWords = compiledNegativePrompt.toLowerCase()
    .replace(/[^a-z0-9\s,]/g, '')
    .split(/[\s,]+/)
    .filter(w => w.length > 3);

  const contradictions = negWords.filter(nw => posWords.has(nw));
  if (contradictions.length > 0) {
    errors.push({
      code: 'CONTRADICTION_ERROR',
      message: `Contradiction: Positive and negative prompts both contain the terms [${contradictions.join(', ')}].`,
      suggestion: 'Remove terms from the negative prompt that must be generated in the positive prompt.'
    });
  }

  // i2v posture mismatch
  if (state_before.posture === 'standing') {
    const hasRiseBeat = beats.some(b => {
      const act = (typeof b === 'string' ? b : b.action || '').toLowerCase();
      return act.includes('stand up') || act.includes('rise') || act.includes('rise_from_chair');
    });
    if (hasRiseBeat) {
      warnings.push({
        code: 'I2V_POSTURE_MISMATCH',
        message: 'Posture mismatch: state_before.posture is "standing", but action beats contain rise/stand up actions.',
        suggestion: 'Change state_before.posture to "sitting" so that the motion starts from a sitting position.'
      });
      suggestions.push('Set initial posture to "sitting" if the character rises during the clip.');
    }
  }

  return {
    errors,
    warnings,
    suggestions,
    isValid: errors.length === 0
  };
}

// React custom hook for state machine prompts compilation
export function usePromptStateCompiler(initialConfig = {}) {
  const [clipId, setClipId] = useState(initialConfig.clip_id || 'clip_001');
  const [duration, setDuration] = useState(initialConfig.duration || 3.0);
  const [stateBefore, setStateBefore] = useState(initialConfig.state_before || {
    character: 'woman',
    product: 'serum_bottle',
    bg: 'luxury_bathroom',
    props: ['glasses'],
    posture: 'sitting',
    expression: 'neutral',
    position: 'at counter'
  });
  const [stateAfter, setStateAfter] = useState(initialConfig.state_after || {
    character: 'woman',
    product: 'serum_bottle',
    bg: 'luxury_bathroom',
    props: [],
    posture: 'standing',
    expression: 'smiling',
    position: 'at counter'
  });
  const [beats, setBeats] = useState(initialConfig.beats || ['rise_from_chair']);
  const [camera, setCamera] = useState(initialConfig.camera || { framing: 'medium shot', move: 'dolly zoom' });

  const compiled = useMemo(() => {
    const positive = parsePromptState({
      clip_id: clipId,
      duration,
      state_before: stateBefore,
      state_after: stateAfter,
      beats,
      camera
    });

    const negative = compileNegativePrompt(stateAfter, stateBefore);
    const i2vPrompt = generateI2VPrompt({ state_before: stateBefore, state_after: stateAfter, beats, camera });
    const checklist = generateFirstFrameChecklist({ state_before: stateBefore, camera });

    const linter = validatePromptState({
      state_before: stateBefore,
      state_after: stateAfter,
      beats,
      camera,
      compiledPositivePrompt: positive,
      compiledNegativePrompt: negative
    });

    return {
      positive,
      negative,
      i2vPrompt,
      checklist,
      linter
    };
  }, [clipId, duration, stateBefore, stateAfter, beats, camera]);

  return {
    clipId,
    setClipId,
    duration,
    setDuration,
    stateBefore,
    setStateBefore,
    stateAfter,
    setStateAfter,
    beats,
    setBeats,
    camera,
    setCamera,
    ...compiled
  };
}

// React UI Dashboard Component for testing and visual setup
export default function PromptStateCompiler() {
  const {
    clipId,
    setClipId,
    duration,
    setDuration,
    stateBefore,
    setStateBefore,
    stateAfter,
    setStateAfter,
    beats,
    setBeats,
    camera,
    setCamera,
    positive,
    negative,
    i2vPrompt,
    checklist,
    linter
  } = usePromptStateCompiler();

  const [newBeat, setNewBeat] = useState('');
  const [copySuccess, setCopySuccess] = useState('');

  const triggerCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopySuccess(type);
    setTimeout(() => setCopySuccess(''), 2000);
  };

  const handleStateChange = (when, key, val) => {
    if (when === 'before') {
      setStateBefore(prev => ({ ...prev, [key]: val }));
    } else {
      setStateAfter(prev => ({ ...prev, [key]: val }));
    }
  };

  const handlePropsChange = (when, valString) => {
    const arr = valString.split(',').map(s => s.trim()).filter(Boolean);
    if (when === 'before') {
      setStateBefore(prev => ({ ...prev, props: arr }));
    } else {
      setStateAfter(prev => ({ ...prev, props: arr }));
    }
  };

  const handleAddBeat = () => {
    if (newBeat.trim()) {
      setBeats(prev => [...prev, newBeat.trim()]);
      setNewBeat('');
    }
  };

  const handleRemoveBeat = (index) => {
    setBeats(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="card" style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: '#fafafa', border: '1px solid #ddd' }}>
      <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span>State-Machine Visual Prompt Compiler Dashboard</span>
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* Left Side Configuration */}
        <div>
          <h3 style={{ fontWeight: 'semibold', fontSize: '1rem', marginBottom: '0.75rem' }}>Scene Settings</h3>
          
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <label style={{ flex: 1 }}>
              <span style={{ fontSize: '0.75rem', color: '#666' }}>Clip ID</span>
              <input 
                type="text" 
                className="form-control" 
                value={clipId} 
                onChange={e => setClipId(e.target.value)} 
                style={{ width: '100%', padding: '4px 8px' }} 
              />
            </label>
            <label style={{ flex: 1 }}>
              <span style={{ fontSize: '0.75rem', color: '#666' }}>Duration (seconds)</span>
              <input 
                type="number" 
                className="form-control" 
                value={duration} 
                step="0.5"
                onChange={e => setDuration(parseFloat(e.target.value) || 3.0)} 
                style={{ width: '100%', padding: '4px 8px' }} 
              />
            </label>
          </div>

          <div style={{ border: '1px solid #eee', padding: '0.75rem', borderRadius: '4px', marginBottom: '0.75rem', backgroundColor: '#fff' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Initial State (state_before)</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <label>
                <span style={{ fontSize: '0.75rem' }}>Character</span>
                <select 
                  className="form-control" 
                  value={stateBefore.character} 
                  onChange={e => handleStateChange('before', 'character', e.target.value)}
                >
                  <option value="woman">woman</option>
                  <option value="man">man</option>
                  <option value="model">model</option>
                  <option value="customer">customer</option>
                  <option value="unknown">unknown (fallback)</option>
                </select>
              </label>
              <label>
                <span style={{ fontSize: '0.75rem' }}>Product</span>
                <select 
                  className="form-control" 
                  value={stateBefore.product} 
                  onChange={e => handleStateChange('before', 'product', e.target.value)}
                >
                  <option value="serum_bottle">serum_bottle</option>
                  <option value="cream_jar">cream_jar</option>
                  <option value="perfume">perfume</option>
                  <option value="can">can</option>
                  <option value="watch">watch</option>
                  <option value="none">none</option>
                </select>
              </label>
              <label>
                <span style={{ fontSize: '0.75rem' }}>Background</span>
                <select 
                  className="form-control" 
                  value={stateBefore.bg} 
                  onChange={e => handleStateChange('before', 'bg', e.target.value)}
                >
                  <option value="luxury_bathroom">luxury_bathroom</option>
                  <option value="clean_kitchen">clean_kitchen</option>
                  <option value="modern_office">modern_office</option>
                  <option value="nature_forest">nature_forest</option>
                  <option value="neon_street">neon_street</option>
                  <option value="studio">studio</option>
                </select>
              </label>
              <label>
                <span style={{ fontSize: '0.75rem' }}>Posture</span>
                <input 
                  type="text" 
                  className="form-control" 
                  value={stateBefore.posture || ''} 
                  onChange={e => handleStateChange('before', 'posture', e.target.value)} 
                />
              </label>
            </div>
            <label style={{ display: 'block', marginTop: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem' }}>Props (comma separated)</span>
              <input 
                type="text" 
                className="form-control" 
                value={stateBefore.props ? stateBefore.props.join(', ') : ''} 
                onChange={e => handlePropsChange('before', e.target.value)} 
              />
            </label>
          </div>

          <div style={{ border: '1px solid #eee', padding: '0.75rem', borderRadius: '4px', marginBottom: '0.75rem', backgroundColor: '#fff' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Resulting State (state_after)</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <label>
                <span style={{ fontSize: '0.75rem' }}>Character</span>
                <select 
                  className="form-control" 
                  value={stateAfter.character} 
                  onChange={e => handleStateChange('after', 'character', e.target.value)}
                >
                  <option value="woman">woman</option>
                  <option value="man">man</option>
                  <option value="model">model</option>
                  <option value="customer">customer</option>
                </select>
              </label>
              <label>
                <span style={{ fontSize: '0.75rem' }}>Product</span>
                <select 
                  className="form-control" 
                  value={stateAfter.product} 
                  onChange={e => handleStateChange('after', 'product', e.target.value)}
                >
                  <option value="serum_bottle">serum_bottle</option>
                  <option value="cream_jar">cream_jar</option>
                  <option value="perfume">perfume</option>
                  <option value="can">can</option>
                  <option value="watch">watch</option>
                  <option value="none">none</option>
                </select>
              </label>
              <label>
                <span style={{ fontSize: '0.75rem' }}>Background</span>
                <select 
                  className="form-control" 
                  value={stateAfter.bg} 
                  onChange={e => handleStateChange('after', 'bg', e.target.value)}
                >
                  <option value="luxury_bathroom">luxury_bathroom</option>
                  <option value="clean_kitchen">clean_kitchen</option>
                  <option value="modern_office">modern_office</option>
                  <option value="nature_forest">nature_forest</option>
                  <option value="neon_street">neon_street</option>
                  <option value="studio">studio</option>
                </select>
              </label>
              <label>
                <span style={{ fontSize: '0.75rem' }}>Posture</span>
                <input 
                  type="text" 
                  className="form-control" 
                  value={stateAfter.posture || ''} 
                  onChange={e => handleStateChange('after', 'posture', e.target.value)} 
                />
              </label>
            </div>
            <label style={{ display: 'block', marginTop: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem' }}>Props (comma separated)</span>
              <input 
                type="text" 
                className="form-control" 
                value={stateAfter.props ? stateAfter.props.join(', ') : ''} 
                onChange={e => handlePropsChange('after', e.target.value)} 
              />
            </label>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <label>
              <span style={{ fontSize: '0.75rem', color: '#666' }}>Camera Framing</span>
              <input 
                type="text" 
                className="form-control" 
                value={camera.framing || ''} 
                onChange={e => setCamera(prev => ({ ...prev, framing: e.target.value }))} 
              />
            </label>
            <label>
              <span style={{ fontSize: '0.75rem', color: '#666' }}>Camera Movement</span>
              <input 
                type="text" 
                className="form-control" 
                value={camera.move || ''} 
                onChange={e => setCamera(prev => ({ ...prev, move: e.target.value }))} 
              />
            </label>
          </div>

          <div style={{ border: '1px solid #eee', padding: '0.75rem', borderRadius: '4px', backgroundColor: '#fff' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Beats / Actions Timeline</h4>
            <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '0.5rem' }}>
              <input 
                type="text" 
                className="form-control" 
                placeholder="e.g. rise_from_chair, put_into, wear_glasses" 
                value={newBeat} 
                onChange={e => setNewBeat(e.target.value)} 
                style={{ flex: 1 }}
              />
              <button type="button" className="btn btn-sm btn-primary" onClick={handleAddBeat}>
                <Plus size={14} /> Add
              </button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
              {beats.map((b, i) => (
                <span 
                  key={i} 
                  style={{ 
                    padding: '2px 8px', 
                    borderRadius: '12px', 
                    backgroundColor: '#e9e9e9', 
                    fontSize: '0.75rem', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '4px' 
                  }}
                >
                  {typeof b === 'string' ? b : b.action}
                  <button 
                    type="button" 
                    style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }} 
                    onClick={() => handleRemoveBeat(i)}
                  >
                    <Trash size={12} color="red" />
                  </button>
                </span>
              ))}
              {beats.length === 0 && <span style={{ fontSize: '0.75rem', color: '#999' }}>No action beats configured.</span>}
            </div>
          </div>
        </div>

        {/* Right Side Outputs & Validation */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div>
            <h3 style={{ fontWeight: 'semibold', fontSize: '1rem', marginBottom: '0.75rem' }}>Linter Validation</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {linter.errors.map((err, i) => (
                <div key={i} style={{ border: '1px solid #f5c2c2', backgroundColor: '#fbebeb', color: '#b91c1c', padding: '0.5rem 0.75rem', borderRadius: '4px', fontSize: '0.8rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <AlertCircle size={16} />
                  <div>
                    <strong>[ERROR] {err.code}:</strong> {err.message} <br />
                    <span style={{ fontSize: '0.75rem', opacity: 0.85 }}>Suggestion: {err.suggestion}</span>
                  </div>
                </div>
              ))}
              {linter.warnings.map((warn, i) => (
                <div key={i} style={{ border: '1px solid #ffeeba', backgroundColor: '#fff3cd', color: '#856404', padding: '0.5rem 0.75rem', borderRadius: '4px', fontSize: '0.8rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <AlertCircle size={16} />
                  <div>
                    <strong>[WARN] {warn.code}:</strong> {warn.message} <br />
                    <span style={{ fontSize: '0.75rem', opacity: 0.85 }}>Suggestion: {warn.suggestion}</span>
                  </div>
                </div>
              ))}
              {linter.isValid && linter.warnings.length === 0 && (
                <div style={{ border: '1px solid #c3e6cb', backgroundColor: '#d4edda', color: '#155724', padding: '0.5rem 0.75rem', borderRadius: '4px', fontSize: '0.8rem' }}>
                  ✓ Prompt state and compiled rules are clean. No linter errors or warnings detected.
                </div>
              )}
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Compiled Positive Prompt</span>
              <button 
                type="button" 
                onClick={() => triggerCopy(positive, 'positive')} 
                style={{ fontSize: '0.75rem', padding: '2px 6px', display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer' }}
              >
                <Copy size={12} /> {copySuccess === 'positive' ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <textarea 
              readOnly 
              className="form-control" 
              value={positive} 
              style={{ width: '100%', height: '80px', fontSize: '0.75rem', padding: '4px 8px', backgroundColor: '#f1f1f1', fontFamily: 'monospace' }} 
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Compiled Negative Prompt</span>
              <button 
                type="button" 
                onClick={() => triggerCopy(negative, 'negative')} 
                style={{ fontSize: '0.75rem', padding: '2px 6px', display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer' }}
              >
                <Copy size={12} /> {copySuccess === 'negative' ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <textarea 
              readOnly 
              className="form-control" 
              value={negative} 
              style={{ width: '100%', height: '60px', fontSize: '0.75rem', padding: '4px 8px', backgroundColor: '#f1f1f1', fontFamily: 'monospace' }} 
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>i2v Motion-Only Prompt</span>
              <button 
                type="button" 
                onClick={() => triggerCopy(i2vPrompt, 'i2v')} 
                style={{ fontSize: '0.75rem', padding: '2px 6px', display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer' }}
              >
                <Copy size={12} /> {copySuccess === 'i2v' ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <textarea 
              readOnly 
              className="form-control" 
              value={i2vPrompt} 
              style={{ width: '100%', height: '60px', fontSize: '0.75rem', padding: '4px 8px', backgroundColor: '#f1f1f1', fontFamily: 'monospace' }} 
            />
          </div>

          <div>
            <span style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>i2v First Frame Checklist</span>
            <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.75rem', color: '#555' }}>
              {checklist.map((item, index) => (
                <li key={index} style={{ marginBottom: '2px' }}>
                  <strong>{item.label}:</strong> {item.value}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
