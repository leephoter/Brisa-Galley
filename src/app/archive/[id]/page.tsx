'use client';

import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useInView } from 'react-intersection-observer';
import { useEffect, useState } from 'react';
import { getArchiveBySlug } from '@/lib/api/archives';
import { Archive } from '@/types';
import PageHero from '@/components/common/PageHero';
import PageContainer from '@/components/common/PageContainer';
import PageContent from '@/components/common/PageContent';
import styles from './page.module.css';

export default function ArchiveDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [archive, setArchive] = useState<Archive | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArchive() {
      try {
        const data = await getArchiveBySlug(id);
        setArchive(data);
      } catch (error) {
        console.error('Failed to fetch archive:', error);
        setArchive(null);
      } finally {
        setLoading(false);
      }
    }

    fetchArchive();
  }, [id]);

  if (loading) {
    return (
      <PageContainer>
        <div className={styles.loading}>
          <p>Loading...</p>
        </div>
      </PageContainer>
    );
  }

  if (!archive) {
    return (
      <PageContainer>
        <div className={styles.notFound}>
          <h1>Archive Not Found</h1>
          <Link href='/archive' className={styles.backLink}>
            ← Back to ARCHIVE
          </Link>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHero title={archive.title} subtitle={archive.description} />

      {/* Image Gallery - 2 Column Scroll */}
      <PageContent>
        <div className={styles.imageGrid}>
          {archive.images.length ? (
            archive.images.map((image, index) => (
              <ImageCard key={index} image={image} index={index} title={archive.title} />
            ))
          ) : (
            <ImageCard index={0} title={'Comming Soon...'}></ImageCard>
          )}
        </div>
      </PageContent>
    </PageContainer>
  );
}

function ImageCard({ image, index, title }: { image?: string; index: number; title: string }) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      className={styles.imageCard}
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{ duration: 0.6, delay: (index % 2) * 0.1 }}
    >
      <div className={styles.imageWrapper}>
        {image ? (
          <Image
            src={image}
            alt={`${title} - Image ${index + 1}`}
            fill
            className={styles.image}
            priority={index < 4}
          />
        ) : (
          <p className={styles.noImage}>{title}</p>
        )}
      </div>
    </motion.div>
  );
}
