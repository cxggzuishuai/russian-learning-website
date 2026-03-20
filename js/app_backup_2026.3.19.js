/* ========================================
   俄语世界 - Русский Мир  V4
   简化版：左侧边栏 + 右侧内容
   ======================================== */

// ============ 默认数据 ============
const DEFAULT_RESOURCES = {
  categories: [
    { id: "phonetics", name: "语音入门", nameRu: "Фонетика", icon: "🔤", order: 1 },
    { id: "grammar", name: "语法课程", nameRu: "Грамматика", icon: "📖", order: 2 },
    { id: "vocabulary", name: "词汇积累", nameRu: "Словарный запас", icon: "📝", order: 3 },
    { id: "listening", name: "听力训练", nameRu: "Аудирование", icon: "🎧", order: 4 },
    { id: "reading", name: "阅读理解", nameRu: "Чтение", icon: "📚", order: 5 },
    { id: "culture", name: "俄罗斯文化", nameRu: "Культура России", icon: "🏛️", order: 6 },
    { id: "exam", name: "考试专区", nameRu: "Экзамены", icon: "🎓", order: 7 },
    { id: "video", name: "视频教程", nameRu: "Видеоуроки", icon: "🎬", order: 8 }
  ],
  resources: [
    // ============ 语音入门 ============
    { id:"r011", title:"俄语33个字母发音详解", titleRu:"Русский алфавит - 33 буквы", category:"phonetics", level:"beginner", type:"article", description:"完整的俄语字母表教程，33个字母逐一讲解发音、书写和记忆技巧，配有元音弱化、辅音清浊化等发音规则。", thumbnail:"", url:"lessons/alphabet.html", tags:["字母","发音","入门"], isPublished:true, isFeatured:true, createdAt:"2026-03-17", updatedAt:"2026-03-17" },
    { id:"r012", title:"俄语元音发音与弱化规则", titleRu:"Гласные звуки и редукция", category:"phonetics", level:"beginner", type:"article", description:"详解俄语10个元音字母的发音规则，重点讲解元音弱化（аканье и иканье）现象及实际应用。", thumbnail:"", url:"lessons/vowels.html", tags:["元音","发音","弱化"], isPublished:true, isFeatured:false, createdAt:"2026-03-17", updatedAt:"2026-03-17" },
    { id:"r013", title:"俄语辅音清浊化规则", titleRu:"Оглушение и озвончение согласных", category:"phonetics", level:"beginner", type:"article", description:"系统讲解俄语辅音的清浊对立、词尾浊辅音清化、清浊同化等重要发音规则。", thumbnail:"", url:"lessons/consonants.html", tags:["辅音","清浊化","发音"], isPublished:true, isFeatured:false, createdAt:"2026-03-17", updatedAt:"2026-03-17" },
    { id:"r014", title:"俄语重音规则与移动", titleRu:"Ударение в русском языке", category:"phonetics", level:"intermediate", type:"article", description:"俄语重音的特点、重音移动规律，以及常见重音模式总结，帮助学习者正确掌握重音位置。", thumbnail:"", url:"lessons/stress.html", tags:["重音","发音","语调"], isPublished:true, isFeatured:false, createdAt:"2026-03-17", updatedAt:"2026-03-17" },
    
    // ============ 语法课程 ============
    { id:"r021", title:"俄语名词六格变化详解", titleRu:"Шесть падежей русского существительного", category:"grammar", level:"intermediate", type:"article", description:"系统讲解名词六格（主格、属格、与格、宾格、工具格、前置格）的变化规则和用法，配有大量例句。", thumbnail:"", url:"lessons/cases.html", tags:["语法","名词","格变化"], isPublished:true, isFeatured:true, createdAt:"2026-03-17", updatedAt:"2026-03-17" },
    { id:"r022", title:"俄语形容词的性数格一致", titleRu:"Согласование прилагательных", category:"grammar", level:"intermediate", type:"article", description:"形容词与名词在性、数、格上的一致关系，长尾与短尾形容词的用法对比。", thumbnail:"", url:"lessons/adjectives.html", tags:["语法","形容词","一致关系"], isPublished:true, isFeatured:false, createdAt:"2026-03-17", updatedAt:"2026-03-17" },
    { id:"r023", title:"俄语动词变位详解", titleRu:"Спряжение глаголов", category:"grammar", level:"intermediate", type:"article", description:"第一变位与第二变位对比，不规则动词、过去时变化规则，配有大量例句和记忆技巧。", thumbnail:"", url:"lessons/verbs.html", tags:["语法","动词","变位"], isPublished:true, isFeatured:false, createdAt:"2026-03-17", updatedAt:"2026-03-17" },
    { id:"r024", title:"俄语动词体（完成体vs未完成体）", titleRu:"Вид глагола (совершенный и несовершенный)", category:"grammar", level:"advanced", type:"article", description:"详解动词体的概念、体的构成、体的用法区别，以及常见体的对应关系表。", thumbnail:"", url:"lessons/aspect.html", tags:["语法","动词体","完成体"], isPublished:true, isFeatured:false, createdAt:"2026-03-17", updatedAt:"2026-03-17" },
    { id:"r025", title:"俄语代词用法大全", titleRu:"Местоимения в русском языке", category:"grammar", level:"intermediate", type:"article", description:"人称代词、物主代词、指示代词、疑问代词等的变格和用法总结。", thumbnail:"", url:"lessons/pronouns.html", tags:["语法","代词","变格"], isPublished:true, isFeatured:false, createdAt:"2026-03-17", updatedAt:"2026-03-17" },
    { id:"r026", title:"俄语数词与数量表达", titleRu:"Числительные и количественные выражения", category:"grammar", level:"intermediate", type:"article", description:"基数词、序数词的变格，与数词连用的名词格选择规则。", thumbnail:"", url:"lessons/numerals.html", tags:["语法","数词","数量"], isPublished:true, isFeatured:false, createdAt:"2026-03-17", updatedAt:"2026-03-17" },
    
    // ============ 词汇积累 ============
    { id:"r031", title:"日常俄语500词速记", titleRu:"500 частоупотребительных слов", category:"vocabulary", level:"beginner", type:"article", description:"精选日常生活中最常用的500个俄语单词，按主题分类，配有记忆方法和例句。", thumbnail:"", url:"lessons/vocabulary.html", tags:["词汇","日常","速记"], isPublished:true, isFeatured:true, createdAt:"2026-03-17", updatedAt:"2026-03-17" },
    { id:"r032", title:"俄语常用动词100个", titleRu:"100 самых употребительных глаголов", category:"vocabulary", level:"beginner", type:"article", description:"俄语中最常用的100个动词，包含变位、接格关系和例句。", thumbnail:"", url:"lessons/common-verbs.html", tags:["词汇","动词","常用"], isPublished:true, isFeatured:false, createdAt:"2026-03-17", updatedAt:"2026-03-17" },
    { id:"r033", title:"俄语饮食词汇大全", titleRu:"Словарь еды и напитков", category:"vocabulary", level:"beginner", type:"article", description:"餐厅、厨房、食材、饮料等相关词汇，适合日常生活和餐厅点餐场景。", thumbnail:"", url:"lessons/food-vocab.html", tags:["词汇","饮食","生活"], isPublished:true, isFeatured:false, createdAt:"2026-03-17", updatedAt:"2026-03-17" },
    { id:"r034", title:"俄语旅行必备词汇", titleRu:"Слова для путешествий", category:"vocabulary", level:"beginner", type:"article", description:"机场、酒店、交通、景点等旅行场景必备词汇。", thumbnail:"", url:"lessons/travel-vocab.html", tags:["词汇","旅行","场景"], isPublished:true, isFeatured:false, createdAt:"2026-03-17", updatedAt:"2026-03-17" },
    { id:"r035", title:"俄语商务词汇300词", titleRu:"300 деловых слов", category:"vocabulary", level:"intermediate", type:"article", description:"商务场景常用词汇，包括会议、邮件、谈判等职场俄语。", thumbnail:"", url:"lessons/business-vocab.html", tags:["词汇","商务","职场"], isPublished:true, isFeatured:false, createdAt:"2026-03-17", updatedAt:"2026-03-17" },
    
    // ============ 听力训练 ============
    { id:"r041", title:"俄语听力与对话训练", titleRu:"Аудирование и диалоги", category:"listening", level:"beginner", type:"audio", description:"实用场景对话训练，包括机场、餐厅、购物等日常场景，配有原文和翻译。", thumbnail:"", url:"lessons/listening.html", tags:["听力","对话","场景"], isPublished:true, isFeatured:true, createdAt:"2026-03-17", updatedAt:"2026-03-17" },
    { id:"r042", title:"慢速俄语新闻听力", titleRu:"Новости на медленном русском", category:"listening", level:"intermediate", type:"audio", description:"精选慢速俄语新闻，适合中级学习者提高听力水平。", thumbnail:"", url:"lessons/news-listening.html", tags:["听力","新闻","慢速"], isPublished:true, isFeatured:false, createdAt:"2026-03-17", updatedAt:"2026-03-17" },
    { id:"r043", title:"俄语歌曲学语言", titleRu:"Учим язык через песни", category:"listening", level:"all", type:"audio", description:"通过经典俄语歌曲学习语言，配有歌词、翻译和语言点讲解。", thumbnail:"", url:"lessons/songs.html", tags:["听力","歌曲","娱乐"], isPublished:true, isFeatured:false, createdAt:"2026-03-17", updatedAt:"2026-03-17" },
    { id:"r044", title:"俄语电影台词精听", titleRu:"Фильмы и диалоги", category:"listening", level:"advanced", type:"audio", description:"经典俄语电影片段精听训练，提高听力和口语表达能力。", thumbnail:"", url:"lessons/movies.html", tags:["听力","电影","高级"], isPublished:true, isFeatured:false, createdAt:"2026-03-17", updatedAt:"2026-03-17" },
    
    // ============ 阅读理解 ============
    { id:"r051", title:"俄语短篇故事阅读", titleRu:"Короткие рассказы", category:"reading", level:"intermediate", type:"article", description:"精选俄语短篇故事，配有词汇注释、语法解析和阅读理解练习。", thumbnail:"", url:"lessons/reading.html", tags:["阅读","故事","文学"], isPublished:true, isFeatured:true, createdAt:"2026-03-17", updatedAt:"2026-03-17" },
    { id:"r052", title:"俄罗斯新闻阅读", titleRu:"Чтение новостей", category:"reading", level:"advanced", type:"article", description:"俄罗斯主流媒体报道，提高新闻阅读能力和了解时事。", thumbnail:"", url:"lessons/news-reading.html", tags:["阅读","新闻","时事"], isPublished:true, isFeatured:false, createdAt:"2026-03-17", updatedAt:"2026-03-17" },
    { id:"r053", title:"俄语科普文章选读", titleRu:"Научно-популярные статьи", category:"reading", level:"intermediate", type:"article", description:"科技、文化、历史等领域的科普文章，拓展词汇和知识面。", thumbnail:"", url:"lessons/science-reading.html", tags:["阅读","科普","知识"], isPublished:true, isFeatured:false, createdAt:"2026-03-17", updatedAt:"2026-03-17" },
    
    // ============ 俄罗斯文化 ============
    { id:"r061", title:"俄罗斯传统节日介绍", titleRu:"Русские традиционные праздники", category:"culture", level:"all", type:"article", description:"新年、复活节、胜利日等俄罗斯重要传统节日的由来和庆祝方式。", thumbnail:"", url:"lessons/culture.html", tags:["文化","节日","传统"], isPublished:true, isFeatured:true, createdAt:"2026-03-17", updatedAt:"2026-03-17" },
    { id:"r062", title:"俄罗斯文学经典导读", titleRu:"Русская классическая литература", category:"culture", level:"all", type:"article", description:"普希金、托尔斯泰、陀思妥耶夫斯基等文学巨匠及其作品介绍。", thumbnail:"", url:"lessons/literature.html", tags:["文化","文学","经典"], isPublished:true, isFeatured:false, createdAt:"2026-03-17", updatedAt:"2026-03-17" },
    { id:"r063", title:"俄罗斯美食文化", titleRu:"Русская кухня", category:"culture", level:"all", type:"article", description:"罗宋汤、饺子、布林饼等俄罗斯传统美食的制作和文化背景。", thumbnail:"", url:"lessons/cuisine.html", tags:["文化","美食","传统"], isPublished:true, isFeatured:false, createdAt:"2026-03-17", updatedAt:"2026-03-17" },
    { id:"r064", title:"俄罗斯音乐与艺术", titleRu:"Русская музыка и искусство", category:"culture", level:"all", type:"article", description:"俄罗斯古典音乐、芭蕾舞、绘画艺术等文化瑰宝介绍。", thumbnail:"", url:"lessons/art.html", tags:["文化","音乐","艺术"], isPublished:true, isFeatured:false, createdAt:"2026-03-17", updatedAt:"2026-03-17" },
    { id:"r065", title:"莫斯科与圣彼得堡城市介绍", titleRu:"Москва и Санкт-Петербург", category:"culture", level:"all", type:"article", description:"俄罗斯两大城市的景点、历史、文化特色介绍。", thumbnail:"", url:"lessons/cities.html", tags:["文化","城市","旅游"], isPublished:true, isFeatured:false, createdAt:"2026-03-17", updatedAt:"2026-03-17" },
    
    // ============ 考试专区 ============
    { id:"r071", title:"ТРКИ考试介绍与备考指南", titleRu:"ТРКИ - Тест по русскому языку как иностранному", category:"exam", level:"all", type:"article", description:"对外俄语等级考试（ТРКИ）介绍，各级别考试要求和备考策略。", thumbnail:"", url:"lessons/trki.html", tags:["考试","ТРКИ","备考"], isPublished:true, isFeatured:true, createdAt:"2026-03-17", updatedAt:"2026-03-17" },
    { id:"r072", title:"ТРКИ模拟试题A1-A2", titleRu:"Тесты ТРКИ А1-А2", category:"exam", level:"beginner", type:"quiz", description:"A1-A2级别模拟试题，包含听力、阅读、语法、写作等部分。", thumbnail:"", url:"lessons/trki-a1a2.html", tags:["考试","ТРКИ","A1","A2"], isPublished:true, isFeatured:false, createdAt:"2026-03-17", updatedAt:"2026-03-17" },
    { id:"r073", title:"ТРКИ模拟试题B1-B2", titleRu:"Тесты ТРКИ B1-B2", category:"exam", level:"intermediate", type:"quiz", description:"B1-B2级别模拟试题，配有详细答案解析。", thumbnail:"", url:"lessons/trki-b1b2.html", tags:["考试","ТРКИ","B1","B2"], isPublished:true, isFeatured:false, createdAt:"2026-03-17", updatedAt:"2026-03-17" },
    
    // ============ 视频教程 ============
    { id:"r081", title:"俄语入门视频课程", titleRu:"Видеокурс для начинающих", category:"video", level:"beginner", type:"video", description:"零基础入门视频课程，从字母到基础对话循序渐进。", thumbnail:"", url:"lessons/video-beginner.html", tags:["视频","入门","课程"], isPublished:true, isFeatured:true, createdAt:"2026-03-17", updatedAt:"2026-03-17" },
    { id:"r082", title:"俄语语法精讲视频", titleRu:"Видеоуроки по грамматике", category:"video", level:"intermediate", type:"video", description:"重点语法难点精讲视频，配有板书和例句分析。", thumbnail:"", url:"lessons/video-grammar.html", tags:["视频","语法","精讲"], isPublished:true, isFeatured:false, createdAt:"2026-03-17", updatedAt:"2026-03-17" }
  ]
};

// ============ 数据存储类 ============
class DataStore {
  constructor() {
    this.categories = [];
    this.resources = [];
    this.layout = {};
  }

  init() {
    // 从 localStorage 加载数据，如果没有则使用默认数据
    const savedCategories = localStorage.getItem('rumir_categories');
    const savedResources = localStorage.getItem('rumir_resources');
    
    this.categories = savedCategories ? JSON.parse(savedCategories) : DEFAULT_RESOURCES.categories;
    this.resources = savedResources ? JSON.parse(savedResources) : DEFAULT_RESOURCES.resources;
    
    // 保存默认数据到 localStorage
    if (!savedCategories) {
      localStorage.setItem('rumir_categories', JSON.stringify(this.categories));
    }
    if (!savedResources) {
      localStorage.setItem('rumir_resources', JSON.stringify(this.resources));
    }
  }

  getCategoryById(id) {
    return this.categories.find(c => c.id === id);
  }

  getResourceById(id) {
    return this.resources.find(r => r.id === id);
  }

  getResourcesByCategory(catId) {
    return this.resources.filter(r => r.category === catId && r.isPublished);
  }

  getFeaturedResources() {
    return this.resources.filter(r => r.isFeatured && r.isPublished);
  }

  getPublishedResources() {
    return this.resources.filter(r => r.isPublished);
  }

  searchResources(query) {
    const q = query.toLowerCase();
    return this.resources.filter(r => 
      r.isPublished && (
        r.title.toLowerCase().includes(q) ||
        r.titleRu.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.tags.some(tag => tag.toLowerCase().includes(q))
      )
    );
  }
}

// ============ 前端渲染类 ============
class FrontendRenderer {
  constructor(store) {
    this.store = store;
  }

  render() {
    this.renderMainContent();
    this.renderSidebar();
  }

  renderMainContent() {
    const main = document.getElementById('main-content');
    if (!main) return;

    const featured = this.store.getFeaturedResources().slice(0, 4);
    const allResources = this.store.getPublishedResources();

    let html = '';

    // 精选推荐
    if (featured.length > 0) {
      html += `
        <section class="resource-section">
          <h2>✨ 精选推荐</h2>
          <div class="resource-grid">
            ${featured.map(r => this.renderResourceCard(r)).join('')}
          </div>
        </section>
      `;
    }

    // 全部资源
    if (allResources.length > 0) {
      html += `
        <section class="resource-section">
          <h2>📚 全部资源</h2>
          <div class="resource-grid">
            ${allResources.slice(0, 12).map(r => this.renderResourceCard(r)).join('')}
          </div>
        </section>
      `;
    }

    main.innerHTML = html;
  }

  renderResourceCard(r) {
    const cat = this.store.getCategoryById(r.category);
    const levelText = { beginner: '入门', intermediate: '中级', advanced: '高级' }[r.level] || r.level;
    const typeIcon = { article: '📄', video: '🎬', audio: '🎧', quiz: '📝' }[r.type] || '📄';

    return `
      <div class="resource-card" onclick="app.showResourceDetail('${r.id}')">
        <div class="resource-card-thumbnail">${typeIcon}</div>
        <div class="resource-card-body">
          <div class="resource-card-title">${r.title}</div>
          <div class="resource-card-title-ru">${r.titleRu}</div>
          <div class="resource-card-desc">${r.description.substring(0, 60)}...</div>
          <div class="resource-card-meta">
            <span class="resource-card-tag">${cat ? cat.name : r.category}</span>
            <span class="resource-card-level level-${r.level}">${levelText}</span>
          </div>
        </div>
      </div>
    `;
  }

  renderSidebar() {
    const sidebarList = document.getElementById('category-sidebar-list');
    if (!sidebarList) return;

    const cats = [...this.store.categories].sort((a, b) => a.order - b.order);
    
    sidebarList.innerHTML = cats.map(c => {
      const count = this.store.getResourcesByCategory(c.id).length;
      return `
        <li>
          <a href="javascript:app.showCategory('${c.id}')" data-cat="${c.id}">
            <span class="cat-icon">${c.icon}</span>
            <span class="cat-info">
              <div class="cat-name">${c.name}</div>
              <div class="cat-name-ru">${c.nameRu}</div>
            </span>
            <span class="cat-count">${count}</span>
          </a>
        </li>
      `;
    }).join('');
  }

  renderCategoryPage(catId) {
    const main = document.getElementById('main-content');
    if (!main) return;

    const cat = this.store.getCategoryById(catId);
    const resources = this.store.getResourcesByCategory(catId);

    let html = `
      <section class="category-page">
        <div class="category-header">
          <button class="back-btn" onclick="app.goHome()">← 返回</button>
          <div class="category-title">
            <span class="cat-icon-large">${cat.icon}</span>
            <div>
              <h2>${cat.name}</h2>
              <div class="cat-name-ru">${cat.nameRu}</div>
            </div>
          </div>
          <span class="category-count">${resources.length} 个资源</span>
        </div>
    `;

    if (resources.length > 0) {
      html += `<div class="resource-grid">${resources.map(r => this.renderResourceCard(r)).join('')}</div>`;
    } else {
      html += '<p style="text-align:center;color:#999;padding:40px;">该分类暂无资源</p>';
    }

    html += '</section>';
    main.innerHTML = html;

    // 更新侧边栏激活状态
    document.querySelectorAll('#category-sidebar-list a').forEach(a => {
      a.classList.toggle('active', a.dataset.cat === catId);
    });
  }

  renderSearchResults(query) {
    const main = document.getElementById('main-content');
    if (!main) return;

    const results = this.store.searchResources(query);

    let html = `
      <section class="search-results">
        <div class="search-header">
          <button class="back-btn" onclick="app.goHome()">← 返回</button>
          <h2>🔍 搜索结果: "${query}"</h2>
          <span class="search-count">找到 ${results.length} 个资源</span>
        </div>
    `;

    if (results.length > 0) {
      html += `<div class="resource-grid">${results.map(r => this.renderResourceCard(r)).join('')}</div>`;
    } else {
      html += '<p style="text-align:center;color:#999;padding:40px;">没有找到相关资源</p>';
    }

    html += '</section>';
    main.innerHTML = html;

    // 清除侧边栏激活状态
    document.querySelectorAll('#category-sidebar-list a').forEach(a => a.classList.remove('active'));
  }
}

// ============ 主应用类 ============
class App {
  constructor() {
    this.store = new DataStore();
    this.renderer = null;
    this.currentTheme = localStorage.getItem('rumir_theme') || 'auto';
  }

  init() {
    this.store.init();
    this.renderer = new FrontendRenderer(this.store);
    this.renderer.render();
    this.applyTheme(this.currentTheme);
    
    // 设置当前主题按钮为激活状态
    this.updateThemeButtons();
  }

  goHome() {
    this.renderer.renderMainContent();
    document.querySelectorAll('#category-sidebar-list a').forEach(a => a.classList.remove('active'));
  }

  showCategory(catId) {
    this.renderer.renderCategoryPage(catId);
  }

  showResourceDetail(id) {
    const r = this.store.getResourceById(id);
    if (!r) return;
    if (r.url && r.url !== '#') {
      window.open(r.url, '_blank');
    } else {
      this.showToast('该资源暂无链接', 'warning');
    }
  }

  search() {
    const query = document.getElementById('hero-search-input')?.value.trim();
    if (!query) {
      this.showToast('请输入搜索关键词', 'warning');
      return;
    }
    this.renderer.renderSearchResults(query);
  }

  toggleTheme(theme) {
    this.currentTheme = theme;
    localStorage.setItem('rumir_theme', theme);
    this.applyTheme(theme);
    this.updateThemeButtons();
    
    const themeName = theme === 'light' ? '日间' : theme === 'dark' ? '夜间' : '跟随系统';
    this.showToast(`已切换到${themeName}模式`, 'success');
  }

  applyTheme(theme) {
    let actualTheme = theme;
    
    if (theme === 'auto') {
      actualTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    
    if (actualTheme === 'dark') {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }

  updateThemeButtons() {
    document.querySelectorAll('.toolbar-btn[id^="theme-"]').forEach(btn => {
      btn.classList.remove('active');
    });
    const activeBtn = document.getElementById('theme-' + this.currentTheme);
    if (activeBtn) activeBtn.classList.add('active');
  }

  showToast(message, type = 'info') {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icon = type === 'success' ? '✓' : type === 'error' ? '✗' : type === 'warning' ? '⚠' : 'ℹ';
    toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;
    
    container.appendChild(toast);
    
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
}

// ============ 初始化 ============
const app = new App();

document.addEventListener('DOMContentLoaded', () => {
  app.init();
});
