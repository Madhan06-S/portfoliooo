import React, { useRef, useState, useEffect, Suspense } from 'react';
import { useThree } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import gsap from 'gsap';
import { playBackgroundMusic } from '../../../utils/audioManager';
import { useAudio } from '../../../context/AudioManager';
import { useAchievements } from '../../../context/AchievementsContext';

const MODEL_PATH = '/models/portfolio-entrance.glb';

// Preload GLB model asset
useGLTF.preload(MODEL_PATH);

const BlenderEntranceContent = ({ position = [0, 0, 22], onComplete }) => {
  const groupRef = useRef();
  const leftHingeRef = useRef();
  const rightHingeRef = useRef();

  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const { camera } = useThree();
  const { unlockAchievement } = useAchievements();
  const { play } = useAudio();

  // Ambient audio loop
  const ambientSoundsRef = useRef({ wind: null, birds: null });

  useEffect(() => {
    let wind, birds;
    try {
      wind = play('szumwiatru', { loop: true, volume: 0.25 });
      birds = play('birds', { loop: true, volume: 0.20 });
      ambientSoundsRef.current.wind = wind;
      ambientSoundsRef.current.birds = birds;
    } catch (err) {
      console.warn('Audio play warning:', err);
    }

    return () => {
      try {
        wind?.stop();
        birds?.stop();
      } catch (e) {}
    };
  }, [play]);

  // Load 3D GLB model
  const { scene, nodes, animations } = useGLTF(MODEL_PATH);
  const { actions } = useAnimations(animations, groupRef);

  // CRITICAL FIX: Play ONLY ambient animations (sign sway, mouse swing, cat idle)
  // Explicitly STOP and RESET door actions so doors remain CLOSED on mount
  useEffect(() => {
    if (actions) {
      Object.entries(actions).forEach(([name, action]) => {
        if (
          name.toLowerCase().includes('door') ||
          name.toLowerCase().includes('hinge') ||
          name.toLowerCase().includes('left_door') ||
          name.toLowerCase().includes('right_door')
        ) {
          try {
            action.stop();
            action.reset();
          } catch (e) {}
        } else {
          try {
            action.play();
          } catch (e) {}
        }
      });
    }
  }, [actions]);

  // Traverse scene to setup shadows, material roughness, and locate door hinge nodes
  useEffect(() => {
    if (scene) {
      scene.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          if (child.material) {
            child.material.needsUpdate = true;
            if (child.material.roughness !== undefined) {
              child.material.roughness = Math.max(child.material.roughness, 0.35);
            }
          }
        }
        if (child.name === 'Left_Door_Hinge' || child.name.includes('Left_Door_Hinge')) {
          leftHingeRef.current = child;
          child.rotation.y = 0;
        }
        if (child.name === 'Right_Door_Hinge' || child.name.includes('Right_Door_Hinge')) {
          rightHingeRef.current = child;
          child.rotation.y = 0;
        }
      });

      if (!leftHingeRef.current && nodes.Left_Door) {
        leftHingeRef.current = nodes.Left_Door.parent || nodes.Left_Door;
      }
      if (!rightHingeRef.current && nodes.Right_Door) {
        rightHingeRef.current = nodes.Right_Door.parent || nodes.Right_Door;
      }

      // Guarantee initial door state is 100% CLOSED
      if (leftHingeRef.current) leftHingeRef.current.rotation.y = 0;
      if (rightHingeRef.current) rightHingeRef.current.rotation.y = 0;
    }
  }, [scene, nodes]);

  // CRITICAL FIX: Position camera to match Blender preview framing (wide diorama composition)
  useEffect(() => {
    if (camera) {
      // Wall is at position [0, 0, 22]
      // In Blender, camera was at Y=-15.2 (Z=+15.2 in Three.js), Z=3.15 (Y=3.15 in Three.js)
      const targetX = position[0];
      const targetY = position[1] + 3.15;
      const targetZ = position[2] + 15.2;

      camera.position.set(targetX, targetY, targetZ);
      camera.lookAt(position[0], position[1] + 2.3, position[2]);
    }
  }, [camera, position]);

  // Pointer cursor on desktop hover
  useEffect(() => {
    if (isHovered && !isOpen && !isAnimating) {
      document.body.style.cursor = 'pointer';
    } else {
      document.body.style.cursor = 'auto';
    }
    return () => {
      document.body.style.cursor = 'auto';
    };
  }, [isHovered, isOpen, isAnimating]);

  // Helper to check if an object is part of the interactive door area
  const isDoorObject = (obj) => {
    let curr = obj;
    while (curr) {
      if (
        curr.name &&
        (curr.name.includes('Door') ||
          curr.name.includes('Frame') ||
          curr.name.includes('Handle') ||
          curr.name.includes('Hinge') ||
          curr.name.includes('Plaque') ||
          curr.name.includes('Tech'))
      ) {
        return true;
      }
      curr = curr.parent;
    }
    return false;
  };

  // Door click / touch tap handler
  const handleDoorClick = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    if (isOpen || isAnimating) return;

    document.body.style.cursor = 'auto';
    setIsOpen(true);
    setIsAnimating(true);

    // Trigger UI overlay exit transition
    window.dispatchEvent(new CustomEvent('entranceTransitionStart'));

    // Fade ambient audio
    if (ambientSoundsRef.current.wind) {
      try {
        gsap.to(ambientSoundsRef.current.wind, { volume: 0, duration: 3.5 });
        gsap.to(ambientSoundsRef.current.birds, { volume: 0.05, duration: 3.5 });
      } catch (err) {}
    }

    // Play door unlocking sound
    try {
      play('uchyleniedrzwi', { volume: 0.8 });
    } catch (e) {}

    const tl = gsap.timeline({
      onComplete: () => {
        onComplete?.();
      },
    });

    tl.add(() => {
      try {
        play('otwarciedrzwi', { volume: 0.7 });
      } catch (e) {}
    }, 0.3);

    // Animate Left and Right doors opening smoothly
    if (leftHingeRef.current) {
      tl.to(
        leftHingeRef.current.rotation,
        {
          y: -Math.PI * 0.55,
          duration: 2.2,
          ease: 'power1.inOut',
        },
        0.2
      );
    }

    if (rightHingeRef.current) {
      tl.to(
        rightHingeRef.current.rotation,
        {
          y: Math.PI * 0.55,
          duration: 2.2,
          ease: 'power1.inOut',
        },
        0.2
      );
    }

    // Move camera smoothly forward into corridor through open doorway
    tl.to(
      camera.position,
      {
        z: position[2] - 11,
        y: position[1] + 0.2,
        duration: 3.2,
        ease: 'power2.inOut',
      },
      0.6
    );

    tl.add(() => {
      try {
        playBackgroundMusic();
        unlockAchievement?.('FIRST_STEPS');
      } catch (err) {}
    }, 2.0);
  };

  return (
    <group ref={groupRef} position={position}>
      {/* Essential lighting for GLB materials in R3F scene */}
      <ambientLight intensity={2.2} />
      <directionalLight position={[5, 10, 10]} intensity={1.5} color="#fff6e8" castShadow />
      <directionalLight position={[-5, 8, 5]} intensity={0.8} color="#e0f0ff" />
      <pointLight position={[0, 4, 3]} intensity={1.2} color="#ffe8d0" distance={15} />

      <primitive
        object={scene}
        onPointerOver={(e) => {
          e.stopPropagation();
          if (isDoorObject(e.object)) {
            setIsHovered(true);
          }
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setIsHovered(false);
        }}
        onClick={(e) => {
          e.stopPropagation();
          handleDoorClick(e);
        }}
      />
    </group>
  );
};

const BlenderEntrance = (props) => {
  return (
    <Suspense fallback={null}>
      <BlenderEntranceContent {...props} />
    </Suspense>
  );
};

export default BlenderEntrance;
