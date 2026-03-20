/* ========================================
   俄语世界 - 侧边栏新闻组件
   在侧边栏显示爬取的新闻
   ======================================== */

class SidebarNews {
  constructor() {
    this.newsData = [];
    this.container = null;
    this.init();
  }

  async init() {
    await this.loadNews();
    this.render();
  }

  async loadNews() {
    try {
      const response = await fetch('data/news/news_data.json?t=' + Date.now());
      if (!response.ok) throw new Error('加载失败');
      this.newsData = await response.json();
      console.log(`[侧边栏新闻] 加载了 ${this.newsData.length} 条新闻`);
    } catch (error) {
      console.error('[侧边栏新闻] 加载失败:', error);
      this.newsData = [];
    }
  }

  render() {
    // 找到侧边栏
    const sidebar = document.querySelector('.sidebar') || document.getElementById('sidebar');
    if (!sidebar) {
      console.warn('[侧边栏新闻] 未找到侧边栏元素');
      return;
    }

    // 检查是否已存在
    if (document.getElementById('sidebar-news-widget')) {
      this.container = document.getElementById('sidebar-news-widget');
    } else {
      // 创建新闻组件
      this.container = document.createElement('div');
      this.container.id = 'sidebar-news-widget';
      this.container.className = 'sidebar-news-widget';
      
      // 插入到侧边栏末尾
      sidebar.appendChild(this.container);
    }

    this.updateContent();
    this.addStyles();
  }

  updateContent() {
    const latestNews = this.newsData.slice(0, 5); // 显示最新5条

    this.container.innerHTML = `
      <div class="sidebar-news-header">
        <h3>📡 实时新闻</h3>
        <span class="news-count">${this.newsData.length}条</span>
      </div>
      <div class="sidebar-news-list">
        ${latestNews.length > 0 
          ? latestNews.map(news => this.renderNewsItem(news)).join('')
          : '<div class="sidebar-news-empty">暂无新闻</div>'
        }
      </div>
      <div class="sidebar-news-footer">
        <button class="refresh-btn" onclick="sidebarNews.refresh()" title="刷新">
          🔄 刷新
        </button>
        <button class="view-all-btn" onclick="sidebarNews.showAll()">
          查看全部 →
        </button>
      </div>
    `;
  }

  renderNewsItem(news) {
    const title = news.title_zh.replace('[待翻译]', '') || news.title_ru;
    const sourceColors = {
      'tass': '#1976d2',
      'sputnik': '#d32f2f',
      'ria': '#388e3c'
    };
    const color = sourceColors[news.source] || '#666';
    
    return `
      <div class="sidebar-news-item" onclick="sidebarNews.openNews('${news.id}')">
        <div class="news-item-source" style="color: ${color}">
          ${news.source_name}
        </div>
        <div class="news-item-title">${title}</div>
        <div class="news-item-time">${this.formatTime(news.crawled_at)}</div>
      </div>
    `;
  }

  formatTime(dateStr) {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return '刚刚';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`;
    
    return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
  }

  openNews(newsId) {
    const news = this.newsData.find(n => n.id === newsId);
    if (!news) return;

    // 创建弹窗显示详情
    const modal = document.createElement('div');
    modal.className = 'sidebar-news-modal';
    modal.innerHTML = `
      <div class="sidebar-news-modal-content">
        <button class="modal-close" onclick="this.closest('.sidebar-news-modal').remove()">&times;</button>
        <div class="modal-header">
          <span class="modal-source">${news.source_name}</span>
          <h2>${news.title_zh.replace('[待翻译]', '')}</h2>
          <h3 class="modal-title-ru">${news.title_ru}</h3>
        </div>
        <div class="modal-body">
          <div class="modal-text">${news.content_zh.replace('[待翻译]', '')}</div>
        </div>
        <div class="modal-footer">
          <button class="btn-play" onclick="sidebarNews.playAudio('${news.id}')">
            🔊 朗读
          </button>
          <a href="${news.url}" target="_blank" class="btn-source">
            🔗 查看原文
          </a>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.remove();
    });
  }

  playAudio(newsId) {
    const news = this.newsData.find(n => n.id === newsId);
    if (!news) return;

    const text = news.content_zh.replace('[待翻译]', '');
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN';
    utterance.rate = 0.9;
    
    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
  }

  async refresh() {
    const btn = this.container.querySelector('.refresh-btn');
    if (btn) {
      btn.classList.add('spinning');
      btn.disabled = true;
    }
    
    await this.loadNews();
    this.updateContent();
    
    if (btn) {
      btn.classList.remove('spinning');
      btn.disabled = false;
    }
  }

  showAll() {
    // 切换到实时新闻分类
    if (typeof app !== 'undefined' && app.selectCategory) {
      app.selectCategory('crawler');
    } else {
      // 直接显示所有新闻
      this.renderFullNews();
    }
  }

  renderFullNews() {
    const mainContent = document.getElementById('main-content');
    if (!mainContent) return;

    mainContent.innerHTML = `
      <div class="full-news-page">
        <h2>📡 实时俄罗斯新闻</h2>
        <div class="full-news-list">
          ${this.newsData.map(news => `
            <article class="full-news-item" onclick="sidebarNews.openNews('${news.id}')">
              <div class="full-news-header">
                <span class="full-news-source">${news.source_name}</span>
                <span class="full-news-time">${this.formatTime(news.crawled_at)}</span>
              </div>
              <h3>${news.title_zh.replace('[待翻译]', '')}</h3>
              <p>${news.content_zh.substring(0, 200).replace('[待翻译]', '')}...</p>
            </article>
          `).join('')}
        </div>
      </div>
    `;
  }

  addStyles() {
    if (document.getElementById('sidebar-news-styles')) return;
    
    const styles = document.createElement('style');
    styles.id = 'sidebar-news-styles';
    styles.textContent = `
      /* 侧边栏新闻组件 */
      .sidebar-news-widget {
        background: white;
        border-radius: 12px;
        padding: 16px;
        margin-top: 20px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      }
      
      .sidebar-news-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
        padding-bottom: 12px;
        border-bottom: 1px solid #eee;
      }
      
      .sidebar-news-header h3 {
        margin: 0;
        font-size: 1rem;
        color: #333;
      }
      
      .news-count {
        font-size: 0.8rem;
        color: #999;
        background: #f5f5f5;
        padding: 2px 8px;
        border-radius: 10px;
      }
      
      .sidebar-news-list {
        max-height: 400px;
        overflow-y: auto;
      }
      
      .sidebar-news-item {
        padding: 12px 0;
        border-bottom: 1px solid #f0f0f0;
        cursor: pointer;
        transition: background 0.2s;
      }
      
      .sidebar-news-item:last-child {
        border-bottom: none;
      }
      
      .sidebar-news-item:hover {
        background: #f8f9fa;
        margin: 0 -12px;
        padding-left: 12px;
        padding-right: 12px;
      }
      
      .news-item-source {
        font-size: 0.75rem;
        font-weight: 600;
        margin-bottom: 4px;
      }
      
      .news-item-title {
        font-size: 0.9rem;
        color: #333;
        line-height: 1.4;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        margin-bottom: 4px;
      }
      
      .news-item-time {
        font-size: 0.75rem;
        color: #999;
      }
      
      .sidebar-news-empty {
        text-align: center;
        padding: 20px;
        color: #999;
      }
      
      .sidebar-news-footer {
        display: flex;
        justify-content: space-between;
        margin-top: 12px;
        padding-top: 12px;
        border-top: 1px solid #eee;
      }
      
      .refresh-btn, .view-all-btn {
        padding: 6px 12px;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 0.85rem;
        transition: all 0.3s;
      }
      
      .refresh-btn {
        background: #f5f5f5;
        color: #666;
      }
      
      .refresh-btn:hover {
        background: #e0e0e0;
      }
      
      .refresh-btn.spinning {
        animation: spin 1s linear infinite;
      }
      
      .view-all-btn {
        background: #2a5298;
        color: white;
      }
      
      .view-all-btn:hover {
        background: #1e3c72;
      }
      
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      
      /* 弹窗样式 */
      .sidebar-news-modal {
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
      
      .sidebar-news-modal-content {
        background: white;
        border-radius: 16px;
        max-width: 600px;
        width: 100%;
        max-height: 80vh;
        overflow-y: auto;
        position: relative;
      }
      
      .modal-close {
        position: absolute;
        top: 16px;
        right: 16px;
        width: 32px;
        height: 32px;
        background: rgba(0,0,0,0.5);
        color: white;
        border: none;
        border-radius: 50%;
        font-size: 1.2rem;
        cursor: pointer;
      }
      
      .modal-header {
        padding: 24px 24px 0;
      }
      
      .modal-source {
        display: inline-block;
        padding: 4px 10px;
        background: #e3f2fd;
        color: #1976d2;
        border-radius: 12px;
        font-size: 0.75rem;
        margin-bottom: 12px;
      }
      
      .modal-header h2 {
        margin: 0 0 8px 0;
        font-size: 1.3rem;
        color: #333;
        line-height: 1.4;
      }
      
      .modal-title-ru {
        font-size: 1rem;
        color: #666;
        margin: 0;
        font-weight: normal;
      }
      
      .modal-body {
        padding: 20px 24px;
      }
      
      .modal-text {
        font-size: 1rem;
        line-height: 1.8;
        color: #444;
        white-space: pre-line;
      }
      
      .modal-footer {
        display: flex;
        gap: 12px;
        padding: 16px 24px 24px;
        border-top: 1px solid #eee;
      }
      
      .btn-play, .btn-source {
        padding: 10px 20px;
        border-radius: 8px;
        border: none;
        cursor: pointer;
        font-size: 0.9rem;
        text-decoration: none;
        display: inline-flex;
        align-items: center;
        gap: 6px;
      }
      
      .btn-play {
        background: #2a5298;
        color: white;
      }
      
      .btn-source {
        background: #f5f5f5;
        color: #333;
      }
      
      /* 完整新闻页面 */
      .full-news-page {
        padding: 20px;
      }
      
      .full-news-page h2 {
        margin-bottom: 20px;
        color: #333;
      }
      
      .full-news-list {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      
      .full-news-item {
        background: white;
        padding: 20px;
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        cursor: pointer;
        transition: transform 0.2s;
      }
      
      .full-news-item:hover {
        transform: translateY(-2px);
      }
      
      .full-news-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 8px;
      }
      
      .full-news-source {
        color: #2a5298;
        font-weight: 600;
        font-size: 0.85rem;
      }
      
      .full-news-time {
        color: #999;
        font-size: 0.85rem;
      }
      
      .full-news-item h3 {
        margin: 0 0 8px 0;
        color: #333;
        font-size: 1.1rem;
      }
      
      .full-news-item p {
        margin: 0;
        color: #666;
        font-size: 0.9rem;
        line-height: 1.6;
      }
    `;
    
    document.head.appendChild(styles);
  }
}

// 全局实例
let sidebarNews;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
  // 延迟初始化，等待侧边栏渲染完成
  setTimeout(() => {
    sidebarNews = new SidebarNews();
  }, 1000);
});
