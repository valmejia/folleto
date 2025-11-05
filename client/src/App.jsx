import "./App.css";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import SignupPage from "./pages/SignupPage/SignupPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import Navbar from "./components/Navbar/Navbar";
import IsPrivate from "./components/IsPrivate/IsPrivate";
import IsAnon from "./components/IsAnon/IsAnon";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, Html } from "@react-three/drei";
import { useState, useEffect, useContext, useRef } from "react";
import { MapContext } from "./context/map.context";
import * as THREE from "three";

import AssignmentIcon from "@mui/icons-material/Assignment";
import ContactPhoneIcon from "@mui/icons-material/ContactPhone";
import InfoIcon from "@mui/icons-material/Info";
import MenuDeCafeteria from "./components/menuDeCafeteria/menuDeCafeteria";
import Compass from "./components/Compass/Compass";

// ==========================================================
// 🔹 COMPONENTE DE EDIFICIO
// ==========================================================
function BuildingModel({
                           id,
                           path,
                           color,
                           position,
                           scale,
                           rotation = [0, 0, 0],
                           onHover,
                           onSelect,
                           selectedBuilding,
                       }) {
    const { scene } = useGLTF(path);
    const [hovered, setHovered] = useState(false);

    const isHighlighted = selectedBuilding?.id === id;

    // Rotación inicial
    useEffect(() => {
        if (!scene) return;
        scene.rotation.set(rotation[0], rotation[1], rotation[2]);
    }, [scene, rotation]);

    // Iluminación dinámica (hover + selección + Navbar)
    useEffect(() => {
        if (!scene) return;
        scene.traverse((child) => {
            if (child.isMesh) {
                if (hovered || isHighlighted) {
                    child.material.emissive = new THREE.Color(color);
                    child.material.emissiveIntensity = isHighlighted ? 1.2 : 0.5;
                } else {
                    child.material.emissive = new THREE.Color("black");
                    child.material.emissiveIntensity = 0;
                }
            }
        });
    }, [hovered, isHighlighted, scene, color]);

    if (!scene) return null;

    return (
        <primitive
            object={scene}
            scale={scale}
            position={position}
            onPointerOver={(e) => {
                e.stopPropagation();
                setHovered(true);
                onHover({ id, position, color });
            }}
            onPointerOut={(e) => {
                e.stopPropagation();
                setHovered(false);
                if (selectedBuilding?.id !== id) onHover(null);
            }}
            onClick={(e) => {
                e.stopPropagation();
                if (selectedBuilding?.id === id) {
                    onSelect(null);
                } else {
                    onSelect({ id, position, color });
                }
            }}
        />
    );
}

// ==========================================================
// 🔹 ÍCONOS ANIMADOS
// ==========================================================
function AnimatedIcons({ building, visible }) {
    const icons = [
        { Icon: AssignmentIcon, offset: new THREE.Vector3(-40, 0, 0), label: "Trámites" },
        { Icon: ContactPhoneIcon, offset: new THREE.Vector3(0, 0, 40), label: "Contacto" },
        { Icon: InfoIcon, offset: new THREE.Vector3(40, 0, 0), label: "Información" },
    ];

    const [progress, setProgress] = useState(0);
    const [currentBuilding, setCurrentBuilding] = useState(building);

    useEffect(() => {
        if (building) setCurrentBuilding(building);
    }, [building]);

    useFrame(() => {
        setProgress((prev) => {
            if (visible && prev < 1) return Math.min(prev + 0.05, 1);
            if (!visible && prev > 0) return Math.max(prev - 0.05, 0);
            return prev;
        });
    });

    if (!currentBuilding && progress <= 0) return null;

    return (
        <>
            {icons.map((item, i) => {
                const pos = new THREE.Vector3().lerpVectors(
                    new THREE.Vector3(0, 0, 0),
                    item.offset,
                    progress
                );

                return (
                    <Html
                        key={i}
                        position={[
                            currentBuilding.position[0] + pos.x,
                            currentBuilding.position[1] + 40 + pos.y,
                            currentBuilding.position[2] + pos.z,
                        ]}
                        center
                    >
                        <div
                            onClick={() => alert(`${item.label} del ${currentBuilding.id}`)}
                            style={{
                                cursor: "pointer",
                                transform: `scale(${0.8 + 0.2 * progress})`,
                                opacity: progress,
                                transition: "transform 0.2s ease, opacity 0.2s ease",
                                background: "none",
                                border: "none",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                            onMouseEnter={(e) =>
                                (e.currentTarget.style.transform = `scale(${1 + 0.2 * progress})`)
                            }
                            onMouseLeave={(e) =>
                                (e.currentTarget.style.transform = `scale(${0.8 + 0.2 * progress})`)
                            }
                        >
                            <item.Icon style={{ fontSize: 32, color: "black" }} />
                        </div>
                    </Html>
                );
            })}
        </>
    );
}

// ==========================================================
// 🔹 HOME CON MODELO
// ==========================================================
function HomeWithModel() {
    const [selectedBuilding, setSelectedBuilding] = useState(null);
    const [hoveredBuilding, setHoveredBuilding] = useState(null);
    const { highlightedBuilding } = useContext(MapContext);

    const sceneRef = useRef();

    const edificios = [
        { id: "A", path: "/models/EDIFICIOA.glb", color: "red", position: [-80, 0, 25], scale: [1.5, 1.5, 1.5], rotation: [0, Math.PI, 0] },
        { id: "B", path: "/models/EDIFICIOB.glb", color: "blue", position: [-80, 0, -100], scale: [2, 3.5, 3], rotation: [0, (270 * Math.PI) / 180, 0] },
        { id: "C", path: "/models/EDIFICIOC.glb", color: "green", position: [-150, 0, -180], scale: [2, 3.5, 3], rotation: [0, (270 * Math.PI) / 180, 0] },
        { id: "D", path: "/models/EDIFICIOD.glb", color: "purple", position: [-150, 0, -280], scale: [2, 3.5, 3], rotation: [0, (270 * Math.PI) / 180, 0] },
        { id: "E", path: "/models/EDIFICIOE.glb", color: "yellow", position: [80, 0, 25], scale: [2, 3.5, 3], rotation: [0, (90 * Math.PI) / 180, 0] },
        { id: "I", path: "/models/EDIFICIOI.glb", color: "orange", position: [-250, 0, -280], scale: [2, 3.5, 3], rotation: [0, (270 * Math.PI) / 180, 0] },
        { id: "IND", path: "/models/EDIFICIOINDUSTRIAL.glb", color: "orange", position: [250, 0, 5], scale: [3, 5, 4], rotation: [0, Math.PI, 0] },
    ];

    const handleSelect = (building) => {
        setSelectedBuilding((prev) =>
            prev?.id === building?.id ? null : building
        );
    };

    // Si viene una selección desde Navbar (highlightedBuilding)
    useEffect(() => {
        if (highlightedBuilding) {
            const buildingData = edificios.find((b) => b.id === highlightedBuilding);
            if (buildingData) {
                setSelectedBuilding({
                    id: buildingData.id,
                    position: buildingData.position,
                    color: buildingData.color,
                });
            }
        } else {
            setSelectedBuilding(null);
        }
    }, [highlightedBuilding]);

    return (
        <div style={{ width: "100%", height: "100vh", position: "relative" }}>
            <Canvas
                ref={sceneRef}
                camera={{ position: [0, 150, 300], fov: 50 }}
                gl={{ alpha: true }}
                style={{ background: "#b3e5ff" }}
                onPointerMissed={() => {
                    setSelectedBuilding(null);
                    setHoveredBuilding(null);
                }}
            >
                <ambientLight intensity={0.6} />
                <directionalLight position={[15, 20, 10]} />

                {/* Piso */}
                <mesh rotation-x={-Math.PI / 2} position={[0, -2, 0]}>
                    <planeGeometry args={[2000, 2000]} />
                    <meshStandardMaterial color="#37F731" />
                </mesh>

                {/* Edificios */}
                {edificios.map((edificio) => (
                    <BuildingModel
                        key={edificio.id}
                        {...edificio}
                        selectedBuilding={selectedBuilding}
                        onSelect={handleSelect}
                        onHover={setHoveredBuilding}
                    />
                ))}

                {/* Íconos animados */}
                {(hoveredBuilding || selectedBuilding) && (
                    <AnimatedIcons
                        building={selectedBuilding || hoveredBuilding}
                        visible={!!(hoveredBuilding || selectedBuilding)}
                    />
                )}

                <OrbitControls
                    enablePan
                    enableZoom
                    enableRotate
                    minDistance={50}
                    maxDistance={600}
                    minPolarAngle={Math.PI / 6}
                    maxPolarAngle={Math.PI / 2.5}
                />

                <Compass />
            </Canvas>
        </div>
    );
}

// ==========================================================
// 🔹 APP PRINCIPAL
// ==========================================================
function App() {
    return (
        <div
            className="App"
            style={{
                width: "100%",
                height: "100%",
                backgroundColor: "transparent",
                overflow: "hidden",
            }}
        >
            <Navbar />
            <Routes>
                <Route path="/" element={<HomeWithModel />} />
                <Route path="/menuDeCafeteria" element={<MenuDeCafeteria />} />
                <Route
                    path="/profile"
                    element={
                        <IsPrivate>
                            <ProfilePage />
                        </IsPrivate>
                    }
                />
                <Route
                    path="/signup"
                    element={
                        <IsAnon>
                            <SignupPage />
                        </IsAnon>
                    }
                />
                <Route
                    path="/login"
                    element={
                        <IsAnon>
                            <LoginPage />
                        </IsAnon>
                    }
                />
            </Routes>
        </div>
    );
}

export default App;
