import { motion } from "framer-motion";

const FlowNode = ({ id, title, description, confidence }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      id={id}
      className="relative bg-white rounded-2xl shadow-lg p-4 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg"
    >
      <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-2">
        {title}
      </h3>

      <p className="text-sm sm:text-base text-gray-600">{description}</p>

      <div className="mt-3">
        <div className="h-2 bg-gray-300 rounded-full">
          <div
            className="h-2 bg-indigo-500 rounded-full"
            style={{ width: `${confidence}%` }}
          ></div>
        </div>
        <p className="text-xs text-right text-gray-500 mt-1">
          {confidence}% confident
        </p>
      </div>
    </motion.div>
  );
};

export default FlowNode;
