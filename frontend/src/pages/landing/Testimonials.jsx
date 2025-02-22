import { motion } from "framer-motion";
import TestimonialCard from "./comps/TestimonialCard";
import { testimonials } from "./comps/landingPageData";

export const Testimonials = () => (
  <section className="py-24 relative">
    <div className="container mx-auto px-4">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-primary via-purple-500 to-accent text-transparent bg-clip-text"
      >
        What Our Community Says
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <TestimonialCard
            key={index}
            name={testimonial.name}
            role={testimonial.role}
            content={testimonial.content}
            delay={index * 0.2}
          />
        ))}
      </div>
    </div>
  </section>
);
