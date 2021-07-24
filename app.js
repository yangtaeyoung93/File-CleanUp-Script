//파일을 확장자별로 분류하여 파일을 정리하고, 편집된 이미지 파일을 따로 정리하는 기능


const path = require('path');
const os = require('os');
const fs = require('fs');
//계획
//1. 사용자가 원하는 폴더의 이름을 받아온다

const folder = process.argv[2];
const workingDir = path.join(os.homedir(),'Pictures',folder);
console.log(workingDir);
if(!folder || !fs.existsSync(folder)){
    console.error('Please enter folder name in Pictures');
    return;
}

//2. 그 폴더안의 video, captured, duplicated 폴더를 만든다.
const videoDir = path.join (workingDir,'video');
const captureDir = path.join( workingDir,'captured');
const duplicateDir = path.join( workingDir,'duplicated');

console.log(videoDir);
console.log(captureDir);
console.log(duplicateDir);


!fs.existsSync(videoDir) && fs.mkdirSync(videoDir);
!fs.existsSync(captureDir) && fs.mkdirSync(captureDir);
!fs.existsSync(duplicateDir) && fs.mkdirSync(duplicateDir);

//3. 폴더안에 있는 파일들을 다 돌면서 해당하는 mp4|mov. png|aae, iMG_1234(IMG_E1234)

//해당 경로안 파일을 읽는다.
fs.promises
.readdir(folder)
.then(processFiles)
.catch(console.error);

//파일들을 조사하는 메서드
function processFiles(files){
    files.forEach((file) => {
       if(isVideoFile(file)){
           move(file,videoDir);
       }else if(isCaptureFile(file)){
            move(file,captureDir);
       }else if(isDuplicateFile(files, file)){
            move(file,duplicateDir);
       }
    });
}
//g:매칭될 수 있는 다수의 결과값을 기억 m : 행이 바뀌어도 찾기 case insensitive : 대소문자 구분 x 
function isVideoFile(file){
    const regExp = /(mp4|mov)$/gm; // mp4|mov로 끝나는 단어를 찾아라 
    const match = file.match(regExp);
    
    return !!match;//match에 결과값이 존재하면 true 없으면 false;
}
function isCaptureFile(file){
    const regExp = /(png|aae)$/gm;// png|aae로 끝나는 단어를 찾아라 
    const match = file.match(regExp);
   
    return !!match;//match에 결과값이 존재하면 true null이면 false;
}
function isDuplicateFile(files, file){
    //IMG_XXXXX -> IMG_EXXXX
    if(!file.startsWith('IMG_') || file.startsWith('IMG_E')){
        return false;
    }

    const edited = `IMG_E${file.split('_')[1]}`;
    //edited가 원본 파일
    const find = files.find(f => f.includes(edited));
    return !!find;//find 결과값이 존재하면 true null이면 false;

}
//파일을 이동 메서드
function move(file,dir){
    const oldPath = path.join(folder,file);
    const newPath = path.join(dir,file);
    fs.promises
    .rename(oldPath, newPath)
    .catch(console.error)
}
