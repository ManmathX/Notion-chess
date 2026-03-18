import React from 'react';

const stats = [
  { value: '12k+', label: 'Students coached', note: 'From primary school to entrance prep' },
  { value: '180+', label: 'Verified tutors', note: 'Subject experts and exam mentors' },
  { value: '94%', label: 'Parents report progress', note: 'Measured within the first 8 weeks' },
  { value: '4.9/5', label: 'Session rating', note: 'Trusted for clarity, care, and consistency' }
];

const programs = [
  {
    title: '1-on-1 Mastery',
    description: 'Focused weekly sessions built around pace gaps, school goals, and exam readiness.',
    bullets: ['Custom lesson path', 'Homework support', 'Weekly parent summary']
  },
  {
    title: 'Small Group Boost',
    description: 'High-energy cohort classes for learners who thrive with structure, peers, and accountability.',
    bullets: ['Max 6 students', 'Live practice drills', 'Monthly benchmark review']
  },
  {
    title: 'Olympiad and Coding',
    description: 'Advanced mentoring for problem-solving competitions, coding clubs, and ambitious learners.',
    bullets: ['Math olympiad prep', 'Python and web basics', 'Portfolio-style projects']
  }
];

const benefits = [
  {
    title: 'Tutor matching that actually fits',
    description: 'We pair every learner with a tutor based on subject need, personality, and pace.'
  },
  {
    title: 'Clear outcomes every week',
    description: 'Parents see lesson goals, completed work, and confidence trends in one simple report.'
  },
  {
    title: 'Built for busy families',
    description: 'Flexible scheduling, class recordings, and make-up sessions keep momentum intact.'
  },
  {
    title: 'Academic confidence, not just marks',
    description: 'Students improve how they think, ask questions, and approach difficult topics.'
  }
];

const testimonials = [
  {
    quote: 'My daughter went from dreading algebra to asking for extra challenge sheets. The difference in confidence has been huge.',
    name: 'Riya Kapoor',
    role: 'Parent of Grade 8 student'
  },
  {
    quote: 'The tutor broke physics into steps I could actually understand. My test scores improved, but so did the way I study.',
    name: 'Arnav Mehta',
    role: 'Grade 11 student'
  },
  {
    quote: 'We finally found a tutoring team that communicates well, tracks progress, and keeps our son motivated every week.',
    name: 'Neha Raman',
    role: 'Parent of middle school learner'
  }
];

const plans = [
  {
    name: 'Starter',
    price: '$79',
    detail: 'per month',
    summary: 'Best for one core subject and weekly support.',
    features: ['4 live sessions', 'Practice worksheets', 'Monthly progress report'],
    cta: 'Start Starter'
  },
  {
    name: 'Growth',
    price: '$149',
    detail: 'per month',
    summary: 'For students building momentum across multiple topics.',
    features: ['8 live sessions', 'Priority tutor matching', 'Weekly parent updates'],
    cta: 'Book Growth Plan',
    featured: true
  },
  {
    name: 'Elite',
    price: '$249',
    detail: 'per month',
    summary: 'High-touch mentoring for exams, olympiads, and advanced goals.',
    features: ['12 live sessions', 'Dedicated mentor coach', 'Mocks and strategy reviews'],
    cta: 'Talk to an Advisor'
  }
];

const subjectTags = ['Math', 'Science', 'Coding', 'English', 'IELTS', 'SAT'];

function TutorLandingPage() {
  return (
    <div className="tutor-site">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="TutorSpark home">
          <span className="brand-mark">TS</span>
          <span className="brand-copy">
            <strong>TutorSpark</strong>
            <span>Premium learning studio</span>
          </span>
        </a>

        <nav className="main-nav" aria-label="Primary">
          <a href="#programs">Programs</a>
          <a href="#results">Results</a>
          <a href="#stories">Stories</a>
          <a href="#pricing">Pricing</a>
        </nav>

        <div className="header-actions">
          <a className="text-link" href="#stories">Log in</a>
          <a className="primary-link" href="#pricing">Book a Free Trial</a>
        </div>
      </header>

      <main>
        <section className="hero-section" id="top">
          <div className="hero-copy">
            <span className="eyebrow">Premium tutoring for focused families</span>
            <h1>
              Turn after-school hours into
              <span> confident academic wins</span>
            </h1>
            <p className="hero-description">
              Live 1-on-1 tutoring, high-impact small groups, and weekly progress updates
              across math, science, coding, and language learning.
            </p>

            <div className="hero-actions">
              <a className="primary-link large" href="#pricing">Book a Free Trial</a>
              <a className="secondary-link large" href="#programs">Explore Programs</a>
            </div>

            <div className="hero-proof">
              <span>No long-term lock-in</span>
              <span>Flexible schedules</span>
              <span>Progress updates every week</span>
            </div>
          </div>

          <div className="hero-visual" aria-hidden="true">
            <div className="visual-frame">
              <div className="visual-glow"></div>
              {subjectTags.map((tag, index) => (
                <div
                  key={tag}
                  className={`subject-chip chip-${index + 1}`}
                >
                  {tag}
                </div>
              ))}

              <div className="mentor-card">
                <div className="mentor-badge">Live mentor session</div>
                <div className="mentor-score">
                  <strong>96%</strong>
                  <span>students say they feel more confident in class after 6 weeks</span>
                </div>
                <div className="mentor-panel">
                  <div>
                    <p>Next class</p>
                    <strong>Advanced Math Sprint</strong>
                  </div>
                  <span>7:30 PM</span>
                </div>
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

        <section className="section-block programs-section" id="programs">
          <div className="section-heading">
            <span className="eyebrow">Programs</span>
            <h2>Support that adapts to how each student learns best</h2>
            <p>
              Every plan is designed to balance results, confidence, and a rhythm that
              fits real family schedules.
            </p>
          </div>

          <div className="program-grid">
            {programs.map((program) => (
              <article className="program-card" key={program.title}>
                <div className="card-index">{program.title.split(' ')[0]}</div>
                <h3>{program.title}</h3>
                <p>{program.description}</p>
                <ul>
                  {program.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="section-block split-section">
          <div className="section-heading compact">
            <span className="eyebrow">Why families stay</span>
            <h2>Everything needed to build consistency, clarity, and momentum</h2>
            <p>
              TutorSpark combines thoughtful mentor matching with structured lesson plans and
              transparent reporting.
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
            <h2>Trusted by students and parents who wanted more than generic tutoring</h2>
            <p>
              The experience is built to feel premium, personal, and consistently useful from
              the very first week.
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
            <h2>Choose the tutoring rhythm that matches your goals</h2>
            <p>
              Start with a free trial session, meet your tutor, and upgrade only if the fit
              feels right.
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
            <h2>Give your learner a tutor who feels like a real academic partner</h2>
          </div>
          <div className="cta-actions">
            <a className="primary-link large" href="#top">Claim Free Trial</a>
            <a className="secondary-link large" href="#stories">See Parent Reviews</a>
          </div>
        </section>
      </main>
    </div>
  );
}

export default TutorLandingPage;
