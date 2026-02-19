import { useState, useEffect } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { BsStar, BsBook, BsHeart, BsPeople, BsShieldCheck, BsJournalBookmark, BsPerson, BsArrowRepeat, BsGlobe, BsChevronDown, BsChevronUp } from 'react-icons/bs'
import { staffAPI } from '../services/api'

export default function About() {
  const [staff, setStaff] = useState([])
  const [expandedBelief, setExpandedBelief] = useState(null)

  useEffect(() => {
    staffAPI.getAll()
      .then(data => setStaff(data))
      .catch(err => console.error('Failed to load staff:', err))
  }, [])

  return (
    <>
      {/* Page Header */}
      <section className="page-header">
        <Container>
          <h1>About Us</h1>
          <p>We are a credo-baptist congregation committed to the principles of Reformed covenantal theology.</p>
        </Container>
      </section>

      {/* Mission Section */}
      <section className="about-section section-padding">
        <Container>
          <Row className="align-items-center g-5">
            <Col lg={6}>
              <div className="about-image-wrapper">
                <img 
                  src="/images/about/community.jpg" 
                  alt="Church community"
                />
                <div className="about-badge">Steinbach, MB</div>
              </div>
            </Col>
            <Col lg={6}>
              <div className="about-content">
                <div className="section-label">Who We Are</div>
                <h2>Committed to Reformed Covenantal Theology</h2>
                <p>
                  We are a growing demographically diverse congregation committed to the principles of Reformed
                  covenantal theology. Our foundation is the Bible, our desire is to see discipleship happen for
                  every person and we seek to elevate the gospel in all areas as our only hope of salvation.
                </p>
                <h5 style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary-dark)', marginBottom: '1rem' }}>
                  What We Believe
                </h5>
                <ul className="about-list">
                  <li>
                    <span className="check-icon"><BsStar /></span>
                    The Bible is the written word of God, inspired by the Holy Spirit and without error
                  </li>
                  <li>
                    <span className="check-icon"><BsBook /></span>
                    Salvation is by God&apos;s grace alone, through faith alone, in Jesus Christ alone
                  </li>
                  <li>
                    <span className="check-icon"><BsHeart /></span>
                    God sovereignly chooses whom He will save based solely on His grace
                  </li>
                  <li>
                    <span className="check-icon"><BsPeople /></span>
                    The church is the covenant community of God where His grace is available to all
                  </li>
                </ul>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* What We Believe - Doctrinal Statement */}
      <section className="section-padding" style={{ background: 'var(--bg-cream)' }}>
        <Container>
          <div className="section-header">
            <div className="section-label">Doctrinal Statement</div>
            <h2 className="section-title">What We Believe</h2>
            <p className="section-description">
              We are a credo-baptist congregation committed to the principles of Reformed covenantal theology. 
              The substance of each statement is borrowed purposefully from historical Reformed creeds and confessions.
            </p>
          </div>
          <Row className="g-4">
            {[
              {
                icon: <BsBook />,
                title: 'The Bible',
                summary: 'The written word of God, inspired by the Holy Spirit and without error.',
                detail: 'We believe that the Bible is the written word of God, inspired by the Holy Spirit and without error in the original manuscripts. The Bible is the revelation of God\'s truth and is infallible and authoritative in all matters of faith and practice.'
              },
              {
                icon: <BsShieldCheck />,
                title: 'The Trinity',
                summary: 'One living and true God existing eternally in three persons.',
                detail: 'We believe in the Trinity. There is one living and true God, infinite and unchanging, who exists eternally in three persons: the Father, the Son, and the Holy Spirit. These are equal in every divine perfection, and they execute distinct but harmonious offices in the work of creation, providence, and redemption.'
              },
              {
                icon: <BsStar />,
                title: 'Jesus Christ',
                summary: 'The eternal Son of God who atoned for the sins of all who trust in Him.',
                detail: 'We believe that Jesus Christ is the eternal Son of God, who through his perfect obedience and sacrificial death as the representative and substitute of his people, atoned for the sins of all who would trust in him alone for salvation.'
              },
              {
                icon: <BsJournalBookmark />,
                title: 'The Holy Spirit',
                summary: 'He came forth to convict, regenerate, sanctify and indwell God\'s people.',
                detail: 'We believe in the Holy Spirit who came forth from the Father and the Son to convict the world of sin, righteousness, and judgment and to regenerate, sanctify and indwell God\'s people and enable them to trust Christ and follow him.'
              },
              {
                icon: <BsPerson />,
                title: 'Man and Sin',
                summary: 'Humanity was created in God\'s image but all are sinners, unable to save themselves.',
                detail: 'We believe that humanity was created by God in his own image; that in the sin of Adam all incurred physical, spiritual and eternal death. All people are thus sinners by nature, are guilty in God\'s sight, and are totally unable to save themselves from God\'s displeasure. His free grace alone provides the way of salvation.'
              },
              {
                icon: <BsHeart />,
                title: 'Election',
                summary: 'Salvation is the work of God alone — He sovereignly chooses whom He will save.',
                detail: 'We believe that this salvation is the work of God alone. He sovereignly chooses whom he will save. We believe that his choice is based solely on his grace, not on any merit found in his people, their foreseen faith, or their religious activity.'
              },
              {
                icon: <BsArrowRepeat />,
                title: 'Salvation',
                summary: 'By God\'s grace alone, through faith alone, in Jesus Christ alone.',
                detail: 'We believe that the only way to acceptance with God is by God\'s grace alone, through faith alone, in Jesus Christ alone. All those who repent and forsake sin and trust in Jesus Christ as Savior are united with Christ, become new creatures, are indwelt by the Holy Spirit, are delivered from condemnation, and receive eternal life.'
              },
              {
                icon: <BsShieldCheck />,
                title: 'Perseverance of the Saints',
                summary: 'Believers can never be lost but persevere, kept by the power of God.',
                detail: 'We believe that having come to saving faith in Christ, believers can never be lost, but persevere to the end, being kept by the power of God through the indwelling of the Holy Spirit. This perseverance is both the responsibility of every believer, and the infallible promise of God to all his people.'
              },
              {
                icon: <BsPeople />,
                title: 'The Church',
                summary: 'The covenant community of God where His grace is available to all.',
                detail: 'We believe that the church is the covenant community of God and the sphere within which the grace of God is available to all, through the preaching and teaching of the Bible, the administration of the sacraments of Baptism and the Lord\'s Supper, and the discipleship of fellow believers.'
              },
              {
                icon: <BsGlobe />,
                title: 'The Return of Christ',
                summary: 'Jesus will return bodily and visibly to judge all mankind.',
                detail: 'We believe that Jesus will return at the last day, bodily and visibly, to judge all mankind and to receive his people to himself.'
              }
            ].map((belief, i) => (
              <Col md={6} key={i}>
                <div 
                  onClick={() => setExpandedBelief(expandedBelief === i ? null : i)}
                  style={{ 
                    background: 'white', 
                    borderRadius: 16, 
                    padding: '1.5rem', 
                    boxShadow: 'var(--shadow-sm)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    border: expandedBelief === i ? '2px solid var(--primary)' : '2px solid transparent',
                    height: '100%'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: expandedBelief === i ? '1rem' : 0 }}>
                    <div style={{ 
                      width: 48, height: 48, borderRadius: 12, 
                      background: 'var(--primary-light)', color: 'white',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1.2rem', flexShrink: 0
                    }}>
                      {belief.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h5 style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary-dark)', margin: 0, fontSize: '1.05rem' }}>
                        {belief.title}
                      </h5>
                      <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-light)' }}>{belief.summary}</p>
                    </div>
                    <span style={{ color: 'var(--primary)', fontSize: '1rem', flexShrink: 0 }}>
                      {expandedBelief === i ? <BsChevronUp /> : <BsChevronDown />}
                    </span>
                  </div>
                  {expandedBelief === i && (
                    <p style={{ margin: 0, lineHeight: 1.8, color: '#555', fontSize: '0.92rem', paddingLeft: '3.5rem' }}>
                      {belief.detail}
                    </p>
                  )}
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Core Values */}
      <section className="section-padding">
        <Container>
          <div className="section-header">
            <div className="section-label">How We Live</div>
            <h2 className="section-title">Our Core Values</h2>
            <p className="section-description">
              These values shape everything we do as a church family.
            </p>
          </div>
          <Row className="g-4">
            {[
              {
                icon: <BsBook />,
                title: 'Biblical Authority',
                text: 'The Bible is our ultimate authority in all matters of faith and practice. We are committed to expository preaching and teaching that faithfully handles God\'s Word.'
              },
              {
                icon: <BsHeart />,
                title: 'Sovereign Grace',
                text: 'We rest in the truth that salvation is entirely the work of God. His sovereign grace is our only hope, and we proclaim this good news to all people.'
              },
              {
                icon: <BsPeople />,
                title: 'Covenant Community',
                text: 'We are a church where all people can be comfortable. Whatever your background or place in life, come as you are. You will find a home among us.'
              },
              {
                icon: <BsJournalBookmark />,
                title: 'Discipleship',
                text: 'Our desire is to see discipleship happen for every person — men, women, and youth — through Bible studies, theological discussion, and life-on-life mentoring.'
              },
              {
                icon: <BsStar />,
                title: 'Gospel-Centered Living',
                text: 'We seek to elevate the gospel in all areas as our only hope of salvation, both in our worship gatherings and in our daily lives.'
              },
              {
                icon: <BsGlobe />,
                title: 'Reformed Heritage',
                text: 'We stand on the shoulders of the historic Reformed faith, drawing from centuries of faithful theological reflection while applying these truths to life today.'
              }
            ].map((value, i) => (
              <Col md={6} lg={4} key={i}>
                <div className="fade-in-up" style={{ 
                  background: 'var(--bg-cream)', 
                  borderRadius: 16, 
                  padding: '2rem', 
                  height: '100%',
                  borderTop: '4px solid var(--primary)'
                }}>
                  <div style={{ 
                    width: 52, height: 52, borderRadius: '50%',
                    background: 'var(--primary)', color: 'white',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.3rem', marginBottom: '1.2rem'
                  }}>
                    {value.icon}
                  </div>
                  <h5 style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary-dark)', marginBottom: '0.8rem' }}>
                    {value.title}
                  </h5>
                  <p style={{ lineHeight: 1.8, color: '#555', fontSize: '0.92rem', margin: 0 }}>
                    {value.text}
                  </p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Staff */}
      <section className="staff-section section-padding">
        <Container>
          <div className="section-header">
            <div className="section-label">Our Team</div>
            <h2 className="section-title">Meet Our Pastors & Staff</h2>
            <p className="section-description">
              Our dedicated team serves with passion and purpose, committed to shepherding 
              our church family.
            </p>
          </div>
          <Row className="g-4">
            {staff.map((person) => (
              <Col md={6} key={person.id}>
                <div className="staff-card fade-in-up" style={{ height: '100%' }}>
                  {person.image && (
                    <div className="staff-card-image">
                      <img src={person.image} alt={person.name} />
                    </div>
                  )}
                  <div className="staff-card-body" style={{ padding: '2rem' }}>
                    <div style={{ 
                      display: 'inline-block',
                      background: 'var(--primary)', 
                      color: '#fff', 
                      fontSize: '0.75rem', 
                      fontWeight: 700, 
                      textTransform: 'uppercase', 
                      letterSpacing: '0.08em',
                      padding: '0.35rem 1rem', 
                      borderRadius: '2rem',
                      marginBottom: '0.75rem'
                    }}>
                      {person.role}
                    </div>
                    <h4 style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary-dark)', marginBottom: '1rem' }}>
                      {person.name}
                    </h4>
                    {person.bio.split('\n\n').map((paragraph, idx) => (
                      <p key={idx} style={{ lineHeight: 1.8, color: '#555' }}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
    </>
  )
}
