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
    tone = 'cinematic', 
    colorPalette = 'amber', 
    aspectRatio = '16:9',
    customMjPrompt = '',
    customNbPrompt = '',
    customCfPrompt = '',
    isMjEdited = false,
    isNbEdited = false,
    isCfEdited = false
  } = frame;

  // Local compiler when AI is not used
  const compileLocalPrompts = () => {
    const styleEn = STYLES[stylePreset]?.en || '';
    const shotEn = SHOTS[shotType]?.en || '';
    const cameraEn = CAMERAS[cameraMove]?.en || '';
    const toneEn = TONES[tone]?.en || '';
    const colorEn = COLORS[colorPalette]?.en || '';

    // Use English translated story if available, fallback to Korean story
    const storyText = storyEn || story.trim() || 'A simple scene';

    // Midjourney: comma separated keywords
    const mj = `${storyText}, ${styleEn}, ${shotEn}, ${cameraEn}, ${toneEn}, ${colorEn} --ar ${aspectRatio} --v 6.0`;

    // NanoBanana: Descriptive paragraphs
    const nb = `A detailed ${STYLES[stylePreset]?.noun || 'illustration'} depicting: ${storyText}. The scene features a ${shotEn} with ${cameraEn}. The general mood is ${toneEn}, rendered in a ${colorEn}.`;

    // ComfyUI z-image-turbo: Comma separated tags with quality suffixes, no parameters
    const cf = `${storyText}, ${styleEn}, ${shotEn}, ${cameraEn}, ${toneEn}, ${colorEn}, highly detailed, masterpiece, sharp focus, 8k`;

    return { mj, nb, cf };
  };

  const localPrompts = compileLocalPrompts();
  const activeMj = customMjPrompt !== '' ? customMjPrompt : localPrompts.mj;
  const activeNb = customNbPrompt !== '' ? customNbPrompt : localPrompts.nb;
  const activeCf = customCfPrompt !== '' ? customCfPrompt : localPrompts.cf;

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
        // A. Premium Translate & AI Expand via Gemini API (Manual trigger)
        const promptText = `Translate this storyboard scene story (written in Korean) into English and expand it into high-quality image generation prompts.
Story in Korean: "${story}"
Style: "${STYLES[stylePreset]?.ko} (${STYLES[stylePreset]?.en})"
Shot Type: "${SHOTS[shotType]?.ko} (${SHOTS[shotType]?.en})"
Camera: "${CAMERAS[cameraMove]?.ko} (${CAMERAS[cameraMove]?.en})"
Tone: "${TONES[tone]?.ko} (${TONES[tone]?.en})"
Colors: "${COLORS[colorPalette]?.ko} (${COLORS[colorPalette]?.en})"

Provide a JSON object containing exactly four fields:
1. "storyEn": The simple, direct translation of the Korean story into English.
2. "midjourney": A prompt optimized for Midjourney (comma-separated keywords, cinematic tags, ending with parameters like --ar ${aspectRatio} --v 6.0).
3. "nanobanana": A prompt optimized for NanoBanana / Google Gemini Imagen 3 (a cohesive, detailed, descriptive English paragraph describing the scene layout, lighting, color, and characters).
4. "comfyui": A prompt optimized for ComfyUI z-image-turbo (focusing on descriptive tags, style triggers, high-quality modifiers like masterpiece, no parameters).

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

        if (parsed.storyEn && parsed.midjourney && parsed.nanobanana && parsed.comfyui) {
          onChange({
            storyEn: parsed.storyEn,
            customMjPrompt: parsed.midjourney,
            customNbPrompt: parsed.nanobanana,
            customCfPrompt: parsed.comfyui,
            isMjEdited: false,
            isNbEdited: false,
            isCfEdited: false
          });
          showToast('AI 번역 및 고도화 완료');
        } else {
          throw new Error('데이터 파싱 오류');
        }
      } else {
        // B. Fallback Free Translate via MyMemory API (Manual trigger)
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
            isCfEdited: false 
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
      isMjEdited: false,
      isNbEdited: false,
      isCfEdited: false
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

      {(customMjPrompt || customNbPrompt || customCfPrompt || isMjEdited || isNbEdited || isCfEdited) && (
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
