import './Home.css';
import Card1 from './Cards/Card1.js';
import Card2 from './Cards/Card2.js';
import Card3 from './Cards/Card3.js';
import Card4 from './Cards/Card4.js';
import Nav from './Nav/Nav.js';
import Inicio from './Inicio/Inicio.js';
import Footer from './Footer/Footer.jsx';

function Home() {
  return (
    <div className="App">
      <Nav />
      <Inicio />

      <section className="monitored-section">
        <div className="containerHome">
          <h2 className="section-title">Monitored Variables</h2>

          <div className="cards-grid">
            <Card1 />
            <Card2 />
            <Card3 />
            <Card4 />
          </div>
        </div>
      </section>

      <Footer
        brand="Industrial El Retoño"
        tagline="Líderes en soluciones industriales"
        contact={{
          email: "El_Retoño_Industries@Corp.com",
          phone: "+52 55 666 54321",
          address: "Aguascalientes, Mexico"
        }}
      />
    </div>
  );
}

export default Home;