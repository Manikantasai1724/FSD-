import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="navbar-logo logo" style={{ color: 'white', marginBottom: '16px' }}>
              <div className="logo-icon">🔄</div>
              SkillXchange
            </div>
            <p>The community platform where knowledge is currency. Learn anything, teach anything, grow together.</p>
          </div>
          <div className="footer-col">
            <h4>Platform</h4>
            <ul>
              <li><Link to="/explore">Explore Skills</Link></li>
              <li><Link to="/match">Find Matches</Link></li>
              <li><Link to="/community">Community</Link></li>
              <li><Link to="/dashboard">Dashboard</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Account</h4>
            <ul>
              <li><Link to="/login">Sign Up</Link></li>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/profile">Profile</Link></li>
              <li><Link to="/requests">Requests</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Company</h4>
            <ul>
              <li><a href="#">About Us</a></li>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2024 SkillXchange. Built with ❤️ for learners everywhere.</span>
          <span style={{ display: 'flex', gap: '16px' }}>
            <a href="#" style={{ color: 'rgba(255,255,255,0.5)' }}>Twitter</a>
            <a href="#" style={{ color: 'rgba(255,255,255,0.5)' }}>LinkedIn</a>
            <a href="#" style={{ color: 'rgba(255,255,255,0.5)' }}>Discord</a>
          </span>
        </div>
      </div>
    </footer>
  );
}
