const { Server } = require("@modelcontextprotocol/sdk/server/index.js");
const { StdioServerTransport } = require("@modelcontextprotocol/sdk/server/stdio.js");
const { CallToolRequestSchema, ListToolsRequestSchema } = require("@modelcontextprotocol/sdk/types.js");

const STYLES = {
  cinematic: { ko: '영화 스틸컷', en: 'Cinematic movie still, photorealistic, 8k resolution, shot on 35mm lens, highly detailed textures', noun: 'cinematic photograph' },
  highend_ad: { ko: '하이엔드 광고 스타일', en: 'High-end luxury commercial advertisement style, sleek product lighting, clean minimalist composition, elegant studio lighting, ultra-sharp focus, premium color grading, sophisticated aesthetic', noun: 'high-end luxury commercial photograph' },
  anime: { ko: '애니메이션', en: 'Anime style, highly detailed digital illustration, vibrant colors, studio Ghibli aesthetic, clean lines', noun: 'anime studio illustration' },
  webtoon: { ko: '웹툰', en: 'Korean webtoon illustration style, line art, cell shaded, high quality manhwa cover art', noun: 'webtoon illustration' },
  disney3d: { ko: '디즈니 3D', en: '3D animated movie render, Pixar style, cute character design, soft lighting, octane render', noun: '3D Pixar-style animated render' },
  concept: { ko: '컨셉 아트', en: 'Concept art, digital painting, dramatic composition, atmospheric perspective, artstation trending', noun: 'fantasy digital painting' },
  lineart: { ko: '라인 드로잉', en: 'Minimalist line drawing, clean vector illustration, sketch art, monochrome', noun: 'minimalist line art drawing' },
  pencil: { ko: '연필 소묘', en: 'Pencil sketch, hand-drawn illustration, cross-hatching, graphite texture, charcoal shading', noun: 'pencil sketch drawing' }
};

const SHOTS = {
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

const CAMERAS = {
  static: { ko: '정적', en: 'static camera' },
  pan: { ko: '팬 (가로)', en: 'panning shot' },
  tilt: { ko: '틸트 (세로)', en: 'tilting camera' },
  zoomin: { ko: '줌 인', en: 'zooming in' },
  zoomout: { ko: '줌 아웃', en: 'zooming out' },
  tracking: { ko: '트래킹', en: 'tracking camera movement' }
};

const TONES = {
  dreamy: { ko: '몽환적인', en: 'dreamy, ethereal atmosphere' },
  cinematic: { ko: '극적인 시네마틱', en: 'cinematic, dramatic mood' },
  dark: { ko: '어둡고 음산한', en: 'dark, moody, ominous atmosphere' },
  bright: { ko: '밝고 화사한', en: 'bright, cheerful, vibrant mood' },
  sad: { ko: '슬프고 잔잔한', en: 'melancholic, sad, reflective tone' },
  suspense: { ko: '긴장감 있는', en: 'suspenseful, tense atmosphere' },
  retro: { ko: '빈티지 레트로', en: 'vintage, nostalgic, retro vibe' }
};

const COLORS = {
  amber: { ko: '따뜻한 골드', en: 'warm amber and golden hour color palette' },
  blue: { ko: '차가운 블루/청록', en: 'cool blue and teal color tones' },
  monochrome: { ko: '흑백', en: 'monochrome color palette, black and white' },
  cyberpunk: { ko: '네온 사이버펑크', en: 'neon cyberpunk colors, electric violet and cyan' },
  pastel: { ko: '부드러운 파스텔', en: 'soft pastel color tones' },
  highcontrast: { ko: '고대비', en: 'high contrast color grading' },
  natural: { ko: '자연스러운 톤', en: 'natural earth tones' }
};

// Help translate ko to en via MyMemory API
async function translateKoToEn(text) {
  if (!text) return '';
  const hasKorean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(text);
  if (!hasKorean) return text.trim();

  try {
    const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=ko|en`);
    if (res.ok) {
      const data = await res.json();
      return data.responseData.translatedText || text.trim();
    }
  } catch (e) {
    console.error("Translation API failed:", e);
  }
  return text.trim();
}

const server = new Server(
  {
    name: "storyboard-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "generate_scene_prompts",
        description: "Translates a Korean storyboard cut directing description and compiles it into customized English prompts for Midjourney, NanoBanana, ComfyUI, Grok, Seedance, and LTX Video.",
        inputSchema: {
          type: "object",
          properties: {
            story: { type: "string", description: "The Korean directing scenario text or keywords." },
            stylePreset: { type: "string", enum: Object.keys(STYLES), default: "cinematic", description: "Visual style preset." },
            shotType: { type: "string", enum: Object.keys(SHOTS), default: "cu", description: "Camera shot type." },
            cameraMove: { type: "string", enum: Object.keys(CAMERAS), default: "static", description: "Camera movement." },
            tone: { type: "string", enum: Object.keys(TONES), default: "cinematic", description: "Atmospheric tone/mood." },
            colorPalette: { type: "string", enum: Object.keys(COLORS), default: "amber", description: "Color palette tone." },
            aspectRatio: { type: "string", default: "16:9", description: "Aspect ratio parameter (e.g., 16:9)." }
          },
          required: ["story"]
        }
      },
      {
        name: "generate_model_prompt",
        description: "Compiles a human model description prompt across multiple engines based on options and translates any custom Korean model descriptions.",
        inputSchema: {
          type: "object",
          properties: {
            age: { type: "string", default: "20s year old", description: "Age description (e.g., 20s year old, 30s year old)." },
            gender: { type: "string", default: "female", description: "Gender (e.g., female, male, person)." },
            composition: { type: "string", default: "close-up portrait shot, headshot", description: "Shot composition." },
            skinTexture: { type: "string", default: "dewy skin texture, glowing skin", description: "Skin texture." },
            expression: { type: "string", default: "neutral natural expression", description: "Subject expression." },
            hair: { type: "string", default: "messy bun hair style, loose strands", description: "Hair style." },
            makeup: { type: "string", default: "minimal natural makeup look, nude tones", description: "Makeup style." },
            detail: { type: "string", default: "subtle fine lines around eyes, detailed skin pores", description: "Skin details." },
            light: { type: "string", default: "soft studio key light", description: "Lighting environment." },
            background: { type: "string", default: "solid minimalist studio backdrop", description: "Background setting." },
            camera: { type: "string", default: "shot on Leica M11, Summilux-M 50mm f/1.4 ASPH lens", description: "Camera gear description." },
            customModelDesc: { type: "string", description: "Optional Korean description of clothing or pose (will be translated and compiled)." }
          }
        }
      }
    ]
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    if (name === "generate_scene_prompts") {
      const story = args.story || '';
      const stylePreset = args.stylePreset || 'cinematic';
      const shotType = args.shotType || 'cu';
      const cameraMove = args.cameraMove || 'static';
      const tone = args.tone || 'cinematic';
      const colorPalette = args.colorPalette || 'amber';
      const aspectRatio = args.aspectRatio || '16:9';

      const styleEn = STYLES[stylePreset]?.en || '';
      const shotEn = SHOTS[shotType]?.en || '';
      const cameraEn = CAMERAS[cameraMove]?.en || '';
      const toneEn = TONES[tone]?.en || '';
      const colorEn = COLORS[colorPalette]?.en || '';

      const storyEn = await translateKoToEn(story);

      // Midjourney
      const mj = `${storyEn}, ${styleEn}, ${shotEn}, ${cameraEn}, ${toneEn}, ${colorEn} --ar ${aspectRatio} --v 6.0`;

      // NanoBanana
      const nb = `A detailed ${STYLES[stylePreset]?.noun || 'illustration'} depicting: ${storyEn}. The scene features a ${shotEn} with ${cameraEn}. The general mood is ${toneEn}, rendered in a ${colorEn}.`;

      // ComfyUI
      const cf = `${storyEn}, ${styleEn}, ${shotEn}, ${cameraEn}, ${toneEn}, ${colorEn}, highly detailed, masterpiece, sharp focus, 8k`;

      // ComfyUI Grok
      const gk = `A raw, detailed photo showing: ${storyEn}. Style: ${styleEn}. Composition: ${shotEn}, ${cameraEn}. Atmosphere: ${toneEn}. Colors: ${colorEn}. Realism, high resolution.`;

      // Seedance
      const sd = `commercial film look, ${storyEn}, ${styleEn}, ${shotEn}, camera motion: ${cameraEn}, tone: ${toneEn}, color grade: ${colorEn}, high quality cinematic render, 8k resolution`;

      // LTX Video
      const lx = `A realistic commercial video clip: ${storyEn}. Style: ${styleEn}. Camera movement: ${cameraEn}, ${shotEn}. Tone: ${toneEn}. Colors: ${colorEn}. Smooth motion, highly detailed, photorealistic render.`;

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              translatedStory: storyEn,
              prompts: {
                midjourney: mj,
                nanobanana: nb,
                comfyui: cf,
                grok: gk,
                seedance: sd,
                ltxvideo: lx
              }
            }, null, 2)
          }
        ]
      };
    } else if (name === "generate_model_prompt") {
      const ageEn = args.age || '20s year old';
      const genderEn = args.gender || 'female';
      const compEn = args.composition || 'close-up portrait shot, headshot';
      const skinEn = args.skinTexture || 'dewy skin texture, glowing skin';
      const exprEn = args.expression || 'neutral natural expression';
      const hairEn = args.hair || 'messy bun hair style, loose strands';
      const makeupEn = args.makeup || 'minimal natural makeup look, nude tones';
      const detailEn = args.detail || 'subtle fine lines around eyes, detailed skin pores';
      const lightEn = args.light || 'soft studio key light';
      const bgEn = args.background || 'solid minimalist studio backdrop';
      const cameraEn = args.camera || 'shot on Leica M11, Summilux-M 50mm f/1.4 ASPH lens';
      const customModelDesc = args.customModelDesc || '';

      const customDescEn = customModelDesc ? await translateKoToEn(customModelDesc) : '';
      const descPart = customDescEn ? `, ${customDescEn}` : '';
      const descPartNb = customDescEn ? `, featuring ${customDescEn}` : '';

      // Midjourney
      const mj = `A raw photo of a ${ageEn} ${genderEn}, ${exprEn}${descPart}, with ${hairEn} and ${makeupEn}, ${compEn}, ${skinEn}, ${detailEn}, ${lightEn}, ${bgEn}, ${cameraEn} --ar 16:9 --v 6.0 --style raw`;

      // NanoBanana
      const nb = `A highly detailed, raw realistic photograph. The subject is a ${ageEn} ${genderEn} with a ${exprEn}${descPartNb}, featuring ${hairEn} and ${makeupEn}. The shot is a ${compEn} highlighting ${skinEn} with ${detailEn}. Captured on a ${cameraEn} under ${lightEn} with a ${bgEn}. Emphasizes authentic skin texture, avoiding any artificial smooth or flawless airbrushed appearance.`;

      // ComfyUI
      const cf = `raw photo, ${ageEn} ${genderEn}, ${exprEn}${descPart}, ${hairEn}, ${makeupEn}, ${compEn}, ${skinEn}, ${detailEn}, ${cameraEn}, ${lightEn}, ${bgEn}, realistic skin texture, visible pores, masterpiece, highly detailed, sharp focus`;

      // ComfyUI Grok
      const gk = `A raw portrait photograph of a ${ageEn} ${genderEn}, ${exprEn}${descPart}, with ${hairEn} and ${makeupEn}. Composition: ${compEn}. Lighting: ${lightEn}. Background: ${bgEn}. Shot on ${cameraEn}.`;

      // Seedance
      const sd = `raw studio photo, ${ageEn} ${genderEn}, ${exprEn}${descPart}, ${hairEn}, ${makeupEn}, ${compEn}, ${skinEn}, ${detailEn}, camera setup: ${cameraEn}, lighting: ${lightEn}, background: ${bgEn}, photorealistic skin textures, high-end commercial grading`;

      // LTX Video
      const lx = `A realistic commercial video clip of a ${ageEn} ${genderEn}, ${exprEn}${descPart}, with ${hairEn} and ${makeupEn}. Camera movement: ${compEn}, ${lightEn}. Background: ${bgEn}. Shot on ${cameraEn}. Photorealistic, natural motion, high-end commercial grade.`;

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              translatedDescription: customDescEn,
              prompts: {
                midjourney: mj,
                nanobanana: nb,
                comfyui: cf,
                grok: gk,
                seedance: sd,
                ltxvideo: lx
              }
            }, null, 2)
          }
        ]
      };
    } else {
      throw new Error(`Tool not found: ${name}`);
    }
  } catch (error) {
    return {
      isError: true,
      content: [
        {
          type: "text",
          text: error.message
        }
      ]
    };
  }
});

// Run server using stdio transport
const transport = new StdioServerTransport();
server.connect(transport).then(() => {
  console.error("Storyboard MCP Server running on stdio transport");
}).catch((error) => {
  console.error("Failed to start server:", error);
});
