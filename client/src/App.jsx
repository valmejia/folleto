import "./App.css";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import SignupPage from "./pages/SignupPage/SignupPage";
import LoginPage from "./pages/LoginPage/LoginPage";

import Navbar from "./components/Navbar/Navbar";
import IsPrivate from "./components/IsPrivate/IsPrivate";
import IsAnon from "./components/IsAnon/IsAnon";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { useState, useEffect } from "react";
import MenuDeCafeteria from "./components/menuDeCafeteria/menuDeCafeteria";
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
            {/* Botón de cierre */}
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

            {/* Imagen */}
            <img
                src={image}
                alt={title}
                style={{
                    width: "100%",
                    borderRadius: "16px",
                    marginBottom: "15px",
                }}
            />

            {/* Información */}
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

    // Aplicar rotación si scene está cargada
    useEffect(() => {
        if (scene) {
            scene.rotation.set(rotation[0], rotation[1], rotation[2]);
        }
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
                "📍 Ubicación: Zona Norte del Campus",
                "🏢 Uso: Laboratorios de Ingeniería",
                "👩‍🏫 Aulas: 10 | Laboratorios: 4",
            ],
            position: [-80, 0, 0],
            scale: [1.5, 1.5, 1.5],
            rotation: [0,  Math.PI , 0],
        },
        {
            id: "IND",
            path: "/models/EDIFICIOINDUSTRIAL.glb",
            color: "orange",
            image: "/images/edificioIndustrial_real.jpg",
            title: "Edificio de Ingeniería Industrial",
            data: [
                "📍 Ubicación: Zona Este del Campus",
                "⚙️ Uso: Aulas y talleres de Ingeniería Industrial",
                "👷‍♀️ Aulas: 8 | Talleres: 3 | Oficinas: 2",
            ],
            position: [250, 0, -30],
            scale: [3, 5, 4],
            rotation: [0, Math.PI, 0],
        },
    ];

    return (
        <div style={{ width: "100%", height: "100vh" }}>
            <Canvas
                camera={{ position: [0, 150, 300], fov: 50 }}
                style={{ background: "#b3e5ff" }}
            >
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
                    minPolarAngle={Math.PI / 4}
                    maxPolarAngle={Math.PI / 2}
                    enablePan={true}
                    enableZoom={true}
                    minDistance={20}
                    maxDistance={500}
                />
            </Canvas>

            {popupData && (
                <Popup
                    onClose={() => setPopupData(null)}
                    title={popupData.title}
                    image={popupData.image}
                    data={popupData.data}
                />
            )}
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
