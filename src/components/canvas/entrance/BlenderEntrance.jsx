import React, { useRef, useState, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import gsap from 'gsap';
import { playBackgroundMusic } from '../../../utils/audioManager';
import { useAudio } from '../../../context/AudioManager';
import { useAchievements } from '../../../context/AchievementsContext';

const MODEL_PATH = '/models/portfolio-entrance.glb';

// Preload GLB asset
try {
  useGLTF.preload(MODEL_PATH);
} catch (e) {
  console.warn('GLB preload warning:', e);
}

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

  // Play embedded GLB keyframe animations (sign sway, mouse swing, cat idle)
  useEffect(() => {
    if (actions && Object.keys(actions).length > 0) {
      Object.values(actions).forEach((action) => {
        try {
          action.play();
        } catch (e) {}
      });
    }
  }, [actions]);

  // Locate Left_Door_Hinge & Right_Door_Hinge in scene hierarchy
  useEffect(() => {
    if (scene) {
      scene.traverse((child) => {
        if (child.name === 'Left_Door_Hinge' || child.name.includes('Left_Door_Hinge')) {
          leftHingeRef.current = child;
        }
        if (child.name === 'Right_Door_Hinge' || child.name.includes('Right_Door_Hinge')) {
          rightHingeRef.current = child;
        }
      });

      if (!leftHingeRef.current && nodes.Left_Door) {
        leftHingeRef.current = nodes.Left_Door.parent || nodes.Left_Door;
      }
      if (!rightHingeRef.current && nodes.Right_Door) {
        rightHingeRef.current = nodes.Right_Door.parent || nodes.Right_Door;
      }
    }
  }, [scene, nodes]);

  // Adjust starting camera framing to match Blender wide cinematic framing
  useEffect(() => {
    if (camera) {
      gsap.to(camera.position, {
        x: position[0],
        y: position[1] + 1.8,
        z: position[2] + 6.2,
        duration: 1.5,
        ease: 'power2.out',
      });
      camera.lookAt(position[0], position[1] + 1.2, position[2]);
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

  // Door click / touch tap handler
  const handleDoorClick = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    if (isOpen || isAnimating) return;

    document.body.style.cursor = 'auto';
    setIsOpen(true);
    setIsAnimating(true);

    // Trigger UI overlay fade-out
    window.dispatchEvent(new CustomEvent('entranceTransitionStart'));

    // Fade ambient audio
    if (ambientSoundsRef.current.wind) {
      try {
        gsap.to(ambientSoundsRef.current.wind, { volume: 0, duration: 3.5 });
        gsap.to(ambientSoundsRef.current.birds, { volume: 0.05, duration: 3.5 });
      } catch (err) {}
    }

    // Play door opening audio
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

    // Animate Left and Right doors opening
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

    // Move camera smoothly forward into corridor
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
      <primitive
        object={scene}
        onPointerOver={(e) => {
          e.stopPropagation();
          setIsHovered(true);
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setIsHovered(false);
        }}
        onClick={handleDoorClick}
      />
    </group>
  );
};

// Safe error boundary wrapper
const BlenderEntrance = (props) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    console.warn('BlenderEntrance: Error encountered, falling back');
    return null;
  }

  try {
    return <BlenderEntranceContent {...props} />;
  } catch (error) {
    console.warn('BlenderEntrance loading failed, falling back:', error);
    setHasError(true);
    return null;
  }
};

export default BlenderEntrance;
