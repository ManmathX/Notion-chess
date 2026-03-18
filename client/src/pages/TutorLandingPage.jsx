import React from 'react';

const stats = [
  { value: '500+', label: 'Young players coached', note: 'From first moves to tournament preparation' },
  { value: '50+', label: 'Live lessons each week', note: 'Private sessions and structured group batches' },
  { value: '12+', label: 'Experienced coaches', note: 'Mentors who know how to teach children clearly' },
  { value: '95%', label: 'Parent satisfaction', note: 'Families stay for structure, confidence, and visible progress' }
];

const courses = [
  {
    title: 'Beginner Foundations',
    description: 'Perfect for young learners building confidence with piece movement, tactics, and checkmates.',
    bullets: ['Board basics and notation', 'Mini tactical puzzles', 'Fun confidence-building drills']
  },
  {
    title: 'Strategy Builder',
    description: 'For students ready to understand planning, opening principles, and endgame conversion.',
    bullets: ['Positional thinking', 'Opening structure', 'Practical middlegame ideas']
  },
  {
    title: 'Tournament Track',
    description: 'Serious coaching for competitive players focused on calculation, discipline, and game review.',
    bullets: ['Deep analysis sessions', 'Competitive preparation', 'Performance feedback']
  }
];

const benefits = [
  {
    title: 'Structured chess curriculum',
    description: 'Students move through a clear progression instead of random online puzzles and scattered lessons.'
  },
  {
    title: 'Live coaches who explain well',
    description: 'Each class is designed to build understanding, not just show moves without context.'
  },
  {
    title: 'Progress updates for parents',
    description: 'Families can see what was taught, what improved, and what the student should practice next.'
  },
  {
    title: 'Flexible demo-first enrollment',
    description: 'Book a free demo class first, meet the coach, and then decide on the right batch or private plan.'
  }
];

const testimonials = [
  {
    quote: 'My son is more focused, more patient, and genuinely excited for every class. The coaching is structured and very encouraging.',
    name: 'Nitika Verma',
    role: 'Parent of Grade 5 student'
  },
  {
    quote: 'I used to play quickly without a plan. Now I understand openings better and I review my mistakes after every game.',
    name: 'Vedant Shah',
    role: 'Student, age 12'
  },
  {
    quote: 'The academy gives us exactly what we wanted: discipline, expert teaching, and a learning path we can trust.',
    name: 'Karthik Iyer',
    role: 'Parent of competitive junior player'
  }
];

const plans = [
  {
    name: 'Starter',
    price: '$39',
    detail: 'per month',
    summary: 'A gentle start for beginners who want one guided class each week.',
    features: ['4 live classes', 'Practice worksheets', 'Monthly progress note'],
    cta: 'Start with Starter'
  },
  {
    name: 'Growth',
    price: '$79',
    detail: 'per month',
    summary: 'Our most popular option for steady improvement and consistent coaching.',
    features: ['8 live classes', 'Batch placement support', 'Priority review feedback'],
    cta: 'Book Free Demo',
    featured: true
  },
  {
    name: 'Master',
    price: '$149',
    detail: 'per month',
    summary: 'For tournament-minded students who need deeper analysis and personal attention.',
    features: ['12 live classes', 'Private coaching mix', 'Advanced game analysis'],
    cta: 'Talk to an Advisor'
  }
];

const pieces = [
  { symbol: '♔', className: 'piece-1 blue' },
  { symbol: '♕', className: 'piece-2 violet' },
  { symbol: '♙', className: 'piece-3 violet' },
  { symbol: '♗', className: 'piece-4 blue' },
  { symbol: '♖', className: 'piece-5 blue' },
  { symbol: '♘', className: 'piece-6 violet' }
];

function TutorLandingPage() {
  return (
    <div className="tutor-site">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Notion Chess home">
          <span className="brand-mark">NC</span>
          <span className="brand-copy">
            <strong>NOTION CHESS</strong>
            <span>Academy</span>
          </span>
        </a>

        <nav className="main-nav" aria-label="Primary">
          <a className="active" href="#about">About Us</a>
          <a href="#courses">Courses</a>
          <a href="#stories">Blog</a>
          <a href="#pricing">Book a Free Demo</a>
        </nav>

        <div className="header-actions">
          <a className="login-link" href="#pricing">
            <span className="login-avatar"></span>
            Login
          </a>
        </div>
      </header>

      <main>
        <section className="hero-section" id="top">
          <div className="hero-copy">
            <span className="eyebrow">Expert chess coaching for growing minds</span>
            <h1>
              <span>Unlock Your</span>
              Child&apos;s Potential
              Through Chess
            </h1>
            <p className="hero-description">
              Expert coaching and a structured curriculum designed to build focus,
              strategic thinking, and confidence in students of all levels.
            </p>

            <div className="hero-actions">
              <a className="primary-link large" href="#pricing">Book a Free Demo</a>
              <a className="secondary-link large" href="#about">Contact</a>
            </div>

            <div className="hero-proof">
              <span>No credit card required</span>
              <span>Takes just 60 seconds to book</span>
            </div>
          </div>

          <div className="hero-visual" aria-hidden="true">
            <div className="visual-frame chess-frame">
              <div className="visual-glow"></div>
              <div className="visual-halo"></div>

              {pieces.map((piece) => (
                <div key={piece.className} className={`piece-orbit ${piece.className}`}>
                  {piece.symbol}
                </div>
              ))}

              <div className="academy-emblem">
                <div className="academy-emblem__core">NC</div>
              </div>
            </div>
          </div>
        </section>

        <section className="stats-section" id="results">
          {stats.map((stat) => (
            <article className="stat-tile" key={stat.label}>
              <strong>{stat.value}</strong>
              <h2>{stat.label}</h2>
              <p>{stat.note}</p>
            </article>
          ))}
        </section>

        <section className="section-block programs-section" id="courses">
          <div className="section-heading">
            <span className="eyebrow">Courses</span>
            <h2>Programs built for beginners, rising players, and ambitious competitors</h2>
            <p>
              Every course is designed to help students think more clearly, play more confidently,
              and enjoy steady progress with expert guidance.
            </p>
          </div>

          <div className="program-grid">
            {courses.map((course) => (
              <article className="program-card" key={course.title}>
                <div className="card-index">{course.title.split(' ')[0][0]}</div>
                <h3>{course.title}</h3>
                <p>{course.description}</p>
                <ul>
                  {course.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="section-block split-section" id="about">
          <div className="section-heading compact">
            <span className="eyebrow">About Us</span>
            <h2>Everything parents need to feel confident about their child&apos;s learning journey</h2>
            <p>
              Notion Chess Academy combines thoughtful teaching, structured lesson paths,
              and patient coaching so students learn the game with clarity and confidence.
            </p>
          </div>

          <div className="benefit-grid">
            {benefits.map((benefit) => (
              <article className="benefit-card" key={benefit.title}>
                <span className="benefit-mark"></span>
                <h3>{benefit.title}</h3>
                <p>{benefit.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section-block story-section" id="stories">
          <div className="section-heading">
            <span className="eyebrow">Stories</span>
            <h2>Trusted by families who want more than casual chess classes</h2>
            <p>
              Our students learn discipline, calculation, and confidence while parents enjoy
              a clear system with real communication and visible outcomes.
            </p>
          </div>

          <div className="testimonial-grid">
            {testimonials.map((testimonial) => (
              <article className="testimonial-card" key={testimonial.name}>
                <div className="rating-row">
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <p>{testimonial.quote}</p>
                <div className="person-meta">
                  <strong>{testimonial.name}</strong>
                  <span>{testimonial.role}</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section-block pricing-section" id="pricing">
          <div className="section-heading">
            <span className="eyebrow">Pricing</span>
            <h2>Choose the plan that fits your child&apos;s pace and goals</h2>
            <p>
              Start with a free demo session, meet the coach, and then choose the format
              that feels right for your learner.
            </p>
          </div>

          <div className="pricing-grid">
            {plans.map((plan) => (
              <article
                className={`pricing-card ${plan.featured ? 'featured' : ''}`}
                key={plan.name}
              >
                {plan.featured ? <div className="plan-tag">Most Popular</div> : null}
                <h3>{plan.name}</h3>
                <p className="plan-summary">{plan.summary}</p>
                <div className="plan-price">
                  <strong>{plan.price}</strong>
                  <span>{plan.detail}</span>
                </div>
                <a className={plan.featured ? 'primary-link block' : 'secondary-link block'} href="#top">
                  {plan.cta}
                </a>
                <ul>
                  {plan.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="section-block final-cta">
          <div>
            <span className="eyebrow">Ready to begin</span>
            <h2>Help your child grow sharper, calmer, and more confident through chess</h2>
          </div>
          <div className="cta-actions">
            <a className="primary-link large" href="#top">Book Free Demo</a>
            <a className="secondary-link large" href="#stories">See Parent Reviews</a>
          </div>
        </section>
      </main>
    </div>
  );
}

export default TutorLandingPage;
