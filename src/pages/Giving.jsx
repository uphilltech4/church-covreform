import { Container, Row, Col } from 'react-bootstrap'
import { BsCreditCard, BsCash, BsBank, BsHeart } from 'react-icons/bs'

const givingMethods = [
  { icon: <BsCreditCard size={28} />, title: 'Online Giving', desc: 'Give securely online through our website. One-time or recurring donations.' },
  { icon: <BsCash size={28} />, title: 'In-Person', desc: 'Give during our Sunday services through the offering. Envelopes available.' },
  { icon: <BsBank size={28} />, title: 'E-Transfer', desc: 'Send an e-transfer directly to the church. Contact the office for details.' },
  { icon: <BsHeart size={28} />, title: 'Special Offerings', desc: 'Contribute to missions, building projects, and special causes throughout the year.' },
]

export default function Giving() {
  return (
    <>
      <section className="page-header">
        <Container>
          <h1>Giving</h1>
          <p>Your generosity makes ministry possible. Thank you for your faithful support.</p>
        </Container>
      </section>

      <section className="giving-section section-padding">
        <Container style={{ position: 'relative', zIndex: 1 }}>
          <Row className="align-items-center g-5 mb-5">
            <Col lg={6}>
              <div className="section-label" style={{ color: 'var(--secondary-light)' }}>Support Our Mission</div>
              <h2 style={{ color: 'white', marginBottom: '1.2rem' }}>Give Generously</h2>
              <p>
                &quot;Each of you should give what you have decided in your heart to give, not reluctantly or under 
                compulsion, for God loves a cheerful giver.&quot; — 2 Corinthians 9:7
              </p>
              <p>
                Your tithes and offerings help us maintain our ministries, support missions, 
                care for our community, and reach the lost with the love of Jesus. Every gift, 
                no matter the size, makes a difference in building God&apos;s kingdom.
              </p>
            </Col>
            <Col lg={6}>
              <Row className="g-3">
                {givingMethods.map((method, i) => (
                  <Col sm={6} key={i}>
                    <div className="giving-method">
                      <div className="giving-icon">{method.icon}</div>
                      <h5>{method.title}</h5>
                      <p>{method.desc}</p>
                    </div>
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>

          <div className="text-center mt-4" style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 20, padding: '2.5rem', border: '1px solid rgba(255,255,255,0.1)' }}>
            <h4 style={{ color: 'white', fontFamily: 'var(--font-heading)', marginBottom: '1rem' }}>
              Tax Receipts
            </h4>
            <p style={{ maxWidth: 600, margin: '0 auto' }}>
              As a registered charitable organization, Covenant Reformed Church issues 
              tax receipts for all eligible donations. Receipts are mailed out annually 
              in February for the previous year&apos;s giving.
            </p>
          </div>
        </Container>
      </section>
    </>
  )
}
