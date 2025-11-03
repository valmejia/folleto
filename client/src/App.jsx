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
import { useState, useEffect, useRef } from "react";
import * as THREE from "three";

import AssignmentIcon from "@mui/icons-material/Assignment";
import ContactPhoneIcon from "@mui/icons-material/ContactPhone";
import InfoIcon from "@mui/icons-material/Info";
import MenuDeCafeteria from "./components/menuDeCafeteria/menuDeCafeteria";
import Compass from "./components/Compass/Compass";

// ================= COMPONENTE DE EDIFICIO =================
function BuildingModel({
                           path,
                           color,
                           position,
                           scale,
                           rotation = [0, 0, 0],
                           onSelect,
                       }) {
    const { scene } = useGLTF(path);
    const [hovered, setHovered] = useState(false);

    useEffect(() => {
        if (scene) scene.rotation.set(rotation[0], rotation[1], rotation[2]);
    }, [scene, rotation]);

    useEffect(() => {
        if (scene)
            scene.traverse((child) => {
                if (child.isMesh) {
                    child.material.emissive = hovered
                        ? new THREE.Color(color)
                        : new THREE.Color("black");
                    child.material.emissiveIntensity = hovered ? 0.5 : 0;
                }
            });
    }, [hovered, scene, color]);

    return (
        <primitive
            object={scene}
            scale={scale}
            position={position}
            onPointerOver={(e) => {
                e.stopPropagation();
                setHovered(true);
                onSelect(position, true); // avisa al padre que está hovered
            }}
            onPointerOut={(e) => {
                e.stopPropagation();
                setHovered(false);
                onSelect(position, false); // avisa que dejó de estar hovered
            }}
            onClick={(e) => {
                e.stopPropagation();
                onSelect(position, hovered);
            }}
        />
    );
}

// ================= ÍCONOS ANIMADOS =================
function AnimatedIcons({ selectedBuilding, isHovered }) {
    const icons = [
        {
            Icon: AssignmentIcon,
            offset: new THREE.Vector3(-40, 0, 0),
            color: "#1e88e5",
            label: "Trámites",
        },
        {
            Icon: ContactPhoneIcon,
            offset: new THREE.Vector3(0, 0, 40),
            color: "#43a047",
            label: "Contacto",
        },
        {
            Icon: InfoIcon,
            offset: new THREE.Vector3(40, 0, 0),
            color: "#fbc02d",
            label: "Información",
        },
    ];

    const [progress, setProgress] = useState(0);

    useFrame(() => {
        setProgress((prev) => {
            if (isHovered) {
                // Animación al abrir
                return Math.min(prev + 0.05, 1);
            } else {
                // Animación al cerrar
                return Math.max(prev - 0.05, 0);
            }
        });
    });

    return (
        <>
            {progress > 0 &&
                icons.map((item, i) => {
                    const pos = new THREE.Vector3().lerpVectors(
                        new THREE.Vector3(0, 0, 0),
                        item.offset,
                        progress
                    );

                    return (
                        <Html
                            key={i}
                            position={[
                                selectedBuilding.position[0] + pos.x,
                                selectedBuilding.position[1] + 40 + pos.y,
                                selectedBuilding.position[2] + pos.z,
                            ]}
                        >
                            <div
                                onClick={() =>
                                    alert(
                                        `${item.label} del ${selectedBuilding.title}`
                                    )
                                }
                                style={{
                                    fontSize: 40,
                                    color: item.color,
                                    cursor: "pointer",
                                    background: "white",
                                    borderRadius: "50%",
                                    padding: "8px",
                                    boxShadow:
                                        "0 4px 10px rgba(0,0,0,0.2)",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    transform: `scale(${
                                        0.5 + progress * 0.5
                                    })`,
                                    opacity: progress,
                                    transition:
                                        "transform 0.2s, opacity 0.2s",
                                }}
                            >
                                <item.Icon
                                    style={{
                                        fontSize: 40,
                                        color: item.color,
                                    }}
                                />
                            </div>
                        </Html>
                    );
                })}
        </>
    );
}

// ================= HOME CON MODELO =================
function HomeWithModel() {
    const [selectedBuilding, setSelectedBuilding] = useState(null);

    const edificios = [
        {
            id: "A",
            path: "/models/EDIFICIOA.glb",
            color: "red",
            title: "Edificio A",
            position: [-80, 0, 25],
            scale: [1.5, 1.5, 1.5],
            rotation: [0, Math.PI, 0],
        },
        {
            id: "B",
            path: "/models/EDIFICIOB.glb",
            color: "blue",
            title: "Edificio B",
            position: [-80, 0, -100],
            scale: [2, 3.5, 3],
            rotation: [0, (270 * Math.PI) / 180, 0],
        },
        {
            id: "C",
            path: "/models/EDIFICIOC.glb",
            color: "green",
            title: "Edificio C",
            position: [-150, 0, -180],
            scale: [2, 3.5, 3],
            rotation: [0, (270 * Math.PI) / 180, 0],
        },
        {
            id: "D",
            path: "/models/EDIFICIOD.glb",
            color: "purple",
            title: "Edificio D",
            position: [-150, 0, -280],
            scale: [2, 3.5, 3],
            rotation: [0, (270 * Math.PI) / 180, 0],
        },
        {
            id: "E",
            path: "/models/EDIFICIOE.glb",
            color: "yellow",
            title: "Edificio E",
            position: [80, 0, 25],
            scale: [2, 3.5, 3],
            rotation: [0, (90 * Math.PI) / 180, 0],
        },
        {
            id: "I",
            path: "/models/EDIFICIOI.glb",
            color: "orange",
            title: "Edificio I",
            position: [-250, 0, -280],
            scale: [2, 3.5, 3],
            rotation: [0, (270 * Math.PI) / 180, 0],
        },
        {
            id: "IND",
            path: "/models/EDIFICIOINDUSTRIAL.glb",
            color: "orange",
            title: "Edificio Industrial",
            position: [250, 0, 5],
            scale: [3, 5, 4],
            rotation: [0, Math.PI, 0],
        },
    ];

    return (
        <div style={{ width: "100%", height: "100vh", position: "relative" }}>
            <Canvas
                camera={{ position: [0, 150, 300], fov: 50 }}
                style={{ background: "#b3e5ff" }}
            >
                {/* Luz */}
                <ambientLight intensity={0.6} />
                <directionalLight position={[15, 20, 10]} />

                {/* Piso verde
                <mesh rotation-x={-Math.PI / 2} position={[0, -2, 0]}>
                    <planeGeometry args={[2000, 2000]} />
                    <meshStandardMaterial color="#37F731" />
                </mesh>
                */}


                {/* Edificios */}
                {edificios.map((edificio) => (
                    <BuildingModel
                        key={edificio.id}
                        path={edificio.path}
                        color={edificio.color}
                        position={edificio.position}
                        scale={edificio.scale}
                        rotation={edificio.rotation}
                        onSelect={(pos, isHovered) =>
                            setSelectedBuilding({
                                ...edificio,
                                position: pos,
                                isHovered,
                            })
                        }
                    />
                ))}

                {/* Íconos alrededor del edificio */}
                {selectedBuilding && (
                    <AnimatedIcons
                        selectedBuilding={selectedBuilding}
                        isHovered={selectedBuilding.isHovered}
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

// ================= APP PRINCIPAL =================
function App() {
    return (
        <div className="App">
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
