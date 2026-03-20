#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
语音合成服务 (TTS)
支持多种TTS引擎：Edge TTS、百度语音、科大讯飞、Azure等
"""

import os
import json
import asyncio
import hashlib
from pathlib import Path

class TTSService:
    def __init__(self):
        self.audio_dir = os.path.join(os.path.dirname(__file__), '..', 'data', 'audio')
        os.makedirs(self.audio_dir, exist_ok=True)
        
        # API配置
        self.config = {
            'edge': {
                'enabled': True,  # Edge TTS免费使用
                'voice': 'zh-CN-XiaoxiaoNeural',  # 中文女声
            },
            'baidu': {
                'app_id': '',
                'api_key': '',
                'secret_key': '',
                'enabled': False
            },
            'azure': {
                'key': '',
                'region': 'eastasia',
                'enabled': False
            }
        }
        
        self.default_engine = 'edge'
    
    def get_audio_path(self, text, engine='edge'):
        """生成音频文件路径"""
        text_hash = hashlib.md5(text.encode()).hexdigest()[:12]
        filename = f"{engine}_{text_hash}.mp3"
        return os.path.join(self.audio_dir, filename)
    
    def audio_exists(self, text, engine='edge'):
        """检查音频是否已存在"""
        audio_path = self.get_audio_path(text, engine)
        return os.path.exists(audio_path)
    
    async def generate_edge_tts(self, text, voice=None):
        """使用Edge TTS生成语音"""
        try:
            import edge_tts
            
            voice = voice or self.config['edge']['voice']
            audio_path = self.get_audio_path(text, 'edge')
            
            # 检查是否已存在
            if os.path.exists(audio_path):
                return audio_path
            
            communicate = edge_tts.Communicate(text, voice)
            await communicate.save(audio_path)
            
            return audio_path
            
        except ImportError:
            print("请先安装edge-tts: pip install edge-tts")
            return None
        except Exception as e:
            print(f"Edge TTS生成失败: {e}")
            return None
    
    def generate_baidu_tts(self, text, lang='zh', speed=5, pitch=5, volume=5):
        """使用百度语音合成"""
        if not self.config['baidu']['enabled']:
            return None
        
        try:
            from aip import AipSpeech
            
            client = AipSpeech(
                self.config['baidu']['app_id'],
                self.config['baidu']['api_key'],
                self.config['baidu']['secret_key']
            )
            
            audio_path = self.get_audio_path(text, 'baidu')
            
            if os.path.exists(audio_path):
                return audio_path
            
            # 调用百度API
            result = client.synthesis(text, 'zh', 1, {
                'vol': volume,
                'spd': speed,
                'pit': pitch,
                'per': 0  # 女声
            })
            
            if not isinstance(result, dict):
                with open(audio_path, 'wb') as f:
                    f.write(result)
                return audio_path
            else:
                print(f"百度TTS错误: {result}")
                return None
                
        except ImportError:
            print("请先安装baidu-aip: pip install baidu-aip")
            return None
        except Exception as e:
            print(f"百度TTS生成失败: {e}")
            return None
    
    async def generate_azure_tts(self, text, voice='zh-CN-XiaoxiaoNeural'):
        """使用Azure TTS"""
        if not self.config['azure']['enabled']:
            return None
        
        try:
            import azure.cognitiveservices.speech as speechsdk
            
            audio_path = self.get_audio_path(text, 'azure')
            
            if os.path.exists(audio_path):
                return audio_path
            
            speech_config = speechsdk.SpeechConfig(
                subscription=self.config['azure']['key'],
                region=self.config['azure']['region']
            )
            speech_config.speech_synthesis_voice_name = voice
            
            audio_config = speechsdk.audio.AudioOutputConfig(filename=audio_path)
            synthesizer = speechsdk.SpeechSynthesizer(
                speech_config=speech_config,
                audio_config=audio_config
            )
            
            result = synthesizer.speak_text_async(text).get()
            
            if result.reason == speechsdk.ResultReason.SynthesizingAudioCompleted:
                return audio_path
            else:
                print(f"Azure TTS错误: {result.reason}")
                return None
                
        except ImportError:
            print("请先安装azure-cognitiveservices-speech: pip install azure-cognitiveservices-speech")
            return None
        except Exception as e:
            print(f"Azure TTS生成失败: {e}")
            return None
    
    async def generate(self, text, engine=None, **kwargs):
        """
        生成语音
        
        Args:
            text: 要合成的文本
            engine: TTS引擎（edge/baidu/azure）
            **kwargs: 额外参数
        
        Returns:
            str: 音频文件路径，失败返回None
        """
        if not text or not text.strip():
            return None
        
        engine = engine or self.default_engine
        
        # 限制文本长度
        max_length = 5000
        if len(text) > max_length:
            text = text[:max_length] + "..."
        
        try:
            if engine == 'edge':
                return await self.generate_edge_tts(text, kwargs.get('voice'))
            elif engine == 'baidu':
                return self.generate_baidu_tts(
                    text,
                    kwargs.get('lang', 'zh'),
                    kwargs.get('speed', 5),
                    kwargs.get('pitch', 5),
                    kwargs.get('volume', 5)
                )
            elif engine == 'azure':
                return await self.generate_azure_tts(text, kwargs.get('voice'))
            else:
                print(f"未知的TTS引擎: {engine}")
                return None
        except Exception as e:
            print(f"语音生成失败: {e}")
            return None
    
    def generate_sync(self, text, engine=None, **kwargs):
        """同步生成语音（便捷方法）"""
        try:
            loop = asyncio.get_event_loop()
        except RuntimeError:
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
        
        return loop.run_until_complete(self.generate(text, engine, **kwargs))
    
    async def batch_generate(self, texts, engine=None, **kwargs):
        """批量生成语音"""
        tasks = []
        for text in texts:
            task = self.generate(text, engine, **kwargs)
            tasks.append(task)
        
        results = await asyncio.gather(*tasks, return_exceptions=True)
        return [r if not isinstance(r, Exception) else None for r in results]
    
    def get_audio_url(self, text, engine='edge'):
        """获取音频文件的相对URL"""
        audio_path = self.get_audio_path(text, engine)
        if os.path.exists(audio_path):
            return f"data/audio/{os.path.basename(audio_path)}"
        return None
    
    def delete_audio(self, text, engine='edge'):
        """删除音频文件"""
        audio_path = self.get_audio_path(text, engine)
        if os.path.exists(audio_path):
            os.remove(audio_path)
            return True
        return False
    
    def clean_old_audio(self, days=7):
        """清理旧音频文件"""
        import time
        
        count = 0
        current_time = time.time()
        
        for filename in os.listdir(self.audio_dir):
            filepath = os.path.join(self.audio_dir, filename)
            if os.path.isfile(filepath):
                file_time = os.path.getmtime(filepath)
                if (current_time - file_time) > (days * 24 * 60 * 60):
                    os.remove(filepath)
                    count += 1
        
        print(f"清理了 {count} 个旧音频文件")
        return count
    
    def get_stats(self):
        """获取统计信息"""
        total_files = 0
        total_size = 0
        
        for filename in os.listdir(self.audio_dir):
            filepath = os.path.join(self.audio_dir, filename)
            if os.path.isfile(filepath):
                total_files += 1
                total_size += os.path.getsize(filepath)
        
        return {
            'total_files': total_files,
            'total_size_mb': round(total_size / (1024 * 1024), 2),
            'audio_dir': self.audio_dir
        }


# 单例模式
tts_service = TTSService()

async def generate_audio(text, engine='edge', **kwargs):
    """便捷异步函数"""
    return await tts_service.generate(text, engine, **kwargs)

def generate_audio_sync(text, engine='edge', **kwargs):
    """便捷同步函数"""
    return tts_service.generate_sync(text, engine, **kwargs)

if __name__ == '__main__':
    # 测试
    test_texts = [
        "欢迎使用俄语世界新闻语音功能。",
        "这是一段测试语音，用于演示TTS功能。",
        "俄罗斯新闻将在这里播报。",
    ]
    
    print("TTS测试：")
    print("="*50)
    
    async def test():
        for text in test_texts:
            print(f"文本: {text}")
            result = await generate_audio(text, 'edge')
            if result:
                print(f"音频已生成: {result}")
            else:
                print("生成失败")
            print("-"*50)
    
    asyncio.run(test())
    
    # 打印统计
    stats = tts_service.get_stats()
    print(f"\n音频统计: {stats}")
