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

const ETHNICITIES = [
  { ko: '한국인', en: 'Korean' },
  { ko: '동아시아인', en: 'East Asian' },
  { ko: '백인', en: 'Caucasian' },
  { ko: '흑인', en: 'Black' },
  { ko: '히스패닉', en: 'Hispanic' },
  { ko: '남아시아인', en: 'South Asian' },
  { ko: '중동계', en: 'Middle Eastern' },
  { ko: '인종 미지정', en: '' }
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
  { ko: '앞머리 뱅 + 긴생머리', en: 'long straight hair with neat front bangs' },
  { ko: '앞머리 없는 긴생머리', en: 'long sleek straight hair without bangs, middle part' },
  { ko: '깔끔한 숏 단발', en: 'sleek short bob hair style' },
  { ko: '올백 (Slicked back)', en: 'slicked back hair style, elegant' },
  { ko: '젖은 질감 올백 (Wet-look)', en: 'wet-look slicked-back hair style, high gloss, editorial look' },
  { ko: '짧은 삭발/크롭 헤어 (Buzzcut)', en: 'buzzcut hairstyle, ultra-short cropped hair' },
  { ko: '헝클어진 단발 (Windswept bob)', en: 'windswept messy short bob hairstyle, textured' },
  { ko: '길고 물결치는 머리', en: 'long wavy hair, natural flow' },
  { ko: '포니테일', en: 'neat ponytail hair style' },
  { ko: '짧은 숏컷', en: 'short cropped hair style' }
];

const HAIR_COLORS = [
  { ko: '검은색', en: 'black' },
  { ko: '어두운 갈색', en: 'dark brown' },
  { ko: '금발', en: 'blonde' },
  { ko: '애쉬 그레이', en: 'ash gray' },
  { ko: '백발/실버', en: 'silver' },
  { ko: '빨간색', en: 'red' },
  { ko: '색상 미지정', en: '' }
];

const MAKEUPS = [
  { ko: '화장기 없는 맨얼굴', en: 'completely no-makeup look, bare face' },
  { ko: '최소한의 내추럴 화장', en: 'minimal natural makeup look, nude tones' },
  { ko: '생기있는 립글로스', en: 'dewy skin with glossy lips, subtle eyeliner' },
  { ko: '세련된 스모키 메이크업', en: 'sophisticated smoky eye makeup, elegant look' }
];

const POSES = [
  { ko: '기본 (포즈 미지정)', en: '' },
  { ko: '정면 서 있는 자세', en: 'standing pose, looking forward' },
  { ko: '의자에 앉아 있는 자세', en: 'sitting pose on a minimalist chair' },
  { ko: '테이블에 기댄 자세', en: 'leaning pose against a marble table' },
  { ko: '팔짱을 낀 자세', en: 'arms crossed pose, confident look' },
  { ko: '제품을 턱 밑에 대고 있는 포즈', en: 'holding a cosmetic bottle gently near chin' },
  { ko: '제품을 보여주는 포즈', en: 'holding and presenting a product to the camera' },
  { ko: '어깨 너머로 뒤돌아보는 포즈', en: 'looking back over shoulder pose' },
  { ko: '턱 괴고 쪼그려 앉은 하이패션 포즈', en: 'crouching high-fashion editorial pose with one hand under chin, crouching profile' },
  { ko: '주머니 손 넣고 뒤돌아보는 포즈', en: 'standing in profile, hands in pockets, looking back over shoulder' },
  { ko: '가죽 안락의자에 깊게 비스듬히 앉은 자세', en: 'sitting deeply reclined in a luxury leather armchair, confident posture' }
];

const DETAILS = [
  { ko: '피부 미세 솜털', en: 'fine peach fuzz hairs visible on cheeks and ears' },
  { ko: '잔주름 및 모공 강조', en: 'subtle fine lines around eyes, detailed skin pores' },
  { ko: '자연스러운 주근깨/잡티', en: 'natural freckles, minor skin blemishes, authentic skin imperfections' },
  { ko: '피부 소름 (구스범프)', en: 'subtle goosebumps on arms and shoulders' }
];

const LIGHTS = [
  { ko: '하이패션 화보 조명 (Editorial)', en: 'high-fashion editorial photography lighting, soft high-contrast studio shadows' },
  { ko: '렘브란트 라이트 (명암)', en: 'soft side Rembrandt lighting, dramatic shadows' },
  { ko: '골든 아워 자연광 (따뜻함)', en: 'warm golden hour sunlight, natural diffused light' },
  { ko: '소프트 스튜디오 조명', en: 'soft diffused studio key light' },
  { ko: '네온 사이버 라이팅', en: 'cyberpunk neon ambient backlighting, edge glow' }
];

const BACKGROUNDS = [
  { ko: '미니멀 쿨그레이 스튜디오', en: 'minimalist cool gray studio backdrop' },
  { ko: '미니멀 웜베이지 스튜디오', en: 'minimalist warm beige studio backdrop' },
  { ko: '심플 콘크리트 벽', en: 'minimalist gray concrete wall background' },
  { ko: '부드럽게 흐려진 실내', en: 'soft out-of-focus indoor room background' },
  { ko: '자연 채광 야외 숲', en: 'blurred natural outdoor forest background' },
  { ko: '도시 어두운 밤거리', en: 'dark blurred urban street background, city night lights' },
  { ko: '단색 스튜디오 배경', en: 'solid minimalist studio backdrop' }
];

const CLOTHES = [
  { ko: '기본 (의상 미지정)', en: '' },
  { ko: '오버사이즈 파워숄더 블레이저', en: 'dressed in an oversized black power-shoulder blazer' },
  { ko: '광택 실크/새틴 바이올렛 드레스', en: 'dressed in a glossy shimmering violet satin-silk dress' },
  { ko: '빈티지 브라운 가죽 자켓', en: 'dressed in a distressed vintage brown leather jacket' },
  { ko: '다크 브라운 테일러드 수트', en: 'dressed in a tailored dark brown formal suit' },
  { ko: '캐주얼 화이트 티셔츠', en: 'dressed in a simple casual white t-shirt' },
  { ko: '럭셔리 포멀 수트', en: 'dressed in a premium luxury formal suit' },
  { ko: '세련된 실크 블라우스', en: 'dressed in a sophisticated silk blouse' },
  { ko: '포근한 오버사이즈 니트', en: 'dressed in a cozy oversized knit sweater' },
  { ko: '스포티 애슬레저 룩', en: 'dressed in stylish modern athletic wear' },
  { ko: '우아한 블랙 드레스', en: 'dressed in an elegant black dress' },
  { ko: '클래식 베이지 트렌치코트', en: 'dressed in a classic beige trench coat' },
  { ko: '트렌디 데님 자켓', en: 'dressed in a trendy street-style denim jacket' }
];

const ACCESSORIES = [
  { ko: '기본 (악세사리 없음)', en: '' },
  { ko: '블랙 오발 선글라스 (젠틀몬스터 스타일)', en: 'wearing trendy black oval sunglasses' },
  { ko: '청키한 골드 링 귀걸이', en: 'wearing chunky gold hoop earrings' },
  { ko: '시크한 와이드 가죽 벨트', en: 'wearing a chic wide leather belt around waist' }
];

const CAMERAS = [
  { ko: 'Hasselblad H6D (중형)', en: 'shot on Hasselblad H6D-100c' },
  { ko: 'Leica M11 (라이카)', en: 'shot on Leica M11' },
  { ko: 'Fujifilm GFX (후지)', en: 'shot on Fujifilm GFX 100S' },
  { ko: 'Sony a7R V (소니)', en: 'shot on Sony a7R V' },
  { ko: 'Canon EOS R5 (캐논)', en: 'shot on Canon EOS R5' },
  { ko: 'Arri Alexa Mini (시네마)', en: 'filmed on Arri Alexa Mini' }
];

const LENS_MMS = [
  { ko: '기본 (화각 미지정)', en: '' },
  { ko: '12mm (초광각)', en: '12mm lens' },
  { ko: '24mm (광각)', en: '24mm lens' },
  { ko: '35mm (시네 35)', en: '35mm lens' },
  { ko: '50mm (표준)', en: '50mm lens' },
  { ko: '85mm (인물)', en: '85mm lens' },
  { ko: '135mm (망원)', en: '135mm lens' },
  { ko: '200mm (초망원)', en: '200mm lens' }
];

const LENS_TYPES = [
  { ko: '기본 (렌즈종류 미지정)', en: '' },
  { ko: 'Leica Noctilux f/0.95 (아웃포커싱)', en: 'Leica Noctilux-M 50mm f/0.95 lens' },
  { ko: 'Zeiss Otus f/1.4 (초고해상도)', en: 'Zeiss Otus 55mm f/1.4 lens' },
  { ko: 'Anamorphic (시네마 플레어)', en: 'anamorphic lens' },
  { ko: 'Arri Master Prime (영화 표준)', en: 'ARRI Zeiss Master Prime lens' },
  { ko: 'Cooke S4/i (따뜻하고 클래식)', en: 'Cooke S4/i prime lens' },
  { ko: 'Helios 44-2 (회오리 보케)', en: 'vintage Helios 44-2 lens' },
  { ko: 'Canon L-Series (광고 표준)', en: 'Canon L-series USM lens' }
];

export default function ModelPromptGenerator({ geminiApiKey, showToast }) {
  const [age, setAge] = useState('20대');
  const [gender, setGender] = useState('여성');
  const [ethnicity, setEthnicity] = useState('한국인');
  const [composition, setComposition] = useState('클로즈업 (얼굴 위주)');
  const [skinTexture, setSkinTexture] = useState('모공 질감 극대화');
  const [expression, setExpression] = useState('자연스러운 무표정');
  const [hair, setHair] = useState('자연스런 번 (올림머리)');
  const [hairColor, setHairColor] = useState('검은색');
  const [makeup, setMakeup] = useState('화장기 없는 맨얼굴');
  const [pose, setPose] = useState('기본 (포즈 미지정)');
  const [clothes, setClothes] = useState('기본 (의상 미지정)');
  const [accessory, setAccessory] = useState('기본 (악세사리 없음)');
  const [detail, setDetail] = useState('잔주름 및 모공 강조');
  const [light, setLight] = useState('렘브란트 라이트 (명암)');
  const [background, setBackground] = useState('부드럽게 흐려진 실내');
  const [camera, setCamera] = useState('Leica M11 (라이카)');
  const [lensMm, setLensMm] = useState('기본 (화각 미지정)');
  const [lensType, setLensType] = useState('기본 (렌즈종류 미지정)');
  
  // Custom description in Korean
  const [customModelDesc, setCustomModelDesc] = useState('');
  const [loading, setLoading] = useState(false);

  // Main assembled prompts
  const [prompts, setPrompts] = useState({ mj: '', nb: '', cf: '', gk: '', sd: '', lx: '', fx: '' });

  // Custom manually edited prompt fields
  const [customMjPrompt, setCustomMjPrompt] = useState('');
  const [customNbPrompt, setCustomNbPrompt] = useState('');
  const [customCfPrompt, setCustomCfPrompt] = useState('');
  const [customGkPrompt, setCustomGkPrompt] = useState('');
  const [customSdPrompt, setCustomSdPrompt] = useState('');
  const [customLxPrompt, setCustomLxPrompt] = useState('');
  const [customFxPrompt, setCustomFxPrompt] = useState('');

  // Dirty edit tracking
  const [isMjEdited, setIsMjEdited] = useState(false);
  const [isNbEdited, setIsNbEdited] = useState(false);
  const [isCfEdited, setIsCfEdited] = useState(false);
  const [isGkEdited, setIsGkEdited] = useState(false);
  const [isSdEdited, setIsSdEdited] = useState(false);
  const [isLxEdited, setIsLxEdited] = useState(false);
  const [isFxEdited, setIsFxEdited] = useState(false);

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

  // Fallback compiler
  const compileLocalPrompts = (customDescEn = '') => {
    const ageEn = AGES.find(a => a.ko === age)?.en || '';
    const genderEn = GENDERS.find(g => g.ko === gender)?.en || '';
    const ethEn = ETHNICITIES.find(e => e.ko === ethnicity)?.en || '';
    const compEn = COMPOSITIONS.find(c => c.ko === composition)?.en || '';
    const skinEn = SKIN_TEXTURES.find(s => s.ko === skinTexture)?.en || '';
    const exprEn = EXPRESSIONS.find(e => e.ko === expression)?.en || '';
    
    // Combine Hair Color & Style
    const hStyleEn = HAIRS.find(h => h.ko === hair)?.en || '';
    const hColorEn = HAIR_COLORS.find(c => c.ko === hairColor)?.en || '';
    let hairEn = '';
    if (hColorEn && hStyleEn) {
      hairEn = `${hColorEn} ${hStyleEn}`;
    } else {
      hairEn = hColorEn || hStyleEn || '';
    }

    const makeupEn = MAKEUPS.find(m => m.ko === makeup)?.en || '';
    const poseEn = POSES.find(p => p.ko === pose)?.en || '';
    const clothesEn = CLOTHES.find(c => c.ko === clothes)?.en || '';
    const accessoryEn = ACCESSORIES.find(a => a.ko === accessory)?.en || '';
    const detailEn = DETAILS.find(d => d.ko === detail)?.en || '';
    const lightEn = LIGHTS.find(l => l.ko === light)?.en || '';
    const bgEn = BACKGROUNDS.find(b => b.ko === background)?.en || '';

    // Map selected options to keys
    const cameraMap = {
      'Hasselblad H6D (중형)': 'hasselblad',
      'Leica M11 (라이카)': 'leica',
      'Fujifilm GFX (후지)': 'fujifilm',
      'Sony a7R V (소니)': 'sony',
      'Canon EOS R5 (캐논)': 'canon',
      'Arri Alexa Mini (시네마)': 'arri'
    };

    const lensMmMap = {
      '12mm (초광각)': 'mm12',
      '24mm (광각)': 'mm24',
      '35mm (시네 35)': 'mm35',
      '50mm (표준)': 'mm50',
      '85mm (인물)': 'mm85',
      '135mm (망원)': 'mm135',
      '200mm (초망원)': 'mm200'
    };

    const lensTypeMap = {
      'Leica Noctilux f/0.95 (아웃포커싱)': 'noctilux',
      'Zeiss Otus f/1.4 (초고해상도)': 'otus',
      'Anamorphic (시네마 플레어)': 'anamorphic',
      'Arri Master Prime (영화 표준)': 'master_prime',
      'Cooke S4/i (따뜻하고 클래식)': 'cooke',
      'Helios 44-2 (회오리 보케)': 'helios',
      'Canon L-Series (광고 표준)': 'canon_l'
    };

    const gearKey = cameraMap[camera] || 'none';
    const mmKey = lensMmMap[lensMm] || 'none';
    const typeKey = lensTypeMap[lensType] || 'none';

    const cameraSentence = buildStaticCameraDescription(gearKey, mmKey, typeKey);

    const descPart = customDescEn ? `, ${customDescEn}` : '';
    const descPartNb = customDescEn ? `, featuring ${customDescEn}` : '';

    // Assembled human subject description: "20s year old Korean female"
    const subjectParts = [ageEn, ethEn, genderEn].filter(Boolean);
    const subjectEn = subjectParts.join(' ') || 'person';

    const posePart = poseEn ? ` in a ${poseEn}` : '';
    const poseSentence = poseEn ? ` The subject is in a ${poseEn}.` : '';

    const cameraSuffix = cameraSentence ? `, ${cameraSentence}` : '';

    // Midjourney
    const mj = `A raw photo of a ${subjectEn}${posePart}, ${exprEn}${descPart}, with ${hairEn} and ${makeupEn}, ${clothesEn ? clothesEn + ', ' : ''}${accessoryEn ? accessoryEn + ', ' : ''}${compEn}, ${skinEn}, ${detailEn}, ${lightEn}, ${bgEn}${cameraSuffix} --ar 16:9 --v 6.0 --style raw`;

    // NanoBanana
    const nb = `A highly detailed, raw realistic photograph. The subject is a ${subjectEn}${poseSentence} They feature a ${exprEn}${descPartNb}, with ${hairEn} and ${makeupEn}${clothesEn ? ', ' + clothesEn : ''}${accessoryEn ? ', ' + accessoryEn : ''}. The shot is a ${compEn} highlighting ${skinEn} with ${detailEn}. ${cameraSentence || 'Shot on a professional camera'}. Captured under ${lightEn} with a ${bgEn}. Emphasizes authentic skin texture, avoiding any artificial smooth or flawless airbrushed appearance.`;

    // ComfyUI Z-Image Turbo: Subject -> State -> Composition -> Lighting -> Atmosphere
    const cf = `A raw portrait photograph of a ${subjectEn}, with ${hairEn} and ${makeupEn}${clothesEn ? ', ' + clothesEn : ''}${accessoryEn ? ', ' + accessoryEn : ''}, ${exprEn}${descPart}, in a ${compEn} framing${posePart ? ', posing' + posePart : ''}, illuminated by ${lightEn}, showing natural realistic skin texture highlighting ${skinEn} with ${detailEn}, ${bgEn ? 'against a ' + bgEn : ''}, ${cameraSentence}, highly detailed, masterpiece, sharp focus, 8k`;

    // ComfyUI Grok
    const gk = `A raw portrait photograph of a ${subjectEn}${posePart}, ${exprEn}${descPart}, with ${hairEn} and ${makeupEn}${clothesEn ? ', ' + clothesEn : ''}${accessoryEn ? ', ' + accessoryEn : ''}. Composition: ${compEn}. Lighting: ${lightEn}. Background: ${bgEn}. Camera setup: ${cameraSentence || 'professional studio quality'}.`;

    // Seedance
    const sd = `raw studio photo, ${subjectEn}${posePart}, ${exprEn}${descPart}, ${hairEn}, ${makeupEn}${clothesEn ? ', ' + clothesEn : ''}${accessoryEn ? ', ' + accessoryEn : ''}, ${compEn}, ${skinEn}, ${detailEn}, camera setup: ${cameraSentence || 'high-end camera'}, lighting: ${lightEn}, background: ${bgEn}, photorealistic skin textures, high-end commercial grading`;

    // LTX Video
    const lx = `A realistic commercial video clip of a ${subjectEn}${posePart}, ${exprEn}${descPart}, with ${hairEn} and ${makeupEn}${clothesEn ? ', ' + clothesEn : ''}${accessoryEn ? ', ' + accessoryEn : ''}. Camera movement: ${compEn}, ${lightEn}. Background: ${bgEn}${cameraSuffix}. Photorealistic, natural motion, high-end commercial grade.`;

    // Flux Image Edit
    const fx = `flux image edit, edit instructions: modify model attributes to a ${subjectEn}${posePart}, with ${hairEn} and ${makeupEn}, ${clothesEn ? clothesEn + ', ' : ''}${accessoryEn ? accessoryEn + ', ' : ''}, face expression: ${exprEn}${descPart}, captured in a ${compEn} framing, focusing on detailed ${skinEn} texture with ${detailEn}, under ${lightEn} in front of ${bgEn}, ${cameraSentence}`;

    return { mj, nb, cf, gk, sd, lx, fx };
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
      if (!isGkEdited) setCustomGkPrompt(compiled.gk);
      if (!isSdEdited) setCustomSdPrompt(compiled.sd);
      if (!isLxEdited) setCustomLxPrompt(compiled.lx);
      if (!isFxEdited) setCustomFxPrompt(compiled.fx);

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
    setCustomGkPrompt(initial.gk);
    setCustomSdPrompt(initial.sd);
    setCustomLxPrompt(initial.lx);
    setCustomFxPrompt(initial.fx);
  }, []);

  const handleResetCustomPrompts = () => {
    setAge('20대');
    setGender('여성');
    setEthnicity('한국인');
    setComposition('클로즈업 (얼굴 위주)');
    setSkinTexture('모공 질감 극대화');
    setExpression('자연스러운 무표정');
    setHair('자연스런 번 (올림머리)');
    setHairColor('검은색');
    setMakeup('화장기 없는 맨얼굴');
    setPose('기본 (포즈 미지정)');
    setClothes('기본 (의상 미지정)');
    setAccessory('기본 (악세사리 없음)');
    setDetail('잔주름 및 모공 강조');
    setLight('렘브란트 라이트 (명암)');
    setBackground('부드럽게 흐려진 실내');
    setCamera('Leica M11 (라이카)');
    setLensMm('기본 (화각 미지정)');
    setLensType('기본 (렌즈종류 미지정)');
    setCustomModelDesc('');
    
    // Defer compile so state updates process
    setTimeout(() => {
      const initial = compileLocalPrompts();
      setPrompts(initial);
      setCustomMjPrompt(initial.mj);
      setCustomNbPrompt(initial.nb);
      setCustomCfPrompt(initial.cf);
      setCustomGkPrompt(initial.gk);
      setCustomSdPrompt(initial.sd);
      setCustomLxPrompt(initial.lx);
      setCustomFxPrompt(initial.fx);
      setIsMjEdited(false);
      setIsNbEdited(false);
      setIsCfEdited(false);
      setIsGkEdited(false);
      setIsSdEdited(false);
      setIsLxEdited(false);
      setIsFxEdited(false);
      showToast('기본 프롬프트로 초기화되었습니다.');
    }, 50);
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    showToast(`${type} 인물 프롬프트가 복사되었습니다.`);
  };

  const activeMj = isMjEdited ? customMjPrompt : (customMjPrompt || prompts.mj);
  const activeNb = isNbEdited ? customNbPrompt : (customNbPrompt || prompts.nb);
  const activeCf = isCfEdited ? customCfPrompt : (customCfPrompt || prompts.cf);
  const activeGk = isGkEdited ? customGkPrompt : (customGkPrompt || prompts.gk);
  const activeSd = isSdEdited ? customSdPrompt : (customSdPrompt || prompts.sd);
  const activeLx = isLxEdited ? customLxPrompt : (customLxPrompt || prompts.lx);
  const activeFx = isFxEdited ? customFxPrompt : (customFxPrompt || prompts.fx);

  return (
    <div className="model-sidebar" style={{ maxHeight: '82vh', overflowY: 'auto' }}>
      <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Eye size={18} style={{ color: 'var(--accent-color)' }} />
        <h3 style={{ fontSize: '0.95rem', fontWeight: 700, fontFamily: 'var(--font-display)' }}>인물 모델 프롬프트 생성기</h3>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.8rem' }}>
        {/* Row 1: Age & Gender (2 columns) */}
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

        {/* Row 2: Ethnicity & Composition (2 columns) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
          <div className="form-group">
            <label style={{ fontSize: '0.65rem' }}>인종</label>
            <select value={ethnicity} onChange={(e) => setEthnicity(e.target.value)} style={{ padding: '0.375rem 0.5rem', fontSize: '0.775rem' }}>
              {ETHNICITIES.map(et => <option key={et.ko} value={et.ko}>{et.ko}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label style={{ fontSize: '0.65rem' }}>구도 / 앵글</label>
            <select value={composition} onChange={(e) => setComposition(e.target.value)} style={{ padding: '0.375rem 0.5rem', fontSize: '0.775rem' }}>
              {COMPOSITIONS.map(c => <option key={c.ko} value={c.ko}>{c.ko}</option>)}
            </select>
          </div>
        </div>

        {/* Row 3: Skin Texture & Expression (2 columns) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
          <div className="form-group">
            <label style={{ fontSize: '0.65rem' }}>피부 질감</label>
            <select value={skinTexture} onChange={(e) => setSkinTexture(e.target.value)} style={{ padding: '0.375rem 0.5rem', fontSize: '0.775rem' }}>
              {SKIN_TEXTURES.map(s => <option key={s.ko} value={s.ko}>{s.ko}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label style={{ fontSize: '0.65rem' }}>표정</label>
            <select value={expression} onChange={(e) => setExpression(e.target.value)} style={{ padding: '0.375rem 0.5rem', fontSize: '0.775rem' }}>
              {EXPRESSIONS.map(e => <option key={e.ko} value={e.ko}>{e.ko}</option>)}
            </select>
          </div>
        </div>

        {/* Row 4: Hair Style & Hair Color (2 columns) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
          <div className="form-group">
            <label style={{ fontSize: '0.65rem' }}>헤어 스타일</label>
            <select value={hair} onChange={(e) => setHair(e.target.value)} style={{ padding: '0.375rem 0.5rem', fontSize: '0.775rem' }}>
              {HAIRS.map(h => <option key={h.ko} value={h.ko}>{h.ko}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label style={{ fontSize: '0.65rem' }}>헤어 컬러</label>
            <select value={hairColor} onChange={(e) => setHairColor(e.target.value)} style={{ padding: '0.375rem 0.5rem', fontSize: '0.775rem' }}>
              {HAIR_COLORS.map(c => <option key={c.ko} value={c.ko}>{c.ko}</option>)}
            </select>
          </div>
        </div>

        {/* Row 5: Makeup & Lighting (2 columns) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
          <div className="form-group">
            <label style={{ fontSize: '0.65rem' }}>메이크업</label>
            <select value={makeup} onChange={(e) => setMakeup(e.target.value)} style={{ padding: '0.375rem 0.5rem', fontSize: '0.775rem' }}>
              {MAKEUPS.map(m => <option key={m.ko} value={m.ko}>{m.ko}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label style={{ fontSize: '0.65rem' }}>조명 설정</label>
            <select value={light} onChange={(e) => setLight(e.target.value)} style={{ padding: '0.375rem 0.5rem', fontSize: '0.775rem' }}>
              {LIGHTS.map(l => <option key={l.ko} value={l.ko}>{l.ko}</option>)}
            </select>
          </div>
        </div>

        {/* Row 6: Pose (1 column - Full width since poses can have long descriptions) */}
        <div className="form-group">
          <label style={{ fontSize: '0.65rem' }}>포즈</label>
          <select value={pose} onChange={(e) => setPose(e.target.value)} style={{ padding: '0.375rem 0.5rem', fontSize: '0.775rem', width: '100%' }}>
            {POSES.map(p => <option key={p.ko} value={p.ko}>{p.ko}</option>)}
          </select>
        </div>

        {/* Row 7: Background (1 column - Full width) */}
        <div className="form-group">
          <label style={{ fontSize: '0.65rem' }}>배경</label>
          <select value={background} onChange={(e) => setBackground(e.target.value)} style={{ padding: '0.375rem 0.5rem', fontSize: '0.775rem', width: '100%' }}>
            {BACKGROUNDS.map(b => <option key={b.ko} value={b.ko}>{b.ko}</option>)}
          </select>
        </div>

        {/* Row 7.5: Clothes (1 column - Full width) */}
        <div className="form-group">
          <label style={{ fontSize: '0.65rem' }}>의상 / 옷</label>
          <select value={clothes} onChange={(e) => setClothes(e.target.value)} style={{ padding: '0.375rem 0.5rem', fontSize: '0.775rem', width: '100%' }}>
            {CLOTHES.map(c => <option key={c.ko} value={c.ko}>{c.ko}</option>)}
          </select>
        </div>

        {/* Row 7.6: Accessories (1 column - Full width) */}
        <div className="form-group">
          <label style={{ fontSize: '0.65rem' }}>악세사리 / 소품</label>
          <select value={accessory} onChange={(e) => setAccessory(e.target.value)} style={{ padding: '0.375rem 0.5rem', fontSize: '0.775rem', width: '100%' }}>
            {ACCESSORIES.map(a => <option key={a.ko} value={a.ko}>{a.ko}</option>)}
          </select>
        </div>

        {/* Row 8: Detail (1 column - Full width) */}
        <div className="form-group">
          <label style={{ fontSize: '0.65rem' }}>세부 디테일 강조</label>
          <select value={detail} onChange={(e) => setDetail(e.target.value)} style={{ padding: '0.375rem 0.5rem', fontSize: '0.775rem', width: '100%' }}>
            {DETAILS.map(d => <option key={d.ko} value={d.ko}>{d.ko}</option>)}
          </select>
        </div>

        {/* Row 9: Camera Gear & Lens mm (2 columns) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
          <div className="form-group">
            <label style={{ fontSize: '0.65rem' }}>카메라 장비</label>
            <select value={camera} onChange={(e) => setCamera(e.target.value)} style={{ padding: '0.375rem 0.5rem', fontSize: '0.775rem' }}>
              {CAMERAS.map(c => <option key={c.ko} value={c.ko}>{c.ko}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label style={{ fontSize: '0.65rem' }}>렌즈 화각</label>
            <select value={lensMm} onChange={(e) => setLensMm(e.target.value)} style={{ padding: '0.375rem 0.5rem', fontSize: '0.775rem' }}>
              {LENS_MMS.map(l => <option key={l.ko} value={l.ko}>{l.ko}</option>)}
            </select>
          </div>
        </div>

        {/* Row 10: Lens Type (1 column - Full width since lens models have extremely long text) */}
        <div className="form-group">
          <label style={{ fontSize: '0.65rem' }}>렌즈 종류</label>
          <select value={lensType} onChange={(e) => setLensType(e.target.value)} style={{ padding: '0.375rem 0.5rem', fontSize: '0.775rem', width: '100%' }}>
            {LENS_TYPES.map(t => <option key={t.ko} value={t.ko}>{t.ko}</option>)}
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

        {/* ComfyUI Grok */}
        <div className="prompt-box" style={{ padding: '0.5rem' }}>
          <div className="prompt-box-header" style={{ marginBottom: '2px' }}>
            <span className="prompt-badge" style={{ backgroundColor: '#1e293b', color: '#f8fafc', fontSize: '0.55rem' }}>ComfyUI Grok Model</span>
            <button type="button" className="btn btn-text btn-sm" style={{ padding: '2px' }} onClick={() => copyToClipboard(activeGk, 'ComfyUI Grok')}>
              <Copy size={10} />
            </button>
          </div>
          <textarea
            className="prompt-text"
            value={activeGk}
            onChange={(e) => {
              setCustomGkPrompt(e.target.value);
              setIsGkEdited(true);
            }}
            style={{ width: '100%', minHeight: '50px', border: 'none', background: 'transparent', fontSize: '0.725rem', fontFamily: 'monospace', resize: 'vertical', outline: 'none', padding: 0 }}
            placeholder="ComfyUI Grok 프롬프트 편집..."
          />
        </div>

        {/* Seedance */}
        <div className="prompt-box" style={{ padding: '0.5rem' }}>
          <div className="prompt-box-header" style={{ marginBottom: '2px' }}>
            <span className="prompt-badge" style={{ backgroundColor: '#4f46e5', color: '#ffffff', fontSize: '0.55rem' }}>Seedance Model</span>
            <button type="button" className="btn btn-text btn-sm" style={{ padding: '2px' }} onClick={() => copyToClipboard(activeSd, 'Seedance')}>
              <Copy size={10} />
            </button>
          </div>
          <textarea
            className="prompt-text"
            value={activeSd}
            onChange={(e) => {
              setCustomSdPrompt(e.target.value);
              setIsSdEdited(true);
            }}
            style={{ width: '100%', minHeight: '50px', border: 'none', background: 'transparent', fontSize: '0.725rem', fontFamily: 'monospace', resize: 'vertical', outline: 'none', padding: 0 }}
            placeholder="Seedance 프롬프트 편집..."
          />
        </div>

        {/* LTX Video */}
        <div className="prompt-box" style={{ padding: '0.5rem' }}>
          <div className="prompt-box-header" style={{ marginBottom: '2px' }}>
            <span className="prompt-badge" style={{ backgroundColor: '#ec4899', color: '#ffffff', fontSize: '0.55rem' }}>LTX Video Model</span>
            <button type="button" className="btn btn-text btn-sm" style={{ padding: '2px' }} onClick={() => copyToClipboard(activeLx, 'LTX Video')}>
              <Copy size={10} />
            </button>
          </div>
          <textarea
            className="prompt-text"
            value={activeLx}
            onChange={(e) => {
              setCustomLxPrompt(e.target.value);
              setIsLxEdited(true);
            }}
            style={{ width: '100%', minHeight: '50px', border: 'none', background: 'transparent', fontSize: '0.725rem', fontFamily: 'monospace', resize: 'vertical', outline: 'none', padding: 0 }}
            placeholder="LTX Video 프롬프트 편집..."
          />
        </div>

        {/* Flux Image Edit */}
        <div className="prompt-box" style={{ padding: '0.5rem' }}>
          <div className="prompt-box-header" style={{ marginBottom: '2px' }}>
            <span className="prompt-badge" style={{ backgroundColor: '#ff7a00', color: '#ffffff', fontSize: '0.55rem' }}>Flux Image Edit Model</span>
            <button type="button" className="btn btn-text btn-sm" style={{ padding: '2px' }} onClick={() => copyToClipboard(activeFx, 'Flux Image Edit')}>
              <Copy size={10} />
            </button>
          </div>
          <textarea
            className="prompt-text"
            value={activeFx}
            onChange={(e) => {
              setCustomFxPrompt(e.target.value);
              setIsFxEdited(true);
            }}
            style={{ width: '100%', minHeight: '50px', border: 'none', background: 'transparent', fontSize: '0.725rem', fontFamily: 'monospace', resize: 'vertical', outline: 'none', padding: 0 }}
            placeholder="Flux Image Edit 프롬프트 편집..."
          />
        </div>

        {(isMjEdited || isNbEdited || isCfEdited || isGkEdited || isSdEdited || isLxEdited || isFxEdited || customModelDesc) && (
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
