import { motion, useAnimation } from "framer-motion";
import { Search, Leaf, BookOpen, MessageCircle } from "lucide-react";

const Hero = () => {
  const searchControls = useAnimation();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const floatingLeafVariants = {
    float: {
      y: [0, -10, 0],
      rotate: [0, 5, 0, -5, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
      },
    },
  };

  const handleSearchFocus = async () => {
    await searchControls.start({
      scale: 1.02,
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
      transition: { duration: 0.2 },
    });
  };

  const handleSearchBlur = async () => {
    await searchControls.start({
      scale: 1,
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
      transition: { duration: 0.2 },
    });
  };

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 bg-gradient-to-b from-[#E8F5E9] to-cream overflow-hidden">
      <motion.div
        className="absolute top-20 left-10 opacity-30"
        variants={floatingLeafVariants}
        animate="float"
      >
        <Leaf className="text-[#81C784] w-16 h-16" />
      </motion.div>

      <motion.div
        className="absolute bottom-20 right-10 opacity-20"
        variants={floatingLeafVariants}
        animate="float"
        transition={{ delay: 1 }}
      >
        <Leaf className="text-[#66BB6A] w-24 h-24" />
      </motion.div>

      <motion.div
        className="absolute top-1/3 right-1/4 opacity-20"
        variants={floatingLeafVariants}
        animate="float"
        transition={{ delay: 0.5 }}
      >
        <Leaf className="text-[#81C784] w-20 h-20" />
      </motion.div>

      <div className="container mx-auto px-4">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            className="text-4xl md:text-6xl font-display font-bold text-[#1B5E20] mb-6 leading-tight"
            variants={itemVariants}
          >
            Natural Solutions for
            <span className="relative inline-block mx-2">
              <span className="relative z-10">Holistic Health</span>
              <motion.span
                className="absolute bottom-1 left-0 w-full h-3 bg-[#FFF59D] opacity-60 -z-10"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.8, delay: 0.5 }}
              ></motion.span>
            </span>
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl mb-8 text-[#2E7D32] font-light"
            variants={itemVariants}
          >
            Find personalized natural remedies for your wellness goals using the
            power of plants and traditional wisdom.
          </motion.p>

          <motion.div
            className="relative max-w-xl mx-auto mb-12"
            variants={itemVariants}
            animate={searchControls}
          >
            <motion.div
              className="relative"
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
            >
              <input
                type="text"
                placeholder="Describe your symptoms or wellness goals..."
                className="w-full px-6 py-4 rounded-full shadow-md border border-[#C8E6C9] focus:outline-none focus:ring-2 focus:ring-[#66BB6A] text-gray-700 pr-12"
                onFocus={handleSearchFocus}
                onBlur={handleSearchBlur}
              />
              <motion.button
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#43A047] text-white p-2 rounded-full hover:bg-[#388E3C] transition"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Search className="h-6 w-6" />
              </motion.button>
            </motion.div>

            <motion.div
              className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 flex items-center text-[#43A047] text-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              <span>
                Powered by AI chatbot for personalized recommendations
              </span>
            </motion.div>
          </motion.div>

          <motion.div
            className="flex flex-wrap justify-center gap-6"
            variants={itemVariants}
          >
            <motion.div
              className="flex items-center bg-white/80 backdrop-blur-sm px-4 py-3 rounded-lg shadow-sm"
              whileHover={{
                y: -5,
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
              }}
              transition={{ duration: 0.2 }}
            >
              <Leaf className="h-6 w-6 text-[#43A047] mr-2" />
              <span className="text-[#2E7D32]">Natural Remedies</span>
            </motion.div>

            <motion.div
              className="flex items-center bg-white/80 backdrop-blur-sm px-4 py-3 rounded-lg shadow-sm"
              whileHover={{
                y: -5,
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
              }}
              transition={{ duration: 0.2 }}
            >
              <BookOpen className="h-6 w-6 text-[#43A047] mr-2" />
              <span className="text-[#2E7D32]">Holistic Practices</span>
            </motion.div>

            <motion.div
              className="flex items-center bg-white/80 backdrop-blur-sm px-4 py-3 rounded-lg shadow-sm"
              whileHover={{
                y: -5,
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
              }}
              transition={{ duration: 0.2 }}
            >
              <MessageCircle className="h-6 w-6 text-[#43A047] mr-2" />
              <span className="text-[#2E7D32]">AI-Powered Chat</span>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
