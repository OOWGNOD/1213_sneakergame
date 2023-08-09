const main: HTMLElement = document.querySelector("section.main")!;
const qna: HTMLElement = document.querySelector("section.qna")!;
const result: HTMLElement = document.querySelector('section.result')!;

const endPoint: number = 6;
const select: number[] = new Array(infoList.length).fill(0);

function calResult(): number {
    let result: number = select.indexOf(Math.max(...select));
    return result;
}

interface InfoListItem {
    name: string;
    desc: string;
}

function setResult(): void {
    let point: number = calResult();
    const resultName: HTMLElement = document.querySelector('.resultname')!;
    resultName.innerHTML = infoList[point].name;

    let resultImg: HTMLImageElement = document.createElement('img');
    const imgDiv: HTMLElement = document.querySelector('.result-img')!;
    let imgURL: string = 'img/image-' + point + '.jpg';
    resultImg.src = imgURL;
    resultImg.alt = point.toString();
    resultImg.classList.add('img-fluid');
    imgDiv.appendChild(resultImg);

    const resultDesc: HTMLElement = document.querySelector('.resultDesc')!;
    resultDesc.innerHTML = infoList[point].desc;
}

function goResult(): void {
    qna.style.WebkitAnimation = "fadeOut 1s";
    qna.style.animation = "fadeOut 1s";
    setTimeout(() => {
        result.style.WebkitAnimation = "fadeIn 1s";
        result.style.animation = "fadein 1s";
        setTimeout(() => {
            qna.style.display = "none";
            result.style.display = "block";
        }, 450);
    });
    setResult();
    calResult();
}

interface Answer {
    answer: string;
    type: number[];
}

interface QnaListItem {
    q: string;
    a: Answer[];
}

function addAnswer(answerText: string, qIdx: number, idx: number): void {
    let a: HTMLElement = document.querySelector('.answerBox')!;
    let answer: HTMLButtonElement = document.createElement('button');
    answer.classList.add('answerList');
    answer.classList.add('mb-3');
    answer.classList.add('mt-3');
    answer.classList.add('mx-auto');
    answer.classList.add('fadeIn');
    a.appendChild(answer);
    answer.innerHTML = answerText;

    answer.addEventListener("click", function(){
        let children: NodeListOf<HTMLButtonElement> = document.querySelectorAll('.answerList');
        for(let i: number = 0; i < children.length; i++){
            children[i].disabled = true;
            children[i].style.display = 'none';
            children[i].style.WebkitAnimation = "fadeOut .5s";
            children[i].style.animation = "fadeOut .5s";
        }
        setTimeout(() => {
            let target: number[] = qnaList[qIdx].a[idx].type;
            for(let i: number = 0; i < target.length; i++){
                select[target[i]] += 1;
            }
            for(let i: number = 0; i < children.length; i++){
                children[i].style.display = 'none';
            }
            goNext(++qIdx);
        }, 450);
    }, false);
}

function goNext(qIdx: number): void {
    if(qIdx === endPoint) {
        goResult();
        return;
    }
    let q = document.querySelector('.qBox') as HTMLElement;
    q.innerHTML = qnaList[qIdx].q;
    for(let i in qnaList[qIdx].a){
        addAnswer(qnaList[qIdx].a[i].answer, qIdx, Number(i));
    }
    let status = document.querySelector('.statusBar') as HTMLElement;
    status.style.width = `${(100/endPoint) * (qIdx+1)}%`;
}

function begin(): void {
    main.style.WebkitAnimation = "fadeOut 1s";
    main.style.animation = "fadeOut 1s";
    setTimeout(() => {
        qna.style.WebkitAnimation = "fadeIn 1s";
        qna.style.animation = "fadein 1s";
        setTimeout(() => {
            main.style.display = "none";
            qna.style.display = "block";
        }, 450)
        let qIdx = 0;
        goNext(qIdx);
    }, 450);
}
