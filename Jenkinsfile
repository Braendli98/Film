pipeline {
    agent {
        docker {
            image 'anastasiaana/my-node-image:latest'
            args '--publish 3000:3000 --publish 5000:5000 --user root:root'
        }
    }

    options {
        timeout(time: 60, unit: 'MINUTES')
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

                sh 'rm -rf src __tests__ node_modules dist .extras/doc/api .extras/doc/folien/folien.html .extras/doc/projekthandbuch/html'

                git url: 'https://github.com/Braendli98/Film.git', branch: 'main', poll: true

                // Erstellen Sie die erforderlichen Verzeichnisse
                sh 'mkdir -p .extras/doc/projekthandbuch'
                sh 'mkdir -p .extras/doc/folien'
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

                sh 'apt-get update --yes'
                sh 'apt-get install --no-install-recommends --yes --show-progress gcc g++ make python3.11 python3.11-venv python3.11-dev curl'
                
                // Install Node.js and npm
                sh 'curl -fsSL https://deb.nodesource.com/setup_20.x | bash -'
                sh 'apt-get install -y nodejs'

                sh 'python3 --version'
                sh 'node --version'
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
            parallel {
                stage('Test') {
                    steps {
                        echo 'TODO: Rechnername/IP-Adresse des DB-Servers fuer Tests konfigurieren'
                        // sh 'npm run test:coverage'
                    }
                }
                stage('ESLint') {
                    steps {
                        sh 'npx eslint --version'
                        sh 'npm run eslint'
                    }
                }
                stage('Security Audit') {
                    steps {
                        sh 'npm audit --omit=dev'
                    }
                }
                stage('AsciiDoctor') {
                    steps {
                        sh 'npx asciidoctor --version'
                        sh 'npm run asciidoctor'
                    }
                }
                stage('reveal.js') {
                    steps {
                        sh 'npx asciidoctor-revealjs --version'
                        sh 'npm run revealjs'
                    }
                }
                stage('TypeDoc') {
                    steps {
                        sh 'npx typedoc --version'
                        sh 'npm run typedoc'
                    }
                }
            }

            post {
                always {
                    echo 'TODO: Links fuer Coverage und TypeDoc'

                    publishHTML(target: [
                        reportDir: '.extras/doc/projekthandbuch/html',
                        reportFiles: 'projekthandbuch.html',
                        reportName: 'Projekthandbuch',
                        reportTitles: 'Projekthandbuch'
                    ])

                    publishHTML(target: [
                        reportDir: '.extras/doc/folien',
                        reportFiles: 'folien.html',
                        reportName: 'Folien (reveal.js)',
                        reportTitles: 'reveal.js'
                    ])

                    publishHTML(target: [
                        reportDir: '.extras/doc/api',
                        reportFiles: 'index.html',
                        reportName: 'TypeDoc',
                        reportTitles: 'TypeDoc'
                    ])
                }

                success {
                    script {
                        if (fileExists("${env.WORKSPACE}/film.zip")) {
                            sh 'rm film.zip'
                        }
                    }
                    zip zipFile: 'film.zip', dir: 'dist'
                    archiveArtifacts artifacts: 'film.zip', allowEmptyArchive: true
                }
            }
        }

        stage('Docker Image bauen') {
            steps {
                echo 'TODO: Docker-Image bauen und veroeffentlichen'
                // sh 'docker buildx build --tag gruppe8/film:2024.04.0 .'
            }
        }

        stage('Deployment fuer Kubernetes') {
            steps {
                echo 'TODO: Deployment fuer Kubernetes mit z.B. Ansible, Terraform'
            }
        }
    }
}
