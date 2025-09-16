"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { FontLoader, Font } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

const AnimatedAuthText = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement);
    }

    const loader = new FontLoader();
    loader.load("/fonts/helvetiker_bold.typeface.json", (font: Font) => {
      const textGeometry = new TextGeometry("Sign Up", {
        font,
        size: 1,
        height: 0.2,
      });

      const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
      const textMesh = new THREE.Mesh(textGeometry, material);
      scene.add(textMesh);

      textMesh.position.set(-2, 0, 0);
      camera.position.z = 5;

      const animate = () => {
        requestAnimationFrame(animate);
        textMesh.rotation.y += 0.01;
        renderer.render(scene, camera);
      };

      animate();
    });

    return () => {
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} />;
};

export default AnimatedAuthText;
