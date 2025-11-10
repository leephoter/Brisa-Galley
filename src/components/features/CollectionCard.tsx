'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Collection } from '@/types';
import styles from './CollectionCard.module.css';

interface CollectionCardProps {
  collection: Collection;
  index: number;
}

export default function CollectionCard({ collection, index }: CollectionCardProps) {
  return (
    <motion.div
      className={styles.card}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <Link href={`/collection/${collection.slug}`} className={styles.link}>
        <div className={styles.imageWrapper}>
          <div className={styles.imagePlaceholder}>
            {/* Placeholder gradient - users can replace with actual images */}
            <span className={styles.imageText}>{collection.title}</span>
          </div>
        </div>

        <div className={styles.content}>
          <h3 className={styles.title}>{collection.title}</h3>
          <p className={styles.season}>{collection.season}</p>
        </div>
      </Link>
    </motion.div>
  );
}
