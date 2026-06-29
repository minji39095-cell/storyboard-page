import React, { useState, useEffect } from 'react';
import { Plus, Download, Upload, Printer, Key, Sparkles, Film, Trash, Lock, Unlock, Eye, EyeOff } from 'lucide-react';
import StoryboardFrame from './components/StoryboardFrame';

// Master passcode for accessing the page (can be customized)
const MASTER_PASSCODE = 'storyboard123';

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

  // Authentication State
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [inputPasscode, setInputPasscode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');

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

  const copyShareLink = () => {
    const shareUrl = `${window.location.origin}${window.location.pathname}?code=${MASTER_PASSCODE}`;
    navigator.clipboard.writeText(shareUrl);
    triggerToast('자동 로그인 링크가 복사되었습니다!');
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
