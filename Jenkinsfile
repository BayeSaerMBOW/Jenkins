pipeline {
agent any


environment {
// remplacer par vos identifiants dans Jenkins credentials
DOCKERHUB_CRED_ID = 'dockerhub-credentials' // username:password
DOCKERHUB_REPO = 'yourdockerhubusername/node-jenkins-render' // <-- modifier
IMAGE_TAG = "${env.BUILD_NUMBER}" // ou "latest" ou git commit SHA
RENDER_AUTO_DEPLOY = 'true' // si Render est connecté au Docker Hub on n'a pas besoin d'API
// Si vous voulez utiliser l'API Render pour déclencher le deploy, créez la cred 'render-api-key'
RENDER_API_KEY_CRED = 'render-api-key'
RENDER_SERVICE_ID = 'srv-xxxxxxxxxxxxxxxx' // ID du service sur Render si vous utilisez l'API
}


stages {
stage('Checkout') {
steps {
checkout scm
}
}


stage('Build Docker Image') {
steps {
script {
sh "docker --version || true"
// Build image
sh "docker build -t ${DOCKERHUB_REPO}:${IMAGE_TAG} ."
}
}
}


stage('Login & Push to Docker Hub') {
steps {
withCredentials([usernamePassword(credentialsId: env.DOCKERHUB_CRED_ID, usernameVariable: 'DOCKERHUB_USER', passwordVariable: 'DOCKERHUB_PASS')]) {
sh '''
echo "$DOCKERHUB_PASS" | docker login -u "$DOCKERHUB_USER" --password-stdin
docker push ${DOCKERHUB_REPO}:${IMAGE_TAG}
docker tag ${DOCKERHUB_REPO}:${IMAGE_TAG} ${DOCKERHUB_REPO}:latest
docker push ${DOCKERHUB_REPO}:latest
'''
}
}
}


stage('Trigger Render (optional)') {
when {
expression { env.RENDER_AUTO_DEPLOY != 'true' }
}
steps {
withCredentials([string(credentialsId: env.RENDER_API_KEY_CRED, variable: 'RENDER_API_KEY')]) {
script {
// Exemple générique pour appeler l'API de Render si vous préférez déclencher le déploiement via API.
sh '''
echo "Triggering deploy on Render for service ${RENDER_SERVICE_ID}..."
curl -X POST \
-H "Accept: application/json" \
-H "Authorization: Bearer ${RENDER_API_KEY}" \
https://api.render.com/v1/services/${RENDER_SERVICE_ID}/deploys -d '{}'
'''
}
}
}
}
}


post {
always {
sh 'docker logout || true'
}
success {
echo "Build and push successful: ${DOCKERHUB_REPO}:${IMAGE_TAG}"
}
failure {
echo "Pipeline failed"
}
}
}