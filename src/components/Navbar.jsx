import { NavLink, Link } from 'react-router-dom'
import { Container, Nav, Navbar as BSNavbar } from 'react-bootstrap'
import { BsPlusLg } from 'react-icons/bs'

export default function Navbar() {
  return (
    <BSNavbar expand="lg" className="navbar-church" sticky="top">
      <Container>
        <BSNavbar.Brand as={Link} to="/">
          <span className="brand-icon"><BsPlusLg /></span>
          Mitchell Christian Assembly
        </BSNavbar.Brand>
        <BSNavbar.Toggle aria-controls="main-nav" />
        <BSNavbar.Collapse id="main-nav">
          <Nav className="ms-auto align-items-lg-center gap-1">
            <Nav.Link as={NavLink} to="/" end>Home</Nav.Link>
            <Nav.Link as={NavLink} to="/about">About Us</Nav.Link>
            <Nav.Link as={NavLink} to="/ministries">Ministries</Nav.Link>
            <Nav.Link as={NavLink} to="/events">Events</Nav.Link>
            <Nav.Link as={NavLink} to="/online-services">Online Services</Nav.Link>
            <Nav.Link as={NavLink} to="/giving">Giving</Nav.Link>
            <Nav.Link as={NavLink} to="/contact">Contact</Nav.Link>
            <Nav.Link as={Link} to="/admin" className="btn btn-nav-cta ms-lg-2">
              Admin
            </Nav.Link>
          </Nav>
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  )
}
