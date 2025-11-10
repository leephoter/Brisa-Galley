'use client';

import { motion } from 'framer-motion';
import { stockists } from '@/lib/data';
import styles from './page.module.css';

export default function StockistsPage() {
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
          <h1>STOCKISTS</h1>
          <p>Find our collections at these select locations worldwide</p>
        </motion.div>
      </section>

      {/* Stockists Grid */}
      <section className={styles.stockists}>
        <div className={styles.grid}>
          {stockists.map((stockist, index) => (
            <motion.div
              key={stockist.id}
              className={styles.card}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <h3 className={styles.name}>{stockist.name}</h3>
              <div className={styles.details}>
                <p className={styles.address}>{stockist.address}</p>
                <p className={styles.city}>
                  {stockist.city}, {stockist.country}
                </p>
                {stockist.phone && (
                  <a href={`tel:${stockist.phone}`} className={styles.phone}>
                    {stockist.phone}
                  </a>
                )}
                {stockist.email && (
                  <a href={`mailto:${stockist.email}`} className={styles.email}>
                    {stockist.email}
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Info Section */}
      <section className={styles.info}>
        <motion.div
          className={styles.infoContent}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2>Visit Us</h2>
          <p>
            Our collections are available at carefully selected retailers around the
            world. Each location has been chosen for their commitment to quality and
            exceptional customer service.
          </p>
          <p>
            For the most current information about product availability, please contact
            the store directly.
          </p>
        </motion.div>
      </section>
    </div>
  );
}
