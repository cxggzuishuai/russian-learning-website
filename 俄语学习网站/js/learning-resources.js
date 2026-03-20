/* ========================================
   俄语世界 - 学习资源组件
   显示爬取的俄语学习资源
   ======================================== */

class LearningResources {
  constructor() {
    this.resources = [];
    this.currentCategory = 'all';
    this.init();
  }

  async init() {
    await this.loadResources();
    this.renderSidebar();
  }

  async loadResources() {
    try {
      const response = await fetch('data/learning/learning_resources.json?t=' + Date.now());
      if (!response.ok) throw new Error('加载失败');
      this.resources = await response.json();
      console.log(`[学习资源] 加载了 ${this.resources.length} 条资源`);
    } catch (error) {
      console.error('[学习资源] 加载失败:', error);
      this.resources = [];
    }
  }

  renderSidebar() {
    // 尝试多种可能的侧边栏选择器
    let sidebar = document.querySelector('.sidebar') || 
                  document.getElementById('sidebar') ||
                  document.querySelector('.left-sidebar') ||
                  document.getElementById('left-sidebar');
    
    // 如果还找不到，尝试专门的容器
    if (!sidebar) {
      const container = document.getElementById('learning-resources-container');
      if (container) {
        console.log('[学习资源] 使用专用容器');
        this.renderInContainer(container);
        return;
      }
    }
    
    if (!sidebar) {
      console.warn('[学习资源] 未找到侧边栏，尝试插入到分类列表后');
      // 尝试插入到分类列表后
      const categoryList = document.getElementById('category-sidebar-list');
      if (categoryList && categoryList.parentElement) {
        sidebar = categoryList.parentElement;
      }
    }
    
    if (!sidebar) {
      console.error('[学习资源] 无法找到插入位置');
      return;
    }

    // 检查是否已存在
    let widget = document.getElementById('learning-resources-widget');
    if (!widget) {
      widget = document.createElement('div');
      widget.id = 'learning-resources-widget';
      widget.className = 'learning-resources-widget';
      // 插入到侧边栏末尾
      sidebar.appendChild(widget);
      console.log('[学习资源] 组件已插入侧边栏');
    }

    this.container = widget;
    this.updateContent();
    this.addStyles();
  }

  renderInContainer(container) {
    // 直接在指定容器中渲染
    let widget = document.getElementById('learning-resources-widget');
    if (!widget) {
      widget = document.createElement('div');
      widget.id = 'learning-resources-widget';
      widget.className = 'learning-resources-widget';
      container.appendChild(widget);
      console.log('[学习资源] 组件已插入专用容器');
    }
    
    this.container = widget;
    this.updateContent();
    this.addStyles();
  }

  updateContent() {
    const categories = {
      'course': { name: '俄语课程', icon: '📚', count: 0 },
      'grammar': { name: '语法教程', icon: '📝', count: 0 },
      'vocabulary': { name: '词汇学习', icon: '🔤', count: 0 },
      'listening': { name: '听力材料', icon: '🎧', count: 0 },
      'culture': { name: '俄罗斯文化', icon: '🏛️', count: 0 }
    };

    // 统计各分类数量
    this.resources.forEach(r => {
      if (categories[r.category]) {
        categories[r.category].count++;
      }
    });

    this.container.innerHTML = `
      <div class="learning-widget-header">
        <h3>📚 俄语学习资源</h3>
        <span class="resource-total">${this.resources.length}个</span>
      </div>
      <div class="learning-categories">
        ${Object.entries(categories).map(([key, cat]) => `
          <div class="learning-category-item" onclick="learningResources.showCategory('${key}')">
            <span class="cat-icon">${cat.icon}</span>
            <span class="cat-name">${cat.name}</span>
            <span class="cat-count">${cat.count}</span>
          </div>
        `).join('')}
      </div>
      <div class="learning-latest">
        <h4>🆕 最新资源</h4>
        ${this.resources.slice(0, 3).map(r => `
          <div class="latest-item" onclick="learningResources.openResource('${r.id}')">
            <div class="latest-title">${r.title_zh}</div>
            <div class="latest-meta">
              <span class="latest-type">${this.getTypeLabel(r.type)}</span>
              <span class="latest-level">${this.getLevelLabel(r.level)}</span>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  getTypeLabel(type) {
    const labels = {
      'lesson': '课程',
      'article': '文章',
      'vocabulary': '词汇',
      'audio': '音频',
      'video': '视频'
    };
    return labels[type] || type;
  }

  getLevelLabel(level) {
    const labels = {
      'beginner': '初级',
      'intermediate': '中级',
      'advanced': '高级',
      'all': '全部'
    };
    return labels[level] || level;
  }

  showCategory(category) {
    this.currentCategory = category;
    const filtered = this.resources.filter(r => r.category === category);
    
    const mainContent = document.getElementById('main-content');
    if (!mainContent) return;

    const categoryNames = {
      'course': '俄语课程',
      'grammar': '语法教程',
      'vocabulary': '词汇学习',
      'listening': '听力材料',
      'culture': '俄罗斯文化'
    };

    mainContent.innerHTML = `
      <div class="category-page">
        <div class="category-header">
          <button class="back-btn" onclick="learningResources.goBack()">← 返回</button>
          <h2>${categoryNames[category]}</h2>
          <span class="category-count">共 ${filtered.length} 个资源</span>
        </div>
        <div class="resources-grid">
          ${filtered.map(r => this.renderResourceCard(r)).join('')}
        </div>
      </div>
    `;
  }

  renderResourceCard(resource) {
    return `
      <div class="resource-card" onclick="learningResources.openResource('${resource.id}')">
        <div class="resource-card-header">
          <span class="resource-type">${this.getTypeLabel(resource.type)}</span>
          <span class="resource-level ${resource.level}">${this.getLevelLabel(resource.level)}</span>
        </div>
        <h3 class="resource-title">${resource.title_zh}</h3>
        <p class="resource-title-ru">${resource.title_ru}</p>
        <p class="resource-desc">${resource.content_zh.substring(0, 80)}...</p>
        <div class="resource-footer">
          <span class="resource-source">${resource.source_name}</span>
          ${resource.duration ? `<span class="resource-duration">⏱ ${resource.duration}</span>` : ''}
          ${resource.word_count ? `<span class="resource-words">📖 ${resource.word_count}词</span>` : ''}
        </div>
      </div>
    `;
  }

  openResource(resourceId) {
    const resource = this.resources.find(r => r.id === resourceId);
    if (!resource) return;

    // 创建详情弹窗
    const modal = document.createElement('div');
    modal.className = 'resource-modal';
    modal.innerHTML = `
      <div class="resource-modal-content">
        <button class="modal-close" onclick="this.closest('.resource-modal').remove()">&times;</button>
        <div class="resource-modal-header">
          <div class="resource-badges">
            <span class="badge-type">${this.getTypeLabel(resource.type)}</span>
            <span class="badge-level ${resource.level}">${this.getLevelLabel(resource.level)}</span>
            <span class="badge-source">${resource.source_name}</span>
          </div>
          <h2>${resource.title_zh}</h2>
          <h3 class="modal-title-ru">${resource.title_ru}</h3>
        </div>
        <div class="resource-modal-body">
          <div class="resource-content">
            <h4>📖 内容说明</h4>
            <p>${resource.content_zh}</p>
            ${resource.content_ru ? `<p class="content-ru">${resource.content_ru}</p>` : ''}
          </div>
          
          ${resource.word_count ? `
            <div class="resource-stats">
              <span>📚 词汇量: ${resource.word_count} 个</span>
            </div>
          ` : ''}
          
          ${resource.duration ? `
            <div class="resource-stats">
              <span>⏱ 时长: ${resource.duration}</span>
            </div>
          ` : ''}
        </div>
        <div class="resource-modal-footer">
          <button class="btn-play" onclick="learningResources.playAudio('${resource.id}')">
            🔊 朗读内容
          </button>
          <button class="btn-translate" onclick="learningResources.translate('${resource.id}')">
            🌐 翻译
          </button>
          ${resource.url !== '#' ? `
            <a href="${resource.url}" target="_blank" class="btn-source">
              🔗 查看原文
            </a>
          ` : ''}
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.remove();
    });
  }

  playAudio(resourceId) {
    const resource = this.resources.find(r => r.id === resourceId);
    if (!resource) return;

    const text = resource.content_zh;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN';
    utterance.rate = 0.9;
    
    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
  }

  translate(resourceId) {
    const resource = this.resources.find(r => r.id === resourceId);
    if (!resource) return;

    alert(`翻译功能：\n\n原文（中文）: ${resource.title_zh}\n\n俄文: ${resource.title_ru}\n\n注：完整翻译功能需要接入翻译API`);
  }

  goBack() {
    if (typeof app !== 'undefined' && app.goHome) {
      app.goHome();
    } else {
      location.reload();
    }
  }

  addStyles() {
    if (document.getElementById('learning-resources-styles')) return;
    
    const styles = document.createElement('style');
    styles.id = 'learning-resources-styles';
    styles.textContent = `
      /* 学习资源侧边栏组件 */
      .learning-resources-widget {
        background: white;
        border-radius: 12px;
        padding: 16px;
        margin-top: 20px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      }
      
      .learning-widget-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
        padding-bottom: 12px;
        border-bottom: 1px solid #eee;
      }
      
      .learning-widget-header h3 {
        margin: 0;
        font-size: 1rem;
        color: #333;
      }
      
      .resource-total {
        font-size: 0.8rem;
        color: #999;
        background: #f5f5f5;
        padding: 2px 8px;
        border-radius: 10px;
      }
      
      .learning-categories {
        margin-bottom: 16px;
      }
      
      .learning-category-item {
        display: flex;
        align-items: center;
        padding: 10px;
        cursor: pointer;
        border-radius: 8px;
        transition: background 0.2s;
      }
      
      .learning-category-item:hover {
        background: #f5f5f5;
      }
      
      .cat-icon {
        font-size: 1.2rem;
        margin-right: 10px;
      }
      
      .cat-name {
        flex: 1;
        font-size: 0.9rem;
        color: #333;
      }
      
      .cat-count {
        font-size: 0.8rem;
        color: #999;
        background: #f0f0f0;
        padding: 2px 8px;
        border-radius: 10px;
      }
      
      .learning-latest h4 {
        margin: 0 0 10px 0;
        font-size: 0.9rem;
        color: #666;
      }
      
      .latest-item {
        padding: 10px;
        background: #f8f9fa;
        border-radius: 8px;
        margin-bottom: 8px;
        cursor: pointer;
        transition: background 0.2s;
      }
      
      .latest-item:hover {
        background: #e9ecef;
      }
      
      .latest-title {
        font-size: 0.85rem;
        color: #333;
        margin-bottom: 4px;
        line-height: 1.4;
      }
      
      .latest-meta {
        display: flex;
        gap: 8px;
        font-size: 0.75rem;
      }
      
      .latest-type {
        color: #2a5298;
      }
      
      .latest-level {
        color: #666;
      }
      
      /* 分类页面 */
      .category-page {
        padding: 20px;
      }
      
      .category-header {
        display: flex;
        align-items: center;
        gap: 16px;
        margin-bottom: 20px;
      }
      
      .back-btn {
        padding: 8px 16px;
        background: #f5f5f5;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 0.9rem;
      }
      
      .back-btn:hover {
        background: #e0e0e0;
      }
      
      .category-header h2 {
        margin: 0;
        flex: 1;
      }
      
      .category-count {
        color: #999;
        font-size: 0.9rem;
      }
      
      .resources-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 16px;
      }
      
      .resource-card {
        background: white;
        border-radius: 12px;
        padding: 16px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        cursor: pointer;
        transition: transform 0.2s, box-shadow 0.2s;
      }
      
      .resource-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 16px rgba(0,0,0,0.12);
      }
      
      .resource-card-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
      }
      
      .resource-type {
        font-size: 0.75rem;
        color: #2a5298;
        background: #e3f2fd;
        padding: 2px 8px;
        border-radius: 4px;
      }
      
      .resource-level {
        font-size: 0.75rem;
        padding: 2px 8px;
        border-radius: 4px;
      }
      
      .resource-level.beginner {
        color: #388e3c;
        background: #e8f5e9;
      }
      
      .resource-level.intermediate {
        color: #f57c00;
        background: #fff3e0;
      }
      
      .resource-level.advanced {
        color: #d32f2f;
        background: #ffebee;
      }
      
      .resource-title {
        font-size: 1rem;
        color: #333;
        margin: 0 0 4px 0;
        line-height: 1.4;
      }
      
      .resource-title-ru {
        font-size: 0.85rem;
        color: #666;
        margin: 0 0 8px 0;
      }
      
      .resource-desc {
        font-size: 0.85rem;
        color: #666;
        margin: 0 0 12px 0;
        line-height: 1.5;
      }
      
      .resource-footer {
        display: flex;
        gap: 12px;
        font-size: 0.8rem;
        color: #999;
      }
      
      /* 资源详情弹窗 */
      .resource-modal {
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
      
      .resource-modal-content {
        background: white;
        border-radius: 16px;
        max-width: 600px;
        width: 100%;
        max-height: 80vh;
        overflow-y: auto;
        position: relative;
      }
      
      .resource-modal-header {
        padding: 24px 24px 0;
      }
      
      .resource-badges {
        display: flex;
        gap: 8px;
        margin-bottom: 12px;
      }
      
      .badge-type, .badge-level, .badge-source {
        padding: 4px 10px;
        border-radius: 12px;
        font-size: 0.75rem;
      }
      
      .badge-type {
        background: #e3f2fd;
        color: #1976d2;
      }
      
      .badge-level.beginner {
        background: #e8f5e9;
        color: #388e3c;
      }
      
      .badge-level.intermediate {
        background: #fff3e0;
        color: #f57c00;
      }
      
      .badge-source {
        background: #f5f5f5;
        color: #666;
      }
      
      .resource-modal-header h2 {
        margin: 0 0 8px 0;
        font-size: 1.4rem;
        color: #333;
      }
      
      .modal-title-ru {
        font-size: 1.1rem;
        color: #666;
        margin: 0;
        font-weight: normal;
      }
      
      .resource-modal-body {
        padding: 20px 24px;
      }
      
      .resource-content h4 {
        margin: 0 0 10px 0;
        color: #333;
      }
      
      .resource-content p {
        margin: 0 0 12px 0;
        line-height: 1.8;
        color: #444;
      }
      
      .content-ru {
        color: #666;
        font-style: italic;
        border-left: 3px solid #ddd;
        padding-left: 12px;
      }
      
      .resource-stats {
        margin-top: 16px;
        padding: 12px;
        background: #f8f9fa;
        border-radius: 8px;
        font-size: 0.9rem;
        color: #666;
      }
      
      .resource-modal-footer {
        display: flex;
        gap: 12px;
        padding: 16px 24px 24px;
        border-top: 1px solid #eee;
      }
      
      .btn-play, .btn-translate, .btn-source {
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
      
      .btn-translate {
        background: #f5f5f5;
        color: #333;
      }
      
      .btn-source {
        background: #e8f5e9;
        color: #388e3c;
      }
    `;
    
    document.head.appendChild(styles);
  }
}

// 全局实例
let learningResources;

document.addEventListener('DOMContentLoaded', () => {
  console.log('[学习资源] 等待页面加载...');
  setTimeout(() => {
    console.log('[学习资源] 开始初始化');
    learningResources = new LearningResources();
  }, 2000);
});

// 如果DOM已加载，立即执行
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  console.log('[学习资源] DOM已就绪，立即初始化');
  setTimeout(() => {
    if (!learningResources) {
      learningResources = new LearningResources();
    }
  }, 500);
}
