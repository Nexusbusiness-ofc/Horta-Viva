import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RotateCcw, Play, Pause, ZoomIn, ZoomOut, Eye, Ruler, Scissors, CheckCircle2, XCircle, Maximize2, Minimize2 } from "lucide-react";

// --- GERADOR DE ETIQUETAS 3D FLUTUANTES NÍTIDAS ---
function createLabelSprite(text, {
  bgColor = "#ffffff",
  textColor = "#0f172a",
  borderColor = "#cbd5e1",
  icon = "",
  fontSize = 30,
  padding = 14
} = {}) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const font = `bold ${fontSize}px system-ui, -apple-system, sans-serif`;
  ctx.font = font;

  const fullText = icon ? `${icon}  ${text}` : text;
  const metrics = ctx.measureText(fullText);
  const textWidth = metrics.width;
  const textHeight = fontSize * 1.3;

  const width = Math.ceil(textWidth + padding * 3);
  const height = Math.ceil(textHeight + padding * 1.8);

  canvas.width = width * 2;
  canvas.height = height * 2;
  ctx.scale(2, 2);

  // Sombra
  ctx.shadowColor = "rgba(0, 0, 0, 0.2)";
  ctx.shadowBlur = 8;
  ctx.shadowOffsetY = 3;

  // Balão
  const r = 14;
  ctx.fillStyle = bgColor;
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = 3;

  ctx.beginPath();
  ctx.moveTo(r, 0);
  ctx.lineTo(width - r, 0);
  ctx.quadraticCurveTo(width, 0, width, r);
  ctx.lineTo(width, height - r);
  ctx.quadraticCurveTo(width, height, width - r, height);
  ctx.lineTo(r, height);
  ctx.quadraticCurveTo(0, height, 0, height - r);
  ctx.lineTo(0, r);
  ctx.quadraticCurveTo(0, 0, r, 0);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.shadowColor = "transparent";
  ctx.font = font;
  ctx.fillStyle = textColor;
  ctx.textBaseline = "middle";
  ctx.fillText(fullText, padding * 1.5, height / 2 + 1);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;

  const spriteMaterial = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthTest: false
  });

  const sprite = new THREE.Sprite(spriteMaterial);
  const scale = 0.0055;
  sprite.scale.set(width * scale, height * scale, 1);
  return sprite;
}

export default function Monda3DViewer({ diagramType = "root_thinning", name = "Cultura", spacingCm = "5 cm" }) {
  const rootRef = useRef(null);
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const reqIdRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);

  const [autoRotate, setAutoRotate] = useState(false);
  const [showLabels, setShowLabels] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (!sceneRef.current) return;
    sceneRef.current.traverse((obj) => {
      if (obj instanceof THREE.Sprite) {
        obj.visible = showLabels;
      }
    });
  }, [showLabels]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 360;
    const height = container.clientHeight || 340;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0xf7fee7); // Fundo verde lima suave e acolhedor
    scene.fog = new THREE.FogExp2(0xf7fee7, 0.035);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    cameraRef.current = camera;
    if (diagramType === "solanaceae_sucker") {
      camera.position.set(2.4, 3.0, 4.8);
    } else {
      camera.position.set(0, 3.6, 6.2);
    }

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.replaceChildren(renderer.domElement);

    // 4. Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.maxPolarAngle = Math.PI / 2 + 0.05;
    controls.minDistance = 1.8;
    controls.maxDistance = 14;
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = 1.4;

    if (diagramType === "solanaceae_sucker") {
      controls.target.set(0, 1.6, 0);
    } else {
      controls.target.set(0, 1.0, 0);
    }
    controls.update();

    // 5. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfffbeb, 2.3);
    sunLight.position.set(5, 12, 7);
    sunLight.castShadow = true;
    scene.add(sunLight);

    const skyFill = new THREE.DirectionalLight(0xa7f3d0, 0.8);
    skyFill.position.set(-5, 4, -4);
    scene.add(skyFill);

    // 6. Grupo de Modelos
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);

    // Materiais
    const stemMaterial = new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.6 });
    const leafMaterial = new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.5, side: THREE.DoubleSide });
    const suckerMaterial = new THREE.MeshStandardMaterial({
      color: 0xef4444, // Vermelho vivo
      roughness: 0.35,
      emissive: 0xb91c1c,
      emissiveIntensity: 0.4
    });
    const rootMaterial = new THREE.MeshStandardMaterial({ color: 0xea580c, roughness: 0.4 }); // Cenouras laranjas brilhantes

    // Helper tesourinha 3D
    function addMiniShears(pos) {
      const shears = new THREE.Group();
      const bladeGeo = new THREE.BoxGeometry(0.03, 0.28, 0.015);
      const bladeMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, metalness: 0.9 });
      const b1 = new THREE.Mesh(bladeGeo, bladeMat);
      b1.rotation.z = Math.PI / 4;
      const b2 = new THREE.Mesh(bladeGeo, bladeMat);
      b2.rotation.z = -Math.PI / 4;
      shears.add(b1);
      shears.add(b2);

      const r1 = new THREE.Mesh(new THREE.TorusGeometry(0.05, 0.015, 6, 12), new THREE.MeshBasicMaterial({ color: 0xef4444 }));
      r1.position.set(-0.1, -0.12, 0);
      const r2 = new THREE.Mesh(new THREE.TorusGeometry(0.05, 0.015, 6, 12), new THREE.MeshBasicMaterial({ color: 0xef4444 }));
      r2.position.set(0.1, -0.12, 0);
      shears.add(r1);
      shears.add(r2);

      shears.position.copy(pos);
      modelGroup.add(shears);
    }

    if (diagramType === "solanaceae_sucker") {
      // --- MODELO 3D DE DESLADROAMENTO (TOMATEIRO / PIMENTO) ---
      // Base de solo
      const bedGeo = new THREE.CylinderGeometry(2.4, 2.6, 0.3, 32);
      const bedMat = new THREE.MeshStandardMaterial({ color: 0x543015, roughness: 0.9 });
      const bed = new THREE.Mesh(bedGeo, bedMat);
      bed.position.y = -0.15;
      modelGroup.add(bed);

      // Caule Principal Vertical Robusto
      const mainStemGeo = new THREE.CylinderGeometry(0.2, 0.24, 3.8, 24);
      const mainStem = new THREE.Mesh(mainStemGeo, stemMaterial);
      mainStem.position.y = 1.9;
      mainStem.castShadow = true;
      modelGroup.add(mainStem);

      // Folha Horizontal Estendida (formando a axila em V)
      const petioleGeo = new THREE.CylinderGeometry(0.09, 0.13, 2.0, 16);
      const petiole = new THREE.Mesh(petioleGeo, stemMaterial);
      petiole.position.set(0.95, 1.75, 0);
      petiole.rotation.z = -Math.PI / 2.6;
      modelGroup.add(petiole);

      // Folíolos da folha
      for (let i = 0; i < 5; i++) {
        const leafGeo = new THREE.SphereGeometry(0.3, 10, 8);
        leafGeo.scale(1.2, 0.1, 1.8);
        const leaf = new THREE.Mesh(leafGeo, leafMaterial);
        leaf.position.set(0.5 + i * 0.38, 2.05 - i * 0.2, (i % 2 === 0 ? 0.38 : -0.38));
        leaf.rotation.y = (i % 2 === 0 ? 0.45 : -0.45);
        modelGroup.add(leaf);
      }

      // O LADRÃO AXILAR (A 45° - VERMELHO INTENSO - A PARTIR COM O POLEGAR!)
      const suckerGeo = new THREE.CylinderGeometry(0.08, 0.11, 1.2, 16);
      const sucker = new THREE.Mesh(suckerGeo, suckerMaterial);
      sucker.position.set(0.42, 2.15, 0);
      sucker.rotation.z = -Math.PI / 4; // exatamente 45 graus!
      sucker.castShadow = true;
      modelGroup.add(sucker);

      // Folhinhas jovens do ladrão
      const sL1 = new THREE.Mesh(new THREE.SphereGeometry(0.18, 8, 8), suckerMaterial);
      sL1.position.set(0.8, 2.58, 0.1);
      modelGroup.add(sL1);

      const sL2 = new THREE.Mesh(new THREE.SphereGeometry(0.16, 8, 8), suckerMaterial);
      sL2.position.set(0.75, 2.52, -0.1);
      modelGroup.add(sL2);

      // Marcador de tesoura na axila
      addMiniShears(new THREE.Vector3(0.15, 1.82, 0.02));

      // Cacho de Tomates Vermelhos com Cálice Estrelado
      const tomatoGroup = new THREE.Group();
      const tomatoGeo = new THREE.SphereGeometry(0.25, 16, 16);
      const tomatoMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.25 });
      const tomato = new THREE.Mesh(tomatoGeo, tomatoMat);
      tomatoGroup.add(tomato);

      // Cálice verde no topo do tomate
      const calyxGeo = new THREE.ConeGeometry(0.12, 0.08, 5);
      const calyx = new THREE.Mesh(calyxGeo, leafMaterial);
      calyx.position.y = 0.24;
      tomatoGroup.add(calyx);

      tomatoGroup.position.set(-0.35, 2.6, 0.1);
      modelGroup.add(tomatoGroup);

      // ETIQUETAS FLUTUANTES 3D (À PROVA DE AVÓS)
      if (showLabels) {
        // Etiqueta 1: O Ladrão Axilar
        const lSucker = createLabelSprite("CORTAR: Ladrão da Axila (3 a 5 cm)", {
          bgColor: "#dc2626",
          textColor: "#ffffff",
          borderColor: "#b91c1c",
          icon: "✂️"
        });
        lSucker.position.set(0.9, 2.95, 0);
        modelGroup.add(lSucker);

        // Etiqueta 2: Técnica do Polegar
        const lThumb = createLabelSprite("👉 Dobra com o polegar para partir com um clique", {
          bgColor: "#eff6ff",
          textColor: "#1d4ed8",
          borderColor: "#93c5fd",
          icon: "👌"
        });
        lThumb.position.set(1.4, 2.3, 0);
        modelGroup.add(lThumb);

        // Etiqueta 3: Folha que fica
        const lLeaf = createLabelSprite("MANTER: Folha (alimenta os tomates)", {
          bgColor: "#15803d",
          textColor: "#ffffff",
          borderColor: "#22c55e",
          icon: "🌿"
        });
        lLeaf.position.set(1.6, 1.2, 0);
        modelGroup.add(lLeaf);

        // Etiqueta 4: Caule principal
        const lStem = createLabelSprite("Caule Principal", {
          bgColor: "#ffffff",
          textColor: "#166534",
          borderColor: "#86efac",
          icon: "👑"
        });
        lStem.position.set(-0.6, 3.4, 0);
        modelGroup.add(lStem);
      }

    } else {
      // --- MODELO 3D DE DESBASTE DE SEMENTEIRA (CENOURAS / RAÍZES) ---
      const bedWidth = 5.6;
      // Bloco de terra translúcida
      const bedGeo = new THREE.BoxGeometry(bedWidth, 1.6, 1.8);
      const bedMat = new THREE.MeshStandardMaterial({
        color: 0x451a03,
        roughness: 0.9,
        transparent: true,
        opacity: 0.8
      });
      const bed = new THREE.Mesh(bedGeo, bedMat);
      bed.position.set(0, -0.8, 0);
      modelGroup.add(bed);

      // Régua em Centímetros na frente
      const rulerGeo = new THREE.BoxGeometry(bedWidth, 0.08, 0.14);
      const rulerMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 });
      const ruler = new THREE.Mesh(rulerGeo, rulerMat);
      ruler.position.set(0, 0.04, 0.85);
      modelGroup.add(ruler);

      // Cenouras Mantidas (Espaçadas a cada 1.0 unidade / 5 cm reais)
      [-2.0, -1.0, 0.0, 1.0, 2.0].forEach((x) => {
        // Folhagem fofa
        for (let j = 0; j < 3; j++) {
          const l = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.03, 0.9, 8), stemMaterial);
          l.position.set(x, 0.45, 0);
          l.rotation.z = (j - 1) * 0.22;
          modelGroup.add(l);
        }

        // Cenoura grossa bonita debaixo do solo
        const carrotGeo = new THREE.ConeGeometry(0.2, 1.2, 16);
        const carrot = new THREE.Mesh(carrotGeo, rootMaterial);
        carrot.position.set(x, -0.6, 0);
        carrot.rotation.x = Math.PI;
        modelGroup.add(carrot);
      });

      // Plântulas a Mondar (Vermelhas com tesoura rente)
      [-1.5, -0.5, 0.5, 1.5].forEach((x) => {
        const weed = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.5, 8), suckerMaterial);
        weed.position.set(x, 0.25, 0.04);
        weed.rotation.z = 0.15;
        modelGroup.add(weed);

        addMiniShears(new THREE.Vector3(x, 0.05, 0.06));
      });

      // ETIQUETAS FLUTUANTES
      if (showLabels) {
        const lStrong = createLabelSprite("MANTER: Cenoura Forte (Cresce livre!)", {
          bgColor: "#15803d",
          textColor: "#ffffff",
          borderColor: "#22c55e",
          icon: "👑"
        });
        lStrong.position.set(0, 1.4, 0);
        modelGroup.add(lStrong);

        const lWeed = createLabelSprite("CORTAR COM TESOURA RENTE AO CHÃO", {
          bgColor: "#dc2626",
          textColor: "#ffffff",
          borderColor: "#b91c1c",
          icon: "✂️"
        });
        lWeed.position.set(0.6, 0.65, 0.1);
        modelGroup.add(lWeed);

        const lRuler = createLabelSprite(`Espaçamento Ideal: ${spacingCm}`, {
          bgColor: "#fef3c7",
          textColor: "#92400e",
          borderColor: "#f59e0b",
          icon: "📏"
        });
        lRuler.position.set(0, -1.3, 0.9);
        modelGroup.add(lRuler);
      }
    }

    // Loop de Renderização & Animação
    let clock = new THREE.Clock();
    function animate() {
      reqIdRef.current = requestAnimationFrame(animate);
      controls.update();

      const time = clock.getElapsedTime();
      suckerMaterial.emissiveIntensity = 0.3 + 0.25 * Math.sin(time * 3.5);

      renderer.render(scene, camera);
    }
    animate();

    function handleResize() {
      if (!container || !camera || !renderer) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(container);
    window.addEventListener("resize", handleResize);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", handleResize);
      if (reqIdRef.current) cancelAnimationFrame(reqIdRef.current);
      controls.dispose();
      renderer.dispose();
    };
  }, [diagramType, autoRotate, showLabels]);

  // Listener para saída nativa de ecrã inteiro (ex: tecla Esc)
  useEffect(() => {
    const handleFsChange = () => {
      if (!document.fullscreenElement) {
        setIsFullscreen(false);
      }
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  // Bloquear scroll de fundo quando em tela toda
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isFullscreen]);

  // Redimensionar Three.js quando alterna tela toda
  useEffect(() => {
    const timer = setTimeout(() => {
      if (containerRef.current && cameraRef.current && rendererRef.current) {
        const w = containerRef.current.clientWidth;
        const h = containerRef.current.clientHeight;
        if (w > 0 && h > 0) {
          cameraRef.current.aspect = w / h;
          cameraRef.current.updateProjectionMatrix();
          rendererRef.current.setSize(w, h);
        }
      }
    }, 80);
    return () => clearTimeout(timer);
  }, [isFullscreen]);

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      setIsFullscreen(true);
      if (rootRef.current?.requestFullscreen) {
        rootRef.current.requestFullscreen().catch(() => {});
      }
    } else {
      setIsFullscreen(false);
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  function handleResetFront() {
    if (!cameraRef.current || !controlsRef.current) return;
    if (diagramType === "solanaceae_sucker") {
      cameraRef.current.position.set(2.4, 3.0, 4.8);
      controlsRef.current.target.set(0, 1.6, 0);
    } else {
      cameraRef.current.position.set(0, 3.6, 6.2);
      controlsRef.current.target.set(0, 1.0, 0);
    }
    controlsRef.current.update();
  }

  function handleViewTop() {
    if (!cameraRef.current || !controlsRef.current) return;
    cameraRef.current.position.set(0, 7.5, 0.1);
    controlsRef.current.target.set(0, 1.0, 0);
    controlsRef.current.update();
  }

  function handleZoom(factor) {
    if (!cameraRef.current || !controlsRef.current) return;
    cameraRef.current.position.multiplyScalar(factor);
    controlsRef.current.update();
  }

  return (
    <div
      ref={rootRef}
      className={
        isFullscreen
          ? "fixed inset-0 z-[9999] bg-stone-950 flex flex-col p-3 sm:p-5 w-screen h-screen overflow-hidden animate-in fade-in duration-200"
          : "bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm space-y-3 p-4 sm:p-5 relative"
      }
    >
      {/* Cabeçalho */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-lime-500 to-emerald-600 text-white flex items-center justify-center font-extrabold text-base shadow-md shadow-lime-200">
            3D
          </div>
          <div>
            <h4 className={`font-extrabold text-sm sm:text-base leading-tight ${isFullscreen ? "text-white" : "text-stone-800"}`}>
              {name} em Modelo 3D Interativo
            </h4>
            <p className={`text-xs ${isFullscreen ? "text-stone-400" : "text-stone-500"}`}>
              {isFullscreen ? "Modo Tela Toda — Gira e faz zoom para inspecionar cada detalhe" : "Gira com o dedo para ver as raízes e a axila foliar"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {spacingCm && (
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border shadow-2xs ${
              isFullscreen ? "bg-stone-900 border-stone-800 text-lime-400" : "bg-lime-50 border-lime-200 text-lime-800"
            }`}>
              <Ruler className="w-4 h-4" />
              <span>Espaçamento: {spacingCm}</span>
            </div>
          )}

          <button
            onClick={toggleFullscreen}
            className={`px-3.5 py-2 rounded-2xl text-xs font-bold flex items-center gap-1.5 shadow-md transition-all active:scale-95 ${
              isFullscreen
                ? "bg-rose-600 hover:bg-rose-700 text-white"
                : "bg-lime-600 hover:bg-lime-700 text-white"
            }`}
            title={isFullscreen ? "Sair da Tela Toda (Esc)" : "Ver em Tela Toda"}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            <span>{isFullscreen ? "Sair da Tela Toda" : "Tela Toda"}</span>
          </button>
        </div>
      </div>

      {/* Canvas 3D com Controles Flutuantes */}
      <div
        className={
          isFullscreen
            ? "relative flex-1 w-full rounded-2xl overflow-hidden bg-gradient-to-b from-stone-900 via-stone-950 to-black border border-stone-800 shadow-2xl"
            : "relative w-full h-80 sm:h-96 rounded-3xl overflow-hidden bg-gradient-to-b from-lime-50/60 via-emerald-50/20 to-teal-50/40 border border-lime-100 shadow-inner"
        }
      >
        <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing touch-none" />

        {/* Botões de Controlo Flutuantes */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10">
          <button
            onClick={toggleFullscreen}
            className={`p-2.5 rounded-2xl shadow-md border transition-all flex items-center gap-1 text-xs font-bold ${
              isFullscreen
                ? "bg-rose-600 text-white border-rose-700 hover:bg-rose-700"
                : "bg-lime-600 text-white border-lime-700 hover:bg-lime-700"
            }`}
            title={isFullscreen ? "Sair da Tela Toda" : "Ver em Tela Toda"}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            <span className="hidden sm:inline">{isFullscreen ? "Sair" : "Tela Toda"}</span>
          </button>

          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`p-2.5 rounded-2xl shadow-md border transition-all flex items-center gap-1 text-xs font-bold ${
              autoRotate ? "bg-lime-600 text-white border-lime-700" : "bg-white/95 text-stone-700 border-stone-200 hover:bg-white"
            }`}
            title="Girar Sozinho (360°)"
          >
            {autoRotate ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span className="hidden sm:inline">{autoRotate ? "Pausar" : "Girar"}</span>
          </button>

          <button
            onClick={handleResetFront}
            className="p-2.5 rounded-2xl bg-white/95 hover:bg-white text-stone-700 shadow-md border border-stone-200 transition-colors flex items-center gap-1 text-xs font-bold"
            title="Ver de Frente"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Frente</span>
          </button>

          <button
            onClick={handleViewTop}
            className="p-2.5 rounded-2xl bg-white/95 hover:bg-white text-stone-700 shadow-md border border-stone-200 transition-colors flex items-center gap-1 text-xs font-bold"
            title="Ver de Cima"
          >
            <Eye className="w-4 h-4 text-lime-700" />
            <span className="hidden sm:inline">De Cima</span>
          </button>

          <div className="flex gap-1">
            <button
              onClick={() => handleZoom(0.85)}
              className="p-2 flex-1 rounded-xl bg-white/95 hover:bg-white text-stone-700 shadow-md border border-stone-200 flex items-center justify-center font-bold"
              title="Aproximar (+)"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleZoom(1.18)}
              className="p-2 flex-1 rounded-xl bg-white/95 hover:bg-white text-stone-700 shadow-md border border-stone-200 flex items-center justify-center font-bold"
              title="Afastar (-)"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setShowLabels(!showLabels)}
            className={`p-2 rounded-2xl shadow-md border text-xs font-bold transition-all text-center ${
              showLabels ? "bg-amber-100 text-amber-900 border-amber-300" : "bg-white/95 text-stone-500 border-stone-200"
            }`}
          >
            {showLabels ? "🏷️ Ocultar Texto" : "🏷️ Ver Texto"}
          </button>
        </div>

        <div className="absolute bottom-3 left-3 right-3 pointer-events-none flex justify-center">
          <div className="bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl border-2 border-stone-200/80 shadow-lg flex flex-wrap items-center justify-center gap-4 text-xs font-bold pointer-events-auto">
            <div className="flex items-center gap-2 text-rose-700 bg-rose-50 px-2.5 py-1 rounded-xl border border-rose-200">
              <span className="w-3.5 h-3.5 rounded-full bg-rose-600 inline-block shadow-xs animate-pulse" />
              <span>✂️ VERMELHO = RETIRAR (Ladrão / Excesso)</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
              <span className="w-3.5 h-3.5 rounded-full bg-emerald-600 inline-block shadow-xs" />
              <span>🌿 VERDE = MANTER (Planta forte)</span>
            </div>
          </div>
        </div>
      </div>

      <div className={`border rounded-2xl p-3.5 flex items-center gap-3 text-xs ${isFullscreen ? "bg-stone-900 border-stone-800 text-stone-300" : "bg-amber-50/80 border-amber-200 text-amber-950"}`}>
        <span className="text-2xl shrink-0">💡</span>
        <div>
          <span className={`font-extrabold block ${isFullscreen ? "text-amber-400" : "text-amber-900"}`}>Como funciona este esquema de monda 3D:</span>
          <span className="leading-relaxed">
            Roda a planta para ver a raiz e a axila da folha. O que está a <b>vermelho ✂️</b> é o que se corta (ou com a tesoura rente ao chão ou partindo o ladrão com o polegar). O que está a <b>verde 🌿</b> é a planta que fica para crescer viçosa e saudável!
          </span>
        </div>
      </div>
    </div>
  );
}
