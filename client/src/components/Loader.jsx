import { motion } from "framer-motion";
import PropTypes from "prop-types";

/**
 * Enhanced Loader component with multiple animation types
 * @param {Object} props - Component props
 * @param {string} props.type - Type of loader: "spinner", "dots", "pulse", or "text"
 * @param {string} props.size - Size of the loader: "xs", "sm", "md", "lg", or "xl"
 * @param {boolean} props.fullScreen - Whether to show loader in a fullscreen overlay
 * @param {string} props.text - Text to display for text animation loader (default: "Webmark")
 */
const Loader = (props) => {
  const {
    type = "spinner",
    size = "md",
    fullScreen = false,
    text = "Webmark",
  } = props;

  // Render the spinner loader
  const renderSpinner = () => {
    // Size mappings for spinner
    const spinnerSizes = {
      xs: "h-4 w-4 border-2",
      sm: "h-8 w-8 border-2",
      md: "h-12 w-12 border-3",
      lg: "h-16 w-16 border-4",
      xl: "h-24 w-24 border-4",
    };

    const spinnerSize = spinnerSizes[size] || spinnerSizes.md;

    return (
      <div
        className={`animate-spin rounded-full border-solid border-blue-500 border-t-transparent ${spinnerSize}`}
      />
    );
  };

  // Render the dots loader
  const renderDots = () => {
    // Size mappings for dots
    const dotSizes = {
      xs: "h-2 w-2",
      sm: "h-3 w-3",
      md: "h-4 w-4",
      lg: "h-5 w-5",
      xl: "h-6 w-6",
    };

    const dotSize = dotSizes[size] || dotSizes.md;

    return (
      <div className="flex space-x-2">
        {[0, 1, 2].map((dot) => (
          <motion.div
            key={dot}
            className={`rounded-full bg-blue-500 ${dotSize}`}
            animate={{
              y: ["0%", "-50%", "0%"],
              opacity: [1, 0.5, 1],
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              repeatType: "loop",
              delay: dot * 0.2,
            }}
          />
        ))}
      </div>
    );
  };

  // Render the pulse loader
  const renderPulse = () => {
    // Size mappings for pulse
    const pulseSizes = {
      xs: "h-4 w-4",
      sm: "h-8 w-8",
      md: "h-12 w-12",
      lg: "h-16 w-16",
      xl: "h-24 w-24",
    };

    const pulseSize = pulseSizes[size] || pulseSizes.md;

    return (
      <div className="relative">
        <motion.div
          className={`absolute rounded-full bg-blue-500 opacity-75 ${pulseSize}`}
          animate={{
            scale: [1, 1.5],
            opacity: [0.7, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
        <div className={`rounded-full bg-blue-500 ${pulseSize}`} />
      </div>
    );
  };

  // Render the text animation loader
  const renderTextAnimation = () => {
    // Font size mappings for different sizes
    const textSizes = {
      xs: "text-xl",
      sm: "text-2xl",
      md: "text-3xl",
      lg: "text-4xl",
      xl: "text-5xl",
    };

    const textSize = textSizes[size] || textSizes.md;
    const letters = text.split("");

    return (
      <div className="flex flex-col items-center justify-center">
        <div className="flex">
          {letters.map((letter, index) => (
            <motion.div
              key={index}
              className={`${textSize} font-bold text-blue-500`}
              initial={{ opacity: 0, y: -20 }}
              animate={{
                opacity: [0, 1, 1, 0],
                y: [-20, 0, 0, 20],
                color: ["#3b82f6", "#3b82f6", "#60a5fa", "#93c5fd"],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "loop",
                delay: index * 0.1,
              }}>
              {letter === " " ? "\u00A0" : letter}
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  // Select the loader based on type
  const getLoader = () => {
    switch (type) {
      case "dots":
        return renderDots();
      case "pulse":
        return renderPulse();
      case "text":
        return renderTextAnimation();
      case "spinner":
      default:
        return renderSpinner();
    }
  };

  // If fullScreen, wrap in a fullscreen container
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-80">
        {getLoader()}
      </div>
    );
  }

  return getLoader();
};

// PropTypes validation
Loader.propTypes = {
  type: PropTypes.oneOf(["spinner", "dots", "pulse", "text"]),
  size: PropTypes.oneOf(["xs", "sm", "md", "lg", "xl"]),
  fullScreen: PropTypes.bool,
  text: PropTypes.string,
};

// Default props
Loader.defaultProps = {
  type: "spinner",
  size: "md",
  fullScreen: false,
  text: "Webmark",
};

// Export component
export default Loader;
