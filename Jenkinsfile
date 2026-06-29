pipeline {
    agent any
    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timestamps()
    }

    triggers {
        githubPush()
    }

    parameters {
        string(name: 'PROJECT_NAME', defaultValue: 'aqualife')
        string(name: 'PROJECT_DIR', defaultValue: '/var/www/html/aqualife.dvworks.in_chroot/aqualife.dvworks.in/public_html')
        string(name: 'REPO_URL', defaultValue: 'https://github.com/DynamicVishvaGIT/Aqualife-Website.git')
        string(name: 'BRANCH', defaultValue: 'main')
        string(name: 'NOTIFY_EMAIL', defaultValue: 'balrajpasula189@gmail.com')
    }

    stages {
stage('Pull Code') {
    steps {
        withCredentials([string(credentialsId: 'github_token_for_ETI', variable: 'GHTOKEN')]) {
            sh """
                sudo -u growfarm-website GHTOKEN=${GHTOKEN} bash << 'EOF'
                set -e
                cd "${params.PROJECT_DIR}"
                
                # Format URL to inject the GitHub Token dynamically
                AUTH_URL="https://\${GHTOKEN}@github.com/DynamicVishvaGIT/Aqualife-Website.git"
                
                if [ ! -d .git ]; then
                    git clone \${AUTH_URL} .
                else
                    # Update remote URL just in case token changed, then fetch
                    git remote set-url origin \${AUTH_URL}
                fi
                
                git fetch origin
                git reset --hard origin/${params.BRANCH}
EOF
            """
        }
    }
}

stage('Build & Deploy') {
    steps {
        sh """
            # Sabse pehle project directory mein jayein
            cd ${params.PROJECT_DIR}
            
            # npm install aur build ko aqualife user bankar chalaein
            sudo -u aqualife npm install
            sudo -u aqualife npm run build
            
            # Purane assets delete karein
            sudo -n rm -rf assets/
            
            # Dist folder se files copy karein
            if [ -d "dist" ]; then
                sudo -n cp -r dist/* .
                echo "Files copied successfully"
            else
                echo "Build failed: dist folder not found"
                exit 1
            fi
            
            # Ensure final permissions are correct
            sudo -n chown -R aqualife:aqualife .
        """
    }
}
        stage('Permissions & Services') {
            steps {
                sh """
                    sudo chown -R aqualife:aqualife ${params.PROJECT_DIR}
                    sudo systemctl restart apache2
                """
            }
        }

        stage('Health Check') {
            steps {
                sleep 5
                sh "curl -I https://aqualife.dvworks.in || exit 1"
            }
        }
    }

    post {
        aborted {
            echo "Rollback Triggered"
            sh "sudo -u aqualife bash -c 'cd ${params.PROJECT_DIR} && if [ \"\$PREVIOUS_COMMIT\" != \"none\" ]; then git reset --hard \$PREVIOUS_COMMIT; fi'"
        }
        success {
            mail to: "${params.NOTIFY_EMAIL}",
                 subject: "🟢 SUCCESS: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                 body: "React deployment successful 🚀\n\n${env.BUILD_URL}"
        }
        failure {
            mail to: "${params.NOTIFY_EMAIL}",
                 subject: "❌ FAILED: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                 body: "Pipeline failed.\n\n${env.BUILD_URL}"
        }
    }
}
