import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import SignupPage from "./pages/SignupPage/SignupPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import Navbar from "./components/Navbar/Navbar";
import IsPrivate from "./components/IsPrivate/IsPrivate";
import IsAnon from "./components/IsAnon/IsAnon";
import React from "react";

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
    const isHighlighted =
        Array.isArray(selectedBuilding)
            ? selectedBuilding.some((b) => b.id === id)
            : selectedBuilding?.id === id;


    // Rotación inicial
    useEffect(() => {
        if (!scene) return;
        scene.rotation.set(rotation[0], rotation[1], rotation[2]);
    }, [scene, rotation]);

    // 🔹 Iluminación dinámica
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
    const { highlightedBuildings } = useContext(MapContext);

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

    // 🔹 Si no hay building o progreso = 0 → no mostrar nada
    if (!currentBuilding || progress <= 0) return null;

    // 🔹 Normaliza a array para soportar uno o varios edificios
    const buildingsArray = Array.isArray(currentBuilding)
        ? currentBuilding
        : [currentBuilding];

    return (
        <>
            {buildingsArray.map((b, index) =>
                icons.map((item, i) => {
                    // Si b.position no está definido, se salta
                    if (!b.position) return null;

                    const pos = new THREE.Vector3().lerpVectors(
                        new THREE.Vector3(0, 0, 0),
                        item.offset,
                        progress
                    );

                    return (
                        <Html
                            key={`${b.id}-${i}`}
                            position={[
                                b.position[0] + pos.x,
                                b.position[1] + 40 + pos.y,
                                b.position[2] + pos.z,
                            ]}
                            center
                        >
                            <div
                                onClick={() => alert(`${item.label} del ${b.id}`)}
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
                })
            )}
        </>
    );
}

function Piso() {

    const { scene } = useGLTF("/models/caminoTESO.glb");

    return <primitive object={scene} scale={50} position={[25, 0, 0]} rotation={[ 0, (300 * Math.PI) / 180, 0]} />;
}


// ==========================================================
// 🔹 HOME CON MODELO
// ==========================================================
function HomeWithModel() {
    const [selectedBuilding, setSelectedBuilding] = useState(null);
    const [hoveredBuilding, setHoveredBuilding] = useState(null);
    const { highlightedBuildings, trigger } = useContext(MapContext);
    const mountedRef = useRef(false);

    const edificios = [
        { id: "A", path: "/models/EDIFICIOA.glb", color: "red", position: [-40, 0, 155], scale: [1.5, 1.5, 1.5], rotation: [0, Math.PI, 0] },
        { id: "B", path: "/models/EDIFICIOB.glb", color: "blue", position: [-40, 0, 40], scale: [2, 3.5, 3], rotation: [0, (270 * Math.PI) / 180, 0] },
        { id: "C", path: "/models/EDIFICIOC.glb", color: "green", position: [-150, 0, -80], scale: [2, 3.5, 3], rotation: [0, (270 * Math.PI) / 180, 0] },
        { id: "D", path: "/models/EDIFICIOD.glb", color: "purple", position: [-150, 0, -210], scale: [2, 3.5, 3], rotation: [0, (270 * Math.PI) / 180, 0] },
        { id: "E", path: "/models/EDIFICIOE.glb", color: "yellow", position: [100, 0, 180], scale: [2, 3.5, 3], rotation: [0, (95 * Math.PI) / 180, 0] },
        { id: "I", path: "/models/EDIFICIOI.glb", color: "orange", position: [-290, 0, -255], scale: [2, 3.5, 3], rotation: [0, (264 * Math.PI) / 180, 0] },
        { id: "IND", path: "/models/EDIFICIOINDUSTRIAL.glb", color: "orange", position: [250, 0, 120], scale: [3, 5, 4], rotation: [0, (190 * Math.PI) / 180, 0] },
        { id: "CAFE", path: "/models/CAFETERIA.glb", color: "pink", position: [120, 0, 10], scale: [3, 3, 3], rotation: [0, (90 * Math.PI) / 180, 0] },
    ];

    useEffect(() => {
        mountedRef.current = true;
        return () => {
            mountedRef.current = false;
            setSelectedBuilding(null);
        };
    }, []);

    useEffect(() => {
        if (!mountedRef.current) return;

        if (Array.isArray(highlightedBuildings) && highlightedBuildings.length > 0) {
            // Limpia selección previa
            setSelectedBuilding(null);

            // Ilumina todos los edificios de la lista
            setTimeout(() => {
                const highlightedData = edificios
                    .filter((b) => highlightedBuildings.includes(b.id))
                    .map((b) => ({
                        id: b.id,
                        position: b.position,
                        color: b.color,
                    }));
                setSelectedBuilding(highlightedData);
            }, 100);
        } else {
            setSelectedBuilding(null);
        }
    }, [highlightedBuildings, trigger]);


    return (
        <div style={{ width: "100%", height: "100vh", position: "relative" }}>
            <Canvas
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

                {/*  <Piso /> */}


                {/* Piso*/}
                <mesh rotation-x={-Math.PI / 2} position={[0, -2, 0]}>
                    <planeGeometry args={[2000, 2000]} />
                    <meshStandardMaterial color="#37F731" />
                </mesh>

                {/* Edificios */}
                {edificios.map((edificio) => (
                    <BuildingModel
                        key={edificio.id}
                        {...edificio}
                        selectedBuilding={
                            Array.isArray(selectedBuilding)
                                ? selectedBuilding.find((b) => b.id === edificio.id)
                                : selectedBuilding?.id === edificio.id
                                    ? selectedBuilding
                                    : null
                        }
                        onSelect={setSelectedBuilding}
                        onHover={setHoveredBuilding}
                    />
                ))}


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
    const location = useLocation();

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
            <Routes location={location} key={location.pathname}>
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
