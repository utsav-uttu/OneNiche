import { motion } from "framer-motion";

const GridBackground = () => {
    return (
        <div className="grid-background">
            <div className="grid-pattern"></div>
            <div className="grid-overlay"></div>

            {/* Floating Orbs for extra 'pop' */}
            <motion.div
                className="orb orb-1"
                animate={{
                    x: [0, 100, 0],
                    y: [0, -50, 0],
                    scale: [1, 1.2, 1]
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                }}
            />
            <motion.div
                className="orb orb-2"
                animate={{
                    x: [0, -100, 0],
                    y: [0, 50, 0],
                    scale: [1, 1.3, 1]
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "linear"
                }}
            />
        </div>
    );
};

export default GridBackground;
