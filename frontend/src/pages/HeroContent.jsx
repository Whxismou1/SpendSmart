import {
  Float,
  MeshDistortMaterial,
  OrbitControls,
  Sphere
} from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  ArrowRight,
  BarChart3,
  Calendar,
  Coins,
  Download,
  Shield,
  TrendingUp,
} from "lucide-react";
import { motion } from "motion/react";
import { Suspense, useRef } from "react";
import { Link } from "react-router-dom";
export const HeroContent = () => {
  const features = [
    {
      icon: <TrendingUp />,
      title: "Seguimiento Inteligente",
      description:
        "Registra y categoriza tus gastos automáticamente con nuestra IA integrada.",
    },
    {
      icon: <BarChart3 />,
      title: "Análisis Avanzado",
      description:
        "Visualiza tus patrones de gasto con gráficas interactivas y reportes detallados.",
    },
    {
      icon: <Shield />,
      title: "Seguridad Total",
      description:
        "Tus datos están protegidos con encriptación de nivel bancario.",
    },
    {
      icon: <Download />,
      title: "Exportación Fácil",
      description: "Descarga tus reportes en Excel o PDF con un solo clic.",
    },
    {
      icon: <Calendar />,
      title: "Planificación",
      description: "Establece presupuestos y metas financieras personalizadas.",
    },
    {
      icon: <Coins />,
      title: "Market Overview",
      description: "Mantente al día con las tendencias del mercado financiero.",
    },
  ];

  function FloatingCoins() {
    const groupRef = useRef(null);
    useFrame((state) => {
      if (groupRef.current) {
        groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
      }
    });
    return (
      <group ref={groupRef}>
        <Float speed={1.5} rotationIntensity={1} floatIntensity={2}>
          <Sphere args={[1, 32, 32]} position={[-4, 2, -2]}>
            <MeshDistortMaterial
              color="#f59e0b"
              attach="material"
              distort={0.2}
              speed={2}
              roughness={0.1}
              metalness={0.9}
            />
          </Sphere>
        </Float>

        <Float speed={2} rotationIntensity={1.5} floatIntensity={1.5}>
          <Sphere args={[0.8, 32, 32]} position={[4, -1, -1]}>
            <MeshDistortMaterial
              color="#10b981"
              attach="material"
              distort={0.3}
              speed={1.5}
              roughness={0.1}
              metalness={0.9}
            />
          </Sphere>
        </Float>

        <Float speed={1.8} rotationIntensity={0.8} floatIntensity={2.5}>
          <Sphere args={[0.6, 32, 32]} position={[2, 3, -3]}>
            <MeshDistortMaterial
              color="#3b82f6"
              attach="material"
              distort={0.5}
              speed={2.5}
              roughness={0.1}
              metalness={0.9}
            />
          </Sphere>
        </Float>
      </group>
    );
  }

  function Scene() {
    return (
      <>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight
          position={[-10, -10, -10]}
          intensity={0.5}
          color="#3b82f6"
        />

        <FloatingCoins />

        {/* <Environment preset="city" background/> */}
        <OrbitControls enableZoom={false} enablePan={false} />
      </>
    );
  }

  return (
    <>
      <section className="relative h-screen flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
            <Suspense fallback={null}>{<Scene />}</Suspense>
          </Canvas>
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              Gestiona tus finanzas
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-300 max-w-2xl mx-auto">
              Toma el control de tus gastos personales con la herramienta más
              intuitiva y poderosa del mercado
            </p>
            <div className="flex justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-full text-lg font-semibold flex items-center justify-center space-x-2 hover:from-emerald-600 hover:to-blue-700 transition-all"
              >
                <span>Comenzar Gratis</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
            className="w-6 h-10 border-2 border-emerald-400 rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
              className="w-1 h-3 bg-emerald-400 rounded-full mt-2"
            />
          </motion.div>
        </motion.div>
      </section>

      <section id="features" className="py-20 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
              Características Principales
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Descubre todas las herramientas que necesitas para gestionar tus
              finanzas de manera inteligente
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:border-emerald-400/50 transition-all"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-lg flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center bg-gradient-to-r from-emerald-500/20 to-blue-600/20 backdrop-blur-lg rounded-3xl p-12 border border-white/20"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            ¿Listo para tomar el control?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Únete a miles de usuarios que ya están transformando su relación con
            el dinero
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-12 py-4 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-full text-xl font-semibold hover:from-emerald-600 hover:to-blue-700 transition-all"
          >
            <Link to="/login">Comenzar ahora</Link>
          </motion.button>
        </motion.div>
      </section>
    </>
  );
};
