import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RotateCcw, Play, Pause, ZoomIn, ZoomOut, Eye, Sun, Scissors, CheckCircle2, Sparkles, HelpCircle, Maximize2, Minimize2 } from "lucide-react";

// --- GERADOR DE ETIQUETAS 3D FLUTUANTES (SUPER NÍTIDAS E À PROVA DE DÚVIDAS) ---
function createLabelSprite(text, {
  bgColor = "#ffffff",
  textColor = "#0f172a",
  borderColor = "#cbd5e1",
  icon = "",
  fontSize = 32,
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

  // 2x supersampling para ficar cristalino em telemóveis e ecrãs retina
  canvas.width = width * 2;
  canvas.height = height * 2;
  ctx.scale(2, 2);

  // Sombra do balão
  ctx.shadowColor = "rgba(0, 0, 0, 0.2)";
  ctx.shadowBlur = 8;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 3;

  // Fundo com cantos arredondados
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

  // Remover sombra para o texto ficar nítido
  ctx.shadowColor = "transparent";

  // Texto
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
    depthTest: false // Mantém sempre visível à frente sem ser tapado por ramos pequenos
  });

  const sprite = new THREE.Sprite(spriteMaterial);
  const scale = 0.0055;
  sprite.scale.set(width * scale, height * scale, 1);
  return sprite;
}

export default function Poda3DViewer({ diagramType = "cup_shape", name = "Árvore" }) {
  const rootRef = useRef(null);
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const reqIdRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);

  const [modelMode, setModelMode] = useState("canopy"); // 'canopy' | 'cut_angle'
  const [autoRotate, setAutoRotate] = useState(false); // por defeito parado para facilitar a leitura inicial
  const [showLabels, setShowLabels] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Atualizar visibilidade das etiquetas
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

    // 1. Cena
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0xf0fdf4); // Fundo verde pomar suave e acolhedor
    scene.fog = new THREE.FogExp2(0xf0fdf4, 0.035);

    // 2. Câmara
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    cameraRef.current = camera;
    if (modelMode === "cut_angle") {
      camera.position.set(0, 2.8, 5.5);
    } else {
      camera.position.set(0, 4.2, 8.0);
    }

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.replaceChildren(renderer.domElement);

    // 4. Controlos de Órbita 360°
    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.maxPolarAngle = Math.PI / 2 + 0.05; // não ir debaixo da terra
    controls.minDistance = 2.0;
    controls.maxDistance = 15;
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = 1.4;

    if (modelMode === "cut_angle") {
      controls.target.set(0, 1.4, 0);
    } else {
      controls.target.set(0, 2.2, 0);
    }
    controls.update();

    // 5. Luz Solar Calorosa de Pomar
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfffbeb, 2.4);
    sunLight.position.set(6, 14, 8);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    scene.add(sunLight);

    const skyFill = new THREE.DirectionalLight(0xbae6fd, 0.9);
    skyFill.position.set(-6, 5, -6);
    scene.add(skyFill);

    // 6. Canteiro de Pomar Bonito (Solo fértil + Relva com pedras)
    const orchardBed = new THREE.Group();
    scene.add(orchardBed);

    // Camada de terra escura
    const soilGeo = new THREE.CylinderGeometry(4.4, 4.6, 0.4, 36);
    const soilMat = new THREE.MeshStandardMaterial({ color: 0x543015, roughness: 0.95 });
    const soil = new THREE.Mesh(soilGeo, soilMat);
    soil.position.y = -0.2;
    soil.receiveShadow = true;
    orchardBed.add(soil);

    // Relva verde viçosa superior
    const grassGeo = new THREE.CylinderGeometry(4.35, 4.35, 0.06, 36);
    const grassMat = new THREE.MeshStandardMaterial({ color: 0x2e7d32, roughness: 0.8 });
    const grass = new THREE.Mesh(grassGeo, grassMat);
    grass.position.y = 0.01;
    grass.receiveShadow = true;
    orchardBed.add(grass);

    // Pequenas pedrinhas arredondadas decorativas na base
    const stoneMat = new THREE.MeshStandardMaterial({ color: 0xa8a29e, roughness: 0.7 });
    for (let i = 0; i < 7; i++) {
      const stoneGeo = new THREE.SphereGeometry(0.12 + (i % 3) * 0.04, 8, 8);
      stoneGeo.scale(1.2, 0.6, 1);
      const stone = new THREE.Mesh(stoneGeo, stoneMat);
      const ang = (i * Math.PI * 2) / 7 + 0.2;
      stone.position.set(Math.cos(ang) * 0.9, 0.06, Math.sin(ang) * 0.9);
      stone.castShadow = true;
      orchardBed.add(stone);
    }

    // 7. Grupo de Modelos da Árvore
    const treeGroup = new THREE.Group();
    scene.add(treeGroup);

    // Materiais Nobres
    const trunkMaterial = new THREE.MeshStandardMaterial({
      color: 0x5a381e,
      roughness: 0.85,
      metalness: 0.05
    });

    const keptBranchMaterial = new THREE.MeshStandardMaterial({
      color: 0x15803d, // Verde viçoso vivo
      roughness: 0.7,
      metalness: 0.1
    });

    const cutBranchMaterial = new THREE.MeshStandardMaterial({
      color: 0xef4444, // Vermelho rubro evidente
      roughness: 0.35,
      emissive: 0xb91c1c,
      emissiveIntensity: 0.4
    });

    const leafMaterial = new THREE.MeshStandardMaterial({
      color: 0x22c55e,
      roughness: 0.5,
      side: THREE.DoubleSide
    });

    const fruitMaterial = new THREE.MeshStandardMaterial({
      color: 0xdc2626, // Maçã vermelha
      roughness: 0.25,
      metalness: 0.1
    });

    // Helper para criar ramos
    function createBranch(p1, p2, radius1, radius2, material) {
      const dir = new THREE.Vector3().subVectors(p2, p1);
      const len = dir.length();
      const geom = new THREE.CylinderGeometry(radius2, radius1, len, 14);
      const mesh = new THREE.Mesh(geom, material);
      mesh.castShadow = true;
      mesh.receiveShadow = true;

      mesh.position.copy(p1).addScaledVector(dir, 0.5);
      mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
      return mesh;
    }

    // Helper para criar uma tesoura 3D elegante no ponto de corte
    function addShearsMarker(pos, rotationY = 0) {
      const shearsGroup = new THREE.Group();

      // Duas lâminas cruzadas prateadas
      const bladeGeo = new THREE.BoxGeometry(0.04, 0.35, 0.02);
      const bladeMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9, roughness: 0.2 });

      const b1 = new THREE.Mesh(bladeGeo, bladeMat);
      b1.rotation.z = Math.PI / 4;
      shearsGroup.add(b1);

      const b2 = new THREE.Mesh(bladeGeo, bladeMat);
      b2.rotation.z = -Math.PI / 4;
      shearsGroup.add(b2);

      // Dois aros vermelhos da tesoura
      const ringGeo = new THREE.TorusGeometry(0.06, 0.02, 6, 12);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });

      const r1 = new THREE.Mesh(ringGeo, ringMat);
      r1.position.set(-0.14, -0.15, 0);
      shearsGroup.add(r1);

      const r2 = new THREE.Mesh(ringGeo, ringMat);
      r2.position.set(0.14, -0.15, 0);
      shearsGroup.add(r2);

      // Anel circular de corte na madeira
      const cutRing = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.03, 8, 20), new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true }));
      cutRing.rotation.x = Math.PI / 2;
      shearsGroup.add(cutRing);

      shearsGroup.position.copy(pos);
      shearsGroup.rotation.y = rotationY;
      treeGroup.add(shearsGroup);
    }

    // Helper para adicionar tufo de folhas com fruta
    function addFoliageCluster(pos, fruitColor = 0xdc2626) {
      const cluster = new THREE.Group();
      for (let i = 0; i < 4; i++) {
        const leafGeo = new THREE.SphereGeometry(0.24, 8, 6);
        leafGeo.scale(1.2, 0.1, 1.8);
        const leaf = new THREE.Mesh(leafGeo, leafMaterial);
        const ang = (i * Math.PI) / 2;
        leaf.position.set(Math.cos(ang) * 0.18, 0, Math.sin(ang) * 0.18);
        leaf.rotation.y = ang;
        leaf.rotation.x = 0.2;
        cluster.add(leaf);
      }

      // Fruto 3D pendurado
      const fruitGeo = new THREE.SphereGeometry(0.16, 16, 14);
      fruitGeo.scale(1, 0.95, 1);
      const fruitMat = new THREE.MeshStandardMaterial({ color: fruitColor, roughness: 0.3 });
      const fruit = new THREE.Mesh(fruitGeo, fruitMat);
      fruit.position.set(0, -0.15, 0);
      fruit.castShadow = true;
      cluster.add(fruit);

      cluster.position.copy(pos);
      treeGroup.add(cluster);
    }

    // ==========================================
    // CONSTRUÇÃO CONFORME O MODO
    // ==========================================
    if (modelMode === "cut_angle") {
      // --- MODELO 3D DO CORTE EM BISEL A 45° (DETALHADO E NÍTIDO) ---
      orchardBed.visible = false;

      // Haste de madeira principal
      const stemMesh = createBranch(new THREE.Vector3(0, -0.5, 0), new THREE.Vector3(0, 2.2, 0), 0.42, 0.38, trunkMaterial);
      treeGroup.add(stemMesh);

      // Corte chanfrado a 45° realista
      const bevelTop = createBranch(new THREE.Vector3(0, 2.2, 0), new THREE.Vector3(0.35, 2.7, 0), 0.38, 0.34, keptBranchMaterial);
      bevelTop.rotation.z = -Math.PI / 4;
      treeGroup.add(bevelTop);

      // Superfície plana do corte em bisel (madeira viva alva com miolo)
      const cutSurfaceGeo = new THREE.CircleGeometry(0.42, 32);
      const cutSurfaceMat = new THREE.MeshStandardMaterial({
        color: 0xdcfce7, // Madeira fresca esverdeada/alva
        roughness: 0.3
      });
      const cutSurface = new THREE.Mesh(cutSurfaceGeo, cutSurfaceMat);
      cutSurface.position.set(0.16, 2.45, 0);
      cutSurface.rotation.x = Math.PI / 2;
      cutSurface.rotation.y = -Math.PI / 4;
      treeGroup.add(cutSurface);

      // Gema exterior na lateral direita (5 mm abaixo)
      const budGeo = new THREE.ConeGeometry(0.18, 0.45, 16);
      const budMat = new THREE.MeshStandardMaterial({ color: 0x65a30d, roughness: 0.4 });
      const bud = new THREE.Mesh(budGeo, budMat);
      bud.position.set(0.42, 1.85, 0);
      bud.rotation.z = -Math.PI / 3;
      treeGroup.add(bud);

      // Gotas de água escorrendo para o lado oposto (esquerdo)
      const waterMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.1, metalness: 0.7 });
      [-0.38, -0.42, -0.36].forEach((x, idx) => {
        const drop = new THREE.Mesh(new THREE.SphereGeometry(0.09, 12, 12), waterMat);
        drop.position.set(x, 2.2 - idx * 0.45, 0.05);
        treeGroup.add(drop);
      });

      // ETIQUETAS FLUTUANTES 3D (À PROVA DE AVÓS)
      if (showLabels) {
        // Etiqueta 1: Corte Correto a 45°
        const l1 = createLabelSprite("CORTE A 45° (Bisel Perfeito)", {
          bgColor: "#15803d",
          textColor: "#ffffff",
          borderColor: "#22c55e",
          icon: "✅"
        });
        l1.position.set(0.1, 3.2, 0);
        treeGroup.add(l1);

        // Etiqueta 2: Gema Exterior Preservada
        const l2 = createLabelSprite("Gema voltada para fora (5 mm abaixo)", {
          bgColor: "#ecfdf5",
          textColor: "#047857",
          borderColor: "#6ee7b7",
          icon: "🌿"
        });
        l2.position.set(1.9, 1.85, 0);
        treeGroup.add(l2);

        // Etiqueta 3: Água a escorrer
        const l3 = createLabelSprite("Água da chuva escorre para longe da gema", {
          bgColor: "#f0f9ff",
          textColor: "#0369a1",
          borderColor: "#7dd3fc",
          icon: "💧"
        });
        l3.position.set(-1.8, 1.6, 0);
        treeGroup.add(l3);
      }
    } else {
      // --- MODELO 3D DA COPA DA ÁRVORE (VISUAL RICO E EXPLÍCITO) ---
      orchardBed.visible = true;

      if (diagramType === "grapevine_winter" || diagramType === "grapevine_green") {
        // --- VIDEIRA EM CORDÃO COM TALÕES DE 2 GOMOS ---
        const trunk = createBranch(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0.05, 1.6, 0), 0.24, 0.18, trunkMaterial);
        treeGroup.add(trunk);

        // Arame de suporte metálico
        const wireGeo = new THREE.CylinderGeometry(0.015, 0.015, 8.0, 8);
        const wireMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.9 });
        const wire = new THREE.Mesh(wireGeo, wireMat);
        wire.position.set(0, 1.6, 0);
        wire.rotation.z = Math.PI / 2;
        treeGroup.add(wire);

        // Braços horizontais
        const armL = createBranch(new THREE.Vector3(0.05, 1.6, 0), new THREE.Vector3(-2.2, 1.62, 0), 0.16, 0.12, trunkMaterial);
        const armR = createBranch(new THREE.Vector3(0.05, 1.6, 0), new THREE.Vector3(2.2, 1.58, 0), 0.16, 0.12, trunkMaterial);
        treeGroup.add(armL);
        treeGroup.add(armR);

        // Talões verdes de 2 gomos (Mantidos)
        [-1.4, -0.6, 0.6, 1.5].forEach((x) => {
          const spur = createBranch(new THREE.Vector3(x, 1.6, 0), new THREE.Vector3(x + 0.1, 2.2, 0.1), 0.09, 0.06, keptBranchMaterial);
          treeGroup.add(spur);

          // Cacho de uvas 3D
          const grapeMat = new THREE.MeshStandardMaterial({ color: 0x7c3aed, roughness: 0.3 });
          const grape = new THREE.Mesh(new THREE.SphereGeometry(0.15, 12, 12), grapeMat);
          grape.position.set(x + 0.1, 1.45, 0.18);
          treeGroup.add(grape);
        });

        // Varas velhas compridas (Vermelhas - Cortar!)
        [-1.0, 0.0, 1.1].forEach((x, i) => {
          const oldCane = createBranch(new THREE.Vector3(x, 1.6, 0), new THREE.Vector3(x - 0.25, 3.6, 0.2), 0.09, 0.04, cutBranchMaterial);
          treeGroup.add(oldCane);
          addShearsMarker(new THREE.Vector3(x - 0.05, 1.75, 0.05), i);
        });

        // Ladrão do tronco (Vermelho - Cortar!)
        const trunkSucker = createBranch(new THREE.Vector3(0.05, 0.6, 0), new THREE.Vector3(0.8, 1.1, 0.3), 0.09, 0.04, cutBranchMaterial);
        treeGroup.add(trunkSucker);
        addShearsMarker(new THREE.Vector3(0.18, 0.68, 0.08));

        // ETIQUETAS FLUTUANTES
        if (showLabels) {
          const lCut = createLabelSprite("CORTAR: Varas Velhas & Ladrões", {
            bgColor: "#dc2626",
            textColor: "#ffffff",
            borderColor: "#b91c1c",
            icon: "✂️"
          });
          lCut.position.set(0, 3.9, 0.2);
          treeGroup.add(lCut);

          const lKeep = createLabelSprite("MANTER: Talões com 2 Gomos", {
            bgColor: "#15803d",
            textColor: "#ffffff",
            borderColor: "#16a34a",
            icon: "🌿"
          });
          lKeep.position.set(-1.4, 2.5, 0);
          treeGroup.add(lKeep);
        }
      } else {
        // --- COPA EM TAÇA ABERTA PADRÃO (MACIEIRA, PEREIRA, PESSEGUEIRO, CITRINOS, ETC.) ---
        // Tronco forte com conicidade
        const trunk = createBranch(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 1.4, 0), 0.35, 0.26, trunkMaterial);
        treeGroup.add(trunk);

        // 4 Pernadas mestras abertas a 45° para fora (Formato Cálice/Taça - Mantidas a Verde)
        const angles = [Math.PI / 4, (3 * Math.PI) / 4, (5 * Math.PI) / 4, (7 * Math.PI) / 4];
        angles.forEach((ang, i) => {
          const x = Math.cos(ang) * 1.9;
          const z = Math.sin(ang) * 1.9;
          const scaf = createBranch(new THREE.Vector3(0, 1.4, 0), new THREE.Vector3(x, 2.6, z), 0.17, 0.11, keptBranchMaterial);
          treeGroup.add(scaf);

          // Sub-ramo com folhas e fruta
          const tipX = x * 1.35;
          const tipZ = z * 1.35;
          const sub = createBranch(new THREE.Vector3(x, 2.6, z), new THREE.Vector3(tipX, 3.2, tipZ), 0.1, 0.05, keptBranchMaterial);
          treeGroup.add(sub);

          // Folhagem e frutos vermelhos
          addFoliageCluster(new THREE.Vector3(tipX, 3.2, tipZ), i % 2 === 0 ? 0xdc2626 : 0xea580c);
        });

        // 1. RAMO LADRÃO VERTICAL CENTRAL (Chupão - Vermelho - Cortar!)
        const sucker1 = createBranch(new THREE.Vector3(0.15, 1.45, 0.05), new THREE.Vector3(0.2, 4.3, 0.1), 0.13, 0.05, cutBranchMaterial);
        treeGroup.add(sucker1);
        addShearsMarker(new THREE.Vector3(0.17, 1.7, 0.07), 0);

        const sucker2 = createBranch(new THREE.Vector3(-0.15, 1.45, -0.05), new THREE.Vector3(-0.3, 4.0, -0.2), 0.12, 0.05, cutBranchMaterial);
        treeGroup.add(sucker2);
        addShearsMarker(new THREE.Vector3(-0.18, 1.7, -0.08), 1);

        // 2. RAMO CRUZADO INTERIOR (Vermelho - Cortar!)
        const cross = createBranch(new THREE.Vector3(1.1, 2.3, 0.8), new THREE.Vector3(-0.8, 2.7, -0.5), 0.11, 0.04, cutBranchMaterial);
        treeGroup.add(cross);
        addShearsMarker(new THREE.Vector3(0.9, 2.35, 0.65), 2);

        // 3. REBENTO BASAL DE RAIZ (Vermelho - Cortar!)
        const basal = createBranch(new THREE.Vector3(0.1, 0.2, 0.2), new THREE.Vector3(1.0, 1.2, 0.7), 0.1, 0.04, cutBranchMaterial);
        treeGroup.add(basal);
        addShearsMarker(new THREE.Vector3(0.25, 0.4, 0.3), 3);

        // ETIQUETAS 3D VISÍVEIS EM QUALQUER ÂNGULO
        if (showLabels) {
          // Etiqueta Ladrão Central
          const lSucker = createLabelSprite("CORTAR: Ramo Ladrão (Rouba força à fruta!)", {
            bgColor: "#dc2626",
            textColor: "#ffffff",
            borderColor: "#b91c1c",
            icon: "✂️"
          });
          lSucker.position.set(0.2, 4.6, 0.1);
          treeGroup.add(lSucker);

          // Etiqueta Ramo com Fruta
          const lFruit = createLabelSprite("MANTER: Ramo com Fruto e Luz", {
            bgColor: "#15803d",
            textColor: "#ffffff",
            borderColor: "#22c55e",
            icon: "🌿"
          });
          lFruit.position.set(2.4, 3.4, 2.0);
          treeGroup.add(lFruit);

          // Etiqueta Centro Aberto
          const lCenter = createLabelSprite("CENTRO ABERTO (Para entrar o sol)", {
            bgColor: "#fef3c7",
            textColor: "#92400e",
            borderColor: "#f59e0b",
            icon: "☀️"
          });
          lCenter.position.set(0, 2.3, 0);
          treeGroup.add(lCenter);
        }
      }
    }

    // Loop de Renderização & Animação
    let clock = new THREE.Clock();
    function animate() {
      reqIdRef.current = requestAnimationFrame(animate);
      controls.update();

      const time = clock.getElapsedTime();
      // Brilho pulsante suave nos ramos a cortar
      cutBranchMaterial.emissiveIntensity = 0.3 + 0.25 * Math.sin(time * 3.5);

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
  }, [diagramType, modelMode, autoRotate, showLabels]);

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

  // Funções de Controlo Simples de Câmara (Botões Grandes para Qualquer Utilizador)
  function handleResetFront() {
    if (!cameraRef.current || !controlsRef.current) return;
    if (modelMode === "cut_angle") {
      cameraRef.current.position.set(0, 2.8, 5.5);
      controlsRef.current.target.set(0, 1.4, 0);
    } else {
      cameraRef.current.position.set(0, 3.8, 8.0);
      controlsRef.current.target.set(0, 2.2, 0);
    }
    controlsRef.current.update();
  }

  function handleViewTop() {
    if (!cameraRef.current || !controlsRef.current) return;
    cameraRef.current.position.set(0, 9.0, 0.1);
    controlsRef.current.target.set(0, 1.8, 0);
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
      {/* Cabeçalho de Seleção Simples */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-700 text-white flex items-center justify-center font-extrabold text-base shadow-md shadow-emerald-200">
            3D
          </div>
          <div>
            <h4 className={`font-extrabold text-sm sm:text-base leading-tight ${isFullscreen ? "text-white" : "text-stone-800"}`}>
              {name} em Modelo 3D Interativo
            </h4>
            <p className={`text-xs ${isFullscreen ? "text-stone-400" : "text-stone-500"}`}>
              {isFullscreen ? "Modo Tela Toda — Gira e faz zoom para inspecionar cada detalhe" : "Gira com o dedo ou rato para ver todos os lados"}
            </p>
          </div>
        </div>

        {/* Alternador de Visão & Botão de Tela Toda */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className={`flex items-center gap-1.5 p-1.5 rounded-2xl border ${isFullscreen ? "bg-stone-900 border-stone-800" : "bg-stone-100 border-stone-200"}`}>
            <button
              onClick={() => setModelMode("canopy")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                modelMode === "canopy"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : isFullscreen ? "text-stone-300 hover:text-white" : "text-stone-600 hover:text-stone-900"
              }`}
            >
              🌳 Árvore Completa
            </button>
            <button
              onClick={() => setModelMode("cut_angle")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                modelMode === "cut_angle"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : isFullscreen ? "text-stone-300 hover:text-white" : "text-stone-600 hover:text-stone-900"
              }`}
            >
              📐 Corte a 45°
            </button>
          </div>

          <button
            onClick={toggleFullscreen}
            className={`px-3.5 py-2 rounded-2xl text-xs font-bold flex items-center gap-1.5 shadow-md transition-all active:scale-95 ${
              isFullscreen
                ? "bg-rose-600 hover:bg-rose-700 text-white"
                : "bg-emerald-600 hover:bg-emerald-700 text-white"
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
            : "relative w-full h-80 sm:h-96 rounded-3xl overflow-hidden bg-gradient-to-b from-emerald-50/60 via-green-50/20 to-lime-50/40 border border-emerald-100 shadow-inner"
        }
      >
        <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing touch-none" />

        {/* Botões Grandes e Fáceis de Usar (no canto superior direito) */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10">
          <button
            onClick={toggleFullscreen}
            className={`p-2.5 rounded-2xl shadow-md border transition-all flex items-center gap-1 text-xs font-bold ${
              isFullscreen
                ? "bg-rose-600 text-white border-rose-700 hover:bg-rose-700"
                : "bg-emerald-600 text-white border-emerald-700 hover:bg-emerald-700"
            }`}
            title={isFullscreen ? "Sair da Tela Toda (Esc)" : "Ver em Tela Toda"}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            <span className="hidden sm:inline">{isFullscreen ? "Sair" : "Tela Toda"}</span>
          </button>

          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`p-2.5 rounded-2xl shadow-md border transition-all flex items-center gap-1 text-xs font-bold ${
              autoRotate ? "bg-emerald-600 text-white border-emerald-700" : "bg-white/95 text-stone-700 border-stone-200 hover:bg-white"
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
            title="Ver de Cima (Copa Aberta)"
          >
            <Eye className="w-4 h-4 text-emerald-600" />
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

        {/* Caixa de Legenda Clara e Grande "À Prova de Dúvidas" no Fundo */}
        <div className="absolute bottom-3 left-3 right-3 pointer-events-none flex justify-center">
          <div className="bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl border-2 border-stone-200/80 shadow-lg flex flex-wrap items-center justify-center gap-4 text-xs font-bold pointer-events-auto">
            <div className="flex items-center gap-2 text-rose-700 bg-rose-50 px-2.5 py-1 rounded-xl border border-rose-200">
              <span className="w-3.5 h-3.5 rounded-full bg-rose-600 inline-block shadow-xs animate-pulse" />
              <span>✂️ VERMELHO = CORTAR (Ladrões)</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
              <span className="w-3.5 h-3.5 rounded-full bg-emerald-600 inline-block shadow-xs" />
              <span>🌿 VERDE = MANTER (Dá fruta!)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cartão de Ajuda Simples */}
      <div className={`border rounded-2xl p-3.5 flex items-center gap-3 text-xs ${isFullscreen ? "bg-stone-900 border-stone-800 text-stone-300" : "bg-amber-50/80 border-amber-200 text-amber-950"}`}>
        <span className="text-2xl shrink-0">💡</span>
        <div>
          <span className={`font-extrabold block ${isFullscreen ? "text-amber-400" : "text-amber-900"}`}>Como funciona este esquema 3D:</span>
          <span className="leading-relaxed">
            Roda a árvore até veres o centro livre! Os ramos a <b>vermelho com a tesoura ✂️</b> são os que deves cortar porque roubam força. Os ramos a <b>verde 🌿</b> são os que ficam para dar fruta doce.
          </span>
        </div>
      </div>
    </div>
  );
}
