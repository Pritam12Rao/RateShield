pipeline {
    agent any
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        stage('Install') {
            steps {
                bat 'npm install'
            }
        }
        stage('Build Docker Image') {
            steps {
                bat 'docker build -t rateshield:latest .'
            }
        }
        stage('Deploy') {
            steps {
                bat 'docker stop rateshield-app || exit 0'
                bat 'docker rm rateshield-app || exit 0'
                bat 'docker run -d --name rateshield-app -p 3001:3000 rateshield:latest'
            }
        }
    }
}