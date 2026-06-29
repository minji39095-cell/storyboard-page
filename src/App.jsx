import React, { useState, useEffect } from 'react';
import { Plus, Download, Upload, Printer, Key, Sparkles, Film, Trash } from 'lucide-react';
import StoryboardFrame from './components/StoryboardFrame';

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
      image: null
    }
  ]);
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  // Load API Key from localStorage on mount
  useEffect(() => {
    const savedKey = localStorage.getItem('gemini_api_key');
    if (savedKey) setGeminiApiKey(savedKey);
    
    const savedTitle = localStorage.getItem('storyboard_project_title');
    if (savedTitle) setProjectTitle(savedTitle);

    const savedFrames = localStorage.getItem('storyboard_frames');
    if (savedFrames) {
      try {
        setFrames(JSON.parse(savedFrames));
      } catch (e) {
        console.error('스토리보드 데이터를 로드하는데 실패했습니다.');
      }
    }
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    localStorage.setItem('storyboard_frames', JSON.stringify(frames));
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

  const handleAddFrame = () => {
    const newFrame = {
      id: `frame-${Date.now()}`,
      story: '',
      stylePreset: 'cinematic',
      shotType: 'cu',
      cameraMove: 'static',
      tone: 'cinematic',
      colorPalette: 'amber',
      aspectRatio: '16:9',
      image: null
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
    if (window.confirm('정말로 이 씬 컷을 삭제하시겠습니까?')) {
      setFrames(frames.filter((f) => f.id !== id));
      triggerToast('씬 컷이 삭제되었습니다.');
    }
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
            className="btn btn-secondary btn-sm btn-danger-light"
            onClick={handleClearAll}
            title="스토리보드 초기화"
          >
            <Trash size={12} /> 전체 초기화
          </button>
        </div>
      </div>

      {/* Main Workspace */}
      <main className="main-content">
        {frames.length === 0 ? (
          <div className="empty-state">
            <Film className="empty-icon" />
            <h3 className="empty-title">작성된 씬 컷이 없습니다</h3>
            <p className="empty-desc">새로운 씬 컷을 추가하고 프롬프트를 만들어 보세요.</p>
            <button type="button" className="btn btn-primary" onClick={handleAddFrame}>
              <Plus size={16} /> 첫 씬 컷 추가하기
            </button>
          </div>
        ) : (
          <div className="storyboard-grid">
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
            <div className="add-cut-card" onClick={handleAddFrame}>
              <Plus className="add-cut-icon" />
              <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>새 씬 컷 추가</span>
            </div>
          </div>
        )}
      </main>

      {/* Floating Toast Notification */}
      <div className={`toast ${showToast ? 'show' : ''}`}>
        {toastMessage}
      </div>
    </div>
  );
}
