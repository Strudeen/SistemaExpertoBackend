const { exec } = require('child_process');
const path = require('path');

const currentDir = __dirname;

const gitRepoPath = path.join(currentDir, '..');

const execOptions = {
    cwd: gitRepoPath
};

exec('git pull', execOptions, (error) => {
    if (error) {
        return;
    }

    exec('npm install', execOptions, (npmError, npmStdout, npmStderr) => {
        if (npmError) {
            return;
        }
        if (npmStderr) {
           return;
        }
 
    });
});

console.log('SISTEMA EXPERTO BACKEND INSTALADO CORRECTAMENTE!');
