import { useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { useState } from "react";
import * as THREE from "three";

export default function Compass() {
    const { camera } = useThree();
    const [angle, setAngle] = useState(0);

    useFrame(() => {
        const dir = camera.getWorldDirection(new THREE.Vector3());
        // Ajuste para que 0° apunte al norte
        const rad = Math.atan2(-dir.x, -dir.z);
        setAngle((prev) => prev + (rad * (180 / Math.PI) - prev) * 0.1); // Lerp suave
    });

    return (
        <Html
            style={{
                position: "fixed",
                bottom: "-220px",
                left: "550px",
                width: "100px",
                height: "100px",
                pointerEvents: "none",
                zIndex: 10,
            }}
        >
            <div
                style={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "50%",
                    border: "3px solid rgba(0,0,0,0.7)",
                    background: "rgba(255,255,255,0.85)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "Arial, sans-serif",
                }}
            >
                {/* Aguja roja */}
                <div
                    style={{
                        width: "4px",
                        height: "40px",
                        background: "red",
                        position: "absolute",
                        top: "10px",
                        transform: `rotate(${angle}deg)`,
                        transformOrigin: "bottom center",
                        borderRadius: "2px",
                        transition: "transform 0.05s linear",
                    }}
                ></div>

                {/* Letras N/S/E/W */}
                <span style={{ position: "absolute", top: "5px", fontWeight: "bold", color: "#333" }}>N</span>
                <span style={{ position: "absolute", bottom: "5px", fontWeight: "bold", color: "#333" }}>S</span>
                <span style={{ position: "absolute", left: "5px", fontWeight: "bold", color: "#333" }}>W</span>
                <span style={{ position: "absolute", right: "5px", fontWeight: "bold", color: "#333" }}>E</span>

                {/* Círculo central */}
                <div
                    style={{
                        width: "10px",
                        height: "10px",
                        background: "#333",
                        borderRadius: "50%",
                        position: "absolute",
                    }}
                ></div>
            </div>
        </Html>
    );
}
