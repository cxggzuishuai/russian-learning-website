@echo off
chcp 65001 >nul
echo ========================================
echo 俄罗斯新闻爬虫 - 定时任务设置
echo ========================================
echo.

REM 获取当前目录
set "SCRIPT_DIR=%~dp0"
set "CRAWLER_SCRIPT=%SCRIPT_DIR%crawler\news_crawler.py"
set "PYTHON_PATH=python"

echo [信息] 爬虫脚本路径: %CRAWLER_SCRIPT%
echo.

REM 检查脚本是否存在
if not exist "%CRAWLER_SCRIPT%" (
    echo [错误] 未找到爬虫脚本: %CRAWLER_SCRIPT%
    pause
    exit /b 1
)

REM 创建临时XML任务定义文件
set "TEMP_XML=%TEMP%\russian_news_task.xml"

(
echo ^<?xml version="1.0" encoding="UTF-16"?^>
echo ^<Task version="1.2" xmlns="http://schemas.microsoft.com/windows/2004/02/mit/task"^>
echo   ^<RegistrationInfo^>
echo     ^<Date^>2026-03-18T00:00:00^</Date^>
echo     ^<Author^>RussianNewsCrawler^</Author^>
echo     ^<Description^>自动爬取俄罗斯新闻（塔斯社、卫星社、俄新社）^</Description^>
echo   ^</RegistrationInfo^>
echo   ^<Triggers^>
echo     ^<CalendarTrigger^>
echo       ^<StartBoundary^>2026-03-18T00:00:00^</StartBoundary^>
echo       ^<Enabled^>true^</Enabled^>
echo       ^<ScheduleByDay^>
echo         ^<DaysInterval^>1^</DaysInterval^>
echo       ^</ScheduleByDay^>
echo     ^</CalendarTrigger^>
echo   ^</Triggers^>
echo   ^<Principals^>
echo     ^<Principal id="Author"^>
echo       ^<LogonType^>InteractiveToken^</LogonType^>
echo       ^<RunLevel^>LeastPrivilege^</RunLevel^>
echo     ^</Principal^>
echo   ^</Principals^>
echo   ^<Settings^>
echo     ^<MultipleInstancesPolicy^>IgnoreNew^</MultipleInstancesPolicy^>
echo     ^<DisallowStartIfOnBatteries^>false^</DisallowStartIfOnBatteries^>
echo     ^<StopIfGoingOnBatteries^>false^</StopIfGoingOnBatteries^>
echo     ^<AllowHardTerminate^>true^</AllowHardTerminate^>
echo     ^<StartWhenAvailable^>false^</StartWhenAvailable^>
echo     ^<RunOnlyIfNetworkAvailable^>false^</RunOnlyIfNetworkAvailable^>
echo     ^<IdleSettings^>
echo       ^<StopOnIdleEnd^>true^</StopOnIdleEnd^>
echo       ^<RestartOnIdle^>false^</RestartOnIdle^>
echo     ^</IdleSettings^>
echo     ^<AllowStartOnDemand^>true^</AllowStartOnDemand^>
echo     ^<Enabled^>true^</Enabled^>
echo     ^<Hidden^>false^</Hidden^>
echo     ^<RunOnlyIfIdle^>false^</RunOnlyIfIdle^>
echo     ^<WakeToRun^>false^</WakeToRun^>
echo     ^<ExecutionTimeLimit^>PT1H^</ExecutionTimeLimit^>
echo     ^<Priority^>7^</Priority^>
echo   ^</Settings^>
echo   ^<Actions Context="Author"^>
echo     ^<Exec^>
echo       ^<Command^>%PYTHON_PATH%^</Command^>
echo       ^<Arguments^>"%CRAWLER_SCRIPT%"^</Arguments^>
echo       ^<WorkingDirectory^>%SCRIPT_DIR%^</WorkingDirectory^>
echo     ^</Exec^>
echo   ^</Actions^>
echo ^</Task^>
) > "%TEMP_XML%"

echo [1/3] 正在创建定时任务...
schtasks /create /tn "RussianNewsCrawler" /xml "%TEMP_XML%" /f
if errorlevel 1 (
    echo [错误] 创建任务失败，尝试使用命令行方式创建...
    goto :create_simple
)

echo [成功] 定时任务创建成功！
echo.
goto :finish

:create_simple
echo [2/3] 使用命令行方式创建任务...
schtasks /create /tn "RussianNewsCrawler" /tr "'%PYTHON_PATH%' '%CRAWLER_SCRIPT%'" /sc hourly /mo 6 /f
if errorlevel 1 (
    echo [错误] 创建任务失败，请手动创建
    pause
    exit /b 1
)

echo [成功] 定时任务创建成功！
echo.

:finish
echo [3/3] 清理临时文件...
del "%TEMP_XML%" 2>nul

echo.
echo ========================================
echo 定时任务设置完成！
echo ========================================
echo.
echo 任务信息:
echo   任务名称: RussianNewsCrawler
echo   执行频率: 每6小时一次
echo   执行命令: %PYTHON_PATH% "%CRAWLER_SCRIPT%"
echo.
echo 管理命令:
echo   查看任务: schtasks /query /tn "RussianNewsCrawler"
echo   运行任务: schtasks /run /tn "RussianNewsCrawler"
echo   删除任务: schtasks /delete /tn "RussianNewsCrawler" /f
echo.
echo 也可以打开"任务计划程序"进行图形化管理
echo.
pause
