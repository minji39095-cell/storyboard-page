import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Trash2, PenTool, Upload, Image as ImageIcon, X, Sparkles, AlertCircle } from 'lucide-react';
import DrawingCanvas from './DrawingCanvas';
import PromptGenerator, { STYLES, SHOTS, CAMERAS, TONES, COLORS, CAMERA_GEAR, LENS_MM, LENS_TYPES } from './PromptGenerator';

const AD_PRESETS = {
  cosmetics: {
    name: '화장품',
    items: [
      {
        title: '맑고 깨끗한 수분 에센스 광고',
        story: '아침 햇살이 비치는 하얀 대리석 욕실, 제품 용기에 이슬이 맺혀 있다. 에센스 제형이 한 방울 떨어지는 찰나가 고속 슬로우 모션으로 포착되고, 건강한 피부 톤의 모델이 청량하게 숲을 보며 미소 짓는다.',
        stylePreset: 'highend_ad',
        shotType: 'cu',
        cameraMove: 'static',
        cameraGear: 'leica',
        lensMm: 'mm85',
        lensType: 'noctilux',
        tone: 'bright',
        colorPalette: 'pastel'
      },
      {
        title: '심층 수분 크림 모이스처 아쿠아',
        story: '물결이 출렁이는 맑고 깊은 수중 배경. 수분 크림 용기가 회전하며 부드럽게 상승하고, 수분 캡슐이 터지는 그래픽이 겹쳐진다.',
        stylePreset: 'cinematic',
        shotType: 'ms',
        cameraMove: 'zoomin',
        cameraGear: 'arri',
        lensMm: 'mm50',
        lensType: 'anamorphic',
        tone: 'dreamy',
        colorPalette: 'blue'
      }
    ]
  },
  tech: {
    name: 'IT / 기기',
    items: [
      {
        title: '스마트 워치 액티브 스포츠 광고',
        story: '어두운 밤, 네온 컬러 조명이 들어온 도심 로드. 모델이 숨을 헐떡이며 달리고 있으며, 손목의 워치 페이스 스크린이 요동치는 심박 센서를 그래픽으로 보여준다.',
        stylePreset: 'highend_ad',
        shotType: 'ms',
        cameraMove: 'tracking',
        cameraGear: 'sony',
        lensMm: 'mm35',
        lensType: 'canon_l',
        tone: 'dark',
        colorPalette: 'cyberpunk'
      },
      {
        title: '하이엔드 노이즈 캔슬링 헤드폰',
        story: '바쁜 지하철 내부의 소음. 모델이 헤드폰을 착용하고 노이즈캔슬링 버튼을 터치하는 순간, 주변 승객들의 이미지가 부드럽게 아웃포커싱 되며 고요함 속 오아시스가 흐르는 듯한 몽환적인 숲 이미지로 서서히 전환된다.',
        stylePreset: 'cinematic',
        shotType: 'cu',
        cameraMove: 'static',
        cameraGear: 'arri',
        lensMm: 'mm50',
        lensType: 'master_prime',
        tone: 'dreamy',
        colorPalette: 'natural'
      }
    ]
  },
  drink: {
    name: '식음료',
    items: [
      {
        title: '탄산수 익스트림 아이스 크러시',
        story: '얼음이 깨지며 사방으로 파편이 튀고, 시원한 탄산수가 잔 가득 부어지는 극단적인 클로즈업. 솟구치는 기포들이 초고속 카메라 질감으로 깨끗하게 담긴다.',
        stylePreset: 'cinematic',
        shotType: 'ecu',
        cameraMove: 'static',
        cameraGear: 'fujifilm',
        lensMm: 'mm135',
        lensType: 'otus',
        tone: 'bright',
        colorPalette: 'blue'
      },
      {
        title: '프리미엄 원두 드립 커피',
        story: '부드러운 황금빛 조명 아래, 뜨거운 물이 필터를 지나며 커피 에센스가 한 방울씩 떨어지는 평화롭고 고급스러운 커피 전문 컷.',
        stylePreset: 'highend_ad',
        shotType: 'cu',
        cameraMove: 'static',
        cameraGear: 'hasselblad',
        lensMm: 'mm85',
        lensType: 'cooke',
        tone: 'sad',
        colorPalette: 'amber'
      }
    ]
  },
  fashion: {
    name: '패션 / 명품',
    items: [
      {
        title: '럭셔리 가죽 핸드백 런웨이 무드',
        story: '조명이 비치는 세련된 콘크리트 전시장 벽면. 모델이 시크하게 가방을 들고 걸어가며, 가방 가죽의 부드러운 하이라이트 질감과 금속 장식이 정밀하게 비춰진다.',
        stylePreset: 'highend_ad',
        shotType: 'ls',
        cameraMove: 'pan',
        cameraGear: 'hasselblad',
        lensMm: 'mm35',
        lensType: 'otus',
        tone: 'cinematic',
        colorPalette: 'highcontrast'
      }
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

export default function StoryboardFrame({ 
  frame, 
  index, 
  totalFrames, 
  onUpdate, 
  onDelete, 
  onMove, 
  geminiApiKey,
  showToast 
}) {
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [isConceptModalOpen, setIsConceptModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(frame.image ? 'ai' : 'cosmetics');
  const [aiConcepts, setAiConcepts] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiStoryLoading, setAiStoryLoading] = useState(false);
  const fileInputRef = useRef(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleUpdate = (updatedFields) => {
    const clearedPrompts = {};
    if (!frame.isMjEdited && !('customMjPrompt' in updatedFields)) clearedPrompts.customMjPrompt = '';
    if (!frame.isNbEdited && !('customNbPrompt' in updatedFields)) clearedPrompts.customNbPrompt = '';
    if (!frame.isCfEdited && !('customCfPrompt' in updatedFields)) clearedPrompts.customCfPrompt = '';
    if (!frame.isGkEdited && !('customGkPrompt' in updatedFields)) clearedPrompts.customGkPrompt = '';
    if (!frame.isSdEdited && !('customSdPrompt' in updatedFields)) clearedPrompts.customSdPrompt = '';
    if (!frame.isLxEdited && !('customLxPrompt' in updatedFields)) clearedPrompts.customLxPrompt = '';

    onUpdate(frame.id, { ...updatedFields, ...clearedPrompts });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const compressed = await compressImage(event.target.result);
      handleUpdate({ image: compressed });
      setActiveTab('ai'); // Switch default tab to AI recommendation if image is present
      showToast('이미지가 성공적으로 업로드되었습니다.');
    };
    reader.readAsDataURL(file);
  };

  const handleCanvasSave = async (dataUrl) => {
    const compressed = await compressImage(dataUrl);
    handleUpdate({ image: compressed });
    setIsDrawingMode(false);
    setActiveTab('ai');
    showToast('스케치가 저장되었습니다.');
  };

  const handleRemoveImage = (e) => {
    e.stopPropagation();
    handleUpdate({ image: null });
    if (activeTab === 'ai') {
      setActiveTab('cosmetics');
    }
    showToast('이미지가 삭제되었습니다.');
  };

  const applyConcept = (concept) => {
    handleUpdate({
      story: concept.story,
      stylePreset: concept.stylePreset,
      shotType: concept.shotType,
      cameraMove: concept.cameraMove || 'static',
      cameraGear: concept.cameraGear || 'none',
      lensMm: concept.lensMm || 'none',
      lensType: concept.lensType || 'none',
      tone: concept.tone,
      colorPalette: concept.colorPalette || 'amber'
    });
    setIsConceptModalOpen(false);
    showToast(`"${concept.title}" 시안이 적용되었습니다.`);
  };

  const handleAiGenerateConcepts = async () => {
    if (!geminiApiKey) {
      alert('상단 설정에서 Gemini API Key를 입력해야 AI 분석 시안 생성 기능을 사용할 수 있습니다.');
      return;
    }
    if (!frame.image) return;

    setAiLoading(true);
    
    try {
      const parsedImage = parseBase64Image(frame.image);
      if (!parsedImage) {
        throw new Error('올바른 이미지 형식이 아닙니다.');
      }

      const promptText = `Identify the product in this image and generate exactly 3 creative, high-end advertising storyboard scene concept drafts (in Korean).
Each draft must include:
1. "title": A catchy concept title.
2. "story": A detailed story scene script/action description matching the product.
3. "stylePreset": Select one of: cinematic, highend_ad, anime, webtoon, disney3d, concept, lineart, pencil.
4. "shotType": Select one of: ecu, cu, ms, bs, fs, ls, ha, la, oh.
5. "tone": Select one of: dreamy, cinematic, dark, bright, sad, suspense, retro.
6. "colorPalette": Select one of: amber, blue, monochrome, cyberpunk, pastel, highcontrast, natural.

Return a JSON array of exactly 3 objects with these exact keys. Do not write markdown blocks like \`\`\`json.`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
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
            ],
            generationConfig: {
              responseMimeType: "application/json"
            }
          }),
        }
      );

      if (!response.ok) {
        throw new Error('API 호출에 실패했습니다. 키나 이미지 상태를 확인해 주세요.');
      }

      const data = await response.json();
      const textResponse = data.candidates[0].content.parts[0].text;
      const parsed = JSON.parse(textResponse);
      
      if (Array.isArray(parsed)) {
        setAiConcepts(parsed);
        showToast('AI 맞춤 광고 시안 추천 완료');
      } else {
        throw new Error('응답 형식 분석 실패');
      }
    } catch (err) {
      console.error(err);
      alert(err.message || '시안 생성 중 오류가 발생했습니다.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleAiCompleteStory = async () => {
    if (!geminiApiKey) {
      alert('상단 설정에서 Gemini API Key를 입력하셔야 AI 연출 완성 기능을 사용할 수 있습니다.');
      return;
    }
    
    setAiStoryLoading(true);
    
    try {
      const parsedImage = frame.image ? parseBase64Image(frame.image) : null;
      let promptText = `Generate a detailed, creative commercial storyboard scene description / script in Korean (2-3 sentences max) based on the user's initial draft.
Draft idea: "${frame.story.trim() || 'A premium commercial scene'}"
Style preset: "${STYLES[frame.stylePreset]?.ko || 'cinematic'}"
Shot type: "${SHOTS[frame.shotType]?.ko || 'close-up'}"

The generated text must be written in a professional ad storyboard style (KOREAN).
Provide ONLY the final script text. Do not include any explanations, code block formatting, or markdown wraps.`;

      let contentsPayload = [];
      if (parsedImage) {
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
            contents: contentsPayload
          }),
        }
      );

      if (!response.ok) {
        throw new Error('API 호출에 실패했습니다.');
      }

      const data = await response.json();
      const generatedText = data.candidates[0].content.parts[0].text.trim();
      
      if (generatedText) {
        handleUpdate({ story: generatedText });
        showToast('AI 연출 지문 작성이 완료되었습니다.');
      } else {
        throw new Error('생성된 텍스트가 비어 있습니다.');
      }
    } catch (err) {
      console.error(err);
      alert(err.message || '연출 작성 중 오류가 발생했습니다.');
    } finally {
      setAiStoryLoading(false);
    }
  };

  return (
    <div className="storyboard-card">
      {/* Card Header */}
      <div className="card-header">
        <div className="card-title-group">
          <span className="card-number">{index + 1}</span>
          <span className="card-title">Scene Cut #{index + 1}</span>
        </div>
        <div className="card-actions">
          {showDeleteConfirm ? (
            <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--danger-color)', fontWeight: 600, marginRight: '0.25rem' }}>정말 삭제?</span>
              <button
                type="button"
                className="btn btn-danger-light btn-sm"
                onClick={() => {
                  onDelete(frame.id);
                  setShowDeleteConfirm(false);
                }}
                style={{ padding: '0.125rem 0.375rem', fontSize: '0.7rem', fontWeight: 600 }}
              >
                예
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setShowDeleteConfirm(false)}
                style={{ padding: '0.125rem 0.375rem', fontSize: '0.7rem' }}
              >
                아니오
              </button>
            </div>
          ) : (
            <>
              <button 
                type="button" 
                className="btn btn-secondary btn-sm"
                onClick={() => onMove(index, index - 1)}
                disabled={index === 0}
                title="왼쪽으로 이동"
              >
                <ChevronLeft size={14} />
              </button>
              <button 
                type="button" 
                className="btn btn-secondary btn-sm"
                onClick={() => onMove(index, index + 1)}
                disabled={index === totalFrames - 1}
                title="오른쪽으로 이동"
              >
                <ChevronRight size={14} />
              </button>
              <button 
                type="button" 
                className="btn btn-danger-light btn-sm"
                onClick={() => setShowDeleteConfirm(true)}
                title="삭제"
              >
                <Trash2 size={14} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Image Preview & Draw Area */}
      <div className={`image-area-container ${!frame.image ? 'empty' : ''}`}>
        {isDrawingMode ? (
          <DrawingCanvas 
            initialImage={frame.image} 
            onSave={handleCanvasSave} 
            onCancel={() => setIsDrawingMode(false)} 
          />
        ) : (
          <>
            {frame.image ? (
              <>
                <img src={frame.image} alt={`Scene ${index + 1}`} className="image-preview" />
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', borderRadius: '50%', width: '28px', height: '28px', padding: 0 }}
                  onClick={handleRemoveImage}
                  title="이미지 삭제"
                >
                  <X size={14} />
                </button>
              </>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--text-muted)' }}>
                <ImageIcon size={32} strokeWidth={1.5} style={{ marginBottom: '0.5rem' }} />
                <span style={{ fontSize: '0.8rem' }}>그림을 그리거나 이미지를 업로드하세요</span>
              </div>
            )}

            {/* Upload & Draw Overlay */}
            <div className="upload-overlay">
              <button 
                type="button" 
                className="btn btn-primary btn-sm"
                onClick={() => setIsDrawingMode(true)}
              >
                <PenTool size={12} /> 스케치 그리기
              </button>
              <button 
                type="button" 
                className="btn btn-secondary btn-sm"
                onClick={() => fileInputRef.current.click()}
              >
                <Upload size={12} /> 이미지 업로드
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                accept="image/*" 
                style={{ display: 'none' }} 
              />
            </div>
          </>
        )}
      </div>

      {/* Card Form Body */}
      <div className="card-body">
        {/* Story / Description with Concept Suggestion Button */}
        <div className="form-group">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
            <label>스토리 / 연출 내용</label>
            <div style={{ display: 'flex', gap: '0.375rem' }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                style={{ padding: '0.125rem 0.5rem', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '0.25rem', borderColor: 'var(--text-muted)' }}
                onClick={handleAiCompleteStory}
                disabled={aiStoryLoading}
                title="입력한 키워드나 연출 아이디어를 풍부한 지문으로 완성"
              >
                <Sparkles size={10} className={aiStoryLoading ? 'animate-spin' : ''} />
                {aiStoryLoading ? 'AI 작성 중...' : 'AI 연출 완성'}
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                style={{ padding: '0.125rem 0.5rem', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '0.25rem', borderColor: 'var(--text-muted)' }}
                onClick={() => setIsConceptModalOpen(true)}
              >
                <Sparkles size={10} /> 시안 추천 가이드
              </button>
            </div>
          </div>
          <textarea
            value={frame.story}
            onChange={(e) => handleUpdate({ story: e.target.value })}
            placeholder="이 씬의 스토리 및 대사, 카메라 구도를 입력하세요..."
          />
        </div>

        {/* Style & Aspect Ratio */}
        <div className="form-row">
          <div className="form-group">
            <label>비주얼 스타일</label>
            <select
              value={frame.stylePreset}
              onChange={(e) => handleUpdate({ stylePreset: e.target.value })}
            >
              {Object.entries(STYLES).map(([key, val]) => (
                <option key={key} value={key}>{val.ko}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>화면 비율 (AR)</label>
            <select
              value={frame.aspectRatio}
              onChange={(e) => handleUpdate({ aspectRatio: e.target.value })}
            >
              <option value="16:9">16:9 (영화/영상)</option>
              <option value="4:3">4:3 (일반 TV)</option>
              <option value="1:1">1:1 (정사각형)</option>
              <option value="9:16">9:16 (숏폼/세로)</option>
              <option value="2.35:1">2.35:1 (시네마스코프)</option>
            </select>
          </div>
        </div>

        {/* Shot Type & Camera Move */}
        <div className="form-row">
          <div className="form-group">
            <label>카메라 샷 크기</label>
            <select
              value={frame.shotType}
              onChange={(e) => handleUpdate({ shotType: e.target.value })}
            >
              {Object.entries(SHOTS).map(([key, val]) => (
                <option key={key} value={key}>{val.ko}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>카메라 움직임</label>
            <select
              value={frame.cameraMove}
              onChange={(e) => handleUpdate({ cameraMove: e.target.value })}
            >
              {Object.entries(CAMERAS).map(([key, val]) => (
                <option key={key} value={key}>{val.ko}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Camera Gear & Lens MM */}
        <div className="form-row">
          <div className="form-group">
            <label>카메라 장비</label>
            <select
              value={frame.cameraGear || 'none'}
              onChange={(e) => handleUpdate({ cameraGear: e.target.value })}
            >
              {Object.entries(CAMERA_GEAR).map(([key, val]) => (
                <option key={key} value={key}>{val.ko}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>렌즈 화각</label>
            <select
              value={frame.lensMm || 'none'}
              onChange={(e) => handleUpdate({ lensMm: e.target.value })}
            >
              {Object.entries(LENS_MM).map(([key, val]) => (
                <option key={key} value={key}>{val.ko}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Lens Type (Full Width) */}
        <div className="form-group">
          <label>렌즈 종류</label>
          <select
            value={frame.lensType || 'none'}
            onChange={(e) => handleUpdate({ lensType: e.target.value })}
            style={{ width: '100%' }}
          >
            {Object.entries(LENS_TYPES).map(([key, val]) => (
              <option key={key} value={key}>{val.ko}</option>
            ))}
          </select>
        </div>

        {/* Mood/Tone & Colors */}
        <div className="form-row">
          <div className="form-group">
            <label>분위기 / 톤</label>
            <select
              value={frame.tone}
              onChange={(e) => handleUpdate({ tone: e.target.value })}
            >
              {Object.entries(TONES).map(([key, val]) => (
                <option key={key} value={key}>{val.ko}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>색상 팔레트</label>
            <select
              value={frame.colorPalette}
              onChange={(e) => handleUpdate({ colorPalette: e.target.value })}
            >
              {Object.entries(COLORS).map(([key, val]) => (
                <option key={key} value={key}>{val.ko}</option>
              ))}
            </select>
          </div>
        </div>

        {/* AI Prompt Generator */}
        <PromptGenerator
          frame={frame}
          onChange={handleUpdate}
          geminiApiKey={geminiApiKey}
          showToast={showToast}
        />
      </div>

      {/* --- Concept Modal Overlay --- */}
      {isConceptModalOpen && (
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
          onClick={() => setIsConceptModalOpen(false)}
        >
          <div 
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              width: '100%',
              maxWidth: '560px',
              maxHeight: '85vh',
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
                광고 시안 추천 가이드
              </h3>
              <button 
                type="button" 
                className="btn btn-text btn-sm"
                onClick={() => setIsConceptModalOpen(false)}
                style={{ padding: '4px' }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '1.25rem 1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Product Image analysis section */}
              {frame.image ? (
                <div style={{ display: 'flex', gap: '1rem', padding: '0.875rem', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '8px', alignItems: 'center' }}>
                  <img src={frame.image} alt="Product Thumbnail" style={{ width: '56px', height: '56px', objectFit: 'contain', backgroundColor: '#ffffff', border: '1px solid var(--border-color)', borderRadius: '4px' }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>제품 이미지가 업로드되어 있습니다.</p>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>AI가 이 제품의 비주얼을 직접 분석해 맞춤형 광고 시안 3종을 제안합니다.</p>
                  </div>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={handleAiGenerateConcepts}
                    disabled={aiLoading}
                    style={{ fontSize: '0.75rem', padding: '0.375rem 0.75rem' }}
                  >
                    <Sparkles size={11} className={aiLoading ? 'animate-spin' : ''} />
                    {aiLoading ? '시안 구상 중...' : 'AI 분석 시안 생성'}
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: '0.5rem', padding: '0.75rem 1rem', backgroundColor: '#fffbeb', border: '1px solid #fef3c7', borderRadius: '8px', alignItems: 'center' }}>
                  <AlertCircle size={14} style={{ color: '#d97706' }} />
                  <p style={{ fontSize: '0.725rem', color: '#b45309', lineHeight: '1.4' }}>
                    씬 카드에 제품 이미지를 먼저 업로드(또는 스케치)하시면, 이미지의 제품 카테고리와 브랜드를 인지하여 개인화된 AI 시안을 받아볼 수 있습니다.
                  </p>
                </div>
              )}

              {/* Tabs */}
              <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', gap: '0.5rem', overflowX: 'auto', paddingBottom: '1px' }}>
                {frame.image && (
                  <button
                    type="button"
                    className="btn btn-text btn-sm"
                    style={{ 
                      borderBottom: activeTab === 'ai' ? '2px solid var(--text-primary)' : 'none', 
                      borderRadius: 0, 
                      fontWeight: 600,
                      color: activeTab === 'ai' ? 'var(--text-primary)' : 'var(--text-secondary)'
                    }}
                    onClick={() => setActiveTab('ai')}
                  >
                    AI 맞춤 시안
                  </button>
                )}
                {Object.entries(AD_PRESETS).map(([key, cat]) => (
                  <button
                    type="button"
                    key={key}
                    className="btn btn-text btn-sm"
                    style={{ 
                      borderBottom: activeTab === key ? '2px solid var(--text-primary)' : 'none', 
                      borderRadius: 0, 
                      fontWeight: 600,
                      color: activeTab === key ? 'var(--text-primary)' : 'var(--text-secondary)'
                    }}
                    onClick={() => setActiveTab(key)}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', minHeight: '180px', paddingBottom: '1rem' }}>
                {activeTab === 'ai' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {aiLoading ? (
                      <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text-secondary)' }}>
                        <Sparkles size={20} className="animate-spin" style={{ margin: '0 auto 0.5rem', color: 'var(--text-muted)' }} />
                        <p style={{ fontSize: '0.8rem' }}>AI가 업로드된 이미지를 인식하고 연출 기법을 적용하는 중입니다...</p>
                      </div>
                    ) : aiConcepts.length > 0 ? (
                      aiConcepts.map((concept, i) => (
                        <div key={i} style={{ border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', backgroundColor: '#fafafa' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>시안 {i+1}: {concept.title}</span>
                            <button
                              type="button"
                              className="btn btn-secondary btn-sm"
                              style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                              onClick={() => applyConcept(concept)}
                            >
                              적용하기
                            </button>
                          </div>
                          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.4', whiteSpace: 'pre-wrap' }}>{concept.story}</p>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginTop: '0.25rem' }}>
                            <span style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', backgroundColor: 'var(--bg-secondary)', padding: '0.125rem 0.375rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}>스타일: {STYLES[concept.stylePreset]?.ko}</span>
                            <span style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', backgroundColor: 'var(--bg-secondary)', padding: '0.125rem 0.375rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}>샷: {SHOTS[concept.shotType]?.ko}</span>
                            <span style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', backgroundColor: 'var(--bg-secondary)', padding: '0.125rem 0.375rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}>톤: {TONES[concept.tone]?.ko}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text-secondary)', border: '1px dashed var(--border-color)', borderRadius: '8px' }}>
                        <p style={{ fontSize: '0.775rem' }}>위의 'AI 분석 시안 생성' 버튼을 클릭하시면 업로드된 제품 이미지 맞춤형 광고 시안을 제미나이가 실시간 분석하여 제안해 드립니다.</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab !== 'ai' && AD_PRESETS[activeTab] && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {AD_PRESETS[activeTab].items.map((concept, i) => (
                      <div key={i} style={{ border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', backgroundColor: '#fafafa' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>{concept.title}</span>
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                            onClick={() => applyConcept(concept)}
                          >
                            적용하기
                          </button>
                        </div>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>{concept.story}</p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginTop: '0.25rem' }}>
                          <span style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', backgroundColor: 'var(--bg-secondary)', padding: '0.125rem 0.375rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}>스타일: {STYLES[concept.stylePreset]?.ko}</span>
                          <span style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', backgroundColor: 'var(--bg-secondary)', padding: '0.125rem 0.375rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}>샷: {SHOTS[concept.shotType]?.ko}</span>
                          <span style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', backgroundColor: 'var(--bg-secondary)', padding: '0.125rem 0.375rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}>톤: {TONES[concept.tone]?.ko}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
