pipeline {
  agent any
  options {
    timeout(time: 1, unit: 'HOURS')
    buildDiscarder(logRotator(numToKeepStr: '5'))
    disableConcurrentBuilds()
  }
  stages {
    stage('Info') {
      steps {
        sh 'id'
        sh 'uname -a'
        sh 'tree -du -L 4'
      }
    }
    stage('Build') {
      steps {
        sh 'echo $PATH'
        sh 'make build'
      }
    }
    // stage('to=dev') {
    //   steps {
    //     sh 'make rsync to=alps_w'
    //     sh 'make release to=alps_w'
    //     sh 'make rsync-branch to=alps_w'
    //     sh 'make release-branch to=alps_w'
    //     echo "https://jenkins.alps_w.xyz"
    //   }
    // }
    // stage('to=test') {
    //   steps {
    //     sh 'make rsync to=saas-test'
    //     sh 'make release to=saas-test'
    //     sh 'make rsync-branch to=saas-test'
    //     sh 'make release-branch to=saas-test'
    //     echo "https://saas.test.styd.cn"
    //   }
    // }
    // stage('to=pre') {
    //   steps {
    //     sh 'make rsync to=saas-pre'
    //     sh 'make release to=saas-pre'
    //     sh 'make rsync-branch to=saas-pre'
    //     sh 'make release-branch to=saas-pre'
    //     echo "https://saas.pre.styd.cn"
    //   }
    // }
    // stage('to=prod') {
    //   when {
    //     expression { BRANCH_NAME ==~ /(master).*/}
    //   }
    //   steps {
    //     sh 'make rsync to=saas-nginx-m'
    //   }
    // }
  }
  // post {
  //   always {
  //     // 始终删除构建过程中产出的文件
  //     // sh 'make clean'
  //   }
  // }
}
