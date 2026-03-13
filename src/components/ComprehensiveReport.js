'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useCallback } from 'react';
import {
  getPersonalitySynthesis,
  getLifePathDeep,
  getRomanticInsight,
  getCareerGuidance,
  getHiddenPatterns,
  getDailyGuidance,
  expandSection,
} from '@/engine/aiService';
import styles from './ComprehensiveReport.module.css';

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

// Expandable Section Component
function ExpandableSection({ title, number, children, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <motion.section
      className={`oracle-card ${styles.section} ${isOpen ? styles.sectionOpen : ''}`}
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.6, delay: number * 0.1 }}
    >
      <button
        className={styles.sectionHeaderBtn}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <div className={styles.sectionHeader}>
          <span className={styles.sectionNumber}>{String(number).padStart(2, '0')}</span>
          <h3 className="glow-text">{title}</h3>
        </div>
        <motion.span
          className={styles.expandIcon}
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          v
        </motion.span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={styles.sectionContent}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}

// AI Insight Button Component
function AIInsightButton({ label, onClick, loading, content }) {
  return (
    <div className={styles.aiInsightContainer}>
      {!content ? (
        <motion.button
          className={styles.aiButton}
          onClick={onClick}
          disabled={loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {loading ? (
            <>
              <span className={styles.aiSpinner} />
              Channeling cosmic wisdom...
            </>
          ) : (
            <>
              <span className={styles.aiIcon}>AI</span>
              {label}
            </>
          )}
        </motion.button>
      ) : (
        <motion.div
          className={styles.aiContent}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className={styles.aiContentHeader}>
            <span className={styles.aiIcon}>AI</span>
            <span>AI Insight</span>
          </div>
          <p>{content}</p>
        </motion.div>
      )}
    </div>
  );
}

// Interactive Stat Box with hover effect
function StatBox({ value, label, color = 'gold', onClick }) {
  return (
    <motion.div
      className={`${styles.statBox} ${styles[`stat${color}`]}`}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <motion.div
        className={styles.statValue}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
      >
        {value}
      </motion.div>
      <div className={styles.statLabel}>{label}</div>
      {onClick && <span className={styles.statHint}>Click to explore</span>}
    </motion.div>
  );
}

// Number Card with animation
function NumberCard({ number, title, label, description, delay = 0 }) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <motion.div
      className={`${styles.numCard} ${isFlipped ? styles.numCardFlipped : ''}`}
      initial={{ opacity: 0, rotateY: -90 }}
      animate={{ opacity: 1, rotateY: 0 }}
      transition={{ duration: 0.6, delay }}
      onClick={() => setIsFlipped(!isFlipped)}
      whileHover={{ y: -4 }}
    >
      <div className={styles.numCardInner}>
        <div className={styles.numCardFront}>
          <div className={styles.numNumber}>{number}</div>
          <div className={styles.numTitle}>{title}</div>
          <div className={styles.numLabel}>{label}</div>
          <span className={styles.flipHint}>Tap for meaning</span>
        </div>
        <div className={styles.numCardBack}>
          <p className={styles.numDesc}>{description}</p>
          <span className={styles.flipHint}>Tap to flip back</span>
        </div>
      </div>
    </motion.div>
  );
}

// Progress Ring Component
function ProgressRing({ value, label, color = 'gold' }) {
  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className={styles.progressRing}>
      <svg viewBox="0 0 100 100" className={styles.ringSvg}>
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="8"
        />
        <motion.circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke={`var(--${color})`}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          style={{ transformOrigin: 'center', transform: 'rotate(-90deg)' }}
        />
      </svg>
      <div className={styles.ringValue}>{value}%</div>
      <div className={styles.ringLabel}>{label}</div>
    </div>
  );
}

export default function ComprehensiveReport({ reading }) {
  const {
    birthData,
    numerology,
    nameNumerology,
    demographics,
    letterAnalysis,
    romantic,
    personalityCluster,
  } = reading;

  // AI content states
  const [aiContent, setAiContent] = useState({});
  const [aiLoading, setAiLoading] = useState({});

  const fetchAI = useCallback(async (key, fetchFn) => {
    if (aiContent[key] || aiLoading[key]) return;
    
    setAiLoading(prev => ({ ...prev, [key]: true }));
    try {
      const content = await fetchFn(reading);
      setAiContent(prev => ({ ...prev, [key]: content }));
    } catch (error) {
      console.error('AI fetch error:', error);
    } finally {
      setAiLoading(prev => ({ ...prev, [key]: false }));
    }
  }, [reading, aiContent, aiLoading]);

  return (
    <div className={styles.container}>
      {/* Daily Guidance Banner */}
      <motion.div
        className={styles.dailyBanner}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <AIInsightButton
          label="Receive Today's Cosmic Guidance"
          onClick={() => fetchAI('daily', getDailyGuidance)}
          loading={aiLoading.daily}
          content={aiContent.daily}
        />
      </motion.div>

      {/* Section 1: Demographic Overview */}
      <ExpandableSection title="Demographic Profile" number={1} defaultOpen={true}>
        <div className={styles.statGrid}>
          <StatBox value={demographics.age} label="Age" color="gold" />
          <StatBox value={demographics.generation} label="Generation" color="blue" />
          <StatBox
            value={demographics.gender.maleProbability > 0.5 
              ? `${Math.round(demographics.gender.maleProbability * 100)}%`
              : `${Math.round(demographics.gender.femaleProbability * 100)}%`
            }
            label={demographics.gender.maleProbability > 0.5 ? 'Male' : 'Female'}
            color="purple"
          />
        </div>

        <div className={styles.infoBlock}>
          <h4>Cultural Origin Inference</h4>
          <div className={styles.originTags}>
            {demographics.cultural.origins.map((origin, i) => (
              <motion.span
                key={i}
                className={styles.originTag}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
              >
                {origin}
              </motion.span>
            ))}
          </div>
          {demographics.cultural.multicultural && (
            <motion.span
              className={styles.badge}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Multicultural Heritage Detected
            </motion.span>
          )}
        </div>

        <div className={styles.traitCarousel}>
          <h4>Generation Traits</h4>
          <div className={styles.traitScroll}>
            {demographics.generationTraits.map((trait, i) => (
              <motion.div
                key={i}
                className={styles.traitCard}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.05, y: -2 }}
              >
                {trait}
              </motion.div>
            ))}
          </div>
        </div>

        <p className={styles.disclaimer}>{demographics.disclaimer}</p>
      </ExpandableSection>

      {/* Section 2: Numerology Analysis */}
      <ExpandableSection title="Numerology Analysis" number={2} defaultOpen={true}>
        <div className={styles.numerologyGrid}>
          <NumberCard
            number={numerology.lifePathNumber}
            title={numerology.title}
            label="Life Path"
            description={numerology.description}
            delay={0.1}
          />
          <NumberCard
            number={nameNumerology.destiny.number}
            title={nameNumerology.destiny.title}
            label="Destiny"
            description={nameNumerology.destiny.description}
            delay={0.2}
          />
          <NumberCard
            number={nameNumerology.soulUrge.number}
            title={nameNumerology.soulUrge.title}
            label="Soul Urge"
            description={nameNumerology.soulUrge.desire}
            delay={0.3}
          />
          <NumberCard
            number={nameNumerology.birthday.number}
            title={nameNumerology.birthday.title}
            label="Birthday"
            description={nameNumerology.birthday.gift}
            delay={0.4}
          />
        </div>

        <AIInsightButton
          label="Unlock Deep Life Path Analysis"
          onClick={() => fetchAI('lifePath', getLifePathDeep)}
          loading={aiLoading.lifePath}
          content={aiContent.lifePath}
        />

        <div className={styles.personalityBox}>
          <h4>Outer Personality - Number {nameNumerology.personality.number}</h4>
          <p className={styles.personalityTitle}>{nameNumerology.personality.title}</p>
          <p>{nameNumerology.personality.impression}</p>
        </div>

        <div className={styles.traitTags}>
          {nameNumerology.destiny.traits?.map((trait, i) => (
            <motion.span
              key={i}
              className={styles.tag}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.1 }}
            >
              {trait}
            </motion.span>
          ))}
        </div>
      </ExpandableSection>

      {/* Section 3: Letter & Name Analysis */}
      <ExpandableSection title="Name Structure Analysis" number={3}>
        <div className={styles.letterVisual}>
          <div className={styles.letterStats}>
            <ProgressRing
              value={letterAnalysis.letterCounts.vowelRatio}
              label="Vowel Ratio"
              color="violet-deep"
            />
            <ProgressRing
              value={letterAnalysis.rhythm.memorabilityScore}
              label="Memorability"
              color="gold"
            />
          </div>
          
          <div className={styles.letterBreakdown}>
            <div className={styles.letterItem}>
              <span className={styles.letterNum}>{letterAnalysis.letterCounts.total}</span>
              <span className={styles.letterLabel}>Letters</span>
            </div>
            <div className={styles.letterItem}>
              <span className={styles.letterNum}>{letterAnalysis.letterCounts.vowels}</span>
              <span className={styles.letterLabel}>Vowels</span>
            </div>
            <div className={styles.letterItem}>
              <span className={styles.letterNum}>{letterAnalysis.letterCounts.consonants}</span>
              <span className={styles.letterLabel}>Consonants</span>
            </div>
            <div className={styles.letterItem}>
              <span className={styles.letterNum}>{letterAnalysis.rhythm.totalSyllables}</span>
              <span className={styles.letterLabel}>Syllables</span>
            </div>
          </div>
        </div>

        <div className={styles.doubleCol}>
          <div className={styles.analysisCard}>
            <h4>Consonant Energy</h4>
            <div className={styles.energyBar}>
              <div className={styles.energyLabel}>Hard</div>
              <div className={styles.energyTrack}>
                <motion.div
                  className={styles.energyFillHard}
                  initial={{ width: 0 }}
                  animate={{
                    width: `${(letterAnalysis.letterCounts.hardConsonants / 
                      (letterAnalysis.letterCounts.hardConsonants + letterAnalysis.letterCounts.softConsonants)) * 100}%`
                  }}
                  transition={{ duration: 1 }}
                />
              </div>
              <span>{letterAnalysis.letterCounts.hardConsonants}</span>
            </div>
            <div className={styles.energyBar}>
              <div className={styles.energyLabel}>Soft</div>
              <div className={styles.energyTrack}>
                <motion.div
                  className={styles.energyFillSoft}
                  initial={{ width: 0 }}
                  animate={{
                    width: `${(letterAnalysis.letterCounts.softConsonants / 
                      (letterAnalysis.letterCounts.hardConsonants + letterAnalysis.letterCounts.softConsonants)) * 100}%`
                  }}
                  transition={{ duration: 1 }}
                />
              </div>
              <span>{letterAnalysis.letterCounts.softConsonants}</span>
            </div>
          </div>

          <div className={styles.analysisCard}>
            <h4>Phonetic Profile</h4>
            <div className={styles.phoneticItem}>
              <span className={styles.phoneticLabel}>Pattern</span>
              <span className={styles.phoneticValue}>{letterAnalysis.rhythm.rhythmPattern}</span>
            </div>
            <div className={styles.phoneticItem}>
              <span className={styles.phoneticLabel}>Texture</span>
              <span className={styles.phoneticValue}>{letterAnalysis.rhythm.soundTexture}</span>
            </div>
          </div>
        </div>

        <AIInsightButton
          label="Reveal Hidden Name Patterns"
          onClick={() => fetchAI('patterns', getHiddenPatterns)}
          loading={aiLoading.patterns}
          content={aiContent.patterns}
        />

        {letterAnalysis.interpretations.length > 0 && (
          <div className={styles.interpretations}>
            {letterAnalysis.interpretations.map((interp, i) => (
              <motion.div
                key={i}
                className={styles.interpItem}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.15 }}
              >
                <span className={styles.interpLabel}>{interp.aspect}</span>
                <span className={styles.interpValue}>{interp.value}</span>
              </motion.div>
            ))}
          </div>
        )}

        {letterAnalysis.symmetry.isPowerOfTwo && (
          <motion.p
            className={styles.funFact}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Your name length ({letterAnalysis.symmetry.nameLength}) is a power of 2 and computationally aligned with binary patterns.
          </motion.p>
        )}
      </ExpandableSection>

      {/* Section 4: Personality Archetype */}
      <ExpandableSection title="Personality Archetype" number={4} defaultOpen={true}>
        <motion.div
          className={styles.archetypeBox}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className={styles.archetypeGlow}
            animate={{ 
              boxShadow: [
                '0 0 30px rgba(212, 165, 116, 0.3)',
                '0 0 60px rgba(212, 165, 116, 0.5)',
                '0 0 30px rgba(212, 165, 116, 0.3)',
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <h2 className={styles.archetypeName}>{personalityCluster.archetype.name}</h2>
          <p className={styles.archetypeDesc}>{personalityCluster.archetype.description}</p>
          <div className={styles.elementBadge}>
            {personalityCluster.dominantElement} Dominant
          </div>
        </motion.div>

        <AIInsightButton
          label="Generate Personalized Synthesis"
          onClick={() => fetchAI('synthesis', getPersonalitySynthesis)}
          loading={aiLoading.synthesis}
          content={aiContent.synthesis}
        />

        <div className={styles.doubleCol}>
          <div className={styles.cognitiveCard}>
            <h4>Cognitive Style</h4>
            <p className={styles.cognitiveTitle}>{personalityCluster.cognitiveStyle.name}</p>
            <p>{personalityCluster.cognitiveStyle.description}</p>
            <div className={styles.strengthList}>
              {personalityCluster.cognitiveStyle.strengths.map((s, i) => (
                <motion.span
                  key={i}
                  className={styles.strengthTag}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.1 }}
                >
                  {s}
                </motion.span>
              ))}
            </div>
          </div>

          <div className={styles.careerCard}>
            <h4>Career Alignment</h4>
            <p>Your profile suggests strong alignment with:</p>
            <div className={styles.careerTags}>
              {personalityCluster.careerCluster.careers.map((career, i) => (
                <motion.span
                  key={i}
                  className={styles.careerTag}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.05, x: 5 }}
                >
                  {'-> '} {career}
                </motion.span>
              ))}
            </div>
          </div>
        </div>

        <AIInsightButton
          label="Get Career Guidance"
          onClick={() => fetchAI('career', getCareerGuidance)}
          loading={aiLoading.career}
          content={aiContent.career}
        />

        <div className={styles.birthdayStats}>
          <h4>Birthday Influence</h4>
          <div className={styles.birthdayGrid}>
            <motion.div
              className={styles.bdayCard}
              whileHover={{ y: -3 }}
            >
              <span className={styles.bdayIcon}>D</span>
              <span className={styles.bdayValue}>{personalityCluster.birthdayStats.dayOfWeek}</span>
              <span className={styles.bdayLabel}>Born on</span>
            </motion.div>
            <motion.div
              className={styles.bdayCard}
              whileHover={{ y: -3 }}
            >
              <span className={styles.bdayIcon}>R</span>
              <span className={styles.bdayValue}>{personalityCluster.birthdayStats.planetaryRuler}</span>
              <span className={styles.bdayLabel}>Planetary Ruler</span>
            </motion.div>
            <motion.div
              className={styles.bdayCard}
              whileHover={{ y: -3 }}
            >
              <span className={styles.bdayIcon}>E</span>
              <span className={styles.bdayValue}>{personalityCluster.birthdayStats.dayTrait.split(',')[0]}</span>
              <span className={styles.bdayLabel}>Day Energy</span>
            </motion.div>
          </div>
          {personalityCluster.birthdayStats.isPrimeDay && (
            <motion.p
              className={styles.funFact}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              Born on a prime-number day - mathematically unique.
            </motion.p>
          )}
        </div>
      </ExpandableSection>

      {/* Section 5: Romantic Profile */}
      <ExpandableSection title="Romantic Profile" number={5}>
        <motion.div
          className={styles.romanticArchetype}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p className={styles.sunSign}>{romantic.sunSign}</p>
          <h2 className={styles.loveStyle}>{romantic.archetype}</h2>
          <div className={styles.loveTraits}>
            {romantic.traits.map((trait, i) => (
              <motion.span
                key={i}
                className={styles.loveTrait}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.1, y: -2 }}
              >
                {trait}
              </motion.span>
            ))}
          </div>
        </motion.div>

        <div className={styles.romanticGrid}>
          <motion.div
            className={styles.romanticCard}
            whileHover={{ scale: 1.02 }}
          >
            <h4>Love Language</h4>
            <p>{romantic.loveLanguage}</p>
          </motion.div>
          <motion.div
            className={styles.romanticCard}
            whileHover={{ scale: 1.02 }}
          >
            <h4>Attachment Style</h4>
            <p>{romantic.attachmentStyle}</p>
          </motion.div>
        </div>

        <AIInsightButton
          label="Reveal Your Romantic Destiny"
          onClick={() => fetchAI('romantic', getRomanticInsight)}
          loading={aiLoading.romantic}
          content={aiContent.romantic}
        />

        <div className={styles.romanticDetails}>
          <div className={styles.detailBlock}>
            <h4>Approach to Love</h4>
            <p>{romantic.approachToLove}</p>
          </div>
          <div className={styles.detailBlock}>
            <h4>What You Need</h4>
            <p>{romantic.romanticNeeds}</p>
          </div>
          <div className={styles.detailBlock}>
            <h4>Growth Areas</h4>
            <p className={styles.challengeText}>{romantic.challenges}</p>
          </div>
        </div>

        {romantic.cusp.isOnCusp && (
          <motion.div
            className={styles.cuspNote}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <span className={styles.cuspLabel}>{romantic.cusp.cusp} Cusp</span>
            <p>{romantic.cusp.modifier}</p>
          </motion.div>
        )}

        <div className={styles.compatSection}>
          <div className={styles.compatBox}>
            <h4>Best Matches</h4>
            <div className={styles.signList}>
              {romantic.compatibility.bestMatches.map((sign, i) => (
                <motion.span
                  key={i}
                  className={styles.signBadgeGood}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.15 }}
                >
                  {sign}
                </motion.span>
              ))}
            </div>
          </div>
          <div className={styles.compatBox}>
            <h4>Challenging Matches</h4>
            <div className={styles.signList}>
              {romantic.compatibility.challengingMatches.map((sign, i) => (
                <motion.span
                  key={i}
                  className={styles.signBadgeChallenging}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.15 }}
                >
                  {sign}
                </motion.span>
              ))}
            </div>
          </div>
        </div>

        <motion.div
          className={styles.idealPartner}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h4>Ideal Partner</h4>
          <p>{romantic.idealPartner}</p>
        </motion.div>
      </ExpandableSection>
    </div>
  );
}

