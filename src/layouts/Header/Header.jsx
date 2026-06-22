import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import Button from '../../components/Button/Button';
import './Header.css';
import logo from '../../assets/GDMS_logo.png';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const projectsSection = document.getElementById('projects');
      if (projectsSection) {
        // Show the menu when the top of the projects section is near the viewport top
        setIsScrolled(projectsSection.getBoundingClientRect().top <= 100);
      } else {
        // Fallback if not on the homepage or if projects section isn't found
        setIsScrolled(window.scrollY > 20);
      }
    };
    window.addEventListener('scroll', handleScroll);
    // Call it once on mount to set the initial state
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (id) => {
    setIsMenuOpen(false);
    if (location.pathname !== '/') {
      // If not on home page, navigation will happen via Link to="/"
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className={`header ${isScrolled ? 'scrolled glass' : ''}`}>
      <div className="container-fluid header-content">
        <div className="logo">
          <Link to="/">
            <img src={logo} alt="GDMS Logo" className="logo-image" />
          </Link>
        </div>

        <nav className={`nav ${isMenuOpen ? "open" : ""}`}>
          <Link to="/#projects" onClick={() => handleNavClick("projects")}>
            PROJECTS
          </Link>
          <Link to="/#about" onClick={() => handleNavClick("about")}>
            ABOUT US
          </Link>
          <Link to="/#services" onClick={() => handleNavClick("services")}>
            SERVICES
          </Link>
          <Link to="/#team" onClick={() => handleNavClick("team")}>
            TEAM
          </Link>
          <Link to="/careers">CAREER</Link>
          <Link to="/#contact" onClick={() => handleNavClick("contact")}>
            CONTACT US
          </Link>
        </nav>

        <button className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>
    </header>
  );
};

export default Header;
