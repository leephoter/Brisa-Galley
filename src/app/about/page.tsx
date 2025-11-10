'use client';

import { motion } from 'framer-motion';
import styles from './page.module.css';

export default function AboutPage() {
  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <motion.div
          className={styles.heroContent}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1>ABOUT</h1>
          <p>Crafting timeless pieces for the modern wardrobe</p>
        </motion.div>
      </section>

      {/* Story Section */}
      <section className={styles.story}>
        <motion.div
          className={styles.storyContent}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2>Our Story</h2>
          <div className={styles.text}>
            <p>
              Brisa Gallery was founded with a simple belief: that great design should be timeless,
              not temporary. We create pieces that transcend seasons and trends, focusing on quality
              craftsmanship and enduring style.
            </p>
            <p>
              Each collection is carefully curated to represent the intersection of contemporary
              design and traditional techniques. We work with skilled artisans and use only the
              finest materials to ensure every piece meets our exacting standards.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Philosophy Section */}
      <section className={styles.philosophy}>
        <motion.div
          className={styles.philosophyContent}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2>Philosophy</h2>
          <div className={styles.grid}>
            <div className={styles.card}>
              <h3>Timeless Design</h3>
              <p>
                We create pieces that remain relevant season after season, rejecting fast Brisa in
                favor of lasting quality.
              </p>
            </div>
            <div className={styles.card}>
              <h3>Quality Craftsmanship</h3>
              <p>
                Every item is made with attention to detail and respect for traditional techniques,
                ensuring exceptional quality.
              </p>
            </div>
            <div className={styles.card}>
              <h3>Sustainable Practice</h3>
              <p>
                We are committed to responsible production methods and materials that minimize our
                environmental impact.
              </p>
            </div>
            <div className={styles.card}>
              <h3>Contemporary Aesthetic</h3>
              <p>
                Our designs balance classic silhouettes with modern sensibilities, creating pieces
                that feel both familiar and fresh.
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Vision Section */}
      <section className={styles.vision}>
        <motion.div
          className={styles.visionContent}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2>Our Vision</h2>
          <p>
            To create a wardrobe that serves you for years to come. We believe in investing in
            fewer, better things – pieces that you'll reach for again and again, that age gracefully
            and tell your story.
          </p>
        </motion.div>
      </section>
    </div>
  );
}
