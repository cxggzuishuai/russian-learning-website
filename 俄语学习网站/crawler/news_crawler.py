#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
俄罗斯新闻爬虫
爬取塔斯社、卫星社、俄新社的新闻内容
包含标题、全文、图片，支持翻译和语音
"""

import requests
from bs4 import BeautifulSoup
import json
import os
import hashlib
from datetime import datetime
import re
import time
from urllib.parse import urljoin, urlparse

class RussianNewsCrawler:
    def __init__(self):
        self.data_dir = os.path.join(os.path.dirname(__file__), '..', 'data', 'news')
        self.images_dir = os.path.join(os.path.dirname(__file__), '..', 'data', 'images')
        self.audio_dir = os.path.join(os.path.dirname(__file__), '..', 'data', 'audio')
        
        # 创建目录
        for dir_path in [self.data_dir, self.images_dir, self.audio_dir]:
            os.makedirs(dir_path, exist_ok=True)
        
        # 新闻源配置
        self.sources = {
            'tass': {
                'name': '塔斯社',
                'name_ru': 'ТАСС',
                'base_url': 'https://tass.com',
                'rss_url': 'https://tass.com/rss/v2.xml',
                'selectors': {
                    'title': 'h1',
                    'content': '.article-content, .text-content, .news-content',
                    'image': '.article-image img, .news-image img, .main-image img'
                }
            },
            'sputnik': {
                'name': '卫星社',
                'name_ru': 'Спутник',
                'base_url': 'https://sputniknews.cn',
                'list_url': 'https://sputniknews.cn/news/',
                'selectors': {
                    'title': 'h1',
                    'content': '.article__text, .article-text, .content',
                    'image': '.article__image img, .main-image img'
                }
            },
            'ria': {
                'name': '俄新社',
                'name_ru': 'РИА Новости',
                'base_url': 'https://ria.ru',
                'list_url': 'https://ria.ru/',
                'selectors': {
                    'title': 'h1',
                    'content': '.article__text, .article-body, .content',
                    'image': '.article__image img, .main-image img'
                }
            }
        }
        
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'zh-CN,zh;q=0.9,ru;q=0.8,en;q=0.7'
        }
        
        self.news_data = []
    
    def fetch_page(self, url):
        """获取页面内容"""
        try:
            response = requests.get(url, headers=self.headers, timeout=30)
            response.encoding = 'utf-8'
            if response.status_code == 200:
                return response.text
            else:
                print(f"获取页面失败: {url}, 状态码: {response.status_code}")
                return None
        except Exception as e:
            print(f"请求异常: {url}, 错误: {str(e)}")
            return None
    
    def download_image(self, img_url, news_id):
        """下载图片"""
        try:
            if not img_url.startswith('http'):
                return None
            
            # 生成图片文件名
            img_ext = os.path.splitext(urlparse(img_url).path)[1] or '.jpg'
            img_filename = f"{news_id}_{hashlib.md5(img_url.encode()).hexdigest()[:8]}{img_ext}"
            img_path = os.path.join(self.images_dir, img_filename)
            
            # 检查是否已下载
            if os.path.exists(img_path):
                return f"data/images/{img_filename}"
            
            # 下载图片
            response = requests.get(img_url, headers=self.headers, timeout=30)
            if response.status_code == 200:
                with open(img_path, 'wb') as f:
                    f.write(response.content)
                return f"data/images/{img_filename}"
            
        except Exception as e:
            print(f"下载图片失败: {img_url}, 错误: {str(e)}")
        
        return None
    
    def translate_text(self, text, source_lang='ru', target_lang='zh'):
        """翻译文本（使用简单的模拟翻译，实际可接入翻译API）"""
        # 这里可以接入百度翻译、Google翻译、DeepL等API
        # 暂时返回原文+标记，表示需要翻译
        return {
            'original': text,
            'translated': f'[待翻译] {text[:100]}...' if len(text) > 100 else f'[待翻译] {text}',
            'source_lang': source_lang,
            'target_lang': target_lang
        }
    
    def generate_audio(self, text, news_id):
        """生成语音（使用TTS）"""
        # 这里可以接入百度语音、科大讯飞、Azure TTS等
        # 暂时返回空，表示需要生成
        audio_filename = f"{news_id}_zh.mp3"
        return f"data/audio/{audio_filename}"
    
    def parse_tass_news(self):
        """解析塔斯社新闻"""
        print("开始爬取塔斯社...")
        source = self.sources['tass']
        
        # 获取新闻列表页
        html = self.fetch_page(source['base_url'])
        if not html:
            return
        
        soup = BeautifulSoup(html, 'html.parser')
        
        # 查找新闻链接（根据实际页面结构调整）
        news_links = []
        for link in soup.find_all('a', href=True):
            href = link['href']
            if '/world/' in href or '/politics/' in href or '/society/' in href:
                full_url = urljoin(source['base_url'], href)
                if full_url not in [n['url'] for n in news_links]:
                    news_links.append({'url': full_url, 'title': link.get_text(strip=True)})
        
        # 限制爬取数量
        news_links = news_links[:10]
        
        for link_info in news_links:
            try:
                news = self.parse_news_article(link_info['url'], 'tass')
                if news:
                    self.news_data.append(news)
                    print(f"成功爬取: {news['title_ru'][:50]}...")
                time.sleep(1)  # 礼貌爬取
            except Exception as e:
                print(f"解析新闻失败: {link_info['url']}, 错误: {str(e)}")
    
    def parse_sputnik_news(self):
        """解析卫星社新闻"""
        print("开始爬取卫星社...")
        source = self.sources['sputnik']
        
        html = self.fetch_page(source['list_url'])
        if not html:
            return
        
        soup = BeautifulSoup(html, 'html.parser')
        
        news_links = []
        for link in soup.find_all('a', href=True):
            href = link['href']
            if '/news/' in href and href.count('/') > 2:
                full_url = urljoin(source['base_url'], href)
                if full_url not in [n['url'] for n in news_links]:
                    news_links.append({'url': full_url, 'title': link.get_text(strip=True)})
        
        news_links = news_links[:10]
        
        for link_info in news_links:
            try:
                news = self.parse_news_article(link_info['url'], 'sputnik')
                if news:
                    self.news_data.append(news)
                    print(f"成功爬取: {news['title_ru'][:50]}...")
                time.sleep(1)
            except Exception as e:
                print(f"解析新闻失败: {link_info['url']}, 错误: {str(e)}")
    
    def parse_ria_news(self):
        """解析俄新社新闻"""
        print("开始爬取俄新社...")
        source = self.sources['ria']
        
        html = self.fetch_page(source['list_url'])
        if not html:
            return
        
        soup = BeautifulSoup(html, 'html.parser')
        
        news_links = []
        for link in soup.find_all('a', href=True):
            href = link['href']
            if '/' in href and href.startswith('/20'):
                full_url = urljoin(source['base_url'], href)
                if full_url not in [n['url'] for n in news_links]:
                    news_links.append({'url': full_url, 'title': link.get_text(strip=True)})
        
        news_links = news_links[:10]
        
        for link_info in news_links:
            try:
                news = self.parse_news_article(link_info['url'], 'ria')
                if news:
                    self.news_data.append(news)
                    print(f"成功爬取: {news['title_ru'][:50]}...")
                time.sleep(1)
            except Exception as e:
                print(f"解析新闻失败: {link_info['url']}, 错误: {str(e)}")
    
    def parse_news_article(self, url, source_key):
        """解析单篇新闻文章"""
        source = self.sources[source_key]
        html = self.fetch_page(url)
        if not html:
            return None
        
        soup = BeautifulSoup(html, 'html.parser')
        
        # 提取标题
        title_elem = soup.select_one(source['selectors']['title'])
        title_ru = title_elem.get_text(strip=True) if title_elem else "无标题"
        
        # 提取内容
        content_elem = soup.select_one(source['selectors']['content'])
        if content_elem:
            # 清理内容
            for script in content_elem.find_all(['script', 'style']):
                script.decompose()
            content_ru = content_elem.get_text(separator='\n', strip=True)
        else:
            content_ru = ""
        
        # 提取图片
        images = []
        for img in soup.select(source['selectors']['image']):
            img_url = img.get('src') or img.get('data-src')
            if img_url:
                images.append(urljoin(source['base_url'], img_url))
        
        # 生成唯一ID
        news_id = hashlib.md5(url.encode()).hexdigest()[:12]
        
        # 下载图片
        local_images = []
        for img_url in images[:3]:  # 最多下载3张图片
            local_path = self.download_image(img_url, news_id)
            if local_path:
                local_images.append(local_path)
        
        # 翻译
        title_trans = self.translate_text(title_ru)
        content_trans = self.translate_text(content_ru)
        
        # 生成音频路径
        audio_path = self.generate_audio(content_trans['translated'], news_id)
        
        news_item = {
            'id': news_id,
            'source': source_key,
            'source_name': source['name'],
            'source_name_ru': source['name_ru'],
            'url': url,
            'title_ru': title_ru,
            'title_zh': title_trans['translated'],
            'content_ru': content_ru,
            'content_zh': content_trans['translated'],
            'images': local_images,
            'audio_zh': audio_path,
            'published_at': datetime.now().isoformat(),
            'crawled_at': datetime.now().isoformat()
        }
        
        return news_item
    
    def save_news(self):
        """保存新闻数据"""
        output_file = os.path.join(self.data_dir, 'news_data.json')
        
        # 加载已有数据
        existing_news = []
        if os.path.exists(output_file):
            try:
                with open(output_file, 'r', encoding='utf-8') as f:
                    existing_news = json.load(f)
            except:
                pass
        
        # 合并数据（去重）
        existing_ids = {n['id'] for n in existing_news}
        new_news = [n for n in self.news_data if n['id'] not in existing_ids]
        
        all_news = new_news + existing_news
        
        # 只保留最近100条
        all_news = all_news[:100]
        
        # 保存
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(all_news, f, ensure_ascii=False, indent=2)
        
        print(f"\n保存完成！新增 {len(new_news)} 条新闻，总计 {len(all_news)} 条")
        return len(new_news)
    
    def run(self):
        """运行爬虫"""
        print("="*50)
        print("俄罗斯新闻爬虫启动")
        print("="*50)
        print(f"开始时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print()
        
        # 爬取各来源
        self.parse_tass_news()
        self.parse_sputnik_news()
        self.parse_ria_news()
        
        # 保存数据
        if self.news_data:
            count = self.save_news()
            print(f"\n成功爬取并保存 {count} 条新闻！")
        else:
            print("\n没有获取到新新闻")
        
        print(f"\n结束时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print("="*50)

if __name__ == '__main__':
    crawler = RussianNewsCrawler()
    crawler.run()
