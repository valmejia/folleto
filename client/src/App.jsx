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
import Tramites from "./components/Tramites/Tramites";

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
// 🔹 COMPONENTE DE VEGETACIÓN - SIN ILUMINACIÓN ESPECIAL
// ==========================================================
function VegetationModel({
                             id,
                             path,
                             position,
                             scale,
                             rotation = [0, 0, 0],
                         }) {
    const { scene } = useGLTF(path);

    // Rotación inicial
    useEffect(() => {
        if (!scene) return;
        scene.rotation.set(rotation[0], rotation[1], rotation[2]);
    }, [scene, rotation]);

    if (!scene) return null;

    return (
        <primitive
            object={scene}
            scale={scale}
            position={position}
        />
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
function AnimatedIcons({ buildings, visible, onContactClick }) {
    const icons = [
        { Icon: AssignmentIcon, offset: new THREE.Vector3(-40, 0, 0), label: "Trámites" },
        {
            Icon: ContactPhoneIcon,
            offset: new THREE.Vector3(0, 0, 40),
            label: "Contacto",
            action: (building) => {
                console.log("Click en contacto del edificio:", building.id);
                if (onContactClick) {
                    onContactClick(building.id);
                }
            }
        },
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
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (item.action) {
                                        item.action(b);
                                    } else {
                                        alert(`${item.label} del Edificio ${b.id}`);
                                    }
                                }}
                                style={{
                                    cursor: "pointer",
                                    transform: `scale(${0.8 + 0.2 * progress})`,
                                    opacity: progress,
                                    transition: "transform 0.2s ease, opacity 0.2s ease",
                                    background: "rgba(255, 255, 255, 0.9)",
                                    border: "2px solid #1976d2",
                                    borderRadius: "50%",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    width: "50px",
                                    height: "50px",
                                    boxShadow: "0 4px 8px rgba(0,0,0,0.3)"
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = `scale(${1.1 + 0.2 * progress})`;
                                    e.currentTarget.style.background = "rgba(25, 118, 210, 0.1)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = `scale(${0.8 + 0.2 * progress})`;
                                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.9)";
                                }}
                            >
                                <item.Icon style={{
                                    fontSize: 28,
                                    color: "#1976d2"
                                }} />
                            </div>
                        </Html>
                    );
                })
            )}
        </>
    );
}

// ==========================================================
// 🔹 CONTROLES MINECRAFT (FIRST PERSON) - CORREGIDO SIN OJO DE PEZ
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

    const walkSpeed = 30;
    const sprintSpeed = 40;
    const currentSpeed = useRef(walkSpeed);
    const topViewSpeed = 0.5;
    const zoomSpeed = 1; // Reducido para zoom más suave
    const jumpForce = 12;
    const gravity = -25;

    // 🔹 AJUSTE: Alturas más elevadas
    const initialHeight = 15;
    const minHeight = 15;
    const maxHeight = 100;

    const [isGrounded, setIsGrounded] = useState(true);
    const [isMouseLooking, setIsMouseLooking] = useState(false);
    const [isTopView, setIsTopView] = useState(false);
    const [isTopViewDragging, setIsTopViewDragging] = useState(false);
    const raycaster = useRef(new THREE.Raycaster());
    const pointerLockRequested = useRef(false);
    const originalPosition = useRef(new THREE.Vector3());
    const lastMousePosition = useRef({ x: 0, y: 0 });

    useEffect(() => {
        // Configuración de cámara para reducir distorsión
        camera.position.set(0, initialHeight, 0);
        camera.rotation.order = 'YXZ';

        // Ajustar el near plane para mejor calidad
        camera.near = 0.1;
        camera.far = 2000;

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

                // 🔹 CAMBIO: Rango de FOV más conservador para evitar distorsión
                const newFov = THREE.MathUtils.clamp(
                    camera.fov + zoomAmount,
                    45,  // Mínimo aumentado (era 30)
                    65   // Máximo reducido (era 90)
                );

                camera.fov = newFov;
                camera.updateProjectionMatrix();
            } else {
                event.preventDefault();
                const zoomAmount = event.deltaY > 0 ? 80 : -80;

                const newHeight = THREE.MathUtils.clamp(
                    camera.position.y + zoomAmount,
                    350,
                    950
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

        // 🔹 CAMBIO: FOV reducido para vista más natural
        camera.position.set(originalPosition.current.x, initialHeight, originalPosition.current.z);
        camera.rotation.set(0, 0, 0);
        camera.fov = 55; // Reducido de 100 a 55
        camera.updateProjectionMatrix();

        gl.domElement.style.cursor = 'crosshair';

        setIsTopView(false);
        setIsTopViewDragging(false);
    };

    const checkGrounded = () => {
        raycaster.current.set(camera.position, new THREE.Vector3(0, -1, 0));
        const groundDistance = minHeight + 0.1;
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

        if (camera.position.y > maxHeight) {
            camera.position.y = maxHeight;
            velocity.current.y = Math.min(velocity.current.y, 0);
        }
    });

    return null;
}

// ==========================================================
// 🔹 COMPONENTE DE VEGETACIÓN - RENDERIZA TODOS LOS ÁRBOLES/ARBUSTOS
// ==========================================================
function Vegetation() {
    // Definición de todos los modelos de vegetación
    const vegetationModels = [
        // Piños
        { id: "pino", path: "/models/pinos.glb", position: [50, 0, 270], scale: [2, 2, 2], rotation: [0, 0, 0] },
        // Arbustos E2
        { id: "arbustoE2", path: "/models/arbustoE2.glb", position: [140, 0, 475], scale: [2.3, 2.3, 2.3], rotation: [0, 0, 0] },
        // Arbustos E1
        { id: "arbustoE1", path: "/models/arbustoE1.glb", position: [146, 0, 384], scale: [2.3, 2.3, 2.3], rotation: [0, 0, 0] },

        // Arbusto edificio B
        { id: "arbustoB1", path: "/models/arbustoB1.glb", position: [-210, 0, 55], scale: [2.3, 2.3, 2.3], rotation: [0, 0, 0] },
        { id: "arbustoB2", path: "/models/arbustoB2.glb", position: [-210, 0, 142], scale: [2.3, 2.3, 2.3], rotation: [0, 0, 0] },

        // Arbusto edificio gastro
        { id: "arbustoC1", path: "/models/arbustoC1.glb", position: [-424, 0, -339], scale: [2.3, 2.3, 2.3], rotation: [0, 0, 0] },
        { id: "arbustoC2", path: "/models/arbustoC2.glb", position: [-424, 0, -251], scale: [2.3, 2.3, 2.3], rotation: [0, 0, 0] },

        // Arbusto edificio gastro
        { id: "arbustoD1", path: "/models/arbustoD1.glb", position: [-424, 0, -815], scale: [2.3, 2.3, 2.3], rotation: [0, 0, 0] },
        { id: "arbustoD2", path: "/models/arbustoD2.glb", position: [-424, 0, -670], scale: [2.3, 2.3, 2.3], rotation: [0, 0, 0] },

        // Árboles A2
        { id: "arbolesA2", path: "/models/ArbolesA2.glb", position: [0, 0, 0], scale: [2.5, 2.5, 2.5], rotation: [0, 0, 0] },

        // Árboles A1
        { id: "arbolesA1", path: "/models/ArbolesA1.glb", position: [-95, 0, 570], scale: [2.5, 2.5, 2.5], rotation: [0, 0, 0] },

        // 3 árboles altos
        { id: "3arbolesaltos", path: "/models/3arbolesaltos.glb", position: [-80, 0, 375], scale: [2.5, 2.5, 2.5], rotation: [0, (180 * Math.PI) / 180, 0] },

        // 3 árboles normales
        { id: "3arboles", path: "/models/3arboles.glb", position: [300, 0, -300], scale: [2.5, 2.5, 2.5], rotation: [0, 0, 0] },

    ];

    return (
        <>
            {vegetationModels.map((model) => (
                <VegetationModel
                    key={model.id}
                    id={model.id}
                    path={model.path}
                    position={model.position}
                    scale={model.scale}
                    rotation={model.rotation}
                />
            ))}
        </>
    );
}

// ==========================================================
// 🔹 HOME CON MODELO - SISTEMA DE SELECCIÓN COMBINADO
// ==========================================================
function HomeWithModel() {
    const [clickedBuildings, setClickedBuildings] = useState([]);
    const [highlightedBuildings, setHighlightedBuildings] = useState([]);
    const [contactOpen, setContactOpen] = useState(false);
    const [selectedEdificioData, setSelectedEdificioData] = useState(null);
    const { highlightedBuildings: contextHighlightedBuildings, trigger } = useContext(MapContext);
    const mountedRef = useRef(false);

    const edificios = [
        { id: "A", path: "/models/EDIFICIOA.glb", color: "red", position: [-273.7, 0, 450], scale: [5.9, 5, 5], rotation: [0, Math.PI, 0] },
        { id: "B", path: "/models/EDIFICIOB.glb", color: "blue", position: [-377, 0, 30], scale: [1.6, 1.7, 1.7], rotation: [0, (90 * Math.PI) / 180, 0] },
        { id: "C", path: "/models/EDIFICIOC.glb", color: "green", position: [-610, 0, -365], scale: [1.6, 1.7, 1.7], rotation: [0, (90 * Math.PI) / 180, 0] },
        { id: "D", path: "/models/EDIFICIOD.glb", color: "purple", position: [-608, 0, -837], scale: [1.6, 1.7, 1.7], rotation: [0, (90 * Math.PI) / 180, 0] },
        { id: "E", path: "/models/EDIFICIOE.glb", color: "yellow", position: [330, 0, 500], scale: [1.6, 1.7, 1.7], rotation: [0, (270 * Math.PI) / 180, 0] },
        { id: "I", path: "/models/EDIFICIOI.glb", color: "orange", position: [-987, 0, -839], scale: [1.6, 1.7, 1.7], rotation: [0, (90 * Math.PI) / 180, 0] },
        { id: "F", path: "/models/EDIFICIOF.glb", color: "red", position: [585, 0, 380], scale: [31, 40, 40], rotation: [0, (90 * Math.PI) / 180, 0] },
        { id: "IND", path: "/models/EDIFICIOINDUSTRIAL.glb", color: "orange", position: [821, 0, 350], scale: [8.5, 18, 13.8], rotation: [0, (180 * Math.PI) / 180, 0] },
        { id: "CAFE", path: "/models/CAFETERIA.glb", color: "pink", position: [231, 0, 15], scale: [7, 7, 6], rotation: [0, (90 * Math.PI) / 180, 0] },
        { id: "AUDITORIO", path: "/models/auditorio.glb", color: "blue", position: [871, 0, -50], scale: [1.6, 1.7, 1.7], rotation: [0, (270 * Math.PI) / 180, 0] },
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
            if (event.object.position.y === -2) {
                setClickedBuildings([]);
            }
        }
    };

    // 🔹 FUNCIÓN: Manejar click en contacto desde los íconos
    const handleContactFromIcon = (buildingId) => {
        const contactDataPorEdificio = {
            "A": {
                nombre: "Edificio A",
                contactos: [
                    {
                        nombre: "CIRILO MARTÍNEZ LIGA",
                        puesto: "JEFE DE LA DIVISIÓN DE INGENIERIA EN SISTEMAS COMPUTACIONALES",
                        correo: "sc@tesoem.edu.mx"
                    }
                ]
            },
            "B": {
                nombre: "Edificio B",
                contactos: [
                    {
                        nombre: "JOSÉ ISRAEL CAMPERO DOMÍNGUEZ",
                        puesto: "DIRECTOR GENERAL",
                        correo: "direccion@tesoem.edu.mx"
                    },
                    {
                        nombre: "MIGUEL ÁNGEL HERNÁNDEZ ESPEJEL",
                        puesto: "SECRETARIO DE EDUCACIÓN",
                        correo: "seduc@edomex.gob.mx"
                    },
                    {
                        nombre: "PABLO ALDO TAPIA BRICEÑO",
                        puesto: "TITULAR DEL ÓRGANO INTERNO DE CONTROL",
                        correo: "contraloria@tesoem.edu.mx"
                    },
                    {
                        nombre: "MARÍA DEL CARMEN ARRIETA LÓPEZ",
                        puesto: "DIRECTORA ACADÉMICA",
                        correo: "dir.acad@tesoem.edu.mx"
                    },
                    {
                        nombre: "JOSÉ ALEJANDRO CRUZ ÁLVAREZ",
                        puesto: "SUBDIRECTOR ACADÉMICO",
                        correo: "sub.academica@tesoem.edu.mx"
                    },
                    {
                        nombre: "ERIKA IVONNE GERALDO MORALES",
                        puesto: "JEFA DEL DEPARTAMENTO DE DESARROLLO ACADÉMICO",
                        correo: "desarrollo.academico@tesoem.edu.mx"
                    },
                    {
                        nombre: "JUAN ALBERTO BERNAL SORIANO",
                        puesto: "JEFE DEL DEPARTAMENTO DE CIENCIAS BÁSICAS",
                        correo: "ciencias.basicas@tesoem.edu.mx"
                    },
                    {
                        nombre: "ALFREDO SEGUNDO PÉREZ",
                        puesto: "JEFE DEL DEPARTAMENTO DE DIFUSIÓN Y CONCERTACIÓN",
                        correo: "difusion@tesoem.edu.mx"
                    },
                    {
                        nombre: "MIGUEL ÁNGEL MORUA RAMÍREZ",
                        puesto: "SUBDIRECTOR DE PLANEACIÓN",
                        correo: "spyc@tesoem.edu.mx"
                    },
                    {
                        nombre: "EDITH OLIVOS ESPINOSA",
                        puesto: "JEFA DEL DEPARTAMENTO DE PLANEACIÓN Y PROGRAMACIÓN",
                        correo: "planeacion@tesoem.edu.mx"
                    },
                    {
                        nombre: "ALEJANDRO TÉLLEZ PEÑA",
                        puesto: "JEFE DEL DEPARTAMENTO DE ESTADÍSTICA Y EVALUACIÓN",
                        correo: "estadistica.evaluacion@tesoem.edu.mx"
                    },
                    {
                        nombre: "JAIME GERARDO GONZÁLEZ ARELLANO",
                        puesto: "SUBDIRECTOR DE SERVICIOS ADMINISTRATIVOS",
                        correo: "sub.sadmin@tesoem.edu.mx"
                    }
                ]
            },
            "C": {
                nombre: "Edificio C",
                contactos: [
                    {
                        nombre: "BEATRIZ ALCANTARA VELÁZQUEZ",
                        puesto: "JEFA DE LA DIVISIÓN DE LICENCIATURA EN GASTRONOMÍA",
                        correo: "gastronomia@tesoem.edu.mx"
                    }
                ]
            },
            "D": {
                nombre: "Edificio D",
                contactos: [
                    {
                        nombre: "JAIME SILVA JUÁREZ",
                        puesto: "JEFE DE LA DIVISIÓN DE INGENIERÍA EN ADMINISTRACIÓN",
                        correo: "ing.admon@tesoem.edu.mx"
                    }
                ]
            },
            "E": {
                nombre: "Edificio E",
                contactos: [
                    {
                        nombre: "MIGUEL ÁNGEL LUCIO LÓPEZ",
                        puesto: "JEFE DE LA DIVISIÓN DE INGENIERÍA SISTEMAS AUTOMOTRICES",
                        correo: "automotrices@tesoem.edu.mx"
                    },
                    {
                        nombre: "BLANCA INÉS VALENCIA VÁZQUEZ",
                        puesto: "JEFA DE LA DIVISIÓN DE INGENIERÍA EN TECNOLOGÍAS DE LA INFORMACIÓN Y COMUNICACIONES",
                        correo: "ing.tics@tesoem.edu.mx"
                    },
                    {
                        nombre: "NORA SOYUKI PORTILLO VÉLEZ",
                        puesto: "SUBDIRECTORA DE POSGRADO E INVESTIGACIÓN",
                        correo: "sub.posgrado@tesoem.edu.mx"
                    },
                    {
                        nombre: "LEONARDO CORTÉS VERGARA",
                        puesto: "JEFE DEL DEPARTAMENTO DE POSGRADO E INVESTIGACIÓN",
                        correo: "posgrado.investigacion@tesoem.edu.mx"
                    },
                    {
                        nombre: "AMBROCIO SÁNCHEZ CRUZ",
                        puesto: "DIRECTOR DE PLANEACIÓN Y VINCULACIÓN",
                        correo: "direccion.pv@tesoem.edu.mx"
                    },
                    {
                        nombre: "EDGAR OSIRIS GARCÍA IBARRA",
                        puesto: "SUBDIRECTOR DE VINCULACIÓN",
                        correo: "sub.vinculacion@tesoem.edu.mx"
                    },
                    {
                        nombre: "ANDREA MORENO RIVERA",
                        puesto: "JEFA DEL DEPARTAMENTO DE VINCULACIÓN",
                        correo: "vinculacion@tesoem.edu.mx"
                    },
                    {
                        nombre: "SILVIA GLORIA MENDOZA FERNÁNDEZ",
                        puesto: "JEFA DEL DEPARTAMENTO DE RESIDENCIAS PROFESIONALES Y SERVICIO SOCIAL",
                        correo: "ss.rp@tesoem.edu.mx"
                    }
                ]
            },
            "I": {
                nombre: "Edificio I",
                contactos: [
                    {
                        nombre: "TERESITA DE JESÚS SUÁREZ ALTAMIRANO",
                        puesto: "JEFA DE LA DIVISIÓN DE CONTADOR PÚBLICO",
                        correo: "cp@tesoem.edu.mx"
                    },
                    {
                        nombre: "RAMÓN EDUARDO MARTÍNEZ GRIMALDO",
                        puesto: "JEFE DE LA DIVISIÓN DE INGENIERÍA EN ENERGÍAS RENOVABLES",
                        correo: "i.renovables@tesoem.edu.mx"
                    }
                ]
            },
            "IND": {
                nombre: "Edificio Industrial",
                contactos: [
                    {
                        nombre: "ING. PATRICIA LÓPEZ GUTIÉRREZ",
                        puesto: "COORDINADORA ÁREA INDUSTRIAL",
                        correo: "industrial@tesoem.edu.mx"
                    },
                    {
                        nombre: "ING. RAÚL MARTÍNEZ",
                        puesto: "JEFE DE TALLERES INDUSTRIALES",
                        correo: "talleresindustrial@tesoem.edu.mx"
                    }
                ]
            },
            "CAFE": {
                nombre: "Cafetería",
                contactos: [
                    {
                        nombre: "C. ANA MARÍA TORRES",
                        puesto: "ENCARGADA DE CAFETERÍA",
                        correo: "cafeteria@tesoem.edu.mx"
                    },
                    {
                        nombre: "C. LUIS HERNÁNDEZ",
                        puesto: "SUPLEMENTOS Y ALMACÉN",
                        correo: "almacencafeteria@tesoem.edu.mx"
                    }
                ]
            }
        };

        const datosEdificio = contactDataPorEdificio[buildingId];
        if (datosEdificio) {
            setSelectedEdificioData(datosEdificio);
            setContactOpen(true);
        } else {
            // Si no hay datos específicos, mostrar datos genéricos
            setSelectedEdificioData({
                nombre: `Edificio ${buildingId}`,
                contactos: [
                    {
                        nombre: "COORDINADOR DEL EDIFICIO",
                        puesto: "INFORMACIÓN DE CONTACTO",
                        correo: `edificio${buildingId.toLowerCase()}@tesoem.edu.mx`
                    }
                ]
            });
            setContactOpen(true);
        }
    };

    // Combinar todas las selecciones para mostrar íconos
    const allSelectedBuildings = [...clickedBuildings, ...highlightedBuildings];

   // const { scene } = useGLTF('/models/EXPLANADA.glb');

    return (
        <div style={{ width: "100%", height: "100vh", position: "relative" }}>
            <HtmlCompass />

            {/* Popup de Contacto - FUERA del Canvas */}
            {contactOpen && selectedEdificioData && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    zIndex: 9999,
                    display: 'flex'
                }}>
                    <div style={{
                        width: window.innerWidth <= 600 ? '90%' : '400px',
                        height: '100%',
                        backgroundColor: 'white',
                        boxShadow: '2px 0 10px rgba(0,0,0,0.3)',
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        {/* Header del popup */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '16px',
                            backgroundColor: '#1976d2',
                            color: 'white'
                        }}>
                            <h2 style={{ margin: 0, fontSize: '1.25rem' }}>
                                Contacto - {selectedEdificioData.nombre}
                            </h2>
                            <button
                                onClick={() => {
                                    setContactOpen(false);
                                    setSelectedEdificioData(null);
                                }}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: 'white',
                                    fontSize: '24px',
                                    cursor: 'pointer'
                                }}
                            >
                                ×
                            </button>
                        </div>

                        {/* Contenido del popup */}
                        <div style={{
                            padding: '16px',
                            overflow: 'auto',
                            flex: 1
                        }}>
                            <div style={{ marginBottom: '24px' }}>
                                <h3 style={{
                                    color: '#1976d2',
                                    marginBottom: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}>
                                    <span style={{ fontSize: '20px' }}>🏢</span>
                                    {selectedEdificioData.nombre}
                                </h3>

                                <div>
                                    {selectedEdificioData.contactos.map((contacto, contactIndex) => (
                                        <div key={contactIndex}>
                                            <div style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'flex-start',
                                                padding: '8px 0'
                                            }}>
                                                <strong style={{ fontSize: '14px' }}>
                                                    {contacto.nombre}
                                                </strong>
                                                <span style={{
                                                    fontSize: '12px',
                                                    color: '#666',
                                                    marginTop: '4px'
                                                }}>
                                                    {contacto.puesto}
                                                </span>
                                                <div style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '4px',
                                                    marginTop: '4px'
                                                }}>
                                                    <span style={{ fontSize: '16px' }}>📧</span>
                                                    <a
                                                        href={`mailto:${contacto.correo}`}
                                                        style={{
                                                            fontSize: '12px',
                                                            color: '#1976d2',
                                                            textDecoration: 'none'
                                                        }}
                                                        onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                                                        onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                                                    >
                                                        {contacto.correo}
                                                    </a>
                                                </div>
                                            </div>
                                            {contactIndex < selectedEdificioData.contactos.length - 1 && (
                                                <hr style={{
                                                    margin: '8px 0',
                                                    border: 'none',
                                                    borderTop: '1px solid #e0e0e0'
                                                }} />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Fondo clickeable para cerrar */}
                    <div
                        style={{
                            flex: 1,
                            height: '100%'
                        }}
                        onClick={() => {
                            setContactOpen(false);
                            setSelectedEdificioData(null);
                        }}
                    />
                </div>
            )}

            <Canvas
                camera={{
                    position: [0, 30, 200],
                    fov: 55, // 🔹 CAMBIO: Reducido de 75 a 55
                    near: 0.1,
                    far: 2000
                }}
                gl={{
                    alpha: true,
                    antialias: true // 🔹 Mejorar calidad
                }}
                style={{
                    background: "#b3e5ff",
                    cursor: 'crosshair'
                }}
                shadows // 🔹 Opcional: activar sombras si las necesitas
            >
                <ambientLight intensity={0.6} />
                <directionalLight
                    position={[15, 20, 10]}
                    castShadow // 🔹 Opcional
                />

                {/* Piso con manejo de clicks */}
                <mesh
                    rotation-x={-Math.PI / 2}
                    position={[0, 0, 0]}
                    onClick={handleBackgroundClick}
                >
                    <planeGeometry args={[5000, 5000]} />
                    <meshStandardMaterial color="#87E753" />
                </mesh>

                {/* Piso con manejo de clicks
                <primitive
                    object={scene}
                    position={[0, 0, 500]}
                    scale={[2, 2, 2]}
                    onClick={handleBackgroundClick}
                />
                */}

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

                {/* Vegetación - agregada como componente separado */}
                <Vegetation />

                {/* Íconos animados para todos los edificios seleccionados */}
                {allSelectedBuildings.length > 0 && (
                    <AnimatedIcons
                        buildings={allSelectedBuildings}
                        visible={allSelectedBuildings.length > 0}
                        onContactClick={handleContactFromIcon}
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
                <Route path="/tramites" element={<Tramites />} />
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