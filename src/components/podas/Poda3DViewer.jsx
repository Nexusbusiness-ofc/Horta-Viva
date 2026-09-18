import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RotateCcw, Play, Pause, Maximize2, Scissors, CheckCircle2, XCircle, Info, Sparkles } from "lucide-react";

export default function Poda3DViewer({ diagramType = "cup_shape", name = "Árvore" }) {
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const reqIdRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);

  const [modelMode, setModelMode] = useState("canopy"); // 'canopy' | 'cut_angle'
  const [autoRotate, setAutoRotate] = useState(true);
  const [highlightCuts, setHighlightCuts] = useState(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 360;
    const height = container.clientHeight || 320;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0xf8fafc); // Stone 50 suave

    // Fog suave para profundidade
    scene.fog = new THREE.FogExp2(0xf8fafc, 0.04);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    cameraRef.current = camera;
    if (modelMode === "cut_angle") {
      camera.position.set(0, 3, 6);
    } else {
      camera.position.set(0, 4.5, 8.5);
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
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 + 0.1; // não descer abaixo do chão
    controls.minDistance = 2;
    controls.maxDistance = 16;
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = 1.6;

    if (modelMode === "cut_angle") {
      controls.target.set(0, 1.5, 0);
    } else {
      controls.target.set(0, 2.5, 0);
    }
    controls.update();

    // 5. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfffaed, 2.2);
    dirLight.position.set(6, 12, 8);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    scene.add(dirLight);

    const fillLight = new THREE.DirectionalLight(0xbae6fd, 0.8);
    fillLight.position.set(-6, 4, -6);
    scene.add(fillLight);

    // 6. Ground / Solo Circular
    const groundGeo = new THREE.CylinderGeometry(4.5, 4.8, 0.3, 32);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x78350f,
      roughness: 0.9,
      metalness: 0.1
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.position.y = -0.15;
    ground.receiveShadow = true;
    scene.add(ground);

    // Relva/Terra superior
    const grassGeo = new THREE.CylinderGeometry(4.45, 4.45, 0.05, 32);
    const grassMat = new THREE.MeshStandardMaterial({
      color: 0x3f6212,
      roughness: 0.8
    });
    const grass = new THREE.Mesh(grassGeo, grassMat);
    grass.position.y = 0.02;
    grass.receiveShadow = true;
    scene.add(grass);

    // 7. CONSTRUÇÃO DO MODELO 3D
    const treeGroup = new THREE.Group();
    scene.add(treeGroup);

    // Materiais
    const barkMaterial = new THREE.MeshStandardMaterial({
      color: 0x5c3818,
      roughness: 0.85,
      metalness: 0.05
    });

    const keptBranchMaterial = new THREE.MeshStandardMaterial({
      color: 0x15803d,
      roughness: 0.7,
      metalness: 0.1
    });

    const cutBranchMaterial = new THREE.MeshStandardMaterial({
      color: 0xef4444, // Vermelho brilhante
      roughness: 0.4,
      metalness: 0.2,
      emissive: 0x7f1d1d,
      emissiveIntensity: 0.3
    });

    const cutRingMaterial = new THREE.MeshBasicMaterial({
      color: 0xff2222,
      wireframe: true
    });

    const budMaterial = new THREE.MeshStandardMaterial({
      color: 0x84cc16,
      roughness: 0.5
    });

    const leafMaterial = new THREE.MeshStandardMaterial({
      color: 0x22c55e,
      roughness: 0.6,
      side: THREE.DoubleSide
    });

    // Função auxiliar para criar ramo cilíndrico orientado entre 2 pontos
    function createBranch(p1, p2, radius1, radius2, material) {
      const dir = new THREE.Vector3().subVectors(p2, p1);
      const len = dir.length();
      const geom = new THREE.CylinderGeometry(radius2, radius1, len, 12);
      const mesh = new THREE.Mesh(geom, material);
      mesh.castShadow = true;
      mesh.receiveShadow = true;

      // Orientação
      mesh.position.copy(p1).addScaledVector(dir, 0.5);
      mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
      return mesh;
    }

    // Função para adicionar anel de corte (marcador onde serrar/tesourar)
    function addCutMarker(pos, normal, radius = 0.18) {
      const ringGeo = new THREE.TorusGeometry(radius, 0.04, 8, 24);
      const ringMesh = new THREE.Mesh(ringGeo, cutRingMaterial);
      ringMesh.position.copy(pos);
      ringMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal.clone().normalize());
      treeGroup.add(ringMesh);

      // Ícone pequeno flutuante ou esfera vermelha
      const dotGeo = new THREE.SphereGeometry(0.08, 12, 12);
      const dotMesh = new THREE.Mesh(dotGeo, new THREE.MeshBasicMaterial({ color: 0xff0000 }));
      dotMesh.position.copy(pos);
      treeGroup.add(dotMesh);
    }

    if (modelMode === "cut_angle") {
      // --- MODELO 3D ESPECÍFICO DO CORTE EM BISEL A 45° ---
      ground.visible = false;
      grass.visible = false;

      // Base do ramo vertical
      const stemGeo = new THREE.CylinderGeometry(0.5, 0.52, 3.2, 32);
      const stemMesh = new THREE.Mesh(stemGeo, barkMaterial);
      stemMesh.position.y = 1.0;
      stemMesh.castShadow = true;
      treeGroup.add(stemMesh);

      // Corte biselado a 45° no topo (usando um plano inclinado no topo)
      const bevelTopGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.6, 32);
      const bevelMesh = new THREE.Mesh(bevelTopGeo, keptBranchMaterial);
      bevelMesh.position.set(0, 2.7, 0);
      bevelMesh.rotation.z = -Math.PI / 4; // 45 graus
      treeGroup.add(bevelMesh);

      // Plano da superfície de corte (verde sã)
      const cutFaceGeo = new THREE.CircleGeometry(0.52, 32);
      const cutFaceMat = new THREE.MeshStandardMaterial({
        color: 0x86efac,
        roughness: 0.4
      });
      const cutFace = new THREE.Mesh(cutFaceGeo, cutFaceMat);
      cutFace.position.set(0.18, 2.8, 0);
      cutFace.rotation.x = Math.PI / 2;
      cutFace.rotation.y = -Math.PI / 4;
      treeGroup.add(cutFace);

      // Gema exterior na lateral direita (5 mm abaixo do corte)
      const budGeo = new THREE.ConeGeometry(0.2, 0.45, 16);
      const bud = new THREE.Mesh(budGeo, budMaterial);
      bud.position.set(0.5, 2.3, 0);
      bud.rotation.z = -Math.PI / 3;
      treeGroup.add(bud);

      // Gotas de água 3D escorrendo para o lado oposto (lado esquerdo)
      const dropMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.1, metalness: 0.8 });
      [-0.4, -0.45, -0.42].forEach((x, i) => {
        const drop = new THREE.Mesh(new THREE.SphereGeometry(0.08, 12, 12), dropMat);
        drop.position.set(x, 2.5 - i * 0.4, 0.1);
        treeGroup.add(drop);
      });
    } else {
      // --- MODELO 3D DA COPA / ÁRVORE COMPLETA ---
      if (diagramType === "grapevine_winter" || diagramType === "grapevine_green") {
        // --- VINHA (CORDAO ROYAT / GUYOT) ---
        // Tronco tortuoso
        const trunkMesh = createBranch(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0.1, 1.8, 0), 0.22, 0.18, barkMaterial);
        treeGroup.add(trunkMesh);

        // Arame de suporte horizontal
        const wireGeo = new THREE.CylinderGeometry(0.015, 0.015, 7.5, 8);
        const wireMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9, roughness: 0.2 });
        const wire = new THREE.Mesh(wireGeo, wireMat);
        wire.position.set(0, 1.8, 0);
        wire.rotation.z = Math.PI / 2;
        treeGroup.add(wire);

        // Braço horizontal aramado
        const armLeft = createBranch(new THREE.Vector3(0.1, 1.8, 0), new THREE.Vector3(-1.8, 1.82, 0), 0.16, 0.12, barkMaterial);
        const armRight = createBranch(new THREE.Vector3(0.1, 1.8, 0), new THREE.Vector3(2.0, 1.78, 0), 0.16, 0.12, barkMaterial);
        treeGroup.add(armLeft);
        treeGroup.add(armRight);

        // Talões produtivos de 2 gomos (Verdes - Mantidos)
        [-1.3, -0.6, 0.7, 1.5].forEach((x) => {
          const spur = createBranch(new THREE.Vector3(x, 1.8, 0), new THREE.Vector3(x + 0.1, 2.4, 0.1), 0.08, 0.06, keptBranchMaterial);
          treeGroup.add(spur);

          // 2 gomos
          const b1 = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), budMaterial);
          b1.position.set(x + 0.05, 2.05, 0.15);
          treeGroup.add(b1);

          const b2 = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), budMaterial);
          b2.position.set(x + 0.08, 2.28, 0.15);
          treeGroup.add(b2);
        });

        // Varas compridas velhas do ano anterior (Vermelhas - Cortar!)
        [-1.0, 0.0, 1.1].forEach((x) => {
          const oldCane = createBranch(new THREE.Vector3(x, 1.8, 0), new THREE.Vector3(x - 0.2, 3.4, 0.3), 0.09, 0.04, cutBranchMaterial);
          treeGroup.add(oldCane);
          addCutMarker(new THREE.Vector3(x - 0.03, 1.9, 0.05), new THREE.Vector3(0, 1, 0), 0.14);
        });

        // Ladrão do tronco (Vermelho)
        const trunkSucker = createBranch(new THREE.Vector3(0.05, 0.6, 0), new THREE.Vector3(0.6, 1.1, 0.2), 0.08, 0.04, cutBranchMaterial);
        treeGroup.add(trunkSucker);
        addCutMarker(new THREE.Vector3(0.12, 0.68, 0.03), new THREE.Vector3(1, 0.5, 0), 0.12);
      } else if (diagramType === "citrus") {
        // --- CITRINOS (GUARDA-CHUVA ILUMINADO & SAIA LIMPA) ---
        // Tronco limpo até 1.4m
        const trunk = createBranch(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 1.5, 0), 0.28, 0.22, barkMaterial);
        treeGroup.add(trunk);

        // Pernadas mestras exteriores em guarda-chuva
        const angles = [0, (2 * Math.PI) / 5, (4 * Math.PI) / 5, (6 * Math.PI) / 5, (8 * Math.PI) / 5];
        angles.forEach((ang) => {
          const x = Math.cos(ang) * 1.8;
          const z = Math.sin(ang) * 1.8;
          const scaf = createBranch(new THREE.Vector3(0, 1.5, 0), new THREE.Vector3(x, 2.3, z), 0.14, 0.09, keptBranchMaterial);
          treeGroup.add(scaf);

          // Folhagem e frutos na periferia
          const sub1 = createBranch(new THREE.Vector3(x, 2.3, z), new THREE.Vector3(x * 1.3, 2.8, z * 1.3), 0.08, 0.04, keptBranchMaterial);
          treeGroup.add(sub1);

          // Laranja 3D esférica
          const orange = new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 16), new THREE.MeshStandardMaterial({ color: 0xea580c, roughness: 0.3 }));
          orange.position.set(x * 1.25, 2.3, z * 1.25);
          orange.castShadow = true;
          treeGroup.add(orange);
        });

        // Chupão / Ladrão vertical que brota do miolo (Vermelho - A cortar!)
        const sucker1 = createBranch(new THREE.Vector3(0.05, 1.5, 0), new THREE.Vector3(0.1, 3.8, 0.1), 0.12, 0.06, cutBranchMaterial);
        treeGroup.add(sucker1);
        addCutMarker(new THREE.Vector3(0.06, 1.68, 0.02), new THREE.Vector3(0, 1, 0), 0.18);

        // Ramo rasteiro da saia que cai abaixo de 35 cm (Vermelho - A cortar!)
        const lowBranch = createBranch(new THREE.Vector3(0.1, 0.8, 0), new THREE.Vector3(1.2, 0.25, 0.3), 0.1, 0.04, cutBranchMaterial);
        treeGroup.add(lowBranch);
        addCutMarker(new THREE.Vector3(0.2, 0.75, 0.05), new THREE.Vector3(1, -0.5, 0), 0.15);
      } else {
        // --- PADRÃO GERAL: COPA EM TAÇA ABERTA (Macieira, Pereira, Pessegueiro, etc.) ---
        // Tronco robusto
        const trunk = createBranch(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 1.4, 0), 0.32, 0.25, barkMaterial);
        treeGroup.add(trunk);

        // 4 Pernadas mestras abertas a 45° para fora (Taça Verde - Mantidas)
        const scafAngles = [Math.PI / 4, (3 * Math.PI) / 4, (5 * Math.PI) / 4, (7 * Math.PI) / 4];
        scafAngles.forEach((ang) => {
          const x = Math.cos(ang) * 1.9;
          const z = Math.sin(ang) * 1.9;
          const scaf = createBranch(new THREE.Vector3(0, 1.4, 0), new THREE.Vector3(x, 2.7, z), 0.16, 0.1, keptBranchMaterial);
          treeGroup.add(scaf);

          // Sub-ramos de produção com botões
          const subX = x * 1.4 + Math.sin(ang) * 0.4;
          const subZ = z * 1.4 - Math.cos(ang) * 0.4;
          const sub = createBranch(new THREE.Vector3(x, 2.7, z), new THREE.Vector3(subX, 3.4, subZ), 0.09, 0.05, keptBranchMaterial);
          treeGroup.add(sub);

          // Folhinhas/botões florais no sub-ramo
          for (let i = 0; i < 3; i++) {
            const bud = new THREE.Mesh(new THREE.SphereGeometry(0.07, 10, 10), budMaterial);
            bud.position.lerpVectors(new THREE.Vector3(x, 2.7, z), new THREE.Vector3(subX, 3.4, subZ), (i + 1) / 4);
            bud.position.x += 0.05 * (i % 2 === 0 ? 1 : -1);
            treeGroup.add(bud);
          }
        });

        // 1. RAMOS LADRÕES VERTICAIS (Vermelhos - Cortar!)
        const sucker1 = createBranch(new THREE.Vector3(0.2, 1.45, 0.1), new THREE.Vector3(0.25, 4.2, 0.15), 0.12, 0.05, cutBranchMaterial);
        treeGroup.add(sucker1);
        addCutMarker(new THREE.Vector3(0.21, 1.6, 0.11), new THREE.Vector3(0, 1, 0), 0.16);

        const sucker2 = createBranch(new THREE.Vector3(-0.2, 1.45, -0.1), new THREE.Vector3(-0.35, 3.9, -0.2), 0.11, 0.05, cutBranchMaterial);
        treeGroup.add(sucker2);
        addCutMarker(new THREE.Vector3(-0.23, 1.6, -0.12), new THREE.Vector3(0, 1, 0), 0.15);

        // 2. RAMO CRUZADO AO CENTRO (Vermelho - Cortar!)
        const crossBranch = createBranch(new THREE.Vector3(1.2, 2.3, 0.8), new THREE.Vector3(-0.9, 2.8, -0.6), 0.1, 0.04, cutBranchMaterial);
        treeGroup.add(crossBranch);
        addCutMarker(new THREE.Vector3(1.0, 2.35, 0.7), new THREE.Vector3(-1, 0.5, -1), 0.14);

        // 3. LADRÃO BASAL NA BASE DO TRONCO (Vermelho - Cortar!)
        const baseSucker = createBranch(new THREE.Vector3(0.1, 0.2, 0.2), new THREE.Vector3(0.9, 1.2, 0.7), 0.1, 0.04, cutBranchMaterial);
        treeGroup.add(baseSucker);
        addCutMarker(new THREE.Vector3(0.2, 0.35, 0.25), new THREE.Vector3(1, 1, 1), 0.14);
      }
    }

    // Loop de renderização com animação
    let clock = new THREE.Clock();
    function animate() {
      reqIdRef.current = requestAnimationFrame(animate);

      // Rotação suave se ativada
      controls.update();

      // Pulsação suave nos anéis vermelhos de corte
      const time = clock.getElapsedTime();
      cutBranchMaterial.emissiveIntensity = 0.25 + 0.2 * Math.sin(time * 3);

      renderer.render(scene, camera);
    }
    animate();

    // Resize handler
    function handleResize() {
      if (!container || !camera || !renderer) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (reqIdRef.current) cancelAnimationFrame(reqIdRef.current);
      controls.dispose();
      renderer.dispose();
      groundGeo.dispose();
      groundMat.dispose();
      grassGeo.dispose();
      grassMat.dispose();
      barkMaterial.dispose();
      keptBranchMaterial.dispose();
      cutBranchMaterial.dispose();
      cutRingMaterial.dispose();
      budMaterial.dispose();
      leafMaterial.dispose();
    };
  }, [diagramType, modelMode, autoRotate]);

  function handleResetCamera() {
    if (!cameraRef.current || !controlsRef.current) return;
    if (modelMode === "cut_angle") {
      cameraRef.current.position.set(0, 3, 6);
      controlsRef.current.target.set(0, 1.5, 0);
    } else {
      cameraRef.current.position.set(0, 4.5, 8.5);
      controlsRef.current.target.set(0, 2.5, 0);
    }
    controlsRef.current.update();
  }

  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm space-y-3 p-4">
      {/* Barra de Título & Alternador de Modelo 3D */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold shadow-xs">
            3D
          </div>
          <div>
            <h4 className="font-bold text-stone-800 text-sm flex items-center gap-1.5">
              <span>{name} em 3D Interativo</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                360° Órbita
              </span>
            </h4>
            <p className="text-xs text-stone-500">Arrasta para girar em qualquer ângulo • Pinça/Roda para Zoom</p>
          </div>
        </div>

        {/* Alternador de Visão 3D: Copa vs Ângulo 45° */}
        <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setModelMode("canopy")}
            className={`px-3 py-1 rounded-lg transition-all ${
              modelMode === "canopy"
                ? "bg-emerald-600 text-white shadow-xs font-bold"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            🌳 Copa Completa
          </button>
          <button
            onClick={() => setModelMode("cut_angle")}
            className={`px-3 py-1 rounded-lg transition-all ${
              modelMode === "cut_angle"
                ? "bg-emerald-600 text-white shadow-xs font-bold"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            📐 Bisel 45°
          </button>
        </div>
      </div>

      {/* Canvas Three.js */}
      <div className="relative w-full h-72 sm:h-80 rounded-2xl overflow-hidden bg-gradient-to-b from-stone-100/60 via-slate-50 to-emerald-50/30 border border-stone-200/80 shadow-inner">
        <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing touch-none" />

        {/* Botões Flutuantes de Controlo 3D */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10">
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className="p-2 rounded-xl bg-white/90 hover:bg-white text-stone-700 shadow-md backdrop-blur-xs border border-stone-200 transition-colors"
            title={autoRotate ? "Pausar Rotação Automática" : "Ativar Rotação Automática"}
          >
            {autoRotate ? <Pause className="w-4 h-4 text-emerald-600" /> : <Play className="w-4 h-4" />}
          </button>
          <button
            onClick={handleResetCamera}
            className="p-2 rounded-xl bg-white/90 hover:bg-white text-stone-700 shadow-md backdrop-blur-xs border border-stone-200 transition-colors"
            title="Repor Ângulo da Câmara"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Legenda Flutuante 3D */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
          <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-stone-200/80 shadow-sm flex items-center gap-3 text-[11px] font-semibold pointer-events-auto">
            <span className="flex items-center gap-1.5 text-rose-700 font-bold">
              <span className="w-3 h-3 rounded-full bg-rose-500 inline-block shadow-2xs animate-pulse" />
              ✂️ Cortar (Ladrões / Cruzados)
            </span>
            <span className="flex items-center gap-1.5 text-emerald-800 font-bold">
              <span className="w-3 h-3 rounded-full bg-emerald-600 inline-block shadow-2xs" />
              🌿 Manter (Produtivos)
            </span>
          </div>

          <span className="hidden sm:inline-block bg-black/40 text-white text-[10px] px-2.5 py-1 rounded-lg backdrop-blur-xs">
            Gira livremente em 360°
          </span>
        </div>
      </div>

      <p className="text-xs text-stone-500 text-center">
        💡 <b>Dica de exploração:</b> Roda a árvore até veres o centro aberto (copa em vaso) e identifica os ramos vermelhos verticais a eliminar.
      </p>
    </div>
  );
}
