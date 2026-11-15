@REM ----------------------------------------------------------------------------
@REM Maven Wrapper Script for InterviewPrep AI Backend
@REM ----------------------------------------------------------------------------
@echo off
setlocal

set "DEFAULT_JAVA_HOME=C:\Program Files\Java\jdk-21"
if not defined JAVA_HOME (
    if exist "%DEFAULT_JAVA_HOME%" (
        set "JAVA_HOME=%DEFAULT_JAVA_HOME%"
    )
)

set "MVN_CMD=%USERPROFILE%\.m2\apache-maven-3.9.9\bin\mvn.cmd"
if exist "%MVN_CMD%" (
    call "%MVN_CMD%" %*
) else (
    call mvn %*
)

endlocal
