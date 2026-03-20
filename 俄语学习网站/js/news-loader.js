/* ========================================
   俄语世界 - 新闻加载器
   自动加载爬取的新闻数据
   ======================================== */

class NewsLoader {
  constructor() {
    this.newsData = [];
    this.currentFilter = 'all';
    this.init();
  }

  async init() {
    await this.loadNews();
    this.renderNewsSection();
  }

  async loadNews() {
    try {
      const response = await fetch('data/news/news_data.json?t=' + Date.now());
      if (!response.ok) throw new Error('加载失败');
      this.newsData = await response.json();
      console.log(`加载了 ${this.newsData.length} 条新闻`);
    } catch (error) {
      console.error('加载新闻失败:', error);
      this.newsData = [];
    }
  }

  renderNewsSection() {
    // 在首页插入新闻区块
    const mainContent = document.getElementById('main-content');
    if (!mainContent) return;

    // 检查是否已存在新闻区块
    let newsSection = document.getElementById('crawler-news-section');
    if (!newsSection) {
      newsSection = document.createElement('section');
      newsSection.id = 'crawler-news-section';
      newsSection.className = 'resource-section';
      
      // 插入到main-content的开头
      mainContent.insertBefore(newsSection, mainContent.firstChild);
    }

    const featuredNews = this.newsData.slice(0, 6); // 显示前6条

    newsSection.innerHTML = `
      <div class="section-header">
        <h2>📡 实时俄罗斯新闻</h2>
        <a href="news.html" class="view-all">查看全部 →</a>
      </div>
      <div class="news-filter-bar">
        <button class="filter-chip ${this.currentFilter === 'all' ? 'active' : ''}" onclick="newsLoader.setFilter('all')">全部</button>
        <button class="filter-chip ${this.currentFilter === 'tass' ? 'active' : ''}" onclick="newsLoader.setFilter('tass')">塔斯社</button>
        <button class="filter-chip ${this.currentFilter === 'sputnik' ? 'active' : ''}" onclick="newsLoader.setFilter('sputnik')">卫星社</button>
        <button class="filter-chip ${this.currentFilter === 'ria' ? 'active' : ''}" onclick="newsLoader.setFilter('ria')">俄新社</button>
      </div>
      <div class="news-cards-grid">
        ${featuredNews.length > 0 ? featuredNews.map(news => this.renderNewsCard(news)).join('') : this.renderEmptyState()}
      </div>
    `;

    // 添加样式
    this.addStyles();
  }

  renderNewsCard(news) {
    const imageUrl = news.images && news.images[0] ? news.images[0] : '';
    const placeholderSvg = `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 200'><rect fill='%23f0f0f0' width='400' height='200'/><text fill='%23999' x='50%' y='50%' text-anchor='middle' font-size='16'>暂无图片</text></svg>`;
    
    return `
      <article class="news-card-item" onclick="newsLoader.openNewsModal('${news.id}')">
        <div class="news-card-image">
          <img src="${imageUrl || placeholderSvg}" alt="" onerror="this.src='${placeholderSvg}'">
          <span class="news-source-badge">${news.source_name}</span>
        </div>
        <div class="news-card-body">
          <h3 class="news-card-title">${news.title_zh.replace('[待翻译]', '')}</h3>
          <p class="news-card-excerpt">${news.content_zh.substring(0, 80).replace('[待翻译]', '')}...</p>
          <div class="news-card-meta">
            <span>${this.formatDate(news.crawled_at)}</span>
            <button class="news-play-btn" onclick="event.stopPropagation(); newsLoader.playNewsAudio('${news.id}')" title="朗读">
              🔊
            </button>
          </div>
        </div>
      </article>
    `;
  }

  renderEmptyState() {
    return `
      <div class="news-empty-state">
        <div class="news-empty-icon">📰</div>
        <p>暂无新闻数据</p>
        <button onclick="newsLoader.refreshNews()" class="refresh-btn">刷新新闻</button>
      </div>
    `;
  }

  setFilter(source) {
    this.currentFilter = source;
    if (source === 'all') {
      this.renderNewsSection();
    } else {
      this.renderFilteredNews(source);
    }
  }

  renderFilteredNews(source) {
    const section = document.getElementById('crawler-news-section');
    const filteredNews = this.newsData.filter(n => n.source === source).slice(0, 6);
    
    const grid = section.querySelector('.news-cards-grid');
    grid.innerHTML = filteredNews.length > 0 
      ? filteredNews.map(news => this.renderNewsCard(news)).join('')
      : '<div class="news-empty-state"><p>该来源暂无新闻</p></div>';

    // 更新按钮状态
    section.querySelectorAll('.filter-chip').forEach(btn => {
      btn.classList.toggle('active', btn.textContent.includes(this.getSourceName(source)));
    });
  }

  getSourceName(source) {
    const names = { 'tass': '塔斯社', 'sputnik': '卫星社', 'ria': '俄新社' };
    return names[source] || source;
  }

  openNewsModal(newsId) {
    const news = this.newsData.find(n => n.id === newsId);
    if (!news) return;

    // 创建弹窗
    const modal = document.createElement('div');
    modal.className = 'news-modal-overlay';
    modal.innerHTML = `
      <div class="news-modal-content">
        <button class="news-modal-close" onclick="this.closest('.news-modal-overlay').remove()">&times;</button>
        <div class="news-modal-header">
          <img src="${news.images && news.images[0] ? news.images[0] : ''}" alt="" onerror="this.style.display='none'">
        </div>
        <div class="news-modal-body">
          <span class="news-modal-source">${news.source_name}</span>
          <h2>${news.title_zh.replace('[待翻译]', '')}</h2>
          <h3 class="news-title-ru">${news.title_ru}</h3>
          <div class="news-modal-text">${news.content_zh.replace('[待翻译]', '')}</div>
          <div class="news-modal-actions">
            <button class="btn-play" onclick="newsLoader.playNewsAudio('${news.id}')">
              <span>🔊</span> 朗读中文
            </button>
            <a href="${news.url}" target="_blank" class="btn-link">
              <span>🔗</span> 查看原文
            </a>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // 点击外部关闭
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.remove();
    });
  }

  playNewsAudio(newsId) {
    const news = this.newsData.find(n => n.id === newsId);
    if (!news) return;

    // 使用Web Speech API
    const utterance = new SpeechSynthesisUtterance(news.content_zh.replace('[待翻译]', ''));
    utterance.lang = 'zh-CN';
    utterance.rate = 0.9;
    
    // 停止之前的朗读
    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
  }

  async refreshNews() {
    await this.loadNews();
    this.renderNewsSection();
  }

  formatDate(dateStr) {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now - date;
    
    // 小于1小时显示"X分钟前"
    if (diff < 3600000) {
      const minutes = Math.floor(diff / 60000);
      return minutes < 1 ? '刚刚' : `${minutes}分钟前`;
    }
    // 小于24小时显示"X小时前"
    if (diff < 86400000) {
      return `${Math.floor(diff / 3600000)}小时前`;
    }
    
    return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  }

  addStyles() {
    if (document.getElementById('news-loader-styles')) return;
    
    const styles = document.createElement('style');
    styles.id = 'news-loader-styles';
    styles.textContent = `
      /* 新闻区块样式 */
      #crawler-news-section {
        margin-bottom: 40px;
      }
      
      .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
      }
      
      .section-header h2 {
        font-size: 1.5rem;
        color: #333;
        margin: 0;
      }
      
      .view-all {
        color: #2a5298;
        text-decoration: none;
        font-size: 0.9rem;
      }
      
      .view-all:hover {
        text-decoration: underline;
      }
      
      .news-filter-bar {
        display: flex;
        gap: 10px;
        margin-bottom: 20px;
        flex-wrap: wrap;
      }
      
      .filter-chip {
        padding: 6px 16px;
        border: 1px solid #ddd;
        background: white;
        border-radius: 20px;
        cursor: pointer;
        font-size: 0.85rem;
        transition: all 0.3s;
      }
      
      .filter-chip:hover,
      .filter-chip.active {
        background: #2a5298;
        color: white;
        border-color: #2a5298;
      }
      
      .news-cards-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 20px;
      }
      
      .news-card-item {
        background: white;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        cursor: pointer;
        transition: transform 0.3s, box-shadow 0.3s;
      }
      
      .news-card-item:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(0,0,0,0.12);
      }
      
      .news-card-image {
        position: relative;
        height: 160px;
        overflow: hidden;
      }
      
      .news-card-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      
      .news-source-badge {
        position: absolute;
        top: 10px;
        left: 10px;
        padding: 4px 10px;
        background: rgba(42, 82, 152, 0.9);
        color: white;
        border-radius: 12px;
        font-size: 0.75rem;
      }
      
      .news-card-body {
        padding: 16px;
      }
      
      .news-card-title {
        font-size: 1rem;
        font-weight: 600;
        color: #333;
        margin: 0 0 8px 0;
        line-height: 1.4;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      
      .news-card-excerpt {
        font-size: 0.85rem;
        color: #666;
        margin: 0 0 12px 0;
        line-height: 1.5;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      
      .news-card-meta {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 0.8rem;
        color: #999;
      }
      
      .news-play-btn {
        width: 32px;
        height: 32px;
        border: none;
        background: #f0f0f0;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.3s;
      }
      
      .news-play-btn:hover {
        background: #e0e0e0;
      }
      
      .news-empty-state {
        grid-column: 1 / -1;
        text-align: center;
        padding: 60px;
        color: #999;
      }
      
      .news-empty-icon {
        font-size: 3rem;
        margin-bottom: 16px;
      }
      
      .refresh-btn {
        margin-top: 16px;
        padding: 10px 24px;
        background: #2a5298;
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
      }
      
      /* 弹窗样式 */
      .news-modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.7);
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
      }
      
      .news-modal-content {
        background: white;
        border-radius: 16px;
        max-width: 700px;
        width: 100%;
        max-height: 90vh;
        overflow-y: auto;
        position: relative;
      }
      
      .news-modal-close {
        position: absolute;
        top: 16px;
        right: 16px;
        width: 36px;
        height: 36px;
        background: rgba(0,0,0,0.5);
        color: white;
        border: none;
        border-radius: 50%;
        font-size: 1.5rem;
        cursor: pointer;
        z-index: 10;
      }
      
      .news-modal-header {
        height: 200px;
        overflow: hidden;
      }
      
      .news-modal-header img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      
      .news-modal-body {
        padding: 24px;
      }
      
      .news-modal-source {
        display: inline-block;
        padding: 4px 12px;
        background: #e3f2fd;
        color: #1976d2;
        border-radius: 12px;
        font-size: 0.8rem;
        margin-bottom: 12px;
      }
      
      .news-modal-body h2 {
        font-size: 1.4rem;
        color: #333;
        margin: 0 0 8px 0;
        line-height: 1.4;
      }
      
      .news-title-ru {
        font-size: 1rem;
        color: #666;
        margin: 0 0 16px 0;
        font-weight: normal;
      }
      
      .news-modal-text {
        font-size: 1rem;
        line-height: 1.8;
        color: #444;
        margin-bottom: 20px;
        white-space: pre-line;
      }
      
      .news-modal-actions {
        display: flex;
        gap: 12px;
        padding-top: 20px;
        border-top: 1px solid #eee;
      }
      
      .btn-play,
      .btn-link {
        padding: 12px 24px;
        border-radius: 8px;
        border: none;
        cursor: pointer;
        font-size: 0.95rem;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        text-decoration: none;
      }
      
      .btn-play {
        background: #2a5298;
        color: white;
      }
      
      .btn-link {
        background: #f5f5f5;
        color: #333;
      }
      
      @media (max-width: 768px) {
        .news-cards-grid {
          grid-template-columns: 1fr;
        }
        
        .news-modal-content {
          max-height: 95vh;
        }
      }
    `;
    
    document.head.appendChild(styles);
  }
}

// 全局实例
let newsLoader;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
  // 延迟一点等待其他组件加载
  setTimeout(() => {
    newsLoader = new NewsLoader();
  }, 500);
});
