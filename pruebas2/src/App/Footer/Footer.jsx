import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="footer-column">
          <h3>About Us</h3>
          <div className="footer-links">
            <a href="/">Fundation</a>
            <a href="/">News</a>
            <a href="/">Executive team</a>
          </div>
        </div>

        <div className="footer-column">
          <h3>Industrial El Retoño</h3>
          <div className="footer-links">
            <a href="/">Data centers</a>
            <a href="/">Manufacturing</a>
            <a href="/">Equipment</a>
            <a href="/">Investigation</a>
          </div>
        </div>

        <div className="footer-column">
          <h3>Contact Us</h3>
          <div className="footer-links">
            <a href="/">Facebook</a>
            <a href="/">Instagram</a>
            <a href="/">WhatsApp</a>
            <a href="/">LinkedIn</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <a href="/">Terms & Conditions</a>
        <span>|</span>
        <a href="/">Privacy Policy</a>
        <span>|</span>
        <a href="/">Development team</a>
        <span>|</span>
        <a href="/">Technical Support</a>
      </div>
    </footer>
  );
}