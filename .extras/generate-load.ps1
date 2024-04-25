

# https://docs.microsoft.com/en-us/powershell/scripting/developer/cmdlet/approved-verbs-for-windows-powershell-commands?view=powershell-7

# Aufruf:   .\generate-load.ps1 [ingress]

# ggf. vorher:  Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
# oder:         Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope CurrentUser

Set-StrictMode -Version Latest

$versionMinimum = [Version]'7.5.0'
$versionCurrent = $PSVersionTable.PSVersion
if ($versionMinimum -gt $versionCurrent) {
  throw "PowerShell $versionMinimum statt $versionCurrent erforderlich"
}

# Titel setzen
$host.ui.RawUI.WindowTitle = 'generate-load'

$ProgressPreference = 'SilentlyContinue'
for ($index = 1; ; $index++) {
  switch ($index) {
    { $_ % 2 -eq 0 } {
      $id = 20
    }
    { $_ % 3 -eq 0 } {
      $id = 30
    }
    { $_ % 5 -eq 0 } {
      $id = 40
    }
    { $_ % 7 -eq 0 } {
      $id = 50
    }
    default {
      $id = 1
    }
  }


  Write-Output "id=$id"
  $url = "https`://localhost`:3000/rest/$id"
  #$url = "http`://localhost`:3000/rest/$id"

  Invoke-WebRequest $url `
    -Headers @{Accept = 'application/hal+json' } -SkipHeaderValidation `
    -SslProtocol Tls13 -SkipCertificateCheck  | Out-Null # DevSkim: ignore DS440000

  Start-Sleep -Seconds 0.3
}
