
Set-StrictMode -Version Latest

$port = "3000"
#$hostname = $env:HOSTNAME
$hostname = "localhost"
C:\Zimmermann\Git\mingw64\bin\openssl s_client -connect ${hostname}:$port
