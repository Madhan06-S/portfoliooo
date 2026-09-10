import { useRef, useMemo } from 'react';
import { useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const SignSystem = (props) => {
    const groupRef = useRef();
    const signTexture = useTexture('/textures/entrance/sign.webp');
    const mountTexture = useTexture('/textures/entrance/belka.webp');

    // Physics random offset
    const timeOffset = useMemo(() => Math.random() * 100, []);

    useFrame((state) => {
        if (groupRef.current) {
            const time = state.clock.elapsedTime + timeOffset;
            // Realistic organic 3D pendulum sway
            const windSwayX = Math.sin(time * 1.8) * 0.04;
            const windSwayZ = Math.cos(time * 1.2) * 0.02;

            groupRef.current.rotation.x = windSwayX;
            groupRef.current.rotation.z = windSwayZ;
        }
    });

    return (
        <group {...props}>
            {/* 1. WOODEN MOUNTING BEAM (Visual Anchor) */}
            <mesh position={[-0.05, 2.05, 0.65]}>
                <planeGeometry args={[2.7, 0.4]} />
                <meshBasicMaterial
                    color="#e0e0e0"
                    map={mountTexture}
                    transparent={true}
                    side={THREE.DoubleSide}
                />
            </mesh>

            {/* 2. HANGING WOODEN PORTFOLIO SIGN (Pivot at top chain anchor) */}
            <group
                ref={groupRef}
                position={[0, 1.9, 0.60]}
            >
                <mesh position={[0, -0.5, 0]}>
                    <planeGeometry args={[2.0, 1.0]} />
                    <meshBasicMaterial
                        color="#e0e0e0"
                        map={signTexture}
                        transparent={true}
                        side={THREE.DoubleSide}
                        depthWrite={false}
                    />
                </mesh>
            </group>
        </group>
    );
};

export default SignSystem;
