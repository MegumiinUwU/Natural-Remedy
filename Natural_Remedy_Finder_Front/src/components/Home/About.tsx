import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Leaf, Heart, Brain, Thermometer, Moon, BookOpen } from "lucide-react";

const About = () => {
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);

  const inView1 = useInView(ref1, { once: true, amount: 0.3 });
  const inView2 = useInView(ref2, { once: true, amount: 0.3 });
  const inView3 = useInView(ref3, { once: true, amount: 0.3 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const sectionData = [
    {
      ref: ref1,
      inView: inView1,
      title: "Our Mission",
      description:
        "Natural Remedy Finder empowers you to explore natural, non-chemical solutions for your health concerns. By describing your symptoms or wellness goals in simple language, you'll receive personalized suggestions tailored to your unique needs.",
      image:
        "https://images.pexels.com/photos/4046718/pexels-photo-4046718.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      icons: [
        <Leaf key="leaf" className="h-6 w-6 text-[#43A047]" />,
        <Heart key="heart" className="h-6 w-6 text-[#43A047]" />,
      ],
    },
    {
      ref: ref2,
      inView: inView2,
      title: "Natural Wisdom",
      description:
        "Our platform combines traditional healing knowledge with modern understanding. Discover herbs, natural treatments, and holistic practices that have been used for centuries across different cultures, presented in an accessible and practical way.",
      image:
        "https://images.pexels.com/photos/7615574/pexels-photo-7615574.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      icons: [
        <Brain key="brain" className="h-6 w-6 text-[#43A047]" />,
        <BookOpen key="book" className="h-6 w-6 text-[#43A047]" />,
      ],
    },
    {
      ref: ref3,
      inView: inView3,
      title: "Holistic Lifestyle",
      description:
        "Beyond remedies, we share general health tips like the benefits of cold showers, breathing exercises, and herbal teas to promote a healthier lifestyle through natural means. Our goal is to make natural health advice accessible, safe, and easy to explore.",
      image:
        "https://images.pexels.com/photos/3872370/pexels-photo-3872370.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      icons: [
        <Thermometer key="thermometer" className="h-6 w-6 text-[#43A047]" />,
        <Moon key="moon" className="h-6 w-6 text-[#43A047]" />,
      ],
    },
  ];

  return (
    <section className="py-20 bg-[#FFFBF2]">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <h2 className="text-3xl md:text-5xl font-display font-bold text-[#1B5E20] mb-4">
            About Natural Remedy Finder
          </h2>
          <div className="w-24 h-1 bg-[#4CAF50] mx-auto mb-6"></div>
          <p className="max-w-3xl mx-auto text-lg text-[#2E7D32]">
            Connecting you with nature's healing power through personalized
            recommendations and traditional wisdom.
          </p>
        </motion.div>

        <div className="space-y-24">
          {sectionData.map((section, index) => (
            <motion.div
              key={index}
              ref={section.ref}
              className={`flex flex-col ${
                index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              } items-center gap-8 md:gap-16`}
              variants={containerVariants}
              initial="hidden"
              animate={section.inView ? "visible" : "hidden"}
            >
              <motion.div className="w-full md:w-1/2" variants={itemVariants}>
                <div className="relative">
                  <div className="absolute inset-0 bg-[#A5D6A7] rounded-lg transform translate-x-3 translate-y-3"></div>
                  <img
                    src={section.image}
                    alt={section.title}
                    className="w-full h-[400px] object-cover rounded-lg shadow-lg relative z-10"
                  />
                </div>
              </motion.div>

              <motion.div className="w-full md:w-1/2" variants={itemVariants}>
                <div className="flex gap-4 mb-4">
                  {section.icons.map((icon, i) => (
                    <div key={i} className="bg-[#C8E6C9] p-3 rounded-full">
                      {icon}
                    </div>
                  ))}
                </div>

                <h3 className="text-2xl md:text-3xl font-display font-bold text-[#2E7D32] mb-4">
                  {section.title}
                </h3>

                <p className="text-lg text-[#388E3C] mb-6 leading-relaxed">
                  {section.description}
                </p>

                <motion.button
                  className="inline-flex items-center text-[#43A047] font-medium hover:text-[#2E7D32] transition-colors"
                  whileHover={{ x: 5 }}
                >
                  Learn More
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 ml-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path fillRule="evenodd" d="..." clipRule="evenodd" />
                  </svg>
                </motion.button>
              </motion.div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-24 text-center bg-[#C8E6C9] p-8 md:p-12 rounded-xl shadow-sm"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <h3 className="text-2xl md:text-3xl font-display font-bold text-[#1B5E20] mb-4">
            Experience the Power of Natural Healing
          </h3>
          <p className="max-w-3xl mx-auto text-lg text-[#2E7D32] mb-8">
            Our AI-powered platform makes finding natural remedies easier than
            ever. Start your journey to holistic wellness today.
          </p>
          <motion.button
            className="px-8 py-3 bg-[#43A047] text-white text-lg rounded-md shadow-sm hover:bg-[#388E3C] transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get Started Now
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
