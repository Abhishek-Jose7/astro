'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { validateBirthInput, hasErrors } from '@/engine/validation';
import styles from './BirthForm.module.css';

const MYSTICAL_PLACEHOLDERS = [
  "Enter your full name",
  "Your name, exactly as spoken",
  "The name tied to your story",
  "Type the name destiny will read",
];

// Eye icon SVG
const EyeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="12" cy="12" rx="10" ry="6" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="12" cy="11" r="1" fill="currentColor" />
  </svg>
);

// Calendar icon SVG
const CalIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
    <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="1.5" />
    <line x1="8" y1="3" x2="8" y2="7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="16" y1="3" x2="16" y2="7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// Loading spinner
const SpinnerIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.spinner}>
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="28 56" />
  </svg>
);

// Arrow right icon
const ArrowIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function BirthForm({ onSubmit, loading }) {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [placeholder] = useState(() =>
    MYSTICAL_PLACEHOLDERS[Math.floor(Math.random() * MYSTICAL_PLACEHOLDERS.length)]
  );

  function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validateBirthInput({ name, date });
    setErrors(validationErrors);
    if (hasErrors(validationErrors)) {
      setTouched({ name: true, date: true });
      return;
    }
    onSubmit({ name, date });
  }

  function handleBlur(field) {
    setTouched(prev => ({ ...prev, [field]: true }));
    const validationErrors = validateBirthInput({ name, date });
    if (touched[field]) {
      setErrors(prev => ({ ...prev, [field]: validationErrors[field] }));
    }
  }

  return (
    <motion.form
      className={styles.form}
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: [0.23, 1, 0.32, 1] }}
    >
      {/* Liquid glass surface */}
      <div className={styles.glassPane} />

      {/* Header */}
      <div className={styles.header}>
        <div className={styles.orbRing} aria-hidden="true">
          <motion.div
            className={styles.orbCore}
            animate={{ scale: [1, 1.08, 1], opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          />
          <svg className={styles.orbSvg} viewBox="0 0 80 80" fill="none">
            <circle cx="40" cy="40" r="36" stroke="rgba(124,92,191,0.35)" strokeWidth="1" strokeDasharray="3 6" />
            <circle cx="40" cy="40" r="28" stroke="rgba(196,160,85,0.25)" strokeWidth="0.8" />
          </svg>
        </div>

        <h2 className={styles.title}>Begin The Reading</h2>
        <p className={styles.subtitle}>
          A precise name and birth date are all the oracle requires.
        </p>
      </div>

      {/* Fields */}
      <div className={styles.fields}>
        <div className={styles.fieldGroup}>
          <label className={styles.label} htmlFor="full-name">
            <EyeIcon />
            Full Name
          </label>
          <div className={styles.inputWrap}>
            <input
              id="full-name"
              type="text"
              className={`oracle-input ${styles.input} ${touched.name && errors.name ? styles.inputError : ''}`}
              value={name}
              onChange={e => setName(e.target.value)}
              onBlur={() => handleBlur('name')}
              placeholder={placeholder}
              autoComplete="name"
            />
            {touched.name && !errors.name && name && (
              <span className={styles.inputCheck}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            )}
          </div>
          {touched.name && errors.name && (
            <p className={styles.error}>{errors.name}</p>
          )}
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label} htmlFor="birth-date">
            <CalIcon />
            Birth Date
          </label>
          <div className={styles.inputWrap}>
            <input
              id="birth-date"
              type="date"
              className={`oracle-input ${styles.input} ${touched.date && errors.date ? styles.inputError : ''}`}
              value={date}
              onChange={e => setDate(e.target.value)}
              onBlur={() => handleBlur('date')}
              min="1900-01-01"
              max="2030-12-31"
            />
          </div>
          {touched.date && errors.date && (
            <p className={styles.error}>{errors.date}</p>
          )}
        </div>
      </div>

      {/* Divider with rune marks */}
      <div className={styles.runeRow} aria-hidden="true">
        <div className={styles.runeLine} />
        <span className={styles.runeChar}>ᚹ</span>
        <div className={styles.runeLine} />
        <span className={styles.runeChar}>ᛏ</span>
        <div className={styles.runeLine} />
        <span className={styles.runeChar}>ᚨ</span>
        <div className={styles.runeLine} />
      </div>

      {/* Submit */}
      <motion.button
        type="submit"
        className={styles.submitBtn}
        disabled={loading}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97, y: 1 }}
        transition={{ type: 'spring', stiffness: 340, damping: 22 }}
      >
        {/* Shimmer overlay */}
        <span className={styles.btnShimmer} aria-hidden="true" />
        {loading ? (
          <>
            <SpinnerIcon />
            <span>Calibrating the cosmos...</span>
          </>
        ) : (
          <>
            <span>Open The Oracle</span>
            <ArrowIcon />
          </>
        )}
      </motion.button>

      <p className={styles.disclaimer}>
        For reflective entertainment. Your choices remain entirely your own.
      </p>
    </motion.form>
  );
}

