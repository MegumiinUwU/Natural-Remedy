import { useState, useEffect } from "react";
import { Leaf } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <motion.header
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-md py-3" : "bg-transparent py-5"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <motion.div className="flex items-center" whileHover={{ scale: 1.05 }}>
          <Leaf className="h-8 w-8 text-[#43A047] mr-2" />
          <span
            className={`font-display text-2xl font-bold ${
              scrolled ? "text-[#388E3C]" : "text-[#43A047]"
            }`}
          >
            Natural Remedy Finder
          </span>
        </motion.div>

        <nav className="flex items-center space-x-4">
          <motion.button
            onClick={() => navigate("/auth")}
            className={`px-4 py-2 rounded-md transition-colors ${
              scrolled
                ? "text-[#388E3C] hover:bg-[#E8F5E9]"
                : "text-[#43A047] hover:bg-white/20"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Login
          </motion.button>

          <motion.button
            className="px-6 py-2 bg-[#43A047] text-white rounded-md shadow-sm hover:bg-[#388E3C] transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get Started
          </motion.button>
        </nav>
      </div>
    </motion.header>
  );
};

export default Header;
