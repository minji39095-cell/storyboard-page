import React, { useState, useEffect, useRef } from 'react';
import { Plus, Download, Upload, Printer, Key, Sparkles, Film, Trash, Lock, Unlock, Eye, EyeOff, X, AlertCircle } from 'lucide-react';
import StoryboardFrame from './components/StoryboardFrame';
import ModelPromptGenerator from './components/ModelPromptGenerator';
import PromptStateCompiler from './components/PromptStateCompiler';

// Master passcode for accessing the page (can be customized)
const MASTER_PASSCODE = 'storyboard123';

const OFFLINE_CAMPAIGNS = {
  cosmetics: {
    title: '에센스 수분 충전 캠페인 (4컷)',
    cuts: [
      { story: '아침 이슬이 맺힌 에센스 용기가 하얀 대리석 위에 놓여있다. 부드러운 아침 햇살이 비친다.', storyEn: 'An essence bottle with morning dew is placed on white marble, with soft morning sunlight shining.', stylePreset: 'highend_ad', shotType: 'cu', cameraMove: 'static', tone: 'bright', colorPalette: 'pastel' },
      { story: '모델의 얼굴이 화면을 채운다. 피부 위에 에센스 물방울이 떨어지며 부드럽게 흡수된다.', storyEn: 'The model\'s face fills the screen, and essence water droplets fall on the skin, absorbing gently.', stylePreset: 'highend_ad', shotType: 'ecu', cameraMove: 'zoomin', tone: 'bright', colorPalette: 'pastel' },
      { story: '맑은 숲 속을 배경으로 바람을 맞으며 웃고 있는 모델의 전신 샷. 청량함이 느껴진다.', storyEn: 'A full shot of the model smiling in the wind against a clean forest background, giving a refreshing feeling.', stylePreset: 'cinematic', shotType: 'fs', cameraMove: 'pan', tone: 'dreamy', colorPalette: 'natural' },
      { story: '에센스 제품과 꽃잎이 배치된 마지막 브랜드 연출 샷. 우측 하단에 로고와 브랜드 카피가 나타난다.', storyEn: 'The final brand presentation shot featuring the essence product and flower petals, with the logo and brand copy appearing in the bottom right.', stylePreset: 'highend_ad', shotType: 'ms', cameraMove: 'static', tone: 'bright', colorPalette: 'pastel' }
    ]
  },
  tech: {
    title: '스마트 워치 액티브 추적 캠페인 (4컷)',
    cuts: [
      { story: '어두운 밤, 네온 조명 아래 서 있는 러너가 손목을 보며 출발 준비를 한다.', storyEn: 'A runner standing under neon lights at dark night, checking their wrist and preparing to start.', stylePreset: 'highend_ad', shotType: 'ls', cameraMove: 'static', tone: 'dark', colorPalette: 'cyberpunk' },
      { story: '러너가 도심 속을 빠르게 질주하고, 역동적으로 움직이는 러너의 발과 주변 거리가 트래킹된다.', storyEn: 'The runner dashes through the city, with a tracking shot of the runner\'s feet and the surrounding street.', stylePreset: 'cinematic', shotType: 'ms', cameraMove: 'tracking', tone: 'suspense', colorPalette: 'cyberpunk' },
      { story: '달리는 도중 손목을 흘끗 보며 심박수 페이스를 체크하는 클로즈업. 스마트 워치가 밝게 빛난다.', storyEn: 'A close-up of checking the heart rate pace by glancing at the wrist while running, the smartwatch glowing brightly.', stylePreset: 'highend_ad', shotType: 'cu', cameraMove: 'zoomin', tone: 'dark', colorPalette: 'cyberpunk' },
      { story: '스마트 워치 제품 단독 렌더링 샷. 세련된 매트 블랙 바디가 회전하며 텍스트 로고가 드러난다.', storyEn: 'A solo rendering shot of the smartwatch, the sleek matte black body rotating to reveal the text logo.', stylePreset: 'highend_ad', shotType: 'ms', cameraMove: 'static', tone: 'dark', colorPalette: 'highcontrast' }
    ]
  },
  drink: {
    title: '탄산수 익스트림 스파클링 캠페인 (4컷)',
    cuts: [
      { story: '얼음이 가득 든 투명한 유리잔에 탄산수가 쏟아지는 극도의 클로즈업 샷. 탄산이 튀어 오른다.', storyEn: 'Extreme close-up shot of sparkling water pouring into a clear glass full of ice, bubbles popping.', stylePreset: 'cinematic', shotType: 'ecu', cameraMove: 'static', tone: 'bright', colorPalette: 'blue' },
      { story: '모델이 탄산수 병을 들고 시원하게 들이킨 후 청량하고 활기찬 미소를 짓는다.', storyEn: 'The model drinks refreshingly from the sparkling water bottle and gives a clean, vibrant smile.', stylePreset: 'cinematic', shotType: 'ms', cameraMove: 'pan', tone: 'bright', colorPalette: 'blue' },
      { story: '라임 조각이 탄산수 속으로 떨어지며 시원한 물방울 파편들이 슬로우 모션으로 퍼진다.', storyEn: 'A lime slice drops into the sparkling water, with cool water splashes dispersing in slow motion.', stylePreset: 'cinematic', shotType: 'cu', cameraMove: 'zoomout', tone: 'dreamy', colorPalette: 'blue' },
      { story: '잔잔한 물결 위 탄산수 제품 패키지가 정렬된 마지막 연출 샷. 브랜드 로고 배치.', storyEn: 'The final product display shot of the sparkling water package aligned on gentle waves, with the brand logo.', stylePreset: 'highend_ad', shotType: 'ms', cameraMove: 'static', tone: 'bright', colorPalette: 'pastel' }
    ]
  },
  fashion: {
    title: '럭셔리 명품백 무드 필름 (4컷)',
    cuts: [
      { story: '안개가 자욱한 미니멀 디자인의 대리석 복도 끝, 모델의 우아한 뒷모습과 가방이 포착된다.', storyEn: 'The elegant back profile of the model with the bag captured at the end of a misty, minimalist marble corridor.', stylePreset: 'highend_ad', shotType: 'ls', cameraMove: 'static', tone: 'cinematic', colorPalette: 'monochrome' },
      { story: '가죽 핸드백의 금속 로고 장식과 정교한 바느질 가죽 질감이 렘브란트 조명 아래 클로즈업된다.', storyEn: 'The metal logo ornament and exquisite stitching texture of the leather handbag close-up under Rembrandt lighting.', stylePreset: 'highend_ad', shotType: 'ecu', cameraMove: 'zoomin', tone: 'cinematic', colorPalette: 'amber' },
      { story: '바람을 맞으며 고급 가방을 품에 안고 카메라를 강렬하게 응시하는 모델의 바스트 샷.', storyEn: 'A bust shot of the model holding the premium bag close in the wind, intensely staring at the camera.', stylePreset: 'highend_ad', shotType: 'bs', cameraMove: 'static', tone: 'cinematic', colorPalette: 'highcontrast' },
      { story: '고급스러운 벨벳 매트 배경 위 올려진 핸드백 단독 샷. 브랜드 타이포그래피가 오버레이된다.', storyEn: 'A solo shot of the handbag placed on a luxury velvet matte backdrop, with brand typography overlay.', stylePreset: 'highend_ad', shotType: 'ms', cameraMove: 'static', tone: 'cinematic', colorPalette: 'amber' }
    ]
  }
};

const parseBase64Image = (dataUrl) => {
  const match = dataUrl.match(/^data:(image\/[a-zA-Z0-9.-]+);base64,(.+)$/);
  if (!match) return null;
  return {
    mimeType: match[1],
    data: match[2]
  };
};

const compressImage = (dataUrl, maxWidth = 800, maxHeight = 800) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = dataUrl;
    img.onload = () => {
      if (img.width <= maxWidth && img.height <= maxHeight) {
        resolve(dataUrl);
        return;
      }
      let width = img.width;
      let height = img.height;
      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', 0.8));
    };
    img.onerror = () => {
      resolve(dataUrl);
    };
  });
};

export default function App() {
  const [projectTitle, setProjectTitle] = useState('무제 스토리보드');
  const [frames, setFrames] = useState([
    {
      id: 'frame-1',
      story: '석양이 비치는 도시의 빌딩 숲, 한 인물이 옥상 끝에 서서 바람을 맞고 있다.',
      stylePreset: 'cinematic',
      shotType: 'ls',
      cameraMove: 'static',
      tone: 'cinematic',
      colorPalette: 'amber',
      aspectRatio: '16:9',
      image: null,
      customMjPrompt: '',
      customNbPrompt: '',
      customCfPrompt: '',
      customGkPrompt: '',
      customSdPrompt: '',
      customLxPrompt: '',
      customFxPrompt: '',
      isMjEdited: false,
      isNbEdited: false,
      isCfEdited: false,
      isGkEdited: false,
      isSdEdited: false,
      isLxEdited: false,
      isFxEdited: false
    }
  ]);
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  // Authentication State
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [inputPasscode, setInputPasscode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');

  // Storyboard Auto Generator Modal States
  const [isGeneratorModalOpen, setIsGeneratorModalOpen] = useState(false);
  const [generatorCategory, setGeneratorCategory] = useState('cosmetics');
  const [generatorProductDesc, setGeneratorProductDesc] = useState('');
  const [generatorNumCuts, setGeneratorNumCuts] = useState(4);
  const [generatorImage, setGeneratorImage] = useState(null);
  const [generatorLoading, setGeneratorLoading] = useState(false);
  const genFileInputRef = useRef(null);

  // Load configuration & Auth on mount
  useEffect(() => {
    // 1. Check URL parameters for auto-auth (e.g. ?code=storyboard123)
    const params = new URLSearchParams(window.location.search);
    const urlCode = params.get('code');
    
    // 2. Check local storage for previous auth
    const savedAuth = localStorage.getItem('storyboard_authorized');

    if (urlCode === MASTER_PASSCODE) {
      setIsAuthorized(true);
      localStorage.setItem('storyboard_authorized', 'true');
      triggerToast('링크 코드로 자동 로그인되었습니다.');
      // Clean up the URL parameter for aesthetics
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (savedAuth === 'true') {
      setIsAuthorized(true);
    }

    // Load other settings
    const savedKey = localStorage.getItem('gemini_api_key');
    if (savedKey) setGeminiApiKey(savedKey);
    
    const savedTitle = localStorage.getItem('storyboard_project_title');
    if (savedTitle) setProjectTitle(savedTitle);

    const savedFrames = localStorage.getItem('storyboard_frames');
    if (savedFrames) {
      try {
        const parsed = JSON.parse(savedFrames);
        if (Array.isArray(parsed)) {
          const ids = new Set();
          let hasDuplicates = false;
          const cleaned = parsed.map((f, idx) => {
            if (!f.id || ids.has(f.id)) {
              hasDuplicates = true;
              return { 
                ...f, 
                id: `frame-${idx}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}` 
              };
            }
            ids.add(f.id);
            return f;
          });
          setFrames(cleaned);
          if (hasDuplicates) {
            localStorage.setItem('storyboard_frames', JSON.stringify(cleaned));
            console.log('Duplicate frame IDs detected and repaired.');
          }
        }
      } catch (e) {
        console.error('스토리보드 데이터를 로드하는데 실패했습니다.');
      }
    }
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    try {
      localStorage.setItem('storyboard_frames', JSON.stringify(frames));
    } catch (e) {
      console.warn('로컬 스토리지 한도 초과로 데이터를 저장하지 못했습니다.', e);
    }
  }, [frames]);

  useEffect(() => {
    localStorage.setItem('storyboard_project_title', projectTitle);
  }, [projectTitle]);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 2500);
  };

  const handleApiKeyChange = (e) => {
    const val = e.target.value;
    setGeminiApiKey(val);
    localStorage.setItem('gemini_api_key', val);
  };

  const handlePasscodeSubmit = (e) => {
    e.preventDefault();
    if (inputPasscode === MASTER_PASSCODE) {
      setIsAuthorized(true);
      localStorage.setItem('storyboard_authorized', 'true');
      setAuthError('');
      triggerToast('로그인 성공!');
    } else {
      setAuthError('비밀번호가 올바르지 않습니다. 다시 입력해 주세요.');
    }
  };

  const handleLogout = () => {
    setIsAuthorized(false);
    localStorage.removeItem('storyboard_authorized');
    setInputPasscode('');
    triggerToast('로그아웃되었습니다.');
  };

  const handleAddFrame = () => {
    const newFrame = {
      id: `frame-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      story: '',
      stylePreset: 'cinematic',
      shotType: 'cu',
      cameraMove: 'static',
      tone: 'cinematic',
      colorPalette: 'amber',
      aspectRatio: '16:9',
      image: null,
      customMjPrompt: '',
      customNbPrompt: '',
      customCfPrompt: '',
      customGkPrompt: '',
      customSdPrompt: '',
      customLxPrompt: '',
      customFxPrompt: '',
      isMjEdited: false,
      isNbEdited: false,
      isCfEdited: false,
      isGkEdited: false,
      isSdEdited: false,
      isLxEdited: false,
      isFxEdited: false
    };
    setFrames([...frames, newFrame]);
    triggerToast('새로운 씬 컷이 추가되었습니다.');
  };

  const handleUpdateFrame = (id, updatedFields) => {
    setFrames(
      frames.map((f) => (f.id === id ? { ...f, ...updatedFields } : f))
    );
  };

  const handleDeleteFrame = (id) => {
    setFrames(frames.filter((f) => f.id !== id));
    triggerToast('씬 컷이 삭제되었습니다.');
  };

  const handleMoveFrame = (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= frames.length) return;
    const updated = [...frames];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    setFrames(updated);
  };

  const handleExportJson = () => {
    const dataStr = JSON.stringify({ projectTitle, frames }, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `${projectTitle.replace(/\s+/g, '_')}_storyboard.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    triggerToast('JSON 파일 내보내기가 완료되었습니다.');
  };

  const handleImportJson = (e) => {
    const fileReader = new FileReader();
    fileReader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed.frames && Array.isArray(parsed.frames)) {
          setProjectTitle(parsed.projectTitle || '불러온 스토리보드');
          setFrames(parsed.frames);
          triggerToast('스토리보드 데이터를 성공적으로 불러왔습니다.');
        } else {
          alert('올바른 스토리보드 JSON 형식이 아닙니다.');
        }
      } catch (err) {
        alert('파일을 파싱하는 중 오류가 발생했습니다.');
      }
    };
    
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0]);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleClearAll = () => {
    if (window.confirm('모든 씬 컷을 지우고 초기화하시겠습니까?')) {
      setFrames([]);
      setProjectTitle('무제 스토리보드');
      triggerToast('모든 씬이 삭제되고 초기화되었습니다.');
    }
  };

  const copyShareLink = () => {
    const shareUrl = `${window.location.origin}${window.location.pathname}?code=${MASTER_PASSCODE}`;
    navigator.clipboard.writeText(shareUrl);
    triggerToast('자동 로그인 링크가 복사되었습니다!');
  };

  // --- Campaign Auto Generator Logic ---
  const handleGenImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      const compressed = await compressImage(event.target.result);
      setGeneratorImage(compressed);
    };
    reader.readAsDataURL(file);
  };

  const handleGenerateCampaign = async () => {
    // 1. If keyless and selected standard preset
    if (!geminiApiKey && generatorCategory !== 'custom') {
      const selectedCampaign = OFFLINE_CAMPAIGNS[generatorCategory];
      if (selectedCampaign) {
        if (window.confirm(`"${selectedCampaign.title}" 시안 템플릿으로 스토리보드를 재구성하시겠습니까? (기존 데이터가 덮어씌워집니다)`)) {
          const loadedFrames = selectedCampaign.cuts.map((cut, idx) => ({
            id: `frame-${idx}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            story: cut.story,
            storyEn: cut.storyEn,
            stylePreset: cut.stylePreset,
            shotType: cut.shotType,
            cameraMove: cut.cameraMove,
            tone: cut.tone,
            colorPalette: cut.colorPalette,
            aspectRatio: '16:9',
            image: idx === 0 && generatorImage ? generatorImage : null // Put uploaded product image in the first cut
          }));
          setFrames(loadedFrames);
          setProjectTitle(selectedCampaign.title);
          setIsGeneratorModalOpen(false);
          triggerToast('템플릿 스토리보드가 자동으로 구성되었습니다.');
        }
      }
      return;
    }

    // 2. If Gemini API is used or custom prompt is requested
    if (!geminiApiKey) {
      alert('커스텀 주제나 AI 분석 스토리보드를 작성하려면 상단 설정에서 Gemini API Key를 입력하셔야 합니다.');
      return;
    }

    setGeneratorLoading(true);

    try {
      let promptText = `Generate a structured, cohesive advertising storyboard sequence consisting of exactly ${generatorNumCuts} scene cuts (written in Korean) for this product campaign.
Product Category / Subject: "${generatorCategory !== 'custom' ? generatorCategory : 'Custom'}"
Campaign Topic/Description: "${generatorProductDesc || 'A premium ad campaign'}"

The sequence of cuts must flow logically like a real commercial:
- Cut 1: The opening hook or product reveal.
- Inner cuts: Show features, usage, and model interactions.
- Final Cut: Outro branding with Call to Action (CTA) or product display.

For each scene cut, return exactly:
1. "story": The scene's script, action details, and camera movement in Korean.
2. "storyEn": The direct English translation of the "story" script text.
3. "stylePreset": Select one of: cinematic, highend_ad, anime, webtoon, disney3d, concept, lineart, pencil.
4. "shotType": Select one of: ecu, cu, ms, bs, fs, ls, ha, la, oh.
5. "cameraMove": Select one of: static, pan, tilt, zoomin, zoomout, tracking.
6. "cameraGear": Select one of: none, hasselblad, leica, fujifilm, sony, canon, arri.
7. "lensMm": Select one of: none, mm12, mm24, mm35, mm50, mm85, mm135, mm200.
8. "lensType": Select one of: none, noctilux, otus, anamorphic, master_prime, cooke, helios, canon_l.
9. "tone": Select one of: dreamy, cinematic, dark, bright, sad, suspense, retro.
10. "colorPalette": Select one of: amber, blue, monochrome, cyberpunk, pastel, highcontrast, natural.

Return the result as a JSON array of exactly ${generatorNumCuts} objects. Do not write markdown wraps like \`\`\`json.`;

      // Multimodal payload setup if product image is uploaded
      let contentsPayload = [];
      const parsedImage = generatorImage ? parseBase64Image(generatorImage) : null;

      if (parsedImage) {
        promptText += `\nNote: The user has uploaded a product image. Analyze this product image to make the storyboard sequence specifically tailored to its packaging, branding, and category.`;
        contentsPayload = [
          {
            parts: [
              { text: promptText },
              {
                inlineData: {
                  mimeType: parsedImage.mimeType,
                  data: parsedImage.data
                }
              }
            ]
          }
        ];
      } else {
        contentsPayload = [
          {
            parts: [{ text: promptText }]
          }
        ];
      }

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: contentsPayload,
            generationConfig: {
              responseMimeType: "application/json"
            }
          }),
        }
      );

      if (!response.ok) {
        throw new Error('API 호출에 실패했습니다. 키가 정확한지 확인해 주세요.');
      }

      const data = await response.json();
      const textResponse = data.candidates[0].content.parts[0].text;
      const parsed = JSON.parse(textResponse);

      if (Array.isArray(parsed) && parsed.length > 0) {
        const loadedFrames = parsed.map((cut, idx) => ({
          id: `frame-${idx}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          story: cut.story,
          storyEn: cut.storyEn || '',
          stylePreset: cut.stylePreset || 'highend_ad',
          shotType: cut.shotType || 'ms',
          cameraMove: cut.cameraMove || 'static',
          cameraGear: cut.cameraGear || 'none',
          lensMm: cut.lensMm || 'none',
          lensType: cut.lensType || 'none',
          tone: cut.tone || 'cinematic',
          colorPalette: cut.colorPalette || 'amber',
          aspectRatio: '16:9',
          image: idx === 0 && generatorImage ? generatorImage : null // Place image on first cut
        }));
        setFrames(loadedFrames);
        setProjectTitle(`${generatorProductDesc || 'AI 생성'} 광고 캠페인 (${parsed.length}컷)`);
        setIsGeneratorModalOpen(false);
        triggerToast('AI 맞춤형 스토리보드가 자동으로 구성되었습니다!');
      } else {
        throw new Error('스토리보드 데이터 배열 해석 오류');
      }
    } catch (err) {
      console.error(err);
      alert(err.message || '스토리보드 생성 중 오류가 발생했습니다.');
    } finally {
      setGeneratorLoading(false);
    }
  };

  // --- Auth Render Screen ---
  if (!isAuthorized) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9fafb', padding: '2rem' }}>
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', padding: '3rem 2.5rem', borderRadius: '12px', width: '100%', maxWidth: '420px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ backgroundColor: '#0f172a', color: '#ffffff', width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <Lock size={20} />
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, color: '#111827', marginBottom: '0.5rem' }}>Storyboard Studio</h2>
            <p style={{ fontSize: '0.85rem', color: '#4b5563', lineHeight: '1.4' }}>
              비공개 스토리보드 제작 페이지입니다.<br />공유받으신 패스코드 비밀번호를 입력해 주세요.
            </p>
          </div>

          <form onSubmit={handlePasscodeSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={inputPasscode}
                onChange={(e) => setInputPasscode(e.target.value)}
                placeholder="비밀번호 입력"
                style={{ width: '100%', padding: '0.75rem 1rem', paddingRight: '2.5rem', border: '1px solid #e5e7eb', borderRadius: '8px', outline: 'none', fontSize: '0.95rem' }}
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {authError && (
              <p style={{ color: '#ef4444', fontSize: '0.75rem', fontWeight: 500 }}>{authError}</p>
            )}

            <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem', width: '100%', borderRadius: '8px', fontSize: '0.95rem' }}>
              입장하기
            </button>
          </form>

          <div style={{ marginTop: '2rem', borderTop: '1px solid #e5e7eb', paddingTop: '1.5rem', textAlign: 'center' }}>
            <p style={{ fontSize: '0.75rem', color: '#9ca3af', lineHeight: '1.4' }}>
              * 자동 로그인이 제공되는 공유용 링크를 받으신 분은 링크 클릭만으로 즉시 입장할 수 있습니다.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // --- Authorized Main App Render ---
  return (
    <div className="app-container">
      {/* Top Header */}
      <header>
        <div className="logo-container">
          <Film size={22} strokeWidth={2.5} className="logo-icon" />
          <span className="logo-text">Storyboard Studio</span>
          <span className="logo-tag">Light Minimal</span>
        </div>

        <div className="header-actions">
          <button 
            type="button" 
            className="btn btn-primary" 
            onClick={() => setIsGeneratorModalOpen(true)}
            style={{ display: 'flex', gap: '0.25rem', padding: '0.5rem 1.25rem' }}
          >
            <Sparkles size={16} /> AI 전체 스토리보드 자동 구성
          </button>
          <button type="button" className="btn btn-secondary" onClick={handlePrint}>
            <Printer size={16} /> 인쇄 / PDF 저장
          </button>
          <button type="button" className="btn btn-secondary" onClick={handleExportJson}>
            <Download size={16} /> 백업 내보내기 (JSON)
          </button>
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={() => document.getElementById('json-upload').click()}
          >
            <Upload size={16} /> 백업 가져오기
          </button>
          <input 
            type="file" 
            id="json-upload" 
            onChange={handleImportJson} 
            accept=".json" 
            style={{ display: 'none' }} 
          />
        </div>
      </header>

      {/* Global Config Bar */}
      <div className="config-bar">
        <div className="config-item">
          <label style={{ fontSize: '0.75rem', marginRight: '0.25rem' }}>스토리보드 제목</label>
          <input
            type="text"
            value={projectTitle}
            onChange={(e) => setProjectTitle(e.target.value)}
            style={{ fontWeight: 600, fontSize: '0.9rem', width: '220px' }}
            placeholder="스토리보드 프로젝트 제목"
          />
        </div>

        <div className="config-item" style={{ marginLeft: 'auto' }}>
          <Key size={14} style={{ color: 'var(--text-secondary)' }} />
          <span className="config-label">Gemini API Key</span>
          <input
            type="password"
            value={geminiApiKey}
            onChange={handleApiKeyChange}
            placeholder="AI 프롬프트 생성용 API 키 입력"
            className="api-key-input"
          />
        </div>

        <div className="config-item">
          <button 
            type="button" 
            className="btn btn-secondary btn-sm"
            onClick={copyShareLink}
            title="팀원 공유용 자동 로그인 주소 복사"
            style={{ borderColor: 'var(--text-muted)' }}
          >
            <Unlock size={12} /> 공유용 링크 복사
          </button>
        </div>

        <div className="config-item">
          <button 
            type="button" 
            className="btn btn-secondary btn-sm btn-danger-light"
            onClick={handleClearAll}
            title="스토리보드 초기화"
          >
            <Trash size={12} /> 전체 초기화
          </button>
        </div>

        <div className="config-item">
          <button 
            type="button" 
            className="btn btn-secondary btn-sm"
            onClick={handleLogout}
            title="로그아웃"
          >
            로그아웃
          </button>
        </div>
      </div>

      {/* Main Workspace */}
      <main className="main-content">
        <div className="main-workspace">
          {/* Left Sidebar: Human Model Prompt Generator */}
          <ModelPromptGenerator geminiApiKey={geminiApiKey} showToast={triggerToast} />

          {/* Right Area: Storyboard Workspace */}
          <div className="board-area">
            {frames.length === 0 ? (
              <div className="empty-state" style={{ margin: '2rem auto' }}>
                <Film className="empty-icon" />
                <h3 className="empty-title">작성된 씬 컷이 없습니다</h3>
                <p className="empty-desc">새로운 씬 컷을 추가하고 프롬프트를 만들어 보세요.</p>
                <button type="button" className="btn btn-primary" onClick={handleAddFrame}>
                  <Plus size={16} /> 첫 씬 컷 추가하기
                </button>
              </div>
            ) : (
              <div className="storyboard-grid" style={{ marginTop: 0 }}>
                {frames.map((frame, index) => (
                  <StoryboardFrame
                    key={frame.id}
                    frame={frame}
                    index={index}
                    totalFrames={frames.length}
                    onUpdate={handleUpdateFrame}
                    onDelete={handleDeleteFrame}
                    onMove={handleMoveFrame}
                    geminiApiKey={geminiApiKey}
                    showToast={triggerToast}
                  />
                ))}

                {/* Fast Add Cut Card */}
                <div className="add-cut-card" onClick={handleAddFrame} style={{ minHeight: '380px' }}>
                  <Plus className="add-cut-icon" />
                  <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>새 씬 컷 추가</span>
                </div>
              </div>
            )}
            <PromptStateCompiler />
          </div>
        </div>
      </main>

      {/* --- AI Ad Storyboard Auto Generator Modal --- */}
      {isGeneratorModalOpen && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.3)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '2rem'
          }} 
          onClick={() => setIsGeneratorModalOpen(false)}
        >
          <div 
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              width: '100%',
              maxWidth: '520px',
              boxShadow: 'var(--shadow-lg)',
              display: 'flex',
              flexDirection: 'column',
              animation: 'fadeIn 0.2s ease-out'
            }} 
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--font-display)' }}>
                <Sparkles size={16} style={{ color: 'var(--accent-color)' }} />
                AI 전체 스토리보드 자동 구성
              </h3>
              <button 
                type="button" 
                className="btn btn-text btn-sm"
                onClick={() => setIsGeneratorModalOpen(false)}
                style={{ padding: '4px' }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                <label style={{ fontSize: '0.7rem', fontWeight: 700 }}>캠페인 제품 카테고리</label>
                <select 
                  value={generatorCategory} 
                  onChange={(e) => setGeneratorCategory(e.target.value)}
                  style={{ width: '100%' }}
                >
                  <option value="cosmetics">화장품 (Cosmetics)</option>
                  <option value="tech">IT / 전자기기 (Tech/IT)</option>
                  <option value="drink">식음료 (F&B / Drinks)</option>
                  <option value="fashion">패션 / 명품 (Luxury / Fashion)</option>
                  <option value="custom">직접 입력 (AI 분석 필요)</option>
                </select>
              </div>

              {/* Upload Product Image */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                <label style={{ fontSize: '0.7rem', fontWeight: 700 }}>제품 이미지 첨부 (선택사항)</label>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  {generatorImage ? (
                    <div style={{ position: 'relative', width: '56px', height: '56px' }}>
                      <img src={generatorImage} alt="Product Thumbnail" style={{ width: '100%', height: '100%', objectFit: 'contain', border: '1px solid var(--border-color)', borderRadius: '4px' }} />
                      <button 
                        type="button" 
                        onClick={() => setGeneratorImage(null)}
                        style={{ position: 'absolute', top: '-4px', right: '-4px', backgroundColor: 'var(--danger-color)', color: '#ffffff', border: 'none', borderRadius: '50%', width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '10px' }}
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ) : (
                    <button 
                      type="button" 
                      className="btn btn-secondary btn-sm"
                      onClick={() => genFileInputRef.current.click()}
                      style={{ fontSize: '0.75rem', padding: '0.5rem 1rem' }}
                    >
                      <Upload size={12} /> 이미지 올리기
                    </button>
                  )}
                  <input 
                    type="file" 
                    ref={genFileInputRef} 
                    onChange={handleGenImageUpload} 
                    accept="image/*" 
                    style={{ display: 'none' }} 
                  />
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                    이미지를 업로드하면 AI가 패키지를 직접 보고 분석합니다.
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                <label style={{ fontSize: '0.7rem', fontWeight: 700 }}>광고 주제 및 상세 설명 (AI 필수)</label>
                <textarea
                  value={generatorProductDesc}
                  onChange={(e) => setGeneratorProductDesc(e.target.value)}
                  placeholder="예: 민감한 피부를 진정시키는 유기농 시카 에센스 론칭 광고. 혹은 프리미엄 티타늄 스마트링 소개."
                  style={{ minHeight: '80px', width: '100%' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.375rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                  <label style={{ fontSize: '0.7rem', fontWeight: 700 }}>생성할 컷 수</label>
                  <select 
                    value={generatorNumCuts} 
                    onChange={(e) => setGeneratorNumCuts(parseInt(e.target.value))}
                    disabled={!geminiApiKey && generatorCategory !== 'custom'} // Lock cuts for offline presets
                  >
                    <option value="3">3컷 (초간결 콘셉트)</option>
                    <option value="4">4컷 (표준 캠페인)</option>
                    <option value="5">5컷 (상세 기획)</option>
                    <option value="6">6컷 (풀 시나리오)</option>
                  </select>
                  {!geminiApiKey && generatorCategory !== 'custom' && (
                    <span style={{ fontSize: '0.65rem', color: '#b45309' }}>
                      * API 키가 없는 템플릿 모드에서는 4컷 표준 템플릿이 로드됩니다.
                    </span>
                  )}
                </div>
              </div>

              {generatorLoading ? (
                <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-secondary)' }}>
                  <Sparkles size={18} className="animate-spin" style={{ margin: '0 auto 0.5rem', color: 'var(--text-muted)' }} />
                  <p style={{ fontSize: '0.775rem' }}>AI가 제품 이미지를 분석하고 스토리라인 및 연출 구성안을 작성 중입니다...</p>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={() => setIsGeneratorModalOpen(false)}
                    style={{ flex: 1 }}
                  >
                    취소
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-primary" 
                    onClick={handleGenerateCampaign}
                    style={{ flex: 2 }}
                  >
                    스토리보드 구성 시작
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      <div className={`toast ${showToast ? 'show' : ''}`}>
        {toastMessage}
      </div>
    </div>
  );
}
