#!/bin/bash
# 俄罗斯新闻爬虫 - Linux/Mac安装脚本

echo "========================================"
echo "俄罗斯新闻爬虫 - 安装脚本"
echo "========================================"
echo ""

# 检查Python
if ! command -v python3 &> /dev/null; then
    echo "[错误] 未检测到Python3，请先安装Python 3.8+"
    exit 1
fi

echo "[1/3] 检测到Python版本:"
python3 --version
echo ""

# 安装依赖
echo "[2/3] 正在安装依赖..."
pip3 install -r crawler/requirements.txt
if [ $? -ne 0 ]; then
    echo "[错误] 依赖安装失败"
    exit 1
fi
echo "[成功] 依赖安装完成"
echo ""

# 创建必要目录
echo "[3/3] 创建数据目录..."
mkdir -p data/news
mkdir -p data/images
mkdir -p data/audio
mkdir -p data/cache
echo "[成功] 目录创建完成"
echo ""

echo "========================================"
echo "安装完成！"
echo "========================================"
echo ""
echo "使用方法:"
echo "  1. 运行爬虫: python3 crawler/news_crawler.py"
echo "  2. 查看新闻: 打开 news.html"
echo "  3. 启动服务器: python3 -m http.server 8080"
echo ""
