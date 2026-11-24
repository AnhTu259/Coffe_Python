import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial } from '@react-three/drei';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero-section" id="home">
      <div className="hero-container">
        <div className="hero-left">
          <h1 className="hero-title">DazzyCoffee</h1>
          <p className="hero-subtitle">Nơi mỗi tách cà phê là một câu chuyện.</p>
          <button className="hero-button">Khám phá ngay</button>
        </div>
        <div className="hero-right">
          <Canvas>
            <Suspense fallback={null}>
              <ambientLight intensity={1} />
              <directionalLight position={[3, 2, 1]} />
              <Sphere args={[1, 100, 200]} scale={2.5}>
                <MeshDistortMaterial color="#D4AF37" attach="material" distort={0.5} speed={2} />
              </Sphere>
              <OrbitControls enableZoom={false} autoRotate />
            </Suspense>
          </Canvas>
        </div>
      </div>
    </section>
  );
};

export default Hero;
