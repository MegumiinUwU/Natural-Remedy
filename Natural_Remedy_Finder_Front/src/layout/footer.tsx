import { motion } from 'framer-motion';
import { Leaf, Mail, Instagram, Twitter, Facebook, Heart } from 'lucide-react';

const Footer = () => {
  const links = [
    { heading: "Explore", items: ["Remedy Finder", "Herb Directory", "Wellness Articles", "Health Tips"] },
    { heading: "About", items: ["Our Story", "How It Works", "Testimonials", "Contact Us"] },
    { heading: "Legal", items: ["Privacy Policy", "Terms of Service", "Disclaimer", "Cookie Policy"] }
  ];

  return (
    <footer className="bg-[#1B5E20] text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-1">
            <motion.div 
              className="flex items-center mb-4"
              whileHover={{ scale: 1.05 }}
            >
              <Leaf className="h-8 w-8 text-[#81C784] mr-2" />
              <span className="font-display text-2xl font-bold text-white">
                Natural Remedy Finder
              </span>
            </motion.div>
            
            <p className="text-[#C8E6C9] mb-6">
              Connecting you with nature's healing power through personalized recommendations and traditional wisdom.
            </p>
            
            <div className="flex space-x-4">
              <motion.a 
                href="#" 
                className="bg-[#2E7D32] p-2 rounded-full text-[#A5D6A7] hover:text-white hover:bg-[#388E3C] transition-colors"
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.95 }}
              >
                <Instagram size={20} />
              </motion.a>
              
              <motion.a 
                href="#" 
                className="bg-[#2E7D32] p-2 rounded-full text-[#A5D6A7] hover:text-white hover:bg-[#388E3C] transition-colors"
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.95 }}
              >
                <Twitter size={20} />
              </motion.a>
              
              <motion.a 
                href="#" 
                className="bg-[#2E7D32] p-2 rounded-full text-[#A5D6A7] hover:text-white hover:bg-[#388E3C] transition-colors"
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.95 }}
              >
                <Facebook size={20} />
              </motion.a>
              
              <motion.a 
                href="#" 
                className="bg-[#2E7D32] p-2 rounded-full text-[#A5D6A7] hover:text-white hover:bg-[#388E3C] transition-colors"
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.95 }}
              >
                <Mail size={20} />
              </motion.a>
            </div>
          </div>
          {links.map((section, index) => (
            <div key={index} className="md:col-span-1">
              <h3 className="text-xl font-display font-bold mb-6 text-[#A5D6A7]">
                {section.heading}
              </h3>
              <ul className="space-y-3">
                {section.items.map((item, i) => (
                  <li key={i}>
                    <motion.a 
                      href="#" 
                      className="text-primary-100 hover:text-white transition-colors inline-block"
                      whileHover={{ x: 3 }}
                    >
                      {item}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-[#2E7D32] py-8 mb-8">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-xl font-display font-bold mb-4 text-[#A5D6A7]">
              Get Natural Health Tips
            </h3>
            <p className="text-primary-100 mb-6">
              Subscribe to our newsletter for the latest natural health advice, herbal wisdom, and wellness tips.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="px-4 py-3 rounded-md bg-[#2E7D32] text-white border border-[#388E3C] focus:outline-none focus:ring-2 focus:ring-[#66BB6A] w-full sm:w-auto"
              />
              <motion.button 
                className="px-6 py-3 bg-[#43A047] text-white rounded-md shadow-sm hover:bg-[#4CAF50] transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Subscribe
              </motion.button>
            </div>
          </div>
        </div>
        <div className="border-t border-[#2E7D32] pt-8 text-center">
          <motion.p 
            className="text-[#81C784] text-sm flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Made with <Heart className="h-4 w-4 text-accent-400 mx-1" fill="currentColor" /> by Natural Remedy Finder © {new Date().getFullYear()}
          </motion.p>
          <p className="text-[#66BB6A] text-xs mt-2">
            The information provided is for educational purposes only and is not a substitute for professional medical advice.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;