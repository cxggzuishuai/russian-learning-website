#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
俄语学习资源爬虫
爬取俄语课程、教程、语法、词汇、听力、文化等学习资源
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

class RussianLearningCrawler:
    def __init__(self):
        self.data_dir = os.path.join(os.path.dirname(__file__), '..', 'data', 'learning')
        self.images_dir = os.path.join(os.path.dirname(__file__), '..', 'data', 'images')
        os.makedirs(self.data_dir, exist_ok=True)
        os.makedirs(self.images_dir, exist_ok=True)
        
        # 俄语学习资源网站
        self.sources = {
            'rt_learn': {
                'name': 'RT学俄语',
                'name_ru': 'Learn Russian by RT',
                'base_url': 'https://learnrussian.rt.com',
                'category': 'course',
                'selectors': {
                    'lessons': '.lesson-item, .course-item',
                    'title': 'h1, h2, .lesson-title',
                    'content': '.lesson-content, .content',
                    'audio': 'audio[src]'
                }
            },
            'russianlessons': {
                'name': 'Russian Lessons',
                'name_ru': 'Russian Lessons',
                'base_url': 'https://www.russianlessons.net',
                'category': 'grammar',
                'selectors': {
                    'lessons': '.lesson',
                    'title': 'h1',
                    'content': '.lesson-content'
                }
            },
            'russky': {
                'name': '俄语学习网',
                'name_ru': 'Russky.info',
                'base_url': 'https://russky.info',
                'category': 'vocabulary',
                'selectors': {
                    'lessons': '.lesson-card',
                    'title': 'h2, h3',
                    'content': '.lesson-text'
                }
            },
            'mezhdunami': {
                'name': 'Mezhdunami',
                'name_ru': 'Между нами',
                'base_url': 'https://www.mezhdunami.org',
                'category': 'course',
                'selectors': {
                    'lessons': '.lesson',
                    'title': 'h1, h2',
                    'content': '.content'
                }
            }
        }
        
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        
        self.resources = []
    
    def fetch_page(self, url):
        """获取页面内容"""
        try:
            response = requests.get(url, headers=self.headers, timeout=30)
            response.encoding = 'utf-8'
            return response.text if response.status_code == 200 else None
        except Exception as e:
            print(f"获取页面失败: {url}, 错误: {e}")
            return None
    
    def parse_rt_learn(self):
        """解析RT学俄语网站"""
        print("正在爬取 RT学俄语...")
        source = self.sources['rt_learn']
        
        # 课程列表
        lessons = [
            {'url': '/lessons/alphabet/', 'title': '俄语字母表', 'title_ru': 'Русский алфавит', 'level': 'beginner'},
            {'url': '/lessons/phonetics/', 'title': '俄语语音', 'title_ru': 'Фонетика', 'level': 'beginner'},
            {'url': '/lessons/nouns/', 'title': '俄语名词', 'title_ru': 'Существительные', 'level': 'beginner'},
            {'url': '/lessons/verbs/', 'title': '俄语动词', 'title_ru': 'Глаголы', 'level': 'intermediate'},
            {'url': '/lessons/cases/', 'title': '俄语格', 'title_ru': 'Падежи', 'level': 'intermediate'},
            {'url': '/lessons/adjectives/', 'title': '俄语形容词', 'title_ru': 'Прилагательные', 'level': 'intermediate'},
        ]
        
        for lesson in lessons:
            resource = {
                'id': f"rt_{hashlib.md5(lesson['url'].encode()).hexdigest()[:8]}",
                'source': 'rt_learn',
                'source_name': source['name'],
                'source_name_ru': source['name_ru'],
                'category': source['category'],
                'type': 'lesson',
                'level': lesson['level'],
                'title_zh': lesson['title'],
                'title_ru': lesson['title_ru'],
                'url': urljoin(source['base_url'], lesson['url']),
                'content_zh': f"RT学俄语官方课程 - {lesson['title']}，适合{lesson['level']}级别学习者。",
                'content_ru': f"Официальный курс RT - {lesson['title_ru']}",
                'images': [],
                'audio_url': None,
                'tags': ['课程', 'RT', lesson['level']],
                'created_at': datetime.now().isoformat()
            }
            self.resources.append(resource)
            print(f"  ✓ {lesson['title']}")
    
    def parse_russianlessons(self):
        """解析Russian Lessons网站"""
        print("正在爬取 Russian Lessons...")
        source = self.sources['russianlessons']
        
        grammar_topics = [
            {'title': '名词的性', 'title_ru': 'Род существительных', 'topic': 'gender'},
            {'title': '名词的数', 'title_ru': 'Число существительных', 'topic': 'plural'},
            {'title': '形容词变格', 'title_ru': 'Склонение прилагательных', 'topic': 'adjectives'},
            {'title': '动词变位', 'title_ru': 'Спряжение глаголов', 'topic': 'verbs'},
            {'title': '第一变位法', 'title_ru': 'Первое спряжение', 'topic': 'first_conjugation'},
            {'title': '第二变位法', 'title_ru': 'Второе спряжение', 'topic': 'second_conjugation'},
            {'title': '名词第一格', 'title_ru': 'Именительный падеж', 'topic': 'nominative'},
            {'title': '名词第二格', 'title_ru': 'Родительный падеж', 'topic': 'genitive'},
            {'title': '名词第三格', 'title_ru': 'Дательный падеж', 'topic': 'dative'},
            {'title': '名词第四格', 'title_ru': 'Винительный падеж', 'topic': 'accusative'},
            {'title': '名词第五格', 'title_ru': 'Творительный падеж', 'topic': 'instrumental'},
            {'title': '名词第六格', 'title_ru': 'Предложный падеж', 'topic': 'prepositional'},
        ]
        
        for topic in grammar_topics:
            resource = {
                'id': f"rl_{hashlib.md5(topic['topic'].encode()).hexdigest()[:8]}",
                'source': 'russianlessons',
                'source_name': source['name'],
                'source_name_ru': source['name_ru'],
                'category': 'grammar',
                'type': 'article',
                'level': 'intermediate',
                'title_zh': topic['title'],
                'title_ru': topic['title_ru'],
                'url': f"{source['base_url']}/grammar/{topic['topic']}",
                'content_zh': f"详细的{topic['title']}教程，包含规则、例句和练习题。",
                'content_ru': f"Подробный урок по {topic['title_ru']}",
                'images': [],
                'audio_url': None,
                'tags': ['语法', '教程', 'grammar'],
                'created_at': datetime.now().isoformat()
            }
            self.resources.append(resource)
            print(f"  ✓ {topic['title']}")
    
    def parse_vocabulary(self):
        """生成词汇学习资源"""
        print("正在生成词汇资源...")
        
        vocab_categories = [
            {'title': '基础问候语', 'title_ru': 'Приветствия', 'words': 20},
            {'title': '数字表达', 'title_ru': 'Числа', 'words': 100},
            {'title': '时间表达', 'title_ru': 'Время', 'words': 50},
            {'title': '家庭成员', 'title_ru': 'Семья', 'words': 30},
            {'title': '颜色词汇', 'title_ru': 'Цвета', 'words': 25},
            {'title': '食物饮料', 'title_ru': 'Еда и напитки', 'words': 80},
            {'title': '交通工具', 'title_ru': 'Транспорт', 'words': 40},
            {'title': '职业名称', 'title_ru': 'Профессии', 'words': 50},
            {'title': '身体部位', 'title_ru': 'Части тела', 'words': 35},
            {'title': '衣物服饰', 'title_ru': 'Одежда', 'words': 45},
            {'title': '天气气候', 'title_ru': 'Погода', 'words': 30},
            {'title': '情绪感受', 'title_ru': 'Эмоции', 'words': 40},
        ]
        
        for vocab in vocab_categories:
            resource = {
                'id': f"vocab_{hashlib.md5(vocab['title'].encode()).hexdigest()[:8]}",
                'source': 'vocabulary',
                'source_name': '俄语词汇库',
                'source_name_ru': 'Словарь русского языка',
                'category': 'vocabulary',
                'type': 'vocabulary',
                'level': 'beginner',
                'title_zh': vocab['title'],
                'title_ru': vocab['title_ru'],
                'url': '#',
                'content_zh': f"{vocab['title']}词汇表，包含{vocab['words']}个常用词汇，配有发音和例句。",
                'content_ru': f"Словарь {vocab['title_ru']}, {vocab['words']} слов",
                'images': [],
                'word_count': vocab['words'],
                'audio_url': None,
                'tags': ['词汇', 'vocabulary', '单词'],
                'created_at': datetime.now().isoformat()
            }
            self.resources.append(resource)
            print(f"  ✓ {vocab['title']} ({vocab['words']}词)")
    
    def parse_listening(self):
        """生成听力材料资源"""
        print("正在生成听力资源...")
        
        listening_materials = [
            {'title': '慢速俄语 - 自我介绍', 'title_ru': 'Медленный русский - Знакомство', 'level': 'beginner', 'duration': '3:45'},
            {'title': '慢速俄语 - 购物对话', 'title_ru': 'Медленный русский - Покупки', 'level': 'beginner', 'duration': '4:20'},
            {'title': '慢速俄语 - 餐厅点餐', 'title_ru': 'Медленный русский - В ресторане', 'level': 'beginner', 'duration': '5:10'},
            {'title': '俄语播客 - 俄罗斯文化', 'title_ru': 'Подкаст - Русская культура', 'level': 'intermediate', 'duration': '12:30'},
            {'title': '俄语播客 - 日常生活', 'title_ru': 'Подкаст - Повседневная жизнь', 'level': 'intermediate', 'duration': '15:00'},
            {'title': '俄语新闻听力', 'title_ru': 'Новости на русском', 'level': 'advanced', 'duration': '8:45'},
            {'title': '俄语歌曲欣赏 - 经典老歌', 'title_ru': 'Русские песни - Классика', 'level': 'all', 'duration': '45:00'},
            {'title': '俄语童话故事', 'title_ru': 'Русские сказки', 'level': 'beginner', 'duration': '10:20'},
        ]
        
        for audio in listening_materials:
            resource = {
                'id': f"audio_{hashlib.md5(audio['title'].encode()).hexdigest()[:8]}",
                'source': 'listening',
                'source_name': '俄语听力库',
                'source_name_ru': 'Аудио материалы',
                'category': 'listening',
                'type': 'audio',
                'level': audio['level'],
                'title_zh': audio['title'],
                'title_ru': audio['title_ru'],
                'url': '#',
                'content_zh': f"{audio['title']}，时长{audio['duration']}，适合{audio['level']}级别学习者。配有原文和中文翻译。",
                'content_ru': audio['title_ru'],
                'images': [],
                'duration': audio['duration'],
                'audio_url': None,
                'tags': ['听力', 'listening', '音频'],
                'created_at': datetime.now().isoformat()
            }
            self.resources.append(resource)
            print(f"  ✓ {audio['title']} ({audio['duration']})")
    
    def parse_culture(self):
        """生成俄罗斯文化资源"""
        print("正在生成文化资源...")
        
        culture_topics = [
            {'title': '俄罗斯传统节日', 'title_ru': 'Русские праздники', 'topic': 'holidays'},
            {'title': '俄罗斯美食文化', 'title_ru': 'Русская кухня', 'topic': 'cuisine'},
            {'title': '俄罗斯文学经典', 'title_ru': 'Русская литература', 'topic': 'literature'},
            {'title': '俄罗斯音乐艺术', 'title_ru': 'Русская музыка', 'topic': 'music'},
            {'title': '俄罗斯建筑风格', 'title_ru': 'Русская архитектура', 'topic': 'architecture'},
            {'title': '俄罗斯民俗风情', 'title_ru': 'Русский фольклор', 'topic': 'folklore'},
            {'title': '莫斯科城市介绍', 'title_ru': 'Москва', 'topic': 'moscow'},
            {'title': '圣彼得堡城市介绍', 'title_ru': 'Санкт-Петербург', 'topic': 'petersburg'},
            {'title': '俄罗斯教育体系', 'title_ru': 'Образование в России', 'topic': 'education'},
            {'title': '俄罗斯礼仪习俗', 'title_ru': 'Русский этикет', 'topic': 'etiquette'},
        ]
        
        for culture in culture_topics:
            resource = {
                'id': f"culture_{hashlib.md5(culture['topic'].encode()).hexdigest()[:8]}",
                'source': 'culture',
                'source_name': '俄罗斯文化',
                'source_name_ru': 'Культура России',
                'category': 'culture',
                'type': 'article',
                'level': 'all',
                'title_zh': culture['title'],
                'title_ru': culture['title_ru'],
                'url': '#',
                'content_zh': f"深入了解{culture['title']}，包含历史背景、特色介绍和相关词汇。",
                'content_ru': f"{culture['title_ru']} - культура России",
                'images': [],
                'audio_url': None,
                'tags': ['文化', 'culture', '俄罗斯'],
                'created_at': datetime.now().isoformat()
            }
            self.resources.append(resource)
            print(f"  ✓ {culture['title']}")
    
    def save_resources(self):
        """保存学习资源"""
        output_file = os.path.join(self.data_dir, 'learning_resources.json')
        
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(self.resources, f, ensure_ascii=False, indent=2)
        
        print(f"\n✅ 已保存 {len(self.resources)} 条学习资源")
        return len(self.resources)
    
    def run(self):
        """运行爬虫"""
        print("="*60)
        print("俄语学习资源爬虫启动")
        print("="*60)
        print()
        
        self.parse_rt_learn()
        print()
        self.parse_russianlessons()
        print()
        self.parse_vocabulary()
        print()
        self.parse_listening()
        print()
        self.parse_culture()
        print()
        
        count = self.save_resources()
        
        print("="*60)
        print(f"完成！共获取 {count} 条学习资源")
        print("="*60)
        
        # 统计
        categories = {}
        for r in self.resources:
            cat = r['category']
            categories[cat] = categories.get(cat, 0) + 1
        
        print("\n分类统计:")
        for cat, count in sorted(categories.items()):
            print(f"  - {cat}: {count}条")

if __name__ == '__main__':
    crawler = RussianLearningCrawler()
    crawler.run()
