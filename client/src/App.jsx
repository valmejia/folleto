import "./App.css";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import SignupPage from "./pages/SignupPage/SignupPage";
import LoginPage from "./pages/LoginPage/LoginPage";

import Navbar from "./components/Navbar/Navbar";
import IsPrivate from "./components/IsPrivate/IsPrivate";
import IsAnon from "./components/IsAnon/IsAnon";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF, Html } from "@react-three/drei";
import { useState, useEffect } from "react";
import MenuDeCafeteria from "./components/menuDeCafeteria/menuDeCafeteria";
import Compass from "./components/Compass/Compass";
import * as THREE from "three";

// ================= POPUP =================
function Popup({ onClose, title, image, data }) {
    return (
        <div
            style={{
                position: "fixed",
                top: "100px",
                left: "40px",
                bottom: "40px",
                width: "320px",
                background: "white",
                borderRadius: "24px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <button
                onClick={onClose}
                style={{
                    alignSelf: "flex-end",
                    background: "none",
                    border: "none",
                    fontSize: "20px",
                    cursor: "pointer",
                    color: "#bfc3c9",
                }}
            >
                ✕
            </button>

            <img
                src={image}
                alt={title}
                style={{
                    width: "100%",
                    borderRadius: "16px",
                    marginBottom: "15px",
                }}
            />

            <h2 style={{ margin: "0 0 10px 0" }}>{title}</h2>
            {data.map((line, index) => (
                <p key={index} style={{ margin: "0 0 5px 0" }}>
                    {line}
                </p>
            ))}
        </div>
    );
}

// ================= MODELO DE EDIFICIO =================
function BuildingModel({ path, color, position, scale, rotation = [0, 0, 0], onSelect }) {
    const { scene } = useGLTF(path);
    const [hovered, setHovered] = useState(false);

    useEffect(() => {
        if (scene) scene.rotation.set(rotation[0], rotation[1], rotation[2]);
    }, [scene, rotation]);

    useEffect(() => {
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
            }}
            onPointerOut={(e) => {
                e.stopPropagation();
                setHovered(false);
            }}
            onClick={(e) => {
                e.stopPropagation();
                onSelect();
            }}
        />
    );
}

// ================= HOME =================
function HomeWithModel() {
    const [popupData, setPopupData] = useState(null);

    const edificios = [
        {
            id: "A",
            path: "/models/EDIFICIOA.glb",
            color: "red",
            image: "/images/edificioA_real.jpg",
            title: "Edificio A",
            data: [
                "📍 Zona Norte del Campus",
                "🏢 Laboratorios de Ingeniería",
                "👩‍🏫 Aulas: 10 | Laboratorios: 4",
            ],
            position: [-80, 0, 25],
            scale: [1.5, 1.5, 1.5],
            rotation: [0, Math.PI, 0],
        },
        {
            id: "B",
            path: "/models/EDIFICIOB.glb",
            color: "blue",
            image: "/images/edificioB_real.jpg",
            title: "Edificio B",
            data: [
                "📍 Junto al Edificio A",
                "🏫 Aulas teóricas y oficinas académicas",
                "👩‍🏫 Aulas: 8 | Oficinas: 3",
            ],
            position: [-80, 0, -100],
            scale: [2, 3.5, 3],
            rotation: [0, 270 * Math.PI / 180, 0],
        },
        {
            id: "C",
            path: "/models/EDIFICIOC.glb",
            color: "green",
            image: "/images/edificioC_real.jpg",
            title: "Edificio C",
            data: [
                "📍 Frente al edificio A y B",
                "🧪 Laboratorios de química y biología",
                "🧫 Laboratorios: 5 | Oficinas: 2",
            ],
            position: [-150, 0, -180],
            scale: [2, 3.5, 3],
            rotation: [0, 270 * Math.PI / 180, 0],
        },
        {
            id: "D",
            path: "/models/EDIFICIOD.glb",
            color: "purple",
            image: "/images/edificioD_real.jpg",
            title: "Edificio D",
            data: [
                "📍 Zona Oeste",
                "💻 Laboratorios de informática",
                "👩‍💻 Aulas: 6 | Laboratorios: 3",
            ],
            position: [-150, 0, -280],
            scale: [2, 3.5, 3],
            rotation: [0, 270 * Math.PI / 180, 0],
        },
        {
            id: "E",
            path: "/models/EDIFICIOE.glb",
            color: "yellow",
            image: "/images/edificioE_real.jpg",
            title: "Edificio E",
            data: [
                "📍 Zona Central",
                "📚 Biblioteca y salas de estudio",
                "🪑 Salas: 4 | Cubículos: 6",
            ],
            position: [80, 0, 25],
            scale: [2, 3.5, 3],
            rotation: [0,  90 * Math.PI / 180, 0],
        },
        {
            id: "I",
            path: "/models/EDIFICIOI.glb",
            color: "orange",
            image: "/images/edificioI_real.jpg",
            title: "Edificio I",
            data: [
                "📍 Zona Este",
                "⚙️ Ingeniería Industrial",
                "👷 Talleres: 3 | Oficinas: 2",
            ],
            position: [-250, 0, -280],
            scale: [2, 3.5, 3],
            rotation: [0, 270 * Math.PI / 180, 0],
        },
        {
            id: "IND",
            path: "/models/EDIFICIOINDUSTRIAL.glb",
            color: "orange",
            image: "/images/edificioIndustrial_real.jpg",
            title: "Edificio Industrial",
            data: ["📍 Zona Este", "⚙️ Talleres"],
            position: [250, 0, 5],
            scale: [3, 5, 4],
            rotation: [0, Math.PI, 0]
        },
    ];

    return (
        <div style={{ width: "100%", height: "100vh" }}>
            <Canvas camera={{ position: [0, 150, 300], fov: 50 }} style={{ background: "#b3e5ff" }}>
                <ambientLight intensity={0.6} />
                <directionalLight position={[15, 20, 10]} />

                {edificios.map((edificio) => (
                    <BuildingModel
                        key={edificio.id}
                        path={edificio.path}
                        color={edificio.color}
                        position={edificio.position}
                        scale={edificio.scale}
                        rotation={edificio.rotation}
                        onSelect={() => setPopupData(edificio)}
                    />
                ))}

                <OrbitControls
                    enablePan
                    enableZoom
                    enableRotate
                    minDistance={50}
                    maxDistance={600}
                    minPolarAngle={Math.PI / 6}
                    maxPolarAngle={Math.PI / 2.5}
                />

                <Compass  />
            </Canvas>

        </div>
    );
}

// ================= APP =================
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
