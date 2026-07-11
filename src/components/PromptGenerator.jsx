import React, { useState } from 'react';
import { Copy, Sparkles, AlertCircle, Languages } from 'lucide-react';

export const STYLES = {
  cinematic: { ko: '영화 스틸컷', en: 'Cinematic movie still, photorealistic, 8k resolution, shot on 35mm lens, highly detailed textures', noun: 'cinematic photograph' },
  highend_ad: { ko: '하이엔드 광고 스타일', en: 'High-end luxury commercial advertisement style, sleek product lighting, clean minimalist composition, elegant studio lighting, ultra-sharp focus, premium color grading, sophisticated aesthetic', noun: 'high-end luxury commercial photograph' },
  anime: { ko: '애니메이션', en: 'Anime style, highly detailed digital illustration, vibrant colors, studio Ghibli aesthetic, clean lines', noun: 'anime studio illustration' },
  webtoon: { ko: '웹툰', en: 'Korean webtoon illustration style, line art, cell shaded, high quality manhwa cover art', noun: 'webtoon illustration' },
  disney3d: { ko: '디즈니 3D', en: '3D animated movie render, Pixar style, cute character design, soft lighting, octane render', noun: '3D Pixar-style animated render' },
  concept: { ko: '컨셉 아트', en: 'Concept art, digital painting, dramatic composition, atmospheric perspective, artstation trending', noun: 'fantasy digital painting' },
  lineart: { ko: '라인 드로잉', en: 'Minimalist line drawing, clean vector illustration, sketch art, monochrome', noun: 'minimalist line art drawing' },
  pencil: { ko: '연필 소묘', en: 'Pencil sketch, hand-drawn illustration, cross-hatching, graphite texture, charcoal shading', noun: 'pencil sketch drawing' }
};

export const SHOTS = {
  ecu: { ko: '익스트림 클로즈업', en: 'extreme close-up shot' },
  cu: { ko: '클로즈업', en: 'close-up shot' },
  ms: { ko: '미디엄 샷', en: 'medium shot' },
  bs: { ko: '바스트 샷', en: 'bust shot' },
  fs: { ko: '풀 샷 (전신)', en: 'full body shot' },
  ls: { ko: '롱 샷 (원경)', en: 'long shot' },
  ha: { ko: '하이 앵글', en: 'high angle shot' },
  la: { ko: '로우 앵글', en: 'low angle shot' },
  oh: { ko: '오버헤드 (탑뷰)', en: 'overhead shot, bird\'s eye view' }
};

export const CAMERAS = {
  static: { ko: '정적', en: 'static camera' },
  pan: { ko: '팬 (가로)', en: 'panning shot' },
  tilt: { ko: '틸트 (세로)', en: 'tilting camera' },
  zoomin: { ko: '줌 인', en: 'zooming in' },
  zoomout: { ko: '줌 아웃', en: 'zooming out' },
  tracking: { ko: '트래킹', en: 'tracking camera movement' }
};

export const CAMERA_GEAR = {
  none: { ko: '기본 (장비 미지정)', en: '' },
  hasselblad: { ko: 'Hasselblad H6D (중형)', en: 'shot on Hasselblad H6D-100c' },
  leica: { ko: 'Leica M11 (라이카)', en: 'shot on Leica M11' },
  fujifilm: { ko: 'Fujifilm GFX (후지)', en: 'shot on Fujifilm GFX 100S' },
  sony: { ko: 'Sony a7R V (소니)', en: 'shot on Sony a7R V' },
  canon: { ko: 'Canon EOS R5 (캐논)', en: 'shot on Canon EOS R5' },
  arri: { ko: 'Arri Alexa Mini (시네마)', en: 'filmed on Arri Alexa Mini' }
};

export const LENS_MM = {
  none: { ko: '기본 (화각 미지정)', en: '' },
  mm12: { ko: '12mm (초광각)', en: '12mm lens' },
  mm24: { ko: '24mm (광각)', en: '24mm lens' },
  mm35: { ko: '35mm (시네 35)', en: '35mm lens' },
  mm50: { ko: '50mm (표준)', en: '50mm lens' },
  mm85: { ko: '85mm (인물)', en: '85mm lens' },
  mm135: { ko: '135mm (망원)', en: '135mm lens' },
  mm200: { ko: '200mm (초망원)', en: '200mm lens' }
};

export const LENS_TYPES = {
  none: { ko: '기본 (렌즈종류 미지정)', en: '' },
  noctilux: { ko: 'Leica Noctilux f/0.95 (아웃포커싱)', en: 'Leica Noctilux-M 50mm f/0.95 lens' },
  otus: { ko: 'Zeiss Otus f/1.4 (초고해상도)', en: 'Zeiss Otus 55mm f/1.4 lens' },
  anamorphic: { ko: 'Anamorphic (시네마 플레어)', en: 'anamorphic lens' },
  master_prime: { ko: 'Arri Master Prime (영화 표준)', en: 'ARRI Zeiss Master Prime lens' },
  cooke: { ko: 'Cooke S4/i (따뜻하고 클래식)', en: 'Cooke S4/i prime lens' },
  helios: { ko: 'Helios 44-2 (회오리 보케)', en: 'vintage Helios 44-2 lens' },
  canon_l: { ko: 'Canon L-Series (광고 표준)', en: 'Canon L-series USM lens' }
};

export const TONES = {
  dreamy: { ko: '몽환적인', en: 'dreamy, ethereal atmosphere' },
  cinematic: { ko: '극적인 시네마틱', en: 'cinematic, dramatic mood' },
  dark: { ko: '어둡고 음산한', en: 'dark, moody, ominous atmosphere' },
  bright: { ko: '밝고 화사한', en: 'bright, cheerful, vibrant mood' },
  sad: { ko: '슬프고 잔잔한', en: 'melancholic, sad, reflective tone' },
  suspense: { ko: '긴장감 있는', en: 'suspenseful, tense atmosphere' },
  retro: { ko: '빈티지 레트로', en: 'vintage, nostalgic, retro vibe' }
};

export const COLORS = {
  amber: { ko: '따뜻한 골드', en: 'warm amber and golden hour color palette' },
  blue: { ko: '차가운 블루/청록', en: 'cool blue and teal color tones' },
  monochrome: { ko: '흑백', en: 'monochrome color palette, black and white' },
  cyberpunk: { ko: '네온 사이버펑크', en: 'neon cyberpunk colors, electric violet and cyan' },
  pastel: { ko: '부드러운 파스텔', en: 'soft pastel color tones' },
  highcontrast: { ko: '고대비', en: 'high contrast color grading' },
  natural: { ko: '자연스러운 톤', en: 'natural earth tones' }
};

export default function PromptGenerator({ 
  frame, 
  onChange, 
  geminiApiKey,
  showToast 
}) {
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  // Destructure frame data
  const { 
    story = '', 
    storyEn = '',
    stylePreset = 'cinematic', 
    shotType = 'cu', 
    cameraMove = 'static', 
    cameraGear = 'none',
    lensMm = 'none',
    lensType = 'none',
    tone = 'cinematic', 
    colorPalette = 'amber', 
    aspectRatio = '16:9',
    customMjPrompt = '',
    customNbPrompt = '',
    customCfPrompt = '',
    customGkPrompt = '',
    customSdPrompt = '',
    customLxPrompt = '',
    isMjEdited = false,
    isNbEdited = false,
    isCfEdited = false,
    isGkEdited = false,
    isSdEdited = false,
    isLxEdited = false
  } = frame;

  const buildStaticCameraDescription = (gear, lensMm, lensType) => {
    const gearEffects = {
      hasselblad: 'medium-format photographic aesthetics',
      leica: 'rangefinder photographic quality',
      fujifilm: 'rich digital color fidelity',
      sony: 'crisp commercial digital contrast',
      canon: 'professional high-resolution clarity',
      arri: 'high-end Hollywood cinematic depth'
    };

    const mmEffects = {
      mm12: 'ultra-wide perspective',
      mm24: 'wide-angle composition',
      mm35: 'cinematic prime perspective',
      mm50: 'natural standard focal depth',
      mm85: 'shallow portrait depth-of-field',
      mm135: 'compressed telephoto perspective',
      mm200: 'telephoto compression aesthetics'
    };

    const lensEffects = {
      noctilux: 'extremely shallow depth of field, creamy background bokeh, and painterly out-of-focus falloff',
      otus: 'surgical optical sharpness, ultra-high resolution details, and perfect chromatic aberration control',
      anamorphic: 'cinematic widescreen lens characteristics, oval background bokeh, and organic focus falloff',
      master_prime: 'organic movie rendering, clean micro-contrast, and pristine Hollywood commercial aesthetics',
      cooke: 'warm skin tones, gentle color roll-off, and classic vintage rendering',
      helios: 'distinct swirly bokeh patterns, dreamlike light leaks, and vintage analog character',
      canon_l: 'rich professional contrast, high resolution, and vibrant commercial color accuracy'
    };

    const gearText = gearEffects[gear];
    const mmText = mmEffects[lensMm];
    const lensText = lensEffects[lensType];

    const parts = [];
    if (gearText) parts.push(`utilizing ${gearText}`);
    if (mmText) parts.push(`with a ${mmText}`);
    if (lensText) parts.push(`exhibiting ${lensText}`);

    if (parts.length === 0) return 'captured in sharp focus, rendering professional photographic quality';

    return `photographed to achieve a professional result ${parts.join(', ')}`;
  };

  // Local compiler when AI is not used
  const compileLocalPrompts = () => {
    const styleEn = STYLES[stylePreset]?.en || '';
    const shotEn = SHOTS[shotType]?.en || '';
    const toneEn = TONES[tone]?.en || '';
    const colorEn = COLORS[colorPalette]?.en || '';
    const storyText = storyEn || story.trim() || 'A simple scene';

    // 1. Static camera move: Filter out video motions for static engines to prevent motion blur/composition issues
    const isStaticMove = cameraMove === 'static';
    const staticCameraEn = isStaticMove ? 'steady camera perspective' : '';
    
    // Video camera move for LTX Video only
    const videoCameraMoveEn = CAMERAS[cameraMove]?.en || '';

    // 2. Camera & Lens description: Use brandless adjectival descriptions for static prompts
    const cameraSentence = buildStaticCameraDescription(cameraGear, lensMm, lensType);
    const gearSuffix = cameraSentence ? `, ${cameraSentence}` : '';
    const gearSentence = cameraSentence ? ` ${cameraSentence}.` : '';

    // Midjourney
    const mj = `${storyText}, ${styleEn}, ${shotEn}, ${staticCameraEn ? staticCameraEn + ', ' : ''}${toneEn}, ${colorEn}${gearSuffix} --ar ${aspectRatio} --v 6.0`;

    // NanoBanana
    const nb = `A highly detailed, raw realistic photograph. The subject is ${storyText}. The composition is a ${shotEn}${staticCameraEn ? ' with a ' + staticCameraEn : ''}.${gearSentence} The general mood is ${toneEn}, rendered in a ${colorEn}.`;

    // ComfyUI Z-Image Turbo: Subject -> State -> Composition -> Lighting -> Atmosphere
    // 1. Subject & State: storyText
    // 2. Composition: shotEn + staticCameraEn
    // 3. Lighting: toneEn and colorEn (as light descriptions)
    // 4. Atmosphere: styleEn, cameraSentence, masterpiece modifiers
    const compPart = [shotEn, staticCameraEn].filter(Boolean).join(', ');
    const cf = `${storyText}, ${compPart || 'clear framing'}, illuminated by ${toneEn} and ${colorEn}, rendered in ${styleEn} style, ${cameraSentence}, highly detailed, masterpiece, sharp focus, 8k`;

    // ComfyUI Grok
    const gk = `A raw, detailed photo showing: ${storyText}. Style: ${styleEn}. Composition: ${shotEn}${staticCameraEn ? ', ' + staticCameraEn : ''}. Atmosphere: ${toneEn}. Colors: ${colorEn}. Camera setup: ${cameraSentence}. Realism, high resolution.`;

    // Seedance
    const sd = `commercial film look, ${storyText}, ${styleEn}, ${shotEn}, camera: ${staticCameraEn || 'steady'}, tone: ${toneEn}, color grade: ${colorEn}${gearSuffix}, high quality cinematic render, 8k resolution`;

    // LTX Video (Dynamic video motion allowed)
    const videoCameraDesc = `filmed using professional cinema equipment with ${videoCameraMoveEn || 'steady tracking'}`;
    const lx = `A realistic commercial video clip: ${storyText}. Style: ${styleEn}. Camera movement: ${videoCameraMoveEn}, ${shotEn}. Tone: ${toneEn}. Colors: ${colorEn}. ${videoCameraDesc}. Smooth motion, highly detailed, photorealistic render.`;

    return { mj, nb, cf, gk, sd, lx };
  };

  const localPrompts = compileLocalPrompts();
  const activeMj = customMjPrompt !== '' ? customMjPrompt : localPrompts.mj;
  const activeNb = customNbPrompt !== '' ? customNbPrompt : localPrompts.nb;
  const activeCf = customCfPrompt !== '' ? customCfPrompt : localPrompts.cf;
  const activeGk = customGkPrompt !== '' ? customGkPrompt : localPrompts.gk;
  const activeSd = customSdPrompt !== '' ? customSdPrompt : localPrompts.sd;
  const activeLx = customLxPrompt !== '' ? customLxPrompt : localPrompts.lx;

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    showToast(`${type} 프롬프트가 복사되었습니다.`);
  };

  const handleTranslateAndGenerate = async () => {
    if (!story || !story.trim()) {
      setApiError('번역할 스토리 내용을 먼저 입력해주세요.');
      return;
    }

    setLoading(true);
    setApiError('');

    try {
      if (geminiApiKey) {
        // A. Premium Translate & AI Expand via Gemini API
        const promptText = `Translate this storyboard scene story (written in Korean) into English and expand it into high-quality image/video generation prompts.
Story in Korean: "${story}"
Style: "${STYLES[stylePreset]?.ko} (${STYLES[stylePreset]?.en})"
Shot Type: "${SHOTS[shotType]?.ko} (${SHOTS[shotType]?.en})"
Camera Move: "${CAMERAS[cameraMove]?.ko} (${CAMERAS[cameraMove]?.en})"
Camera Gear: "${CAMERA_GEAR[cameraGear]?.ko} (${CAMERA_GEAR[cameraGear]?.en})"
Lens mm: "${LENS_MM[lensMm]?.ko} (${LENS_MM[lensMm]?.en})"
Lens Type/Model: "${LENS_TYPES[lensType]?.ko} (${LENS_TYPES[lensType]?.en})"
Tone: "${TONES[tone]?.ko} (${TONES[tone]?.en})"
Colors: "${COLORS[colorPalette]?.ko} (${COLORS[colorPalette]?.en})"

CRITICAL PROMPTING RULES:
1. Prevent Camera/Lens Objects in Images: To stop the AI from drawing physical cameras or lenses in the scene, DO NOT mention nouns like "camera body", "camera model", "lens module", "Fujifilm GFX 100S", or "Canon L-series USM lens". Instead, describe the setup using brandless adjectival/prepositional filming style and optical properties (e.g., "photographed with medium-format aesthetics, utilizing shallow depth-of-field and soft out-of-focus background bokeh").
2. No Video Motion in Static Prompts: For all static engines (Midjourney, NanoBanana, ComfyUI, Grok, Seedance), DO NOT include video movement terms (such as "slow rotation", "orbital motion", "zooming in", "panning", "tilting", "tracking"). Replace them with static terms (e.g. "steady camera perspective", "still photograph") or omit them entirely to prevent motion blur and duplicate objects. Only include dynamic motions in the LTX Video prompt.
3. ComfyUI Z-Image Turbo Prompt Structure: The "comfyui" prompt MUST follow this exact natural language sentence structure: [Subject] -> [State] -> [Composition] -> [Lighting] -> [Atmosphere]. Do not write long tag lists. Example: "[Subject/Story details], [State/Action], [Composition/Framing], illuminated by [Lighting], rendered in [Style] style, [Camera/Lens optical description], highly detailed, masterpiece, sharp focus, 8k".

Provide a JSON object containing exactly seven fields:
1. "storyEn": The simple, direct translation of the Korean story into English.
2. "midjourney": A prompt optimized for Midjourney (incorporating the brandless camera/lens rendering description, static framing only, ending with --ar ${aspectRatio} --v 6.0).
3. "nanobanana": A prompt optimized for NanoBanana (a cohesive, detailed, descriptive English paragraph describing layout, brandless optical properties, static composition, and lighting).
4. "comfyui": A prompt optimized for ComfyUI z-image-turbo following the exact structure: [Subject] -> [State] -> [Composition] -> [Lighting] -> [Atmosphere].
5. "grok": A prompt optimized for Grok (Flux/Grok natural spatial tags, including brandless camera/lens rendering details and static composition).
6. "seedance": A prompt optimized for Seedance (cinematic commercial look, brandless camera/lens rendering setup, static camera framing, and color grading).
7. "ltxvideo": A prompt optimized for LTX Video (descriptive video script, focusing on smooth physical motion, camera lens zoom/perspective, and camera gear/lens type effects).

Return only the raw JSON. Do not write markdown tags like \`\`\`json.`;

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              contents: [{ parts: [{ text: promptText }] }],
              generationConfig: {
                responseMimeType: "application/json"
              }
            }),
          }
        );

        if (!response.ok) {
          throw new Error('API 호출에 실패했습니다. 키가 올바른지 확인해주세요.');
        }

        const data = await response.json();
        const textResponse = data.candidates[0].content.parts[0].text;
        const parsed = JSON.parse(textResponse);

        if (parsed.storyEn && parsed.midjourney && parsed.nanobanana && parsed.comfyui && parsed.grok && parsed.seedance && parsed.ltxvideo) {
          const updateData = { storyEn: parsed.storyEn };
          
          if (!isMjEdited) updateData.customMjPrompt = parsed.midjourney;
          if (!isNbEdited) updateData.customNbPrompt = parsed.nanobanana;
          if (!isCfEdited) updateData.customCfPrompt = parsed.comfyui;
          if (!isGkEdited) updateData.customGkPrompt = parsed.grok;
          if (!isSdEdited) updateData.customSdPrompt = parsed.seedance;
          if (!isLxEdited) updateData.customLxPrompt = parsed.ltxvideo;

          onChange(updateData);
          showToast('AI 번역 및 고도화 완료');
        } else {
          throw new Error('데이터 파싱 오류');
        }
      } else {
        // B. Fallback Free Translate via MyMemory API
        const res = await fetch(
          `https://api.mymemory.translated.net/get?q=${encodeURIComponent(story)}&langpair=ko|en`
        );
        if (!res.ok) {
          throw new Error('번역 API 서버 통신 실패');
        }
        const data = await res.json();
        const translatedText = data.responseData.translatedText;
        if (translatedText) {
          onChange({ 
            storyEn: translatedText,
            isMjEdited: false,
            isNbEdited: false,
            isCfEdited: false,
            isGkEdited: false,
            isSdEdited: false,
            isLxEdited: false
          });
          showToast('영문 번역 완료 (MyMemory)');
        } else {
          throw new Error('번역 데이터 해석 실패');
        }
      }
    } catch (err) {
      console.error(err);
      setApiError(err.message || '번역 진행 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetCustomPrompts = () => {
    onChange({
      customMjPrompt: '',
      customNbPrompt: '',
      customCfPrompt: '',
      customGkPrompt: '',
      customSdPrompt: '',
      customLxPrompt: '',
      isMjEdited: false,
      isNbEdited: false,
      isCfEdited: false,
      isGkEdited: false,
      isSdEdited: false,
      isLxEdited: false
    });
  };

  return (
    <div className="prompts-container">
      <div className="form-row" style={{ gap: '0.5rem' }}>
        <button
          type="button"
          className="btn btn-primary btn-sm"
          style={{ gridColumn: 'span 2', display: 'flex', gap: '0.25rem', justifyContent: 'center', fontWeight: 600 }}
          onClick={handleTranslateAndGenerate}
          disabled={loading}
        >
          <Languages size={12} className={loading ? 'animate-spin' : ''} />
          {loading ? '번역 진행 중...' : geminiApiKey ? 'Gemini AI로 번역 & 프롬프트 고도화' : '한글 지문 영문 번역 (MyMemory)'}
        </button>
      </div>

      {apiError && (
        <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center', color: 'var(--danger-color)', fontSize: '0.75rem', marginTop: '0.25rem' }}>
          <AlertCircle size={12} />
          <span>{apiError}</span>
        </div>
      )}

      {/* Midjourney Box */}
      <div className="prompt-box">
        <div className="prompt-box-header">
          <span className="prompt-badge badge-mj">Midjourney</span>
          <button 
            type="button" 
            className="btn btn-text btn-sm" 
            style={{ padding: '2px' }}
            onClick={() => copyToClipboard(activeMj, 'Midjourney')}
            title="복사"
          >
            <Copy size={12} />
          </button>
        </div>
        <textarea
          className="prompt-text"
          value={activeMj}
          onChange={(e) => onChange({ customMjPrompt: e.target.value, isMjEdited: true })}
          style={{
            width: '100%',
            minHeight: '60px',
            border: 'none',
            background: 'transparent',
            fontSize: '0.8rem',
            fontFamily: 'monospace',
            resize: 'vertical',
            outline: 'none',
            padding: 0
          }}
          placeholder="Midjourney 프롬프트 편집..."
        />
      </div>

      {/* NanoBanana Box */}
      <div className="prompt-box">
        <div className="prompt-box-header">
          <span className="prompt-badge badge-nb">NanoBanana</span>
          <button 
            type="button" 
            className="btn btn-text btn-sm" 
            style={{ padding: '2px' }}
            onClick={() => copyToClipboard(activeNb, 'NanoBanana')}
            title="복사"
          >
            <Copy size={12} />
          </button>
        </div>
        <textarea
          className="prompt-text"
          value={activeNb}
          onChange={(e) => onChange({ customNbPrompt: e.target.value, isNbEdited: true })}
          style={{
            width: '100%',
            minHeight: '60px',
            border: 'none',
            background: 'transparent',
            fontSize: '0.8rem',
            fontFamily: 'monospace',
            resize: 'vertical',
            outline: 'none',
            padding: 0
          }}
          placeholder="NanoBanana 프롬프트 편집..."
        />
      </div>

      {/* ComfyUI Box */}
      <div className="prompt-box">
        <div className="prompt-box-header">
          <span className="prompt-badge badge-cf">ComfyUI z-image-turbo</span>
          <button 
            type="button" 
            className="btn btn-text btn-sm" 
            style={{ padding: '2px' }}
            onClick={() => copyToClipboard(activeCf, 'ComfyUI')}
            title="복사"
          >
            <Copy size={12} />
          </button>
        </div>
        <textarea
          className="prompt-text"
          value={activeCf}
          onChange={(e) => onChange({ customCfPrompt: e.target.value, isCfEdited: true })}
          style={{
            width: '100%',
            minHeight: '60px',
            border: 'none',
            background: 'transparent',
            fontSize: '0.8rem',
            fontFamily: 'monospace',
            resize: 'vertical',
            outline: 'none',
            padding: 0
          }}
          placeholder="ComfyUI 프롬프트 편집..."
        />
      </div>

      {/* ComfyUI Grok Box */}
      <div className="prompt-box">
        <div className="prompt-box-header">
          <span className="prompt-badge" style={{ backgroundColor: '#1e293b', color: '#f8fafc', fontSize: '0.65rem' }}>ComfyUI Grok</span>
          <button 
            type="button" 
            className="btn btn-text btn-sm" 
            style={{ padding: '2px' }}
            onClick={() => copyToClipboard(activeGk, 'ComfyUI Grok')}
            title="복사"
          >
            <Copy size={12} />
          </button>
        </div>
        <textarea
          className="prompt-text"
          value={activeGk}
          onChange={(e) => onChange({ customGkPrompt: e.target.value, isGkEdited: true })}
          style={{
            width: '100%',
            minHeight: '60px',
            border: 'none',
            background: 'transparent',
            fontSize: '0.8rem',
            fontFamily: 'monospace',
            resize: 'vertical',
            outline: 'none',
            padding: 0
          }}
          placeholder="ComfyUI Grok 프롬프트 편집..."
        />
      </div>

      {/* Seedance Box */}
      <div className="prompt-box">
        <div className="prompt-box-header">
          <span className="prompt-badge" style={{ backgroundColor: '#4f46e5', color: '#ffffff', fontSize: '0.65rem' }}>Seedance</span>
          <button 
            type="button" 
            className="btn btn-text btn-sm" 
            style={{ padding: '2px' }}
            onClick={() => copyToClipboard(activeSd, 'Seedance')}
            title="복사"
          >
            <Copy size={12} />
          </button>
        </div>
        <textarea
          className="prompt-text"
          value={activeSd}
          onChange={(e) => onChange({ customSdPrompt: e.target.value, isSdEdited: true })}
          style={{
            width: '100%',
            minHeight: '60px',
            border: 'none',
            background: 'transparent',
            fontSize: '0.8rem',
            fontFamily: 'monospace',
            resize: 'vertical',
            outline: 'none',
            padding: 0
          }}
          placeholder="Seedance 프롬프트 편집..."
        />
      </div>

      {/* LTX Video Box */}
      <div className="prompt-box">
        <div className="prompt-box-header">
          <span className="prompt-badge" style={{ backgroundColor: '#ec4899', color: '#ffffff', fontSize: '0.65rem' }}>LTX Video</span>
          <button 
            type="button" 
            className="btn btn-text btn-sm" 
            style={{ padding: '2px' }}
            onClick={() => copyToClipboard(activeLx, 'LTX Video')}
            title="복사"
          >
            <Copy size={12} />
          </button>
        </div>
        <textarea
          className="prompt-text"
          value={activeLx}
          onChange={(e) => onChange({ customLxPrompt: e.target.value, isLxEdited: true })}
          style={{
            width: '100%',
            minHeight: '60px',
            border: 'none',
            background: 'transparent',
            fontSize: '0.8rem',
            fontFamily: 'monospace',
            resize: 'vertical',
            outline: 'none',
            padding: 0
          }}
          placeholder="LTX Video 프롬프트 편집..."
        />
      </div>

      {(customMjPrompt || customNbPrompt || customCfPrompt || customGkPrompt || customSdPrompt || customLxPrompt || isMjEdited || isNbEdited || isCfEdited || isGkEdited || isSdEdited || isLxEdited) && (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="button"
            className="btn btn-text btn-sm"
            style={{ fontSize: '0.7rem', textDecoration: 'underline' }}
            onClick={handleResetCustomPrompts}
          >
            기본 템플릿 프롬프트로 초기화
          </button>
        </div>
      )}
    </div>
  );
}
