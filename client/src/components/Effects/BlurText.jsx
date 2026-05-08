import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const BlurText = ({
    text = '',
    delay = 0.2,
    className = '',
    animateBy = 'words', // 'words' or 'letters'
    direction = 'top', // 'top' or 'bottom'
}) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.1 }); // Trigger once when 10% visible

    const elements = animateBy === 'words' ? text.split(' ') : text.split('');

    const container = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: delay,
            },
        },
    };

    const child = {
        hidden: {
            filter: 'blur(10px)',
            opacity: 0,
            y: direction === 'top' ? -20 : 20
        },
        visible: {
            filter: 'blur(0px)',
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8, // Smooth slow reveal
                ease: [0.2, 0.65, 0.3, 0.9], // Custom cubic bezier
            },
        },
    };

    return (
        <motion.p
            ref={ref}
            className={`blur-text ${className}`}
            variants={container}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
        >
            {elements.map((word, index) => (
                <motion.span
                    key={index}
                    variants={child}
                    style={{ display: 'inline-block', marginRight: animateBy === 'words' ? '0.25em' : '0' }}
                >
                    {word}
                </motion.span>
            ))}
        </motion.p>
    );
};

export default BlurText;
