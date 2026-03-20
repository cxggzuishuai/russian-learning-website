# 俄罗斯新闻爬虫系统

## 功能特性

- **多源新闻爬取**：支持塔斯社(TASS)、卫星社(Sputnik)、俄新社(RIA)
- **完整内容获取**：标题、全文、图片
- **自动翻译**：俄文内容自动翻译为中文
- **语音合成**：中文内容生成语音朗读
- **定时更新**：可设置定时任务自动抓取最新新闻

## 安装依赖

```bash
# 安装Python依赖
pip install requests beautifulsoup4 lxml

# 如需使用翻译API（可选）
pip install googletrans==4.0.0-rc1

# 如需使用语音合成（可选）
pip install edge-tts
```

## 使用方法

### 1. 手动运行爬虫

```bash
# Windows
python .\crawler\news_crawler.py

# 或
npm run crawl:win
```

### 2. 启动本地服务器查看新闻

```bash
# 启动Python服务器
npm run server

# 或简单HTTP服务器
npm run dev
```

然后访问 http://localhost:8080/news.html

### 3. 设置定时自动更新（Windows）

使用任务计划程序：
1. 打开"任务计划程序"
2. 创建基本任务
3. 设置触发器（如每小时）
4. 操作：启动程序
5. 程序：python
6. 参数：`.\crawler\news_crawler.py`
7. 起始于：`F:\飞跃ai数据\俄语学习网站`

## 目录结构

```
俄语学习网站/
├── crawler/
│   ├── news_crawler.py      # 主爬虫程序
│   ├── translate_service.py  # 翻译服务
│   └── tts_service.py        # 语音合成服务
├── data/
│   ├── news/                 # 新闻数据JSON
│   ├── images/               # 下载的新闻图片
│   └── audio/                # 生成的语音文件
├── news.html                 # 新闻展示页面
└── README_CRAWLER.md         # 本文件
```

## 数据来源

- **塔斯社 (TASS)**：https://tass.com
- **卫星社 (Sputnik)**：https://sputniknews.cn
- **俄新社 (RIA)**：https://ria.ru

## 注意事项

1. 爬虫会遵守网站的robots.txt规则
2. 请求间隔设置为1秒，避免对目标网站造成压力
3. 图片和语音文件占用空间较大，请定期清理
4. 翻译和语音功能需要额外配置API密钥

## 待实现功能

- [ ] 接入百度/Google翻译API
- [ ] 接入Azure/科大讯飞TTS
- [ ] 新闻分类标签
- [ ] 搜索功能
- [ ] 用户收藏
- [ ] 邮件订阅
