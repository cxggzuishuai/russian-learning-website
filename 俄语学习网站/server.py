#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
简易HTTP服务器
用于本地预览俄语学习网站
"""

import http.server
import socketserver
import os
import sys
from pathlib import Path

# 配置
PORT = 8080
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)
    
    def end_headers(self):
        # 添加CORS头，允许跨域访问
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        
        # 设置正确的Content-Type
        if self.path.endswith('.js'):
            self.send_header('Content-Type', 'application/javascript; charset=utf-8')
        elif self.path.endswith('.css'):
            self.send_header('Content-Type', 'text/css; charset=utf-8')
        elif self.path.endswith('.json'):
            self.send_header('Content-Type', 'application/json; charset=utf-8')
        elif self.path.endswith('.html'):
            self.send_header('Content-Type', 'text/html; charset=utf-8')
        
        super().end_headers()
    
    def log_message(self, format, *args):
        # 自定义日志格式
        print(f"[{self.log_date_time_string()}] {args[0]}")

def main():
    print("="*60)
    print("俄语世界 - 本地服务器")
    print("="*60)
    print(f"\n服务器目录: {DIRECTORY}")
    print(f"访问地址: http://localhost:{PORT}")
    print(f"新闻页面: http://localhost:{PORT}/news.html")
    print("\n按 Ctrl+C 停止服务器")
    print("="*60)
    
    try:
        with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
            print(f"\n服务器已启动，正在监听端口 {PORT}...\n")
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n\n服务器已停止")
        sys.exit(0)
    except OSError as e:
        if e.errno == 98:  # 端口被占用
            print(f"\n[错误] 端口 {PORT} 已被占用，请尝试其他端口")
            print(f"使用方法: python server.py [端口号]")
        else:
            print(f"\n[错误] {e}")
        sys.exit(1)

if __name__ == '__main__':
    if len(sys.argv) > 1:
        try:
            PORT = int(sys.argv[1])
        except ValueError:
            print("[错误] 端口号必须是数字")
            sys.exit(1)
    
    main()
