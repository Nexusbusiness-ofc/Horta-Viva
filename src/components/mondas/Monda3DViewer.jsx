import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RotateCcw, Play, Pause, Ruler, Scissors, CheckCircle2, XCircle, Sparkles } from "lucide-react";

export default function Monda3DViewer({ diagramType = "root_thinning", name = "Cultura", spacingCm = "5 cm" }) {
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const reqIdRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);

  const [autoRotate, setAutoRotate] = useState(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 360;
    const height = container.clientHeight || 320;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0xf8fafc);
    scene.fog = new THREE.FogExp2(0xf8fafc, 0.04);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    cameraRef.current = camera;
    if (diagramType === "solanaceae_sucker") {
      camera.position.set(2.5, 3.2, 5.0);
    } else {
      camera.position.set(0, 3.8, 6.5);
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
    controls.maxPolarAngle = Math.PI / 2 + 0.1;
    controls.minDistance = 1.8;
    controls.maxDistance = 14;
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = 1.6;

    if (diagramType === "solanaceae_sucker") {
      controls.target.set(0, 1.6, 0);
    } else {
      controls.target.set(0, 1.2, 0);
    }
    controls.update();

    // 5. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.3);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfffbeb, 2.0);
    dirLight.position.set(5, 10, 7);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const fillLight = new THREE.DirectionalLight(0xa7f3d0, 0.7);
    fillLight.position.set(-5, 4, -4);
    scene.add(fillLight);

    // 6. Grupo de Modelos
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);

    // Materiais Comuns
    const stemMaterial = new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.6 });
    const leafMaterial = new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.5, side: THREE.DoubleSide });
    const suckerMaterial = new THREE.MeshStandardMaterial({
      color: 0xef4444, // Vermelho vivo
      roughness: 0.4,
      emissive: 0x991b1b,
      emissiveIntensity: 0.35
    });
    const cutRingMaterial = new THREE.MeshBasicMaterial({ color: 0xff1111, wireframe: true });
    const rootMaterial = new THREE.MeshStandardMaterial({ color: 0xea580c, roughness: 0.5 }); // Laranja para cenouras/raízes

    if (diagramType === "solanaceae_sucker") {
      // --- MODELO 3D DE DESLADROAMENTO AXILAR (TOMATEIRO / PIMENTO) ---
      // Solo pequeno
      const bedGeo = new THREE.CylinderGeometry(2.5, 2.7, 0.3, 32);
      const bedMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 });
      const bed = new THREE.Mesh(bedGeo, bedMat);
      bed.position.y = -0.15;
      modelGroup.add(bed);

      // Caule Principal Vertical
      const mainStemGeo = new THREE.CylinderGeometry(0.18, 0.22, 3.6, 24);
      const mainStem = new THREE.Mesh(mainStemGeo, stemMaterial);
      mainStem.position.y = 1.8;
      mainStem.castShadow = true;
      modelGroup.add(mainStem);

      // Folha Horizontal Estendida (formando a axila)
      const petioleGeo = new THREE.CylinderGeometry(0.08, 0.12, 1.8, 16);
      const petiole = new THREE.Mesh(petioleGeo, stemMaterial);
      petiole.position.set(0.85, 1.7, 0);
      petiole.rotation.z = -Math.PI / 2.5; // inclinado suavemente para baixo
      modelGroup.add(petiole);

      // Folíolos da folha
      for (let i = 0; i < 4; i++) {
        const leafGeo = new THREE.SphereGeometry(0.28, 12, 8);
        leafGeo.scale(1, 0.1, 1.8);
        const leaf = new THREE.Mesh(leafGeo, leafMaterial);
        leaf.position.set(0.5 + i * 0.35, 1.95 - i * 0.18, (i % 2 === 0 ? 0.35 : -0.35));
        leaf.rotation.y = (i % 2 === 0 ? 0.4 : -0.4);
        modelGroup.add(leaf);
      }

      // O REBENTO LADRÃO AXILAR (A 45° - VERMELHO VIVO - A RETIRAR!)
      const suckerGeo = new THREE.CylinderGeometry(0.07, 0.1, 1.1, 16);
      const sucker = new THREE.Mesh(suckerGeo, suckerMaterial);
      sucker.position.set(0.38, 2.1, 0);
      sucker.rotation.z = -Math.PI / 4; // rigorosamente a 45 graus!
      sucker.castShadow = true;
      modelGroup.add(sucker);

      // Folhinhas jovens do ladrão
      const suckerLeaf1 = new THREE.Mesh(new THREE.SphereGeometry(0.15, 8, 8), suckerMaterial);
      suckerLeaf1.position.set(0.72, 2.5, 0.1);
      modelGroup.add(suckerLeaf1);

      const suckerLeaf2 = new THREE.Mesh(new THREE.SphereGeometry(0.14, 8, 8), suckerMaterial);
      suckerLeaf2.position.set(0.68, 2.45, -0.1);
      modelGroup.add(suckerLeaf2);

      // Anel vermelho pulsante de corte na axila
      const ringGeo = new THREE.TorusGeometry(0.16, 0.03, 8, 20);
      const ring = new THREE.Mesh(ringGeo, cutRingMaterial);
      ring.position.set(0.12, 1.78, 0);
      ring.rotation.y = Math.PI / 2;
      modelGroup.add(ring);

      // Pequeno cacho de flores amarelas de tomateiro no caule
      const flowerMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.3 });
      const flower = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.2, 8), flowerMat);
      flower.position.set(-0.25, 2.5, 0);
      flower.rotation.z = Math.PI / 2.5;
      modelGroup.add(flower);

    } else if (diagramType === "cucurbit_trail") {
      // --- MODELO 3D DE DESPONTA DE CUCURBITÁCEAS (ABÓBORA / MELÃO) ---
      // Solo plano
      const soilGeo = new THREE.BoxGeometry(6, 0.3, 3);
      const soilMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 });
      const soil = new THREE.Mesh(soilGeo, soilMat);
      soil.position.y = -0.15;
      modelGroup.add(soil);

      // Rama rasteira ondulada
      const vineCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-2.4, 0.1, 0),
        new THREE.Vector3(-1.2, 0.12, 0.3),
        new THREE.Vector3(0, 0.1, -0.2),
        new THREE.Vector3(1.2, 0.15, 0.2),
        new THREE.Vector3(2.4, 0.1, 0)
      ]);
      const tubeGeo = new THREE.TubeGeometry(vineCurve, 32, 0.08, 12, false);
      const vine = new THREE.Mesh(tubeGeo, stemMaterial);
      modelGroup.add(vine);

      // 4 Folhas largas de abóbora
      [-1.8, -0.8, 0.2, 1.2].forEach((x, idx) => {
        const leafGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.02, 16);
        const leaf = new THREE.Mesh(leafGeo, leafMaterial);
        leaf.position.set(x, 0.4, (idx % 2 === 0 ? 0.4 : -0.4));
        leaf.rotation.x = (idx % 2 === 0 ? 0.3 : -0.3);
        modelGroup.add(leaf);
      });

      // Fruto fixado no chão (Abóbora / Melão dourado)
      const fruitGeo = new THREE.SphereGeometry(0.45, 24, 24);
      fruitGeo.scale(1.2, 0.9, 1.1);
      const fruitMat = new THREE.MeshStandardMaterial({ color: 0xeab308, roughness: 0.3 });
      const fruit = new THREE.Mesh(fruitGeo, fruitMat);
      fruit.position.set(0.1, 0.38, -0.6);
      fruit.castShadow = true;
      modelGroup.add(fruit);

      // Ponto de desponta apical (Corte após a 4ª folha - Vermelho)
      const ringGeo = new THREE.TorusGeometry(0.18, 0.04, 8, 20);
      const cutRing = new THREE.Mesh(ringGeo, cutRingMaterial);
      cutRing.position.set(1.6, 0.25, 0.1);
      cutRing.rotation.y = Math.PI / 2;
      modelGroup.add(cutRing);

      // Ponta descartada além do corte (Vermelha)
      const tipGeo = new THREE.CylinderGeometry(0.04, 0.07, 0.9, 12);
      const tip = new THREE.Mesh(tipGeo, suckerMaterial);
      tip.position.set(2.0, 0.16, 0.05);
      tip.rotation.z = Math.PI / 2;
      modelGroup.add(tip);

    } else {
      // --- MODELO 3D PADRÃO DE DESBASTE DE SEMENTEIRA (CENOURA, BETERRABA, ETC.) ---
      // Bloco de canteiro com solo translúcido para ver as raízes subterrâneas!
      const bedWidth = 5.6;
      const bedGeo = new THREE.BoxGeometry(bedWidth, 1.6, 1.8);
      const bedMat = new THREE.MeshStandardMaterial({
        color: 0x5c3818,
        roughness: 0.9,
        transparent: true,
        opacity: 0.85
      });
      const bed = new THREE.Mesh(bedGeo, bedMat);
      bed.position.set(0, -0.8, 0);
      modelGroup.add(bed);

      // Linha da régua em cm desenhada na borda frontal
      const rulerGeo = new THREE.BoxGeometry(bedWidth, 0.06, 0.12);
      const rulerMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.2 });
      const ruler = new THREE.Mesh(rulerGeo, rulerMat);
      ruler.position.set(0, 0.03, 0.85);
      modelGroup.add(ruler);

      // Marcações da régua a cada 5cm (escala 3D)
      [-2.0, -1.0, 0.0, 1.0, 2.0].forEach((x, idx) => {
        const markGeo = new THREE.BoxGeometry(0.04, 0.08, 0.14);
        const mark = new THREE.Mesh(markGeo, new THREE.MeshBasicMaterial({ color: 0x0284c7 }));
        mark.position.set(x, 0.04, 0.85);
        modelGroup.add(mark);
      });

      // Plântulas principais espaçadas (Verdes - Mantidas)
      [-2.0, -1.0, 0.0, 1.0, 2.0].forEach((x) => {
        // Folhagem acima do chão
        const foliage = new THREE.Group();
        for (let j = 0; j < 3; j++) {
          const leafStem = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.03, 0.9, 8), stemMaterial);
          leafStem.position.set(0, 0.45, 0);
          leafStem.rotation.z = (j - 1) * 0.25;
          foliage.add(leafStem);
        }
        foliage.position.set(x, 0, 0);
        modelGroup.add(foliage);

        // Raiz de cenoura aprumada debaixo da terra
        const carrotGeo = new THREE.ConeGeometry(0.18, 1.1, 16);
        const carrot = new THREE.Mesh(carrotGeo, rootMaterial);
        carrot.position.set(x, -0.55, 0);
        carrot.rotation.x = Math.PI; // afunila para baixo
        modelGroup.add(carrot);
      });

      // Plântulas em excesso a cortar com tesoura rente à terra (Vermelhas)
      [-1.5, -0.5, 0.5, 1.5].forEach((x) => {
        const weed = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.5, 8), suckerMaterial);
        weed.position.set(x, 0.25, 0.05);
        weed.rotation.z = 0.15;
        modelGroup.add(weed);

        // Anel de corte na base
        const ring = new THREE.Mesh(new THREE.TorusGeometry(0.08, 0.02, 6, 16), cutRingMaterial);
        ring.position.set(x, 0.04, 0.05);
        ring.rotation.x = Math.PI / 2;
        modelGroup.add(ring);
      });
    }

    // Loop de renderização
    let clock = new THREE.Clock();
    function animate() {
      reqIdRef.current = requestAnimationFrame(animate);
      controls.update();

      const time = clock.getElapsedTime();
      suckerMaterial.emissiveIntensity = 0.25 + 0.25 * Math.sin(time * 3.5);

      renderer.render(scene, camera);
    }
    animate();

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
      stemMaterial.dispose();
      leafMaterial.dispose();
      suckerMaterial.dispose();
      cutRingMaterial.dispose();
      rootMaterial.dispose();
    };
  }, [diagramType, autoRotate]);

  function handleResetCamera() {
    if (!cameraRef.current || !controlsRef.current) return;
    if (diagramType === "solanaceae_sucker") {
      cameraRef.current.position.set(2.5, 3.2, 5.0);
      controlsRef.current.target.set(0, 1.6, 0);
    } else {
      cameraRef.current.position.set(0, 3.8, 6.5);
      controlsRef.current.target.set(0, 1.2, 0);
    }
    controlsRef.current.update();
  }

  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm space-y-3 p-4">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-lime-600 text-white flex items-center justify-center font-bold shadow-xs">
            3D
          </div>
          <div>
            <h4 className="font-bold text-stone-800 text-sm flex items-center gap-1.5">
              <span>{name} em 3D Interativo</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-lime-100 text-lime-800 border border-lime-200">
                360° Órbita
              </span>
            </h4>
            <p className="text-xs text-stone-500">Arrasta para rodar em 360° • Zoom com roda ou pinça</p>
          </div>
        </div>

        {spacingCm && (
          <div className="flex items-center gap-1.5 bg-lime-50 border border-lime-200 px-2.5 py-1 rounded-xl text-xs font-bold text-lime-800">
            <Ruler className="w-3.5 h-3.5" />
            <span>Espaçamento: {spacingCm}</span>
          </div>
        )}
      </div>

      <div className="relative w-full h-72 sm:h-80 rounded-2xl overflow-hidden bg-gradient-to-b from-stone-100/60 via-slate-50 to-lime-50/30 border border-stone-200/80 shadow-inner">
        <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing touch-none" />

        <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10">
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className="p-2 rounded-xl bg-white/90 hover:bg-white text-stone-700 shadow-md backdrop-blur-xs border border-stone-200 transition-colors"
            title={autoRotate ? "Pausar Rotação" : "Ativar Rotação"}
          >
            {autoRotate ? <Pause className="w-4 h-4 text-lime-600" /> : <Play className="w-4 h-4" />}
          </button>
          <button
            onClick={handleResetCamera}
            className="p-2 rounded-xl bg-white/90 hover:bg-white text-stone-700 shadow-md backdrop-blur-xs border border-stone-200 transition-colors"
            title="Repor Ângulo"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
          <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-stone-200/80 shadow-sm flex items-center gap-3 text-[11px] font-semibold pointer-events-auto">
            <span className="flex items-center gap-1.5 text-rose-700 font-bold">
              <span className="w-3 h-3 rounded-full bg-rose-500 inline-block shadow-2xs animate-pulse" />
              ✂️ Mondar / Ladrão Axilar
            </span>
            <span className="flex items-center gap-1.5 text-lime-800 font-bold">
              <span className="w-3 h-3 rounded-full bg-lime-600 inline-block shadow-2xs" />
              🌿 Manter Alinhado
            </span>
          </div>

          <span className="hidden sm:inline-block bg-black/40 text-white text-[10px] px-2.5 py-1 rounded-lg backdrop-blur-xs">
            Gira livremente em 360°
          </span>
        </div>
      </div>

      <p className="text-xs text-stone-500 text-center">
        💡 <b>Dica de exploração:</b> Roda o modelo para observar a raiz debaixo do solo ou o ângulo exato de 45° da axila.
      </p>
    </div>
  );
}
