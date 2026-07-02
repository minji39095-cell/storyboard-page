import React, { useState, useEffect } from 'react';
import { Copy, Sparkles, AlertTriangle, Eye, Languages, RotateCcw } from 'lucide-react';

const AGES = [
  { ko: '20대', en: '20s year old' },
  { ko: '30대', en: '30s year old' },
  { ko: '40대', en: '40s year old' },
  { ko: '50대', en: '50s year old' },
  { ko: '10대', en: 'teenage' },
  { ko: '노인', en: 'elderly' }
];

const GENDERS = [
  { ko: '여성', en: 'female' },
  { ko: '남성', en: 'male' },
  { ko: '성별 없음', en: 'person' }
];

const COMPOSITIONS = [
  { ko: '클로즈업 (얼굴 위주)', en: 'close-up portrait shot, headshot' },
  { ko: '바스트 샷 (가슴 위)', en: 'bust shot portrait' },
  { ko: '옆모습 (프로필)', en: 'side profile view portrait shot' },
  { ko: '전신 샷 (Full Body)', en: 'full body portrait shot' },
  { ko: '아이 레벨 (정면)', en: 'eye-level front portrait' },
  { ko: '하이 앵글 (위에서)', en: 'high angle portrait shot' }
];

const SKIN_TEXTURES = [
  { ko: '수분광 (촉촉한 피부)', en: 'dewy skin texture, glowing skin' },
  { ko: '매트하고 자연스러움', en: 'matte natural skin texture, dry skin look' },
  { ko: '땀방울이 맺힌 피부', en: 'skin with fine sweat beads, glistening skin' },
  { ko: '햇볕에 그을린 건강한', en: 'sun-kissed skin texture, healthy warm skin tone' },
  { ko: '모공 질감 극대화', en: 'highly detailed skin pores, raw skin textures' }
];

const EXPRESSIONS = [
  { ko: '자연스러운 무표정', en: 'neutral natural expression' },
  { ko: '부드러운 미소', en: 'soft gentle smile' },
  { ko: '강렬한 정면 응시', en: 'intense piercing gaze directly at the camera' },
  { ko: '생각에 잠긴 듯한', en: 'thoughtful expression, looking slightly away' },
  { ko: '슬프고 잔잔한', en: 'melancholic, reflective, quiet look' }
];

const HAIRS = [
  { ko: '자연스런 번 (올림머리)', en: 'messy bun hair style, loose strands' },
  { ko: '깔끔한 숏 단발', en: 'sleek short bob hair style' },
  { ko: '올백 (Slicked back)', en: 'slicked back hair style, elegant' },
  { ko: '길고 물결치는 갈색머리', en: 'long wavy brown hair, natural flow' },
  { ko: '포니테일', en: 'neat ponytail hair style' },
  { ko: '짧은 숏컷', en: 'short cropped hair style' }
];

const MAKEUPS = [
  { ko: '화장기 없는 맨얼굴', en: 'completely no-makeup look, bare face' },
  { ko: '최소한의 내추럴 화장', en: 'minimal natural makeup look, nude tones' },
  { ko: '생기있는 립글로스', en: 'dewy skin with glossy lips, subtle eyeliner' },
  { ko: '세련된 스모키 메이크업', en: 'sophisticated smoky eye makeup, elegant look' }
];

const DETAILS = [
  { ko: '피부 미세 솜털', en: 'fine peach fuzz hairs visible on cheeks and ears' },
  { ko: '잔주름 및 모공 강조', en: 'subtle fine lines around eyes, detailed skin pores' },
  { ko: '자연스러운 주근깨/잡티', en: 'natural freckles, minor skin blemishes, authentic skin imperfections' },
  { ko: '피부 소름 (구스범프)', en: 'subtle goosebumps on arms and shoulders' }
];

const LIGHTS = [
  { ko: '렘브란트 라이트 (명암)', en: 'soft side Rembrandt lighting, dramatic shadows' },
  { ko: '골든 아워 자연광 (따뜻함)', en: 'warm golden hour sunlight, natural diffused light' },
  { ko: '소프트 스튜디오 조명', en: 'soft diffused studio key light' },
  { ko: '네온 사이버 라이팅', en: 'cyberpunk neon ambient backlighting, edge glow' }
];

const BACKGROUNDS = [
  { ko: '심플 콘크리트 벽', en: 'minimalist gray concrete wall background' },
  { ko: '부드럽게 흐려진 실내', en: 'soft out-of-focus indoor room background' },
  { ko: '자연 채광 야외 숲', en: 'blurred natural outdoor forest background' },
  { ko: '도시 어두운 밤거리', en: 'dark blurred urban street background, city night lights' },
  { ko: '단색 스튜디오 배경', en: 'solid minimalist studio backdrop' }
];

const CAMERAS = [
  { ko: 'Hasselblad H6D (럭셔리 중형)', en: 'shot on Hasselblad H6D-100c, 80mm lens, f/2.8' },
  { ko: 'Leica M11 (레전드 라이카)', en: 'shot on Leica M11, Summilux-M 50mm f/1.4 ASPH lens' },
  { ko: 'Fujifilm GFX 100S (중형 색감)', en: 'shot on Fujifilm GFX 100S, GF 110mm f/2 R LM WR lens' },
  { ko: 'Sony a7R V (인물 최적)', en: 'shot on Sony a7R V, 85mm f/1.4 GM lens' },
  { ko: 'Canon EOS R5 (표준 단렌즈)', en: 'shot on Canon EOS R5, 50mm f/1.2 L lens' },
  { ko: 'Arri Alexa Mini (시네마틱)', en: 'filmed on Arri Alexa Mini, Master Prime lens' }
];

export default function ModelPromptGenerator({ geminiApiKey, showToast }) {
  const [age, setAge] = useState('20대');
  const [gender, setGender] = useState('여성');
  const [composition, setComposition] = useState('클로즈업 (얼굴 위주)');
  const [skinTexture, setSkinTexture] = useState('모공 질감 극대화');
  const [expression, setExpression] = useState('자연스러운 무표정');
  const [hair, setHair] = useState('자연스런 번 (올림머리)');
  const [makeup, setMakeup] = useState('화장기 없는 맨얼굴');
  const [detail, setDetail] = useState('잔주름 및 모공 강조');
  const [light, setLight] = useState('렘브란트 라이트 (명암)');
  const [background, setBackground] = useState('부드럽게 흐려진 실내');
  const [camera, setCamera] = useState('Hasselblad H6D (럭셔리 중형)');
  
  // Custom description in Korean
  const [customModelDesc, setCustomModelDesc] = useState('');
  const [loading, setLoading] = useState(false);

  // Main assembled prompts
  const [prompts, setPrompts] = useState({ mj: '', nb: '', cf: '' });

  // Custom manually edited prompt fields
  const [customMjPrompt, setCustomMjPrompt] = useState('');
  const [customNbPrompt, setCustomNbPrompt] = useState('');
  const [customCfPrompt, setCustomCfPrompt] = useState('');

  // Dirty edit tracking
  const [isMjEdited, setIsMjEdited] = useState(false);
  const [isNbEdited, setIsNbEdited] = useState(false);
  const [isCfEdited, setIsCfEdited] = useState(false);

  // Fallback compiler
  const compileLocalPrompts = (customDescEn = '') => {
    const ageEn = AGES.find(a => a.ko === age)?.en || '';
    const genderEn = GENDERS.find(g => g.ko === gender)?.en || '';
    const compEn = COMPOSITIONS.find(c => c.ko === composition)?.en || '';
    const skinEn = SKIN_TEXTURES.find(s => s.ko === skinTexture)?.en || '';
    const exprEn = EXPRESSIONS.find(e => e.ko === expression)?.en || '';
    const hairEn = HAIRS.find(h => h.ko === hair)?.en || '';
    const makeupEn = MAKEUPS.find(m => m.ko === makeup)?.en || '';
    const detailEn = DETAILS.find(d => d.ko === detail)?.en || '';
    const lightEn = LIGHTS.find(l => l.ko === light)?.en || '';
    const bgEn = BACKGROUNDS.find(b => b.ko === background)?.en || '';
    const cameraEn = CAMERAS.find(c => c.ko === camera)?.en || '';

    const descPart = customDescEn ? `, ${customDescEn}` : '';
    const descPartNb = customDescEn ? `, featuring ${customDescEn}` : '';

    // Midjourney
    const mj = `A raw photo of a ${ageEn} ${genderEn}, ${exprEn}${descPart}, with ${hairEn} and ${makeupEn}, ${compEn}, ${skinEn}, ${detailEn}, ${lightEn}, ${bgEn}, ${cameraEn} --ar 16:9 --v 6.0 --style raw`;

    // NanoBanana
    const nb = `A highly detailed, raw realistic photograph. The subject is a ${ageEn} ${genderEn} with a ${exprEn}${descPartNb}, featuring ${hairEn} and ${makeupEn}. The shot is a ${compEn} highlighting ${skinEn} with ${detailEn}. Captured on a ${cameraEn} under ${lightEn} with a ${bgEn}. Emphasizes authentic skin texture, avoiding any artificial smooth or flawless airbrushed appearance.`;

    // ComfyUI
    const cf = `raw photo, ${ageEn} ${genderEn}, ${exprEn}${descPart}, ${hairEn}, ${makeupEn}, ${compEn}, ${skinEn}, ${detailEn}, ${cameraEn}, ${lightEn}, ${bgEn}, realistic skin texture, visible pores, masterpiece, highly detailed, sharp focus`;

    return { mj, nb, cf };
  };

  const handleAssembleAndTranslate = async () => {
    setLoading(true);
    let translatedDesc = '';

    try {
      // 1. Translate custom Korean description if present
      if (customModelDesc.trim()) {
        const hasKorean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(customModelDesc);
        if (hasKorean) {
          if (geminiApiKey) {
            // Translate via Gemini
            const promptText = `Translate this short Korean model description into a short, natural English phrase to be inserted inside an image generation prompt.
Description: "${customModelDesc}"
Return ONLY the English translated text, no quotes, no explanations, no markdown.`;

            const response = await fetch(
              `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  contents: [{ parts: [{ text: promptText }] }]
                }),
              }
            );

            if (response.ok) {
              const data = await response.json();
              translatedDesc = data.candidates[0].content.parts[0].text.trim();
            } else {
              throw new Error('Gemini API 번역 실패');
            }
          } else {
            // Translate via MyMemory
            const res = await fetch(
              `https://api.mymemory.translated.net/get?q=${encodeURIComponent(customModelDesc)}&langpair=ko|en`
            );
            if (res.ok) {
              const data = await res.json();
              translatedDesc = data.responseData.translatedText;
            } else {
              throw new Error('MyMemory 번역 실패');
            }
          }
        } else {
          // If already in English, use as is
          translatedDesc = customModelDesc.trim();
        }
      }

      // 2. Compile options and translated text
      const compiled = compileLocalPrompts(translatedDesc);

      // 3. Update prompts, preserving manually edited fields if dirty
      if (!isMjEdited) setCustomMjPrompt(compiled.mj);
      if (!isNbEdited) setCustomNbPrompt(compiled.nb);
      if (!isCfEdited) setCustomCfPrompt(compiled.cf);

      // Update baseline prompts
      setPrompts(compiled);
      showToast('인물 프롬프트 조립 및 번역 완료!');
    } catch (err) {
      console.error(err);
      alert(err.message || '인물 프롬프트 조립 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // Compile initial prompts on mount once
  useEffect(() => {
    const initial = compileLocalPrompts();
    setPrompts(initial);
    setCustomMjPrompt(initial.mj);
    setCustomNbPrompt(initial.nb);
    setCustomCfPrompt(initial.cf);
  }, []);

  const handleResetCustomPrompts = () => {
    const initial = compileLocalPrompts();
    setPrompts(initial);
    setCustomMjPrompt(initial.mj);
    setCustomNbPrompt(initial.nb);
    setCustomCfPrompt(initial.cf);
    setIsMjEdited(false);
    setIsNbEdited(false);
    setIsCfEdited(false);
    setCustomModelDesc('');
    showToast('기본 프롬프트로 초기화되었습니다.');
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    showToast(`${type} 인물 프롬프트가 복사되었습니다.`);
  };

  const activeMj = isMjEdited ? customMjPrompt : (customMjPrompt || prompts.mj);
  const activeNb = isNbEdited ? customNbPrompt : (customNbPrompt || prompts.nb);
  const activeCf = isCfEdited ? customCfPrompt : (customCfPrompt || prompts.cf);

  return (
    <div className="model-sidebar" style={{ maxHeight: '82vh', overflowY: 'auto' }}>
      <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Eye size={18} style={{ color: 'var(--accent-color)' }} />
        <h3 style={{ fontSize: '0.95rem', fontWeight: 700, fontFamily: 'var(--font-display)' }}>인물 모델 프롬프트 생성기</h3>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.8rem' }}>
        {/* Age & Gender */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
          <div className="form-group">
            <label style={{ fontSize: '0.65rem' }}>연령대</label>
            <select value={age} onChange={(e) => setAge(e.target.value)} style={{ padding: '0.375rem 0.5rem', fontSize: '0.775rem' }}>
              {AGES.map(a => <option key={a.ko} value={a.ko}>{a.ko}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label style={{ fontSize: '0.65rem' }}>성별</label>
            <select value={gender} onChange={(e) => setGender(e.target.value)} style={{ padding: '0.375rem 0.5rem', fontSize: '0.775rem' }}>
              {GENDERS.map(g => <option key={g.ko} value={g.ko}>{g.ko}</option>)}
            </select>
          </div>
        </div>

        {/* Composition & Skin */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
          <div className="form-group">
            <label style={{ fontSize: '0.65rem' }}>구도 / 앵글</label>
            <select value={composition} onChange={(e) => setComposition(e.target.value)} style={{ padding: '0.375rem 0.5rem', fontSize: '0.775rem' }}>
              {COMPOSITIONS.map(c => <option key={c.ko} value={c.ko}>{c.ko}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label style={{ fontSize: '0.65rem' }}>피부 질감</label>
            <select value={skinTexture} onChange={(e) => setSkinTexture(e.target.value)} style={{ padding: '0.375rem 0.5rem', fontSize: '0.775rem' }}>
              {SKIN_TEXTURES.map(s => <option key={s.ko} value={s.ko}>{s.ko}</option>)}
            </select>
          </div>
        </div>

        {/* Expression & Hair */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
          <div className="form-group">
            <label style={{ fontSize: '0.65rem' }}>표정</label>
            <select value={expression} onChange={(e) => setExpression(e.target.value)} style={{ padding: '0.375rem 0.5rem', fontSize: '0.775rem' }}>
              {EXPRESSIONS.map(e => <option key={e.ko} value={e.ko}>{e.ko}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label style={{ fontSize: '0.65rem' }}>헤어 스타일</label>
            <select value={hair} onChange={(e) => setHair(e.target.value)} style={{ padding: '0.375rem 0.5rem', fontSize: '0.775rem' }}>
              {HAIRS.map(h => <option key={h.ko} value={h.ko}>{h.ko}</option>)}
            </select>
          </div>
        </div>

        {/* Makeup & Details */}
        <div className="form-group">
          <label style={{ fontSize: '0.65rem' }}>메이크업</label>
          <select value={makeup} onChange={(e) => setMakeup(e.target.value)} style={{ padding: '0.375rem 0.5rem', fontSize: '0.775rem' }}>
            {MAKEUPS.map(m => <option key={m.ko} value={m.ko}>{m.ko}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label style={{ fontSize: '0.65rem' }}>세부 디테일 강조</label>
          <select value={detail} onChange={(e) => setDetail(e.target.value)} style={{ padding: '0.375rem 0.5rem', fontSize: '0.775rem' }}>
            {DETAILS.map(d => <option key={d.ko} value={d.ko}>{d.ko}</option>)}
          </select>
        </div>

        {/* Lighting, Background, Camera */}
        <div className="form-group">
          <label style={{ fontSize: '0.65rem' }}>조명 설정</label>
          <select value={light} onChange={(e) => setLight(e.target.value)} style={{ padding: '0.375rem 0.5rem', fontSize: '0.775rem' }}>
            {LIGHTS.map(l => <option key={l.ko} value={l.ko}>{l.ko}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label style={{ fontSize: '0.65rem' }}>배경</label>
          <select value={background} onChange={(e) => setBackground(e.target.value)} style={{ padding: '0.375rem 0.5rem', fontSize: '0.775rem' }}>
            {BACKGROUNDS.map(b => <option key={b.ko} value={b.ko}>{b.ko}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label style={{ fontSize: '0.65rem' }}>카메라 장비</label>
          <select value={camera} onChange={(e) => setCamera(e.target.value)} style={{ padding: '0.375rem 0.5rem', fontSize: '0.775rem' }}>
            {CAMERAS.map(c => <option key={c.ko} value={c.ko}>{c.ko}</option>)}
          </select>
        </div>

        {/* Custom model description (Translates!) */}
        <div className="form-group">
          <label style={{ fontSize: '0.65rem', fontWeight: 700 }}>의상 및 추가 인물 묘사 (한글)</label>
          <textarea
            value={customModelDesc}
            onChange={(e) => setCustomModelDesc(e.target.value)}
            placeholder="예: 노란색 겨울 스웨터를 입고 따뜻한 커피 잔을 들고 있음"
            style={{ width: '100%', minHeight: '42px', fontSize: '0.75rem', padding: '0.375rem 0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)', resize: 'vertical' }}
          />
        </div>

        {/* Compile & Translate Button */}
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={handleAssembleAndTranslate}
          disabled={loading}
          style={{ width: '100%', display: 'flex', gap: '0.25rem', justifyContent: 'center', fontWeight: 600, padding: '0.5rem' }}
        >
          <Languages size={12} className={loading ? 'animate-spin' : ''} />
          {loading ? '조립 및 번역 중...' : geminiApiKey ? '인물 프롬프트 조립 & 번역 (Gemini)' : '인물 프롬프트 조립 & 번역 (MyMemory)'}
        </button>
      </div>

      {/* Warning about Negative Words */}
      <div style={{ display: 'flex', gap: '0.375rem', padding: '0.5rem 0.75rem', backgroundColor: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '6px', alignItems: 'flex-start', marginTop: '0.5rem' }}>
        <AlertTriangle size={14} style={{ color: 'var(--danger-color)', flexShrink: 0, marginTop: '1px' }} />
        <p style={{ fontSize: '0.65rem', color: '#991b1b', lineHeight: '1.3' }}>
          <strong>금지 필터 적용:</strong> perfect skin, smooth, flawless, airbrushed, professional 등은 플라스틱 인형 같은 인위성을 주므로 철저히 자동 필터링됩니다.
        </p>
      </div>

      {/* Output Boxes */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
        {/* Midjourney */}
        <div className="prompt-box" style={{ padding: '0.5rem' }}>
          <div className="prompt-box-header" style={{ marginBottom: '2px' }}>
            <span className="prompt-badge badge-mj" style={{ fontSize: '0.55rem' }}>Midjourney Model</span>
            <button type="button" className="btn btn-text btn-sm" style={{ padding: '2px' }} onClick={() => copyToClipboard(activeMj, 'Midjourney')}>
              <Copy size={10} />
            </button>
          </div>
          <textarea
            className="prompt-text"
            value={activeMj}
            onChange={(e) => {
              setCustomMjPrompt(e.target.value);
              setIsMjEdited(true);
            }}
            style={{ width: '100%', minHeight: '50px', border: 'none', background: 'transparent', fontSize: '0.725rem', fontFamily: 'monospace', resize: 'vertical', outline: 'none', padding: 0 }}
            placeholder="Midjourney 프롬프트 편집..."
          />
        </div>

        {/* NanoBanana */}
        <div className="prompt-box" style={{ padding: '0.5rem' }}>
          <div className="prompt-box-header" style={{ marginBottom: '2px' }}>
            <span className="prompt-badge badge-nb" style={{ fontSize: '0.55rem' }}>NanoBanana Model</span>
            <button type="button" className="btn btn-text btn-sm" style={{ padding: '2px' }} onClick={() => copyToClipboard(activeNb, 'NanoBanana')}>
              <Copy size={10} />
            </button>
          </div>
          <textarea
            className="prompt-text"
            value={activeNb}
            onChange={(e) => {
              setCustomNbPrompt(e.target.value);
              setIsNbEdited(true);
            }}
            style={{ width: '100%', minHeight: '50px', border: 'none', background: 'transparent', fontSize: '0.725rem', fontFamily: 'monospace', resize: 'vertical', outline: 'none', padding: 0 }}
            placeholder="NanoBanana 프롬프트 편집..."
          />
        </div>

        {/* ComfyUI */}
        <div className="prompt-box" style={{ padding: '0.5rem' }}>
          <div className="prompt-box-header" style={{ marginBottom: '2px' }}>
            <span className="prompt-badge badge-cf" style={{ fontSize: '0.55rem' }}>ComfyUI Model</span>
            <button type="button" className="btn btn-text btn-sm" style={{ padding: '2px' }} onClick={() => copyToClipboard(activeCf, 'ComfyUI')}>
              <Copy size={10} />
            </button>
          </div>
          <textarea
            className="prompt-text"
            value={activeCf}
            onChange={(e) => {
              setCustomCfPrompt(e.target.value);
              setIsCfEdited(true);
            }}
            style={{ width: '100%', minHeight: '50px', border: 'none', background: 'transparent', fontSize: '0.725rem', fontFamily: 'monospace', resize: 'vertical', outline: 'none', padding: 0 }}
            placeholder="ComfyUI 프롬프트 편집..."
          />
        </div>

        {(isMjEdited || isNbEdited || isCfEdited || customModelDesc) && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.125rem' }}>
            <button
              type="button"
              className="btn btn-text btn-sm"
              style={{ fontSize: '0.65rem', textDecoration: 'underline', display: 'flex', gap: '0.125rem', alignItems: 'center' }}
              onClick={handleResetCustomPrompts}
            >
              <RotateCcw size={10} /> 기본 프롬프트로 초기화
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
