import { ReactNode } from 'react';
import styles from './PageContent.module.css';

interface PageContentProps {
  children: ReactNode;
}

export default function PageContent({ children }: PageContentProps) {
  return <section className={styles.content}>{children}</section>;
}
