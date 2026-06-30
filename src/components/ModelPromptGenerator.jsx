import React, { useState, useEffect } from 'react';
import { Copy, Sparkles, AlertTriangle, Eye } from 'lucide-react';

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

const SKINS = [
  { ko: '무화장 강조 (No-Makeup)', en: 'completely no-makeup look, authentic raw skin' },
  { ko: '내추럴 스킨 (최소 화장)', en: 'natural minimal makeup, clean natural skin look' },
  { ko: '일반 실사 피부', en: 'clean raw skin' }
];

const DETAILS = [
  { ko: '모공/솜털 극대화 (추천)', en: 'highly detailed skin texture with visible skin pores and fine peach fuzz hairs' },
  { ko: '미세 주름/주근깨 디테일', en: 'skin texture with subtle wrinkles, freckles, and natural imperfections' },
  { ko: '기본 실사 디테일', en: 'realistic skin texture, genuine skin details' }
];

const CAMERAS = [
  { ko: 'Hasselblad H6D (럭셔리 중형)', en: 'shot on Hasselblad H6D-100c, 80mm lens, f/2.8' },
  { ko: 'Sony a7R V (인물 최적)', en: 'shot on Sony a7R V, 85mm f/1.4 GM lens' },
  { ko: 'Canon EOS R5 (표준 단렌즈)', en: 'shot on Canon EOS R5, 50mm f/1.2 L lens' },
  { ko: 'Arri Alexa Mini (시네마틱)', en: 'filmed on Arri Alexa Mini, Master Prime lens' }
];

const LIGHTS = [
  { ko: '렘브란트 라이트 (인물 강조)', en: 'soft side Rembrandt lighting, dramatic shadows' },
  { ko: '골든 아워 자연광 (따뜻함)', en: 'warm golden hour sunlight, natural diffused light' },
  { ko: '소프트 스튜디오 조명', en: 'soft diffused studio key light' },
  { ko: '네온 사이버 라이팅', en: 'cyberpunk neon ambient backlighting, edge glow' }
];

const FOCUSES = [
  { ko: '눈 초점 강조 (아웃포커싱)', en: 'razor-sharp focus on eyes, extremely shallow depth of field, soft blurry background' },
  { ko: '중앙 집중 초점', en: 'sharp focus on the subject, clean bokeh' },
  { ko: '전체 초점 (심도 깊음)', en: 'deep depth of field, sharp detail throughout the frame' }
];

export default function ModelPromptGenerator({ showToast }) {
  const [age, setAge] = useState('20대');
  const [gender, setGender] = useState('여성');
  const [skin, setSkin] = useState('무화장 강조 (No-Makeup)');
  const [detail, setDetail] = useState('모공/솜털 극대화 (추천)');
  const [camera, setCamera] = useState('Hasselblad H6D (럭셔리 중형)');
  const [light, setLight] = useState('렘브란트 라이트 (인물 강조)');
  const [focus, setFocus] = useState('눈 초점 강조 (아웃포커싱)');

  const [prompts, setPrompts] = useState({ mj: '', nb: '', cf: '' });

  // Generate Prompts in Real-time
  useEffect(() => {
    const ageEn = AGES.find(a => a.ko === age)?.en || '';
    const genderEn = GENDERS.find(g => g.ko === gender)?.en || '';
    const skinEn = SKINS.find(s => s.ko === skin)?.en || '';
    const detailEn = DETAILS.find(d => d.ko === detail)?.en || '';
    const cameraEn = CAMERAS.find(c => c.ko === camera)?.en || '';
    const lightEn = LIGHTS.find(l => l.ko === light)?.en || '';
    const focusEn = FOCUSES.find(f => f.ko === focus)?.en || '';

    // Midjourney Positive Prompt (No parameters inside the prompt, parameters appended at the end)
    const mj = `A raw photo of a ${ageEn} ${genderEn}, ${skinEn}, ${detailEn}, ${cameraEn}, ${lightEn}, ${focusEn}, authentic human look, real skin details --ar 16:9 --v 6.0 --style raw`;

    // NanoBanana: Descriptive natural language (highly descriptive)
    const nb = `A highly detailed, raw realistic photograph of a ${ageEn} ${genderEn}. The subject has a ${skinEn} and ${detailEn}. Captured on a ${cameraEn} with ${lightEn}, featuring ${focusEn}. The skin texture shows natural pores, slight imperfections, and fine hairs, strictly avoiding any smooth, perfect, or airbrushed appearance.`;

    // ComfyUI: Clean tags
    const cf = `raw photo, ${ageEn} ${genderEn}, ${skinEn}, ${detailEn}, ${cameraEn}, ${lightEn}, ${focusEn}, realistic skin texture, visible pores, masterpiece, highly detailed, sharp focus`;

    setPrompts({ mj, nb, cf });
  }, [age, gender, skin, detail, camera, light, focus]);

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    showToast(`${type} 인물 프롬프트가 복사되었습니다.`);
  };

  return (
    <div className="model-sidebar">
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

        {/* Skin & Details */}
        <div className="form-group">
          <label style={{ fontSize: '0.65rem' }}>무화장 / 내추럴 스킨</label>
          <select value={skin} onChange={(e) => setSkin(e.target.value)} style={{ padding: '0.375rem 0.5rem', fontSize: '0.775rem' }}>
            {SKINS.map(s => <option key={s.ko} value={s.ko}>{s.ko}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label style={{ fontSize: '0.65rem' }}>극사실 피부 디테일</label>
          <select value={detail} onChange={(e) => setDetail(e.target.value)} style={{ padding: '0.375rem 0.5rem', fontSize: '0.775rem' }}>
            {DETAILS.map(d => <option key={d.ko} value={d.ko}>{d.ko}</option>)}
          </select>
        </div>

        {/* Camera Equipment */}
        <div className="form-group">
          <label style={{ fontSize: '0.65rem' }}>카메라 장비 명시</label>
          <select value={camera} onChange={(e) => setCamera(e.target.value)} style={{ padding: '0.375rem 0.5rem', fontSize: '0.775rem' }}>
            {CAMERAS.map(c => <option key={c.ko} value={c.ko}>{c.ko}</option>)}
          </select>
        </div>

        {/* Lighting Setup */}
        <div className="form-group">
          <label style={{ fontSize: '0.65rem' }}>조명 설정</label>
          <select value={light} onChange={(e) => setLight(e.target.value)} style={{ padding: '0.375rem 0.5rem', fontSize: '0.775rem' }}>
            {LIGHTS.map(l => <option key={l.ko} value={l.ko}>{l.ko}</option>)}
          </select>
        </div>

        {/* Focus highlighting */}
        <div className="form-group">
          <label style={{ fontSize: '0.65rem' }}>초점 강조</label>
          <select value={focus} onChange={(e) => setFocus(e.target.value)} style={{ padding: '0.375rem 0.5rem', fontSize: '0.775rem' }}>
            {FOCUSES.map(f => <option key={f.ko} value={f.ko}>{f.ko}</option>)}
          </select>
        </div>
      </div>

      {/* Warning about Negative Words */}
      <div style={{ display: 'flex', gap: '0.375rem', padding: '0.5rem 0.75rem', backgroundColor: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '6px', alignItems: 'flex-start', marginTop: '0.25rem' }}>
        <AlertTriangle size={14} style={{ color: 'var(--danger-color)', flexShrink: 0, marginTop: '1px' }} />
        <p style={{ fontSize: '0.65rem', color: '#991b1b', lineHeight: '1.3' }}>
          <strong>제외된 단어 (금지 필터 적용):</strong><br />
          perfect skin, smooth, flawless, airbrushed, professional 등 플라스틱처럼 가짜 티가 나는 표현을 철저히 차단하고 실제 미세 세포와 잔주름을 강제 묘사합니다.
        </p>
      </div>

      {/* Output Boxes */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
        {/* Midjourney */}
        <div className="prompt-box" style={{ padding: '0.5rem' }}>
          <div className="prompt-box-header" style={{ marginBottom: '2px' }}>
            <span className="prompt-badge badge-mj" style={{ fontSize: '0.55rem' }}>Midjourney Model</span>
            <button type="button" className="btn btn-text btn-sm" style={{ padding: '2px' }} onClick={() => copyToClipboard(prompts.mj, 'Midjourney')}>
              <Copy size={10} />
            </button>
          </div>
          <div className="prompt-text" style={{ fontSize: '0.725rem', maxHeight: '50px' }}>{prompts.mj}</div>
        </div>

        {/* NanoBanana */}
        <div className="prompt-box" style={{ padding: '0.5rem' }}>
          <div className="prompt-box-header" style={{ marginBottom: '2px' }}>
            <span className="prompt-badge badge-nb" style={{ fontSize: '0.55rem' }}>NanoBanana Model</span>
            <button type="button" className="btn btn-text btn-sm" style={{ padding: '2px' }} onClick={() => copyToClipboard(prompts.nb, 'NanoBanana')}>
              <Copy size={10} />
            </button>
          </div>
          <div className="prompt-text" style={{ fontSize: '0.725rem', maxHeight: '50px' }}>{prompts.nb}</div>
        </div>

        {/* ComfyUI */}
        <div className="prompt-box" style={{ padding: '0.5rem' }}>
          <div className="prompt-box-header" style={{ marginBottom: '2px' }}>
            <span className="prompt-badge badge-cf" style={{ fontSize: '0.55rem' }}>ComfyUI Model</span>
            <button type="button" className="btn btn-text btn-sm" style={{ padding: '2px' }} onClick={() => copyToClipboard(prompts.cf, 'ComfyUI')}>
              <Copy size={10} />
            </button>
          </div>
          <div className="prompt-text" style={{ fontSize: '0.725rem', maxHeight: '50px' }}>{prompts.cf}</div>
        </div>
      </div>
    </div>
  );
}
