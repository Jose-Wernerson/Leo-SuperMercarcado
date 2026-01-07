import React, { useState, useEffect } from 'react';
import '../styles/instagram-feed.css';

const InstagramFeed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Função para buscar posts do Instagram
    // Para usar a API oficial, você precisa de um token de acesso
    // Por enquanto, vamos usar posts de exemplo para demonstração
    
    // Simulando posts (substitua pela chamada real da API)
    const mockPosts = [
      {
        id: '1',
        media_type: 'IMAGE',
        media_url: 'https://via.placeholder.com/400x400/1a7e01/ffffff?text=Ofertas+da+Semana',
        caption: '🛒 Ofertas imperdíveis! Venha conferir nossos preços especiais desta semana. #LeoSuperMercado #Ofertas',
        permalink: 'https://www.instagram.com/leosupermercado_/'
      },
      {
        id: '2',
        media_type: 'IMAGE',
        media_url: 'https://via.placeholder.com/400x400/FFD700/333333?text=Produtos+Frescos',
        caption: '🍎🥕 Frutas e verduras fresquinhas chegando todos os dias! #Qualidade #FrutasFrescas',
        permalink: 'https://www.instagram.com/leosupermercado_/'
      },
      {
        id: '3',
        media_type: 'IMAGE',
        media_url: 'https://via.placeholder.com/400x400/FF4444/ffffff?text=Promoção',
        caption: '🔥 PROMOÇÃO! Aproveite os descontos especiais do fim de semana. #Promoção #Economia',
        permalink: 'https://www.instagram.com/leosupermercado_/'
      },
      {
        id: '4',
        media_type: 'IMAGE',
        media_url: 'https://via.placeholder.com/400x400/1a7e01/ffffff?text=Hortifruti',
        caption: '🥬 Seção de hortifruti com os melhores produtos da região! #Hortifruti #Saúde',
        permalink: 'https://www.instagram.com/leosupermercado_/'
      },
      {
        id: '5',
        media_type: 'IMAGE',
        media_url: 'https://via.placeholder.com/400x400/FFD700/333333?text=Açougue',
        caption: '🥩 Carnes selecionadas! Qualidade e frescor garantidos. #Açougue #CarneFresca',
        permalink: 'https://www.instagram.com/leosupermercado_/'
      },
      {
        id: '6',
        media_type: 'IMAGE',
        media_url: 'https://via.placeholder.com/400x400/FF4444/ffffff?text=Padaria',
        caption: '🍞 Pães quentinhos saindo do forno! #Padaria #PãoFresco',
        permalink: 'https://www.instagram.com/leosupermercado_/'
      }
    ];

    // Simular delay de carregamento
    setTimeout(() => {
      setPosts(mockPosts);
      setLoading(false);
    }, 1000);

    // Para usar a API real do Instagram, descomente e configure:
    /*
    const fetchInstagramPosts = async () => {
      try {
        const accessToken = 'SEU_TOKEN_DE_ACESSO';
        const userId = 'SEU_USER_ID';
        const url = `https://graph.instagram.com/${userId}/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url&access_token=${accessToken}`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.data) {
          setPosts(data.data.slice(0, 6)); // Limitar a 6 posts
        }
        setLoading(false);
      } catch (error) {
        console.error('Erro ao buscar posts do Instagram:', error);
        setLoading(false);
      }
    };
    
    fetchInstagramPosts();
    */
  }, []);

  if (loading) {
    return (
      <div className="instagram-feed-loading">
        <div className="loading-spinner"></div>
        <p>Carregando posts do Instagram...</p>
      </div>
    );
  }

  return (
    <div className="instagram-feed">
      <div className="instagram-feed-grid">
        {posts.map((post) => (
          <a
            key={post.id}
            href={post.permalink}
            target="_blank"
            rel="noopener noreferrer"
            className="instagram-post"
          >
            <div className="instagram-post-media">
              {post.media_type === 'VIDEO' ? (
                <video src={post.media_url} muted loop playsInline />
              ) : (
                <img src={post.media_url} alt={post.caption || 'Post do Instagram'} />
              )}
              <div className="instagram-post-overlay">
                <span className="instagram-icon">📷</span>
                <span className="view-text">Ver no Instagram</span>
              </div>
            </div>
            {post.caption && (
              <div className="instagram-post-caption">
                <p>{post.caption.length > 100 ? post.caption.substring(0, 100) + '...' : post.caption}</p>
              </div>
            )}
          </a>
        ))}
      </div>
    </div>
  );
};

export default InstagramFeed;
