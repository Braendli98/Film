#!/bin/bash

# Aufruf:   ./dependency-check.sh pathToZimmermann
# - z.B. ./dependency-check.sh /opt/zimmermann

pathZimmermmann=${1}

if [ "$pathZimmermmann" = "" ]
then
    echo "Bitte den Pfad zum Ordner \"zimmermann\" angeben."
    exit 1
fi

# Titel setzen
# https://apple.stackexchange.com/questions/364723/how-do-i-set-the-terminal-tab-title-via-command-line
echo -en "\033]1; dependency-check \007"

nvdApiKey='aba30abb-6cd2-4494-870e-789fd40e2de8'
project='film'

if [ ! -e $pathZimmermmann ]
then
  echo "Unter dem angegeben Pfad konnte kein passendes Shell-Skript für OWASP Dependency-Check gefunden werden."
  echo "Pfad: ${pathZimmermmann}"
fi

${pathZimmermmann}/dependency-check/bin/dependency-check.sh \
  --nvdApiKey $nvdApiKey \
  --project $project \
  --scan ../.. \
  --suppression suppression.xml \
  --out . \
  --data ${pathZimmermmann}/Zimmermann/dependency-check-data \
  --disableAssembly \
  --disableAutoconf \
  --disableBundleAudit \
  --disableCentral \
  --disableCmake \
  --disableCocoapodsAnalyzer \
  --disableComposer \
  --disableCpan \
  --disableDart \
  --disableGolangDep \
  --disableGolangMod \
  --disableJar \
  --disableMavenInstall \
  --disableMSBuild \
  --disableNugetconf \
  --disableNuspec \
  --disablePip \
  --disablePipfile \
  --disablePnpmAudit \
  --disablePoetry \
  --disablePyDist \
  --disablePyPkg \
  --disableRubygems \
  --disableSwiftPackageManagerAnalyzer \
  --disableYarnAudit
