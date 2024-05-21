pipeline {
    agent {
        docker {
            image 'gruppe8/film:2024.04.0-bookworm'
            args '--publish 3000:3000 --publish 5000:5000 --user root:root'
        }
    }
    options {
        timeout time: 60, unit: 'MINUTES'
    }
    stages {
        stage('Init') {
            steps {
                script {
                    if (!isUnix()) {
                        error 'Unix ist erforderlich'
                    }
                }

                echo "Jenkins-Job ${env.JOB_NAME} #${env.BUILD_ID} mit Workspace ${env.WORKSPACE}"

                // Unterverzeichnisse src und test im WORKSPACE loeschen: vom letzten Build
                sh 'rm -rf src'
                sh 'rm -rf __tests__'
                sh 'rm -rf node_modules'
                sh 'rm -rf dist'
                sh 'rm -rf .extras/doc/api'
                sh 'rm -rf .extras/doc/folien/folien.html'
                sh 'rm -rf .extras/doc/projekthandfilm/html'

                // Git Repository klonen
                git url: 'https://github.com/Braendli98/Film.git', branch: 'main', credentialsId: 'github-credentials'
            }
        }

        stage('Install') {
            steps {
                sh 'id'
                sh 'cat /etc/passwd'
                sh 'echo $PATH'
                sh 'pwd'
                sh 'uname -a'
                sh 'cat /etc/os-release'
                sh 'cat /etc/debian_version'

                sh 'apt-cache policy nodejs'
                sh 'apt-get install --no-install-recommends --yes --show-progress gcc g++ make python3.11-minimal'
                sh 'apt-get install --no-install-recommends --yes --show-progress ca-certificates curl gnupg'
                sh 'apt-get update --yes'
                sh 'apt-get upgrade --yes'
                sh 'python3 --version'

                sh 'mkdir -p /etc/apt/keyrings'
                sh 'curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg'
                sh 'echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_20.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list'
                sh 'apt-get update'
                sh 'apt-get install nodejs --no-install-recommends --yes --show-progress'
                sh 'apt-cache policy nodejs'
                sh 'node --version'
                sh 'npm i -g npm'
                sh 'npm --version'

                script {
                    if (!fileExists("${env.WORKSPACE}/package.json")) {
                        error "package.json ist *NICHT* in ${env.WORKSPACE} vorhanden"
                    }
                }

                sh 'cat package.json'
                sh 'npm ci --no-fund --no-audit'
            }
        }

        stage('Compile') {
            steps {
                sh 'npx tsc --version'
                sh './node_modules/.bin/tsc'
            }
        }

        stage('Test, Codeanalyse, Security, Dok.') {
            steps {
                parallel(
                    'Test': {
                        echo 'TODO: Rechnername/IP-Adresse des DB-Servers fuer Tests konfigurieren'
                        sh 'npm test -- --passWithNoTests'
                    },
                    'ESLint': {
                        sh 'npx eslint --version'
                        sh 'npm run eslint'
                    },
                    'Security Audit': {
                        sh 'npm audit --omit=dev'
                    },
                    'AsciiDoctor': {
                        sh 'npx asciidoctor --version'
                        sh 'npm run asciidoctor'
                    },
                    'reveal.js': {
                        sh 'npx asciidoctor-revealjs --version'
                        sh 'npm run revealjs'
                    },
                    'TypeDoc': {
                        sh 'npx typedoc --version'
                        sh 'npm run typedoc'
                    }
                )
            }
            post {
                always {
                    echo 'TODO: Links fuer Coverage und TypeDoc'
                    publishHTML (target : [
                        reportDir: '.extras/doc/projekthandfilm/html',
                        reportFiles: 'projekthandfilm.html',
                        reportName: 'Projekthandfilm',
                        reportTitles: 'Projekthandfilm'
                    ])
                    publishHTML target : [
                        reportDir: '.extras/doc/folien',
                        reportFiles: 'folien.html',
                        reportName: 'Folien (reveal.js)',
                        reportTitles: 'reveal.js'
                    ]
                    publishHTML target : [
                        reportDir: '.extras/doc/api',
                        reportFiles: 'index.html',
                        reportName: 'TypeDoc',
                        reportTitles: 'TypeDoc'
                    ]
                }
                success {
                    script {
                        if (fileExists("${env.WORKSPACE}/film.zip")) {
                            sh 'rm film.zip'
                        }
                    }
                    sh 'cd dist && zip -r ../film.zip .'
                    archiveArtifacts artifacts: 'film.zip', allowEmptyArchive: true
                }
            }
        }

        stage('Docker Image bauen') {
            steps {
                echo 'TODO: Docker-Image bauen und veroeffentlichen'
            }
        }

        stage('Deployment fuer Kubernetes') {
            steps {
                echo 'TODO: Deployment fuer Kubernetes mit z.B. Ansible, Terraform'
            }
        }
    }
}
