# Storyboard Studio MCP Server Setup Guide

본 프로젝트는 클로드 데스크톱(Claude Desktop) 등의 MCP 지원 클라이언트와 연동할 수 있도록 **Model Context Protocol (MCP)** 서버가 구성되어 있습니다.
이 가이드를 따라 Claude 앱에 도구를 추가해 보세요.

## 1. 연동 구성 안내

Claude Desktop의 환경설정 파일에 아래 설정을 등록하면 Claude가 프로젝트 내의 프롬프트 조립 및 한국어-영어 자동 번역 엔진 기능을 직접 도구(Tools)로 사용할 수 있게 됩니다.

### 설정 파일 위치 (Windows)
- `%APPDATA%\Claude\claude_desktop_config.json`
- 실제 경로 예시: `C:\Users\minji\AppData\Roaming\Claude\claude_desktop_config.json`

### JSON 설정 파일 내용
설정 파일이 비어 있다면 아래 내용 전체를 복사해 붙여넣고, 이미 다른 MCP 서버가 존재한다면 `"mcpServers"` 필드 내부에 `"storyboard-studio"` 항목을 추가해 주세요.

```json
{
  "mcpServers": {
    "storyboard-studio": {
      "command": "node",
      "args": [
        "c:/Users/minji/Documents/antigravity/commercial/storyboard-mcp/index.js"
      ]
    }
  }
}
```

---

## 2. 연동 확인 및 사용 방법

1. `claude_desktop_config.json` 파일을 저장하고 **Claude Desktop 앱을 완전히 종료 후 다시 실행**합니다.
2. 대화창 우측 하단의 **콘센트 플러그 모양(MCP 아이콘)**을 클릭하면 `storyboard-studio` 도구들이 로드되어 있는 것을 확인할 수 있습니다.
3. 이제 클로드에게 다음과 같이 요청하여 바로 기능을 실행할 수 있습니다.
   - *"이 스토리보드 시나리오에 대해 각 모델별 프롬프트 만들어줘: 세탁제 캡슐이 부드럽게 세탁조 안으로 낙하하는 씬, 극적인 시네마틱 스타일, 슬프고 잔잔한 톤"*
   - *"20대 여성 모델의 올림머리, 렘브란트 조명으로 인물 프롬프트 조립해줘"*

## 3. 제공되는 도구 목록 (Tools)
- `generate_scene_prompts`: 한국어 연출 내용을 영어 번역과 함께 Midjourney, NanoBanana, ComfyUI, Grok, Seedance, LTX Video 프롬프트로 다각도로 변환합니다.
- `generate_model_prompt`: 헤어, 나이, 표정, 메이크업 옵션 등을 조합하여 인물 전용 다중 모델 프롬프트를 구성하며, 추가 한글 의상 묘사 입력 시 실시간 번역해 결합합니다.
