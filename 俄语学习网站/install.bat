@echo off
chcp 65001 >nul
echo ========================================
echo 俄罗斯新闻爬虫 - 安装脚本
echo ========================================
echo.

REM 检查Python
python --version >nul 2>&1
if errorlevel 1 (
    echo [错误] 未检测到Python，请先安装Python 3.8+
    pause
    exit /b 1
)

echo [1/3] 检测到Python版本:
python --version
echo.

REM 安装依赖
echo [2/3] 正在安装依赖...
pip install -r crawler\requirements.txt
if errorlevel 1 (
    echo [错误] 依赖安装失败
    pause
    exit /b 1
)
echo [成功] 依赖安装完成
echo.

REM 创建必要目录
echo [3/3] 创建数据目录...
if not exist "data\news" mkdir "data\news"
if not exist "data\images" mkdir "data\images"
if not exist "data\audio" mkdir "data\audio"
if not exist "data\cache" mkdir "data\cache"
echo [成功] 目录创建完成
echo.

echo ========================================
echo 安装完成！
echo ========================================
echo.
echo 使用方法:
echo   1. 运行爬虫: python .\crawler\news_crawler.py
echo   2. 查看新闻: 打开 news.html
echo   3. 启动服务器: python -m http.server 8080
echo.
pause
