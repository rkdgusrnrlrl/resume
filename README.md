# 이력서
이 이력서는 [jsonresume](https://jsonresume.org/) 을 기반으로 작성 되었고, 테마는 [Kwan themae](https://github.com/icoloma/jsonresume-theme-kwan) 기반으로 일부 수정하였습니다. Kwan 테마는 [Kwan Theme Preview](http://themes.jsonresume.org/kwan)에서 확인 할 수 있습니다.

## kwan 에서 수정된 점
- 날짜 포멧을 `YYYY-MM-DD` 으로 변경 하였습니다.
- sumary 부분은 개행이 없는데, 해당 내용에 개행문자`\n` 가 있는 경우 해당 문장을 `<p>` 로 감쌓습니다.
- 회사 직책 과 같이 단체 담당 의 순서로 나오겨 변경 하였습니다. (기존 직책 회사 순이 였음)

## 자신의 이력서로 변경 하는법 
- `resume.json` 을 자신의 내용에 맞게 수정하면 됩니다 
 - [jsonresume/resume-schema](https://github.com/jsonresume/resume-schema) 참고 하면 됩니다.
- 작성후 `npm start` 시작하면, [http://localhost:8888](http://localhost:8888)에 랜더링 된 이력서를 볼 수 있습니다.

## index.html 파일 생성 하는 법
- `node toHtml.js resume.json` 실행하면 됨

### To develop your resume

To develop iteratively (either to modify the template, CSS or resume contents) to the following

```
$ git clone https://github.com/mudassir0909/jsonresume-theme-elegant.git
$ cd jsonresume-theme-elegant
$ npm install
$ grunt watch // watches for less file changes
$ ./serve.js [optional_resume_filename] // Do this in a separate terminal to run the server with the provided resume or a default one
```

Visit [http://localhost:8888](http://localhost:8888) to see the theme in action.
