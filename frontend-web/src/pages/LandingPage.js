import React from 'react';
import '../styles/landing.css';

const LandingPage = ({ onVisit }) => {
  React.useEffect(() => {
    if (onVisit) onVisit();
  }, [onVisit]);
  return (
    <div className="landing-page">
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="logo-section">
            <img src="/logo192.png" alt="Leo Supermercado" className="logo" />
            <div className="brand">
              <h1>Leo Supermercado</h1>
              <p className="slogan">Qualidade e economia para sua família!</p>
            </div>
          </div>
          <nav className="nav">
            <a href="#sobre">Sobre</a>
            <a href="#ofertas">Ofertas</a>
            <a href="#instagram">Instagram</a>
            <a href="#contato">Contato</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h2>Bem-vindo ao Leo Supermercado</h2>
            <p className="hero-text">
              Os melhores produtos com os melhores preços da região!
            </p>
            <div className="hero-features">
              <div className="feature">
                <span className="icon">🛒</span>
                <h3>Variedade</h3>
                <p>Milhares de produtos</p>
              </div>
              <div className="feature">
                <span className="icon">💰</span>
                <h3>Preços Baixos</h3>
                <p>Economia garantida</p>
              </div>
              <div className="feature">
                <span className="icon">🚚</span>
                <h3>Entrega</h3>
                <p>Rápida e segura</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sobre Nós */}
      <section id="sobre" className="about">
        <div className="container">
          <h2 className="section-title">Sobre Nós</h2>
          <div className="about-content">
            <div className="about-text">
              <p>
                O <strong>Leo Supermercado</strong> é uma empresa familiar que há anos 
                se dedica a oferecer produtos de qualidade com preços justos para 
                toda a comunidade.
              </p>
              <p>
                Nossa missão é proporcionar uma experiência de compra completa, 
                com atendimento personalizado, produtos frescos e sempre com 
                as melhores ofertas.
              </p>
              <div className="about-values">
                <div className="value">
                  <h4>🎯 Nossa Missão</h4>
                  <p>Oferecer qualidade e economia para todas as famílias</p>
                </div>
                <div className="value">
                  <h4>👁️ Nossa Visão</h4>
                  <p>Ser referência em supermercado de bairro na região</p>
                </div>
                <div className="value">
                  <h4>⭐ Nossos Valores</h4>
                  <p>Honestidade, qualidade e respeito ao cliente</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ofertas */}
      <section id="ofertas" className="offers">
        <div className="container">
          <h2 className="section-title">Ofertas da Semana</h2>
          <div className="offers-grid">
            <div className="offer-card">
              <div className="offer-badge">PROMOÇÃO</div>
              <div className="offer-icon">🍎</div>
              <h3>Frutas & Verduras</h3>
              <p>Produtos fresquinhos com até 30% OFF</p>
              <span className="offer-tag">Válido até domingo</span>
            </div>
            <div className="offer-card">
              <div className="offer-badge">DESTAQUE</div>
              <div className="offer-icon">🥛</div>
              <h3>Laticínios</h3>
              <p>Leite, queijo e iogurtes em promoção</p>
              <span className="offer-tag">Aproveite!</span>
            </div>
            <div className="offer-card">
              <div className="offer-badge">IMPERDÍVEL</div>
              <div className="offer-icon">🍞</div>
              <h3>Padaria</h3>
              <p>Pães e bolos frescos todos os dias</p>
              <span className="offer-tag">Sempre fresquinho</span>
            </div>
            <div className="offer-card">
              <div className="offer-badge">OFERTA</div>
              <div className="offer-icon">🥩</div>
              <h3>Açougue</h3>
              <p>Carnes selecionadas com desconto</p>
              <span className="offer-tag">Qualidade garantida</span>
            </div>
          </div>
        </div>
      </section>

      {/* Instagram Feed */}
      <section id="instagram" className="instagram">
        <div className="container">
          <h2 className="section-title">Siga-nos no Instagram</h2>
          <p className="instagram-subtitle">
            Fique por dentro das ofertas e novidades do Leo Supermercado
          </p>
          
          
          {/* Feed do Instagram - temporariamente desabilitado */}
          <div className="instagram-content">
            <a 
              href="https://www.instagram.com/leosupermercado_/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="instagram-link"
            >
              <div className="instagram-icon">📱</div>
              <h3>@leosupermercado_</h3>
              <p>Clique para seguir e ver nossas ofertas!</p>
            </a>
          </div>
          
          {/* Link para seguir */}
          <div className="instagram-follow">
            <a 
              href="https://www.instagram.com/leosupermercado_/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="instagram-button"
            >
              <span className="instagram-button-icon">📱</span>
              Seguir @leosupermercado_
            </a>
          </div>
        </div>
      </section>

      {/* Contato */}
      <section id="contato" className="contact">
        <div className="container">
          <h2 className="section-title">Visite-nos</h2>
          <div className="contact-grid">
            <div className="contact-card">
              <div className="contact-icon">📍</div>
              <h3>Endereço</h3>
              <p>Rua Prefeito Meton Silvano nº 861<br />Centro</p>
            </div>
            <div className="contact-card">
              <div className="contact-icon">⏰</div>
              <h3>Horário</h3>
              <p>Segunda a Sábado<br />06:30 às 21:30</p>
              <p>Domingo<br />06:30 às 21:00</p>
            </div>
            <div className="contact-card">
              <div className="contact-icon">📞</div>
              <h3>Contato</h3>
              <p>
                <strong>WhatsApp Atacado:</strong><br />
                <a 
                  href="https://wa.me/5588988537871" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="whatsapp-link"
                >
                  💬 (88) 8853-7871
                </a>
              </p>
              <p>
                <strong>WhatsApp Varejo:</strong><br />
                <a 
                  href="https://wa.me/558899142423" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="whatsapp-link"
                >
                  💬 (88) 9914-2423
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <img src="/logo192.png" alt="Leo Supermercado" className="footer-logo" />
              <p>Leo Supermercado</p>
              <p className="footer-slogan">Qualidade e economia para sua família!</p>
            </div>
            <div className="footer-social">
              <h4>Redes Sociais</h4>
              <div className="social-links">
                <a 
                  href="https://www.instagram.com/leosupermercado_/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="social-link"
                >
                  📱 Instagram
                </a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} Leo Supermercado. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
