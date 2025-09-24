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
function Popup({ onClose }) {
    return (
        <div
            style={{
                position: "fixed",
                top: "100px", // más separación de la navbar
                left: "40px", // más separación de la izquierda
                bottom: "40px", // más separación del fondo
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

            {/* Imagen real del edificio */}
            <img
                src="/images/edificioA_real.jpg"
                alt="Edificio A"
                style={{
                    width: "100%",
                    borderRadius: "16px",
                    marginBottom: "15px",
                }}
            />

            {/* Datos importantes */}
            <h2 style={{ margin: "0 0 10px 0" }}>Edificio A</h2>
            <p style={{ margin: "0 0 5px 0" }}>
                📍 Ubicación: Zona Norte del Campus
            </p>
            <p style={{ margin: "0 0 5px 0" }}>
                🏢 Uso: Laboratorios de Ingeniería
            </p>
            <p style={{ margin: 0 }}>👩‍🏫 Aulas: 10 | Laboratorios: 4</p>
        </div>
    );
}

// ================= MODELO =================
function CampusModel({ onSelect }) {
    const { scene } = useGLTF("/models/EDIFICIOA.glb");
    const [hovered, setHovered] = useState(false);

    useEffect(() => {
        scene.traverse((child) => {
            if (child.isMesh) {
                child.material.emissive = hovered
                    ? new THREE.Color("red")
                    : new THREE.Color("black");
                child.material.emissiveIntensity = hovered ? 0.5 : 0;
            }
        });
    }, [hovered, scene]);

    return (
        <primitive
            object={scene}
            scale={[1, 1, 1]}
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
    const [popupOpen, setPopupOpen] = useState(false);

    return (
        <div style={{ width: "100%", height: "100vh" }}>
            <Canvas camera={{ position: [20, 15, 40], fov: 50 }}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 10]} />

                <CampusModel onSelect={() => setPopupOpen(true)} />

                <OrbitControls
                    minPolarAngle={Math.PI / 4}
                    maxPolarAngle={Math.PI / 2}
                    enablePan={true}
                    enableZoom={true}
                    minDistance={20}
                    maxDistance={100}
                />
            </Canvas>

            {popupOpen && <Popup onClose={() => setPopupOpen(false)} />}
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
