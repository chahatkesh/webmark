import { Button } from "./button";
import Loader from "../Loader";

/**
 * Enhanced Button component with integrated loading state
 *
 * @param {Object} props - Component props
 * @param {boolean} props.isLoading - Whether to show the loading state
 * @param {string} props.loadingText - Text to display while loading (optional)
 * @param {React.ReactNode} props.children - Button content
 * @param {string} props.size - Size of the button and loader
 */
const LoaderButton = ({
  isLoading = false,
  loadingText,
  children,
  size = "default",
  ...props
}) => {
  // Map button sizes to loader sizes
  const loaderSizeMap = {
    default: "xs",
    sm: "xs",
    lg: "sm",
    icon: "xs",
  };

  const loaderSize = loaderSizeMap[size] || "xs";

  return (
    <Button disabled={isLoading} {...props}>
      {isLoading ? (
        <div className="flex items-center justify-center">
          <Loader type="spinner" size={loaderSize} />
          {loadingText && <span className="ml-2">{loadingText}</span>}
        </div>
      ) : (
        children
      )}
    </Button>
  );
};

export default LoaderButton;
