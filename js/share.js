const url = 'https://oowgnod.github.io/';

function setShare(){
    let resultImg = document.querySelector('.result-img');
    let resultAlt = resultImg.firstElementChild.alt;
    const shareTitle = '스니커즈 게임 결과';
    const shareDes = infoList[resultAlt].name;
    const shareImg = url + 'img/image-' + resultAlt + '.jpg';
    const shareURL = url + 'pages/result-' + resultAlt + '.html';

        Kakao.Link.sendDefault({
                objectType: 'feed',
                content: {
                title: shareTitle,
                description: shareDes,
                imageUrl: shareImg,
                link: {
                    mobileWebUrl: shareURL,
                    webUrl: shareURL,
                },
                },
                buttons: [
                {
                    title: '스니커즈 게임 결과 확인',
                    link: {
                    mobileWebUrl: shareURL,
                    webUrl : shareURL
                    },
                },
                ]
            });
        }


