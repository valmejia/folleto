import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import SignupPage from "./pages/SignupPage/SignupPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import Navbar from "./components/Navbar/Navbar";
import IsPrivate from "./components/IsPrivate/IsPrivate";
import IsAnon from "./components/IsAnon/IsAnon";
import React from "react";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Html } from "@react-three/drei";
import { useState, useEffect, useContext, useRef } from "react";
import { MapContext } from "./context/map.context";
import * as THREE from "three";

import AssignmentIcon from "@mui/icons-material/Assignment";
import ContactPhoneIcon from "@mui/icons-material/ContactPhone";
import InfoIcon from "@mui/icons-material/Info";
import MenuDeCafeteria from "./components/menuDeCafeteria/menuDeCafeteria";

// ==========================================================
// 🔹 BRÚJULA HTML FIJA (sin hooks R3F)
// ==========================================================
function HtmlCompass() {
    const [rotation, setRotation] = useState(0);

    useEffect(() => {
        const updateCompass = () => {
            setRotation(0);
        };

        const interval = setInterval(updateCompass, 100);
        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            width: '80px',
            height: '80px',
            zIndex: 1000,
            pointerEvents: 'none',
            background: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '50%',
            border: '2px solid #333',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)'
        }}>
            <div style={{
                width: '100%',
                height: '100%',
                position: 'relative',
                transform: `rotate(${rotation}deg)`,
                transition: 'transform 0.1s ease'
            }}>
                <div style={{
                    position: 'absolute',
                    top: '5px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    color: 'red',
                    fontWeight: 'bold',
                    fontSize: '12px'
                }}>N</div>

                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '3px',
                    height: '30px',
                    background: 'red',
                    borderRadius: '2px'
                }} />

                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '8px',
                    height: '8px',
                    background: '#333',
                    borderRadius: '50%'
                }} />

                <div style={{
                    position: 'absolute',
                    bottom: '8px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    color: '#333',
                    fontSize: '10px',
                    fontWeight: 'bold'
                }}>S</div>
            </div>
        </div>
    );
}

// ==========================================================
// 🔹 COMPONENTE DE EDIFICIO - SOLO ILUMINACIÓN AL CLICK
// ==========================================================
function BuildingModel({
                           id,
                           path,
                           color,
                           position,
                           scale,
                           rotation = [0, 0, 0],
                           onSelect,
                           highlightedBuildings, // Edificios del contexto
                           clickedBuildings,     // Edificios clickeados manualmente
                       }) {
    const { scene } = useGLTF(path);

    // Combinar ambas selecciones: highlighted (contexto) + clicked (manual)
    const isHighlighted =
        Array.isArray(highlightedBuildings)
            ? highlightedBuildings.some((b) => b.id === id)
            : false;

    const isClicked =
        Array.isArray(clickedBuildings)
            ? clickedBuildings.some((b) => b.id === id)
            : false;

    // El edificio está iluminado solo si está seleccionado por click o contexto
    const shouldHighlight = isHighlighted || isClicked;

    // Rotación inicial
    useEffect(() => {
        if (!scene) return;
        scene.rotation.set(rotation[0], rotation[1], rotation[2]);
    }, [scene, rotation]);

    // 🔹 Iluminación dinámica - SOLO PARA CLICK
    useEffect(() => {
        if (!scene) return;
        scene.traverse((child) => {
            if (child.isMesh) {
                if (shouldHighlight) {
                    child.material.emissive = new THREE.Color(color);
                    child.material.emissiveIntensity = 0.8;
                } else {
                    child.material.emissive = new THREE.Color("black");
                    child.material.emissiveIntensity = 0;
                }
            }
        });
    }, [shouldHighlight, scene, color]);

    if (!scene) return null;

    return (
        <primitive
            object={scene}
            scale={scale}
            position={position}
            onClick={(e) => {
                e.stopPropagation();
                onSelect({ id, position, color });
            }}
        />
    );
}

// ==========================================================
// 🔹 ÍCONOS ANIMADOS - MEJORADO PARA MOSTRAR MÚLTIPLES EDIFICIOS
// ==========================================================
function AnimatedIcons({ buildings, visible }) {
    const icons = [
        { Icon: AssignmentIcon, offset: new THREE.Vector3(-40, 0, 0), label: "Trámites" },
        { Icon: ContactPhoneIcon, offset: new THREE.Vector3(0, 0, 40), label: "Contacto" },
        { Icon: InfoIcon, offset: new THREE.Vector3(40, 0, 0), label: "Información" },
    ];

    const [progress, setProgress] = useState(0);
    const [currentBuildings, setCurrentBuildings] = useState(buildings);

    useEffect(() => {
        if (buildings) setCurrentBuildings(buildings);
    }, [buildings]);

    useFrame(() => {
        setProgress((prev) => {
            if (visible && prev < 1) return Math.min(prev + 0.05, 1);
            if (!visible && prev > 0) return Math.max(prev - 0.05, 0);
            return prev;
        });
    });

    if (!currentBuildings || progress <= 0) return null;

    // 🔹 Normaliza a array para soportar uno o varios edificios
    const buildingsArray = Array.isArray(currentBuildings)
        ? currentBuildings
        : [currentBuildings];

    return (
        <>
            {buildingsArray.map((b, index) =>
                icons.map((item, i) => {
                    if (!b.position) return null;

                    const pos = new THREE.Vector3().lerpVectors(
                        new THREE.Vector3(0, 0, 0),
                        item.offset,
                        progress
                    );

                    return (
                        <Html
                            key={`${b.id}-${i}-${index}`}
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
    return <primitive object={scene} scale={50} position={[25, 0, 0]} rotation={[0, (300 * Math.PI) / 180, 0]} />;
}

// ==========================================================
// 🔹 CONTROLES MINECRAFT (FIRST PERSON) - CÁMARA ELEVADA
// ==========================================================
function MinecraftControls() {
    const { camera, gl } = useThree();
    const moveState = useRef({
        forward: false,
        backward: false,
        left: false,
        right: false,
        jump: false,
        sprint: false
    });

    const topViewMoveState = useRef({
        up: false,
        down: false,
        left: false,
        right: false
    });

    const velocity = useRef(new THREE.Vector3());
    const direction = useRef(new THREE.Vector3());

    const walkSpeed = 10;
    const sprintSpeed = 20;
    const currentSpeed = useRef(walkSpeed);
    const topViewSpeed = 0.5;
    const zoomSpeed = 2;
    const jumpForce = 12;
    const gravity = -25;

    // 🔹 AJUSTE: Alturas más elevadas
    const initialHeight = 15; // Aumentado de 10 a 15
    const minHeight = 15;     // Aumentado de 10 a 15 (altura mínima del suelo)
    const maxHeight = 100;    // Altura máxima para salto

    const [isGrounded, setIsGrounded] = useState(true);
    const [isMouseLooking, setIsMouseLooking] = useState(false);
    const [isTopView, setIsTopView] = useState(false);
    const [isTopViewDragging, setIsTopViewDragging] = useState(false);
    const raycaster = useRef(new THREE.Raycaster());
    const pointerLockRequested = useRef(false);
    const originalPosition = useRef(new THREE.Vector3());
    const lastMousePosition = useRef({ x: 0, y: 0 });

    useEffect(() => {
        // 🔹 AJUSTE: Posición inicial más elevada
        camera.position.set(0, initialHeight, 0);
        camera.rotation.order = 'YXZ';
        originalPosition.current.copy(camera.position);
    }, [camera]);

    useEffect(() => {
        const handlePointerLockChange = () => {
            if (document.pointerLockElement === gl.domElement) {
                setIsMouseLooking(true);
                pointerLockRequested.current = false;
            } else {
                setIsMouseLooking(false);
                pointerLockRequested.current = false;
            }
        };

        const handlePointerLockError = () => {
            setIsMouseLooking(false);
            pointerLockRequested.current = false;
        };

        document.addEventListener('pointerlockchange', handlePointerLockChange);
        document.addEventListener('pointerlockerror', handlePointerLockError);

        return () => {
            document.removeEventListener('pointerlockchange', handlePointerLockChange);
            document.removeEventListener('pointerlockerror', handlePointerLockError);
        };
    }, [gl.domElement]);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (isTopView) {
                switch (event.code) {
                    case 'Space':
                        returnToFirstPerson();
                        break;
                }
                return;
            }

            switch (event.code) {
                case 'ArrowUp':
                    moveState.current.forward = true;
                    break;
                case 'ArrowDown':
                    moveState.current.backward = true;
                    break;
                case 'ArrowLeft':
                    moveState.current.left = true;
                    break;
                case 'ArrowRight':
                    moveState.current.right = true;
                    break;
                case 'Space':
                    if (isGrounded) {
                        moveState.current.jump = true;
                        velocity.current.y = jumpForce;
                        setIsGrounded(false);
                    }
                    break;
                case 'ShiftLeft':
                case 'ShiftRight':
                    moveState.current.sprint = true;
                    currentSpeed.current = sprintSpeed;
                    break;
                case 'KeyC':
                    switchToTopView();
                    break;
            }
        };

        const handleKeyUp = (event) => {
            if (isTopView) return;

            switch (event.code) {
                case 'ArrowUp':
                    moveState.current.forward = false;
                    break;
                case 'ArrowDown':
                    moveState.current.backward = false;
                    break;
                case 'ArrowLeft':
                    moveState.current.left = false;
                    break;
                case 'ArrowRight':
                    moveState.current.right = false;
                    break;
                case 'ShiftLeft':
                case 'ShiftRight':
                    moveState.current.sprint = false;
                    currentSpeed.current = walkSpeed;
                    break;
            }
        };

        const handleMouseMove = (event) => {
            if (isTopView) {
                if (isTopViewDragging) {
                    const deltaX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
                    const deltaY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

                    camera.position.x -= deltaX * topViewSpeed;
                    camera.position.z -= deltaY * topViewSpeed;

                    originalPosition.current.x = camera.position.x;
                    originalPosition.current.z = camera.position.z;

                    const boundary = 800;
                    camera.position.x = THREE.MathUtils.clamp(camera.position.x, -boundary, boundary);
                    camera.position.z = THREE.MathUtils.clamp(camera.position.z, -boundary, boundary);
                }
            } else if (isMouseLooking) {
                const movementX = event.movementX || 0;
                const movementY = event.movementY || 0;

                camera.rotation.y -= movementX * 0.002;
                camera.rotation.x -= movementY * 0.002;

                camera.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, camera.rotation.x));
            }
        };

        const handleWheel = (event) => {
            if (!isTopView) {
                event.preventDefault();
                const zoomAmount = event.deltaY > 0 ? zoomSpeed : -zoomSpeed;

                const newFov = THREE.MathUtils.clamp(
                    camera.fov + zoomAmount,
                    30,
                    90
                );

                camera.fov = newFov;
                camera.updateProjectionMatrix();
            } else {
                event.preventDefault();
                const zoomAmount = event.deltaY > 0 ? 20 : -20;

                const newHeight = THREE.MathUtils.clamp(
                    camera.position.y + zoomAmount,
                    50,
                    800
                );

                camera.position.y = newHeight;
            }
        };

        const handleMouseDown = (event) => {
            if (isTopView) {
                if (event.button === 0 || event.button === 2) {
                    setIsTopViewDragging(true);
                    lastMousePosition.current = { x: event.clientX, y: event.clientY };
                    gl.domElement.style.cursor = 'grabbing';
                }
            } else {
                if ((event.button === 0 || event.button === 2) && !pointerLockRequested.current) {
                    pointerLockRequested.current = true;
                    gl.domElement.requestPointerLock().catch(err => {
                        console.log("Error requesting pointer lock:", err);
                        pointerLockRequested.current = false;
                    });
                }
            }
        };

        const handleMouseUp = (event) => {
            if (isTopView) {
                if (event.button === 0 || event.button === 2) {
                    setIsTopViewDragging(false);
                    gl.domElement.style.cursor = 'crosshair';
                }
            } else {
                if (event.button === 0 || event.button === 2) {
                    if (document.pointerLockElement && !pointerLockRequested.current) {
                        document.exitPointerLock();
                    }
                }
            }
        };

        const handleContextMenu = (event) => {
            event.preventDefault();
        };

        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('wheel', handleWheel, { passive: false });

        gl.domElement.addEventListener('mousedown', handleMouseDown);
        gl.domElement.addEventListener('mouseup', handleMouseUp);
        gl.domElement.addEventListener('contextmenu', handleContextMenu);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('keyup', handleKeyUp);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('wheel', handleWheel);

            gl.domElement.removeEventListener('mousedown', handleMouseDown);
            gl.domElement.removeEventListener('mouseup', handleMouseUp);
            gl.domElement.removeEventListener('contextmenu', handleContextMenu);
        };
    }, [gl, camera, isGrounded, isMouseLooking, isTopView, isTopViewDragging]);

    const switchToTopView = () => {
        if (isTopView) return;

        if (document.pointerLockElement) {
            document.exitPointerLock();
        }

        originalPosition.current.copy(camera.position);

        // 🔹 AJUSTE: Vista superior más elevada
        camera.position.set(originalPosition.current.x, 250, originalPosition.current.z);
        camera.rotation.set(-Math.PI / 2, 0, 0);
        camera.fov = 60;
        camera.updateProjectionMatrix();

        gl.domElement.style.cursor = 'grab';

        setIsTopView(true);
        setIsMouseLooking(false);
    };

    const returnToFirstPerson = () => {
        if (!isTopView) return;

        // 🔹 AJUSTE: Volver a la altura inicial elevada
        camera.position.set(originalPosition.current.x, initialHeight, originalPosition.current.z);
        camera.rotation.set(0, 0, 0);
        camera.fov = 75;
        camera.updateProjectionMatrix();

        gl.domElement.style.cursor = 'crosshair';

        setIsTopView(false);
        setIsTopViewDragging(false);
    };

    const checkGrounded = () => {
        raycaster.current.set(camera.position, new THREE.Vector3(0, -1, 0));
        const groundDistance = minHeight + 0.1; // 🔹 AJUSTE: Distancia al suelo actualizada
        return raycaster.current.ray.origin.y - groundDistance <= 0;
    };

    useFrame((state, delta) => {
        if (isTopView) return;

        if (!isGrounded) {
            velocity.current.y += gravity * delta;
        }

        direction.current.set(0, 0, 0);

        if (moveState.current.forward) {
            direction.current.z -= 1;
        }
        if (moveState.current.backward) {
            direction.current.z += 1;
        }
        if (moveState.current.left) {
            direction.current.x -= 1;
        }
        if (moveState.current.right) {
            direction.current.x += 1;
        }

        if (direction.current.length() > 0) {
            direction.current.normalize();
        }

        direction.current.applyEuler(new THREE.Euler(0, camera.rotation.y, 0));
        direction.current.multiplyScalar(currentSpeed.current * delta);

        velocity.current.x = direction.current.x;
        velocity.current.z = direction.current.z;

        camera.position.x += velocity.current.x;
        camera.position.z += velocity.current.z;
        camera.position.y += velocity.current.y * delta;

        const grounded = checkGrounded();
        if (grounded && camera.position.y < minHeight) {
            // 🔹 AJUSTE: Establecer altura mínima elevada
            camera.position.y = minHeight;
            velocity.current.y = 0;
            setIsGrounded(true);
            moveState.current.jump = false;
        } else {
            setIsGrounded(false);
        }

        const boundary = 800;
        camera.position.x = THREE.MathUtils.clamp(camera.position.x, -boundary, boundary);
        camera.position.z = THREE.MathUtils.clamp(camera.position.z, -boundary, boundary);

        // 🔹 AJUSTE: Límite máximo de altura actualizado
        if (camera.position.y > maxHeight) {
            camera.position.y = maxHeight;
            velocity.current.y = Math.min(velocity.current.y, 0);
        }
    });

    return null;
}

// ==========================================================
// 🔹 HOME CON MODELO - SISTEMA DE SELECCIÓN COMBINADO
// ==========================================================
function HomeWithModel() {
    const [clickedBuildings, setClickedBuildings] = useState([]); // Múltiples edificios clickeados
    const [highlightedBuildings, setHighlightedBuildings] = useState([]); // Del contexto
    const { highlightedBuildings: contextHighlightedBuildings, trigger } = useContext(MapContext);
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
            setClickedBuildings([]);
            setHighlightedBuildings([]);
        };
    }, []);

    // Manejar cambios en el contexto de highlightedBuildings
    useEffect(() => {
        if (!mountedRef.current) return;

        if (Array.isArray(contextHighlightedBuildings) && contextHighlightedBuildings.length > 0) {
            // Convertir los IDs del contexto en datos completos de edificios
            const highlightedData = edificios
                .filter((b) => contextHighlightedBuildings.includes(b.id))
                .map((b) => ({
                    id: b.id,
                    position: b.position,
                    color: b.color,
                }));
            setHighlightedBuildings(highlightedData);
        } else {
            setHighlightedBuildings([]);
        }
    }, [contextHighlightedBuildings, trigger]);

    // 🔹 CORRECIÓN: Función para manejar click en edificios - SELECCIÓN ÚNICA
    const handleBuildingSelect = (building) => {
        setClickedBuildings(prev => {
            const isAlreadySelected = prev.some(b => b.id === building.id);

            if (isAlreadySelected) {
                // Si ya está seleccionado, lo deseleccionamos
                return [];
            } else {
                // Si no está seleccionado, seleccionamos solo este edificio
                return [building];
            }
        });
    };

    // 🔹 NUEVA FUNCIÓN: Deseleccionar todos los edificios al hacer click en el fondo
    const handleBackgroundClick = (event) => {
        // Solo deseleccionar si se hizo click en el piso (no en un edificio)
        if (event.object && event.object.isMesh) {
            // Verificar si es el piso (por posición o alguna propiedad)
            if (event.object.position.y === -2) { // El piso está en Y = -2
                setClickedBuildings([]);
            }
        }
    };

    // Combinar todas las selecciones para mostrar íconos
    const allSelectedBuildings = [...clickedBuildings, ...highlightedBuildings];

    return (
        <div style={{ width: "100%", height: "100vh", position: "relative" }}>
            <HtmlCompass />

            <Canvas
                // 🔹 AJUSTE: Cámara inicial más elevada
                camera={{ position: [0, 150, 300], fov: 75 }}
                gl={{ alpha: true }}
                style={{ background: "#b3e5ff", cursor: 'crosshair' }}
            >
                <ambientLight intensity={0.6} />
                <directionalLight position={[15, 20, 10]} />

                {/* Piso con manejo de clicks */}
                <mesh
                    rotation-x={-Math.PI / 2}
                    position={[0, -2, 0]}
                    onClick={handleBackgroundClick}
                >
                    <planeGeometry args={[2000, 2000]} />
                    <meshStandardMaterial color="#37F731" />
                </mesh>

                {/* Edificios con soporte para selección múltiple */}
                {edificios.map((edificio) => (
                    <BuildingModel
                        key={edificio.id}
                        {...edificio}
                        highlightedBuildings={highlightedBuildings}
                        clickedBuildings={clickedBuildings}
                        onSelect={handleBuildingSelect}
                    />
                ))}

                {/* Íconos animados para todos los edificios seleccionados */}
                {allSelectedBuildings.length > 0 && (
                    <AnimatedIcons
                        buildings={allSelectedBuildings}
                        visible={allSelectedBuildings.length > 0}
                    />
                )}

                <MinecraftControls />
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