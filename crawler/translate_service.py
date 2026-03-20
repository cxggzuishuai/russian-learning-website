#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
翻译服务
支持多种翻译API：百度翻译、Google翻译、DeepL等
"""

import requests
import json
import os
import hashlib
import random
from urllib.parse import quote

class TranslateService:
    def __init__(self):
        self.cache_dir = os.path.join(os.path.dirname(__file__), '..', 'data', 'cache')
        os.makedirs(self.cache_dir, exist_ok=True)
        
        # API配置（需要用户自行申请）
        self.config = {
            'baidu': {
                'appid': '',  # 百度翻译APP ID
                'key': '',     # 百度翻译密钥
                'url': 'https://fanyi-api.baidu.com/api/trans/vip/translate'
            },
            'google': {
                'key': '',  # Google Cloud API Key
            },
            'deepl': {
                'key': '',  # DeepL API Key
                'url': 'https://api-free.deepl.com/v2/translate'
            }
        }
        
        # 默认使用模拟翻译（实际使用时请配置真实API）
        self.default_provider = 'mock'
    
    def get_cache_key(self, text, source_lang, target_lang):
        """生成缓存key"""
        key_str = f"{text}:{source_lang}:{target_lang}"
        return hashlib.md5(key_str.encode()).hexdigest()
    
    def get_from_cache(self, cache_key):
        """从缓存获取"""
        cache_file = os.path.join(self.cache_dir, f"{cache_key}.json")
        if os.path.exists(cache_file):
            try:
                with open(cache_file, 'r', encoding='utf-8') as f:
                    return json.load(f)
            except:
                pass
        return None
    
    def save_to_cache(self, cache_key, data):
        """保存到缓存"""
        cache_file = os.path.join(self.cache_dir, f"{cache_key}.json")
        try:
            with open(cache_file, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False)
        except Exception as e:
            print(f"缓存保存失败: {e}")
    
    def translate_baidu(self, text, source_lang='ru', target_lang='zh'):
        """百度翻译API"""
        if not self.config['baidu']['appid'] or not self.config['baidu']['key']:
            return None
        
        try:
            salt = random.randint(32768, 65536)
            sign_str = self.config['baidu']['appid'] + text + str(salt) + self.config['baidu']['key']
            sign = hashlib.md5(sign_str.encode()).hexdigest()
            
            params = {
                'q': text,
                'from': source_lang,
                'to': target_lang,
                'appid': self.config['baidu']['appid'],
                'salt': salt,
                'sign': sign
            }
            
            response = requests.get(self.config['baidu']['url'], params=params, timeout=30)
            result = response.json()
            
            if 'trans_result' in result:
                translated = ''.join([item['dst'] for item in result['trans_result']])
                return translated
            
        except Exception as e:
            print(f"百度翻译失败: {e}")
        
        return None
    
    def translate_google(self, text, source_lang='ru', target_lang='zh-CN'):
        """Google翻译API（需要代理）"""
        if not self.config['google']['key']:
            return None
        
        try:
            url = f"https://translation.googleapis.com/language/translate/v2"
            params = {
                'q': text,
                'source': source_lang,
                'target': target_lang,
                'format': 'text',
                'key': self.config['google']['key']
            }
            
            response = requests.post(url, data=params, timeout=30)
            result = response.json()
            
            if 'data' in result and 'translations' in result['data']:
                return result['data']['translations'][0]['translatedText']
            
        except Exception as e:
            print(f"Google翻译失败: {e}")
        
        return None
    
    def translate_deepl(self, text, source_lang='RU', target_lang='ZH'):
        """DeepL翻译API"""
        if not self.config['deepl']['key']:
            return None
        
        try:
            headers = {
                'Authorization': f'DeepL-Auth-Key {self.config["deepl"]["key"]}',
                'Content-Type': 'application/json'
            }
            
            data = {
                'text': [text],
                'source_lang': source_lang,
                'target_lang': target_lang
            }
            
            response = requests.post(
                self.config['deepl']['url'],
                headers=headers,
                json=data,
                timeout=30
            )
            result = response.json()
            
            if 'translations' in result:
                return result['translations'][0]['text']
            
        except Exception as e:
            print(f"DeepL翻译失败: {e}")
        
        return None
    
    def translate_mock(self, text, source_lang='ru', target_lang='zh'):
        """模拟翻译（用于测试）"""
        # 简单的俄语-中文对照表（仅用于演示）
        common_words = {
            'новости': '新闻',
            'Россия': '俄罗斯',
            'Путин': '普京',
            'правительство': '政府',
            'президент': '总统',
            'страна': '国家',
            'мир': '世界',
            'война': '战争',
            'мирный': '和平的',
            'экономика': '经济',
            'политика': '政治',
            'общество': '社会',
            'культура': '文化',
            'наука': '科学',
            'технология': '技术',
            'спорт': '体育',
            'погода': '天气',
            'здоровье': '健康',
            'образование': '教育',
            'безопасность': '安全',
        }
        
        # 简单的替换
        result = text
        for ru, zh in common_words.items():
            result = result.replace(ru, zh)
        
        # 如果替换后变化不大，添加标记
        if result == text:
            return f"[俄文] {text[:100]}..." if len(text) > 100 else f"[俄文] {text}"
        
        return result
    
    def translate(self, text, source_lang='ru', target_lang='zh', provider=None):
        """
        翻译文本
        
        Args:
            text: 要翻译的文本
            source_lang: 源语言代码
            target_lang: 目标语言代码
            provider: 翻译提供商（baidu/google/deepl/mock）
        
        Returns:
            dict: 包含原文、译文、语言信息的字典
        """
        if not text or not text.strip():
            return {
                'original': '',
                'translated': '',
                'source_lang': source_lang,
                'target_lang': target_lang,
                'provider': 'none'
            }
        
        # 检查缓存
        cache_key = self.get_cache_key(text, source_lang, target_lang)
        cached = self.get_from_cache(cache_key)
        if cached:
            return cached
        
        # 选择翻译提供商
        provider = provider or self.default_provider
        
        translated = None
        
        # 尝试翻译
        if provider == 'baidu':
            translated = self.translate_baidu(text, source_lang, target_lang)
        elif provider == 'google':
            translated = self.translate_google(text, source_lang, target_lang)
        elif provider == 'deepl':
            # DeepL语言代码不同
            deepl_source = source_lang.upper() if source_lang != 'auto' else None
            deepl_target = 'ZH' if target_lang.startswith('zh') else target_lang.upper()
            translated = self.translate_deepl(text, deepl_source, deepl_target)
        elif provider == 'mock':
            translated = self.translate_mock(text, source_lang, target_lang)
        
        # 如果指定提供商失败，尝试其他
        if not translated and provider != 'mock':
            translated = self.translate_mock(text, source_lang, target_lang)
            provider = 'mock'
        
        result = {
            'original': text,
            'translated': translated or text,
            'source_lang': source_lang,
            'target_lang': target_lang,
            'provider': provider
        }
        
        # 保存缓存
        self.save_to_cache(cache_key, result)
        
        return result
    
    def batch_translate(self, texts, source_lang='ru', target_lang='zh', provider=None):
        """批量翻译"""
        results = []
        for text in texts:
            result = self.translate(text, source_lang, target_lang, provider)
            results.append(result)
        return results


# 单例模式
translator = TranslateService()

def translate(text, source_lang='ru', target_lang='zh', provider=None):
    """便捷翻译函数"""
    return translator.translate(text, source_lang, target_lang, provider)

if __name__ == '__main__':
    # 测试
    test_texts = [
        "новости России",
        "Президент Путин провел совещание",
        "Экономика страны растет",
    ]
    
    print("翻译测试：")
    print("="*50)
    
    for text in test_texts:
        result = translate(text)
        print(f"原文: {result['original']}")
        print(f"译文: {result['translated']}")
        print(f"提供商: {result['provider']}")
        print("-"*50)
