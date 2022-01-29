import axios from "axios";
import "./style.css";

//초기 실행 함수
const init = () => {
    axios.get("https://my-json-server.typicode.com/kakaopay-fe/resources/words") //서버에서 단어 받기
        .then(function(response) {
            exam = response;
            window.history.pushState({ path: '/' }, '', '/');
            document.getElementById("app").innerText = "";
            document.getElementById('btn').innerHTML = `<input class=\"input-group\" type=\"text\" size=\'50\' id=\"user_input\"></input>
            <button id=\"button\" class=\"btn-primary\" type=\"button\">시작</button>`;
            document.getElementById("user_input").value = "입력";
            document.getElementById("avg_time").innerText = "";
            document.getElementById("exam_word").innerText = "문제 단어";
            idx = 0;
            score = JSON.stringify(exam.data.length);
            const button = document.getElementById("button");
            button.addEventListener("click", () => { //버튼 클릭시
                if (button_click) { //초기화 -> 시작
                    document.getElementById("exam_word").innerText = "문제 단어";
                    document.getElementById("user_input").value = "입력";
                    document.getElementById("button").innerText = "시작";
                    button_click = false;
                    idx = -1;
                    examtest(idx);
                } else { //시작 -> 초기화
                    document.getElementById("user_input").value = "";
                    document.getElementById("button").innerText = "초기화";
                    button_click = true;
                    idx = 0;
                    score = JSON.stringify(exam.data.length);
                    examtest(idx);
                }
            });
            score = JSON.stringify(exam.data.length); //점수 초기값 max로 세팅
            var obj = JSON.parse(JSON.stringify(exam.data[0]));
            time = obj.second; //시간 초기값 세팅
            document.getElementById("time").innerText = "남은시간 : " + time + "초";
            document.getElementById("score").innerText = "점수 " + score + "점";
        }).catch(function(error) {
            // 오류발생시 실행
            console.error(error);
        });
};
window.addEventListener('popstate', () => { //뒤로가기나 앞으로가기등 이벤트 발생시
    console.log('[popstate]', window.location.pathname);
    if (window.location.pathname == '/finish') {
        finish();
    } else {
        init();
    }
});

window.onkeydown = function() {
    if ((event.ctrlKey == true && (event.keyCode == 78 || event.keyCode == 82)) ||
        (event.keyCode == 116)) { //새로고침 키 이벤트 발생시
        init();
    }
}

//완료 화면
function finish() {
    document.getElementById("app").innerText = "Mission Complete!";
    document.getElementById("time").innerText = "";
    document.getElementById("score").innerText = "";
    document.getElementById("exam_word").innerText = "당신의 점수는 " + score + "점입니다.";
    avg_time = avg_time / score;
    if (score != 0) {
        document.getElementById("avg_time").innerText = "단어당 평균 답변 시간은 " + avg_time + "초입니다.";
    }
    document.getElementById('btn').innerHTML = `<button id=\"button_restart\" class=\"btn-primary\" type=\"button\">다시 시작</button>`;
    const button = document.querySelector('.btn-primary');
    button.addEventListener('click', () => { init(); });
}

//시간 타이머
function setTimer() {
    if (time > 0) {
        time -= 1; //1초마다 시간 -1초
        document.getElementById("time").innerText = "남은시간 : " + time + "초";
        document.querySelector('#user_input').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') { //엔터 키 입력시
                var text = document.getElementById("user_input").value;
                document.getElementById("user_input").value = "";
                if (text == examword) { //정답인 경우
                    if (idx == JSON.stringify(exam.data.length) - 1) { //게임이 종료되었을 때
                        var obj = JSON.parse(JSON.stringify(exam.data[idx]));
                        avg_time += (obj.second - time); //평균시간에 포함
                        clearInterval(timer);
                        window.history.pushState({ path: '/finish' }, '', '/finish'); //라우터를 통한 이동
                        finish();
                    } else { //게임이 진행 중인 경우
                        clearInterval(timer);
                        var obj = JSON.parse(JSON.stringify(exam.data[idx]));
                        avg_time += (obj.second - time);
                        idx += 1;
                        document.getElementById("user_input").value = "";
                        examtest(idx);
                    }

                }
            }
        });
    } else { //시간이 종료된 경우
        if (idx >= 0 && idx < JSON.stringify(exam.data.length) - 1) { //게임이 진행중인 경우
            clearInterval(timer);
            idx += 1;
            score -= 1;
            examtest(idx);
        } else if (idx >= JSON.stringify(exam.data.length) - 1) { //게임이 종료된 경우
            score -= 1;
            clearInterval(timer);
            window.history.pushState({ path: '/finish' }, '', '/finish'); //라우터를 통한 이동
            finish();
        }
    }
}

//문제 세팅
function examtest(idx) {
    if (idx == -1) { //세팅 초기화
        avg_time = 0;
        idx = 0;
        var obj = JSON.parse(JSON.stringify(exam.data[0]));
        time = obj.second;
        document.getElementById("exam_word").innerText = "문제 단어";
        document.getElementById("time").innerText = "남은시간 : " + time + "초";
        document.getElementById("score").innerText = "점수 " + score + "점";
        clearInterval(timer);
        printName();
    } else { //게임 진행 중 세팅
        var obj = JSON.parse(JSON.stringify(exam.data[idx]));
        document.getElementById("exam_word").innerText = obj.text;
        examword = obj.text;
        time = obj.second;
        document.getElementById("time").innerText = "남은시간 : " + time + "초";
        document.getElementById("score").innerText = "점수 " + score + "점";
        timer = setInterval(setTimer, 1000); //1초단위로 타이머 실행
    }
}

var button_click = false;
var exam = 0;
var time = 0;
var timer;
var idx = 0;
var examword;
var score = 0;
var avg_time = 0;

init();