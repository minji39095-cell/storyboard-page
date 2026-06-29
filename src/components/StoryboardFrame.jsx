import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Trash2, PenTool, Upload, Image as ImageIcon, X } from 'lucide-react';
import DrawingCanvas from './DrawingCanvas';
import PromptGenerator, { STYLES, SHOTS, CAMERAS, TONES, COLORS } from './PromptGenerator';

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
  const fileInputRef = useRef(null);

  const handleUpdate = (updatedFields) => {
    onUpdate(frame.id, updatedFields);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      handleUpdate({ image: event.target.result });
      showToast('이미지가 성공적으로 업로드되었습니다.');
    };
    reader.readAsDataURL(file);
  };

  const handleCanvasSave = (dataUrl) => {
    handleUpdate({ image: dataUrl });
    setIsDrawingMode(false);
    showToast('스케치가 저장되었습니다.');
  };

  const handleRemoveImage = (e) => {
    e.stopPropagation();
    handleUpdate({ image: null });
    showToast('이미지가 삭제되었습니다.');
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
            onClick={() => onDelete(frame.id)}
            title="삭제"
          >
            <Trash2 size={14} />
          </button>
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
        {/* Story / Description */}
        <div className="form-group">
          <label>스토리 / 연출 내용</label>
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
    </div>
  );
}
