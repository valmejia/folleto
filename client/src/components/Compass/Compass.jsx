import { useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { useState } from "react";
import * as THREE from "three";

export default function CompassMinimal() {
    const { camera } = useThree();
    const [angle, setAngle] = useState(0);

    useFrame(() => {
        const dir = camera.getWorldDirection(new THREE.Vector3());
        const rad = Math.atan2(-dir.x, -dir.z);
        const deg = THREE.MathUtils.radToDeg(rad);
        setAngle((prev) => prev + (deg - prev) * 0.1);
    });

    const letters = [
        { label: "N", top: "10%" },
        { label: "S", bottom: "10%" },
        { label: "W", left: "10%" },
        { label: "E", right: "10%" },
    ];

    return (
        <Html
            style={{
                position: "fixed",
                bottom: "-220px",
                left: "560px",
                transform: "translateX(-50%)",
                width: "120px",
                height: "120px",
                pointerEvents: "none",
                zIndex: 10,
            }}
        >
            <div
                style={{
                    width: "120px",
                    height: "120px",
                    borderRadius: "50%",
                    background: "rgba(0,0,0,0.2)",
                    backdropFilter: "blur(4px)",
                    border: "2px solid rgba(255,255,255,0.5)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "'Arial', sans-serif",
                }}
            >
                {/* Flecha roja que apunta según la cámara */}
                <div
                    style={{
                        width: "4px",
                        height: "50px",
                        background: "linear-gradient(to top, #ff4d4d, #ff0000)",
                        position: "absolute",
                        top: "10px",
                        transform: `rotate(${angle}deg)`,
                        transformOrigin: "bottom center",
                        borderRadius: "2px",
                        transition: "transform 0.05s linear",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.4)",
                    }}
                ></div>

                {/* Letras N/S/E/W */}
                {letters.map(({ label, top, bottom, left, right }) => (
                    <span
                        key={label}
                        style={{
                            position: "absolute",
                            top,
                            bottom,
                            left,
                            right,
                            fontWeight: "bold",
                            color: "#ffffff",
                            fontSize: "16px",
                        }}
                    >
                        {label}
                    </span>
                ))}

                {/* Círculo central */}
                <div
                    style={{
                        width: "12px",
                        height: "12px",
                        background: "#ffffff",
                        borderRadius: "50%",
                        position: "absolute",
                        boxShadow: "0 0 6px rgba(0,0,0,0.3)",
                    }}
                />
            </div>
        </Html>
    );
}
