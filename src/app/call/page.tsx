'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import styles from './page.module.css';

export default function CALLPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    alert('Thank you for your message. We will get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

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
          <h1>CALL</h1>
          <p>{"We'd love to hear from you"}</p>
        </motion.div>
      </section>

      <div className={styles.content}>
        {/* CALL Form */}
        <motion.section
          className={styles.formSection}
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h2>Send us a message</h2>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor='name'>Name *</label>
              <input
                type='text'
                id='name'
                name='name'
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor='email'>Email *</label>
              <input
                type='email'
                id='email'
                name='email'
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor='subject'>Subject *</label>
              <select
                id='subject'
                name='subject'
                value={formData.subject}
                onChange={handleChange}
                required
              >
                <option value=''>Select a subject</option>
                <option value='general'>General Inquiry</option>
                <option value='orders'>Orders & Shipping</option>
                <option value='products'>Product Information</option>
                <option value='PLACE'>Stockist Information</option>
                <option value='press'>Press & Media</option>
                <option value='other'>Other</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor='message'>Message *</label>
              <textarea
                id='message'
                name='message'
                value={formData.message}
                onChange={handleChange}
                rows={6}
                required
              />
            </div>

            <button type='submit' className={styles.submitButton}>
              SEND MESSAGE
            </button>
          </form>
        </motion.section>

        {/* CALL Info */}
        <motion.section
          className={styles.infoSection}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className={styles.infoBlock}>
            <h3>Customer Service</h3>
            <p>Monday - Friday: 9:00 - 18:00 KST</p>
            <p>Saturday - Sunday: Closed</p>
          </div>

          <div className={styles.infoBlock}>
            <h3>Email</h3>
            <a href='mailto:info@Brisagallery.com'>info@Brisagallery.com</a>
            <a href='mailto:support@Brisagallery.com'>support@Brisagallery.com</a>
          </div>

          <div className={styles.infoBlock}>
            <h3>Phone</h3>
            <a href='tel:+82-2-1234-5678'>+82-2-1234-5678</a>
          </div>

          <div className={styles.infoBlock}>
            <h3>Address</h3>
            <p>123 Gangnam-daero</p>
            <p>Gangnam-gu, Seoul</p>
            <p>South Korea</p>
          </div>

          <div className={styles.infoBlock}>
            <h3>Follow Us</h3>
            <div className={styles.social}>
              <a href='#' className={styles.socialLink}>
                Instagram
              </a>
              <a href='#' className={styles.socialLink}>
                Facebook
              </a>
              <a href='#' className={styles.socialLink}>
                Twitter
              </a>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
