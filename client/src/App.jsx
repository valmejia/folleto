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
import { useState, useEffect  } from "react"
import MenuDeCafeteria from "./components/menuDeCafeteria/menuDeCafeteria";
import { useMemo } from "react";
import * as THREE from "three";

    function CampusModel() {
        const { scene } = useGLTF("/models/EDIFICIOA.glb");
        const [hovered, setHovered] = useState(false);

        useEffect(() => {
            // recorrer todos los meshes del modelo y cambiar emissive
            scene.traverse((child) => {
                if (child.isMesh) {
                    child.material.emissive = hovered ? new THREE.Color("red") : new THREE.Color("black");
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
            />
        );
    }



// Página Home extendida para mostrar el Canvas con el edificio
function HomeWithModel() {
    return (
        <div style={{ width: "100%", height: "100vh" }}>
            <Canvas camera={{ position: [20, 15, 40], fov: 50 }}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 10]} />

                <CampusModel />

                <OrbitControls
                    minPolarAngle={Math.PI / 4}
                    maxPolarAngle={Math.PI / 2}
                    enablePan={true}
                    enableZoom={true}
                    minDistance={20}
                    maxDistance={100}
                />
            </Canvas>
        </div>
    );
}


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
