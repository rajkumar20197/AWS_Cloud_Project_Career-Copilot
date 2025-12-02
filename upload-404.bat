@echo off
echo Uploading custom 404 page to S3...

REM Copy the file with correct name
copy custom-404.html 404.html

REM Upload to S3 (replace bucket name with yours)
aws s3 cp 404.html s3://aicareeragentcoach.com/404.html --content-type "text/html"

REM Configure website hosting
aws s3 website s3://aicareeragentcoach.com --index-document index.html --error-document 404.html

echo Done! Your custom 404 page is now live.
echo Test it at: http://aicareeragentcoach.com.s3-website-us-east-1.amazonaws.com/test

pause