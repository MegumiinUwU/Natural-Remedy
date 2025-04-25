import { motion } from 'framer-motion';
import { MessageCircle, Sparkles, Brain } from 'lucide-react';

const AiSection = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-light-cream to-[#E8F5E9]">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-display font-bold text-[#1B5E20] mb-4">
            AI-Powered Natural Healing
          </h2>
          <div className="w-24 h-1 bg-[#4CAF50] mx-auto mb-6"></div>
          <p className="max-w-3xl mx-auto text-lg text-[#2E7D32]">
            Experience the future of natural remedies with our advanced AI chatbot
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div className="w-full md:w-full" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
            <div className="relative h-[500px]">
              <div className="absolute inset-0 bg-[#A5D6A7] rounded-xl transform translate-x-3 translate-y-3"></div>
              <img
                src="https://images.pexels.com/photos/7615574/pexels-photo-7615574.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                alt="Natural Healing"
                className="w-full h-full object-cover rounded-xl shadow-lg relative z-10"
              />
            </div>
          </motion.div>

          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-lg shadow-lg"
            >
              <div className="flex items-center mb-4">
                <div className="bg-[#C8E6C9] p-3 rounded-full mr-4">
                  <MessageCircle className="h-6 w-6 text-[#43A047]" />
                </div>
                <h3 className="text-xl font-bold text-[#1B5E20]">
                  Natural Conversation
                </h3>
              </div>
              <p className="text-[#2E7D32]">
                Simply describe your symptoms or wellness goals in your own words, and our AI will understand and provide personalized recommendations.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-lg shadow-lg"
            >
              <div className="flex items-center mb-4">
                <div className="bg-[#C8E6C9] p-3 rounded-full mr-4">
                  <Brain className="h-6 w-6 text-[#43A047]" />
                </div>
                <h3 className="text-xl font-bold text-[#1B5E20]">
                  Intelligent Recommendations
                </h3>
              </div>
              <p className="text-[#2E7D32]">
                Our AI combines traditional healing knowledge with modern research to suggest the most effective natural remedies for your needs.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-lg shadow-lg"
            >
              <div className="flex items-center mb-4">
                <div className="bg-[#C8E6C9] p-3 rounded-full mr-4">
                  <Sparkles className="h-6 w-6 text-[#43A047]" />
                </div>
                <h3 className="text-xl font-bold text-[#1B5E20]">
                  Continuous Learning
                </h3>
              </div>
              <p className="text-[#2E7D32]">
                The more you interact, the better our AI understands your preferences and health needs, providing increasingly personalized suggestions.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AiSection;
