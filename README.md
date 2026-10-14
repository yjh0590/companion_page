# 반려 페이지 키우기 · v0.7.0

아무것도 없는 화면에 말을 건네며 점 → 선 → 면 → 2D 생명 → 3D 입체로 키우는 웹 게임입니다.

## 바로 실행하기

`public/index.html`을 Chrome에서 열면 됩니다. 서버와 API 키가 필요하지 않습니다. 저장을 안정적으로 이어가려면 배포한 주소에서 플레이하세요.

## GitHub → Vercel 배포

1. 이 폴더 안의 `public`, `vercel.json`, `README.md`, `CHANGELOG.md`, `package.json`, `scripts`를 GitHub 저장소의 최상위에 올립니다.
2. Vercel에서 새 프로젝트를 만들고 해당 GitHub 저장소를 가져옵니다.
3. 아래 설정으로 Deploy를 누릅니다. `vercel.json`에 기본값이 들어 있습니다.

| 항목 | 값 |
| --- | --- |
| Framework Preset | Other |
| Root Directory | 저장소 최상위 (`./`) |
| Build Command | 빈칸 |
| Install Command | 빈칸 |
| Output Directory | `public` |
| 환경 변수 / API 키 | 없음 |

`public` 폴더만 저장소 최상위에 풀어놓는 대신, 위의 폴더 구조를 그대로 유지하세요. 나중에 코드를 GitHub에 수정해 올리면 연결된 Vercel 프로젝트에서 배포됩니다.

공식 참고: [Vercel 정적 사이트 빌드 설정](https://vercel.com/docs/builds), [프로젝트 설정 파일](https://vercel.com/docs/project-configuration/vercel-json)

## Namecheap 도메인 연결

1. Vercel의 해당 프로젝트 → Settings → Domains에서 원하는 주소를 추가합니다.
2. Vercel이 **그 프로젝트에 표시한 DNS 레코드의 종류·이름·값**을 확인합니다.
3. Namecheap → Domain List → 도메인의 Manage → Advanced DNS → Host Records에서 필요한 레코드를 넣습니다.
4. Vercel에서 연결 상태가 유효해졌는지 확인한 뒤 HTTPS 주소로 접속합니다.

| 연결할 주소 예시 | Namecheap Host 예시 | 레코드 |
| --- | --- | --- |
| `example.com` | `@` | Vercel이 지정한 A 레코드와 값 |
| `pet.example.com` | `pet` | Vercel이 지정한 CNAME 레코드와 값 |
| `www.example.com` | `www` | Vercel이 지정한 CNAME 레코드와 값 |

DNS의 실제 값은 이 README의 예시에서 복사하지 말고 **Vercel 화면에 표시된 값**을 사용하세요. 같은 Host를 쓰는 기존 레코드가 있다면 충돌하는 항목만 조정합니다. 다른 서브도메인이나 메일용 MX/TXT 레코드는 별개입니다. 도메인의 네임서버가 Namecheap DNS가 아니라면 실제 DNS를 관리하는 곳에서 설정해야 합니다.

공식 참고: [Vercel 도메인 추가](https://vercel.com/docs/domains/working-with-domains/add-a-domain), [Namecheap CNAME 추가](https://www.namecheap.com/support/knowledgebase/article.aspx/9646/2237/how-to-create-a-cname-record-for-your-domain/), [Namecheap A 레코드 추가](https://www.namecheap.com/support/knowledgebase/article.aspx/319/2237/how-can-i-set-up-an-a-address-record-for-my-domain/)

## 이전 페이지의 저장 옮기기

브라우저 저장은 주소별로 구분됩니다. 기존 ChatGPT Site, Vercel 기본 주소, 새 도메인은 서로 다른 저장 공간입니다.

1. **이전 주소**에서 보관함 → 저장 파일 내려받기.
2. **새 최종 주소**에서 보관함 → 저장 파일 불러오기.
3. 이름과 성장 상태가 이어지는지 확인.

현재 로그인이나 서버 저장은 없습니다. 계정별·기기 간 자동 이어하기는 다음 개발 범위입니다. 최근 불러오기 또는 초기화 직전 상태는 보관함의 복구 버튼으로 되돌릴 수 있습니다. 브라우저 데이터를 지우면 이 복구 기록도 지워집니다.

## 플레이

- 서로 다른 말을 먹이면 성장하고 조각을 얻습니다.
- 점과 선도 만지거나 끌 수 있습니다.
- 면에 색이 차고 눈과 입이 생깁니다.
- 2D 생명 단계에서 놀이와 꾸미기가 열립니다.
- 3D 단계에서 드래그 또는 방향키로 회전합니다. Home은 기본 각도로 복원합니다.
- 「이 느낌이 맞아?」로 마지막 말의 감정을 직접 고칩니다. 같은 표현은 다음에도 고친 감정으로 받습니다.
- 위의 단계 이름을 누르면 성장 기록을 봅니다. 성장 카드 SVG도 내려받을 수 있습니다.
- 장식 배치 중 방향키로 이동, Shift+방향키로 크게 이동, Delete로 재료 일부를 돌려받습니다.

## 성장 조정

`public/dimensions.js`의 `DIMENSION_STAGES`에서 기준을 바꿀 수 있습니다.

| 단계 | 새로운 말 누적 |
| --- | ---: |
| 점 | 1 |
| 선 | 3 |
| 닫히는 윤곽 | 6 |
| 면 | 9 |
| 2D 생명 | 14 |
| 3D 입체 | 24 |

표정은 11번째 말부터 눈, 12번째부터 입이 나타납니다. 기준을 크게 바꾸면 같은 파일의 표시 조건과 `upgrade.js`의 놀이 해금 조건도 함께 조정해야 합니다.

## 코드 구조

| 파일 | 역할 |
| --- | --- |
| `public/index.html` | 화면 구조 |
| `public/style.css` | 디자인, 감정·놀이 애니메이션 |
| `public/game.js` | 먹이기, 돌봄, 저장과 불러오기 |
| `public/emotions.js` | 감정 8종, 상황 6종, 감정 조합 4종, 성격 |
| `public/upgrade.js` | 조각 재화, 장식 배치, 놀이 5종, 발견 수첩 |
| `public/dimensions.js` | 차원 성장, 선 변형, 입체 기하와 회전 |
| `public/evolution.js` | 해석 교정, 먹이 기억, 성장 앨범, 형태 분화 |
| `scripts/check.cjs` | Node에서 실행하는 게임 로직 검사 |
| `vercel.json` | 정적 배포 설정 |

## 검사와 현재 한계

Node.js가 설치되어 있다면 저장소 최상위에서 `node scripts/check.cjs` 또는 `npm test`로 검사를 실행할 수 있습니다. 외부 패키지 설치는 필요하지 않습니다.

차원 성장, 입체 좌표, 저장과 복구, 감정 교정, 반복 보상 제한을 코드로 확인했습니다. 실제 브라우저에서의 터치·드래그·애니메이션과 실제 Vercel 배포는 추가 확인이 필요합니다.

감정은 AI가 아닌 단어 규칙과 사용자의 교정 기록으로 해석합니다. 복잡한 문장이나 반어법은 잘못 읽을 수 있습니다. 중복 방지에는 최근 5,000개의 정규화된 표현을 기억하며, 교정은 최근 100개 표현을 기억합니다. 오래된 버전의 최근 대화 밖에 있는 말은 역으로 복원할 수 없습니다.

3D는 같은 평면에 두께를 붙인 기하를 SVG에 원근 투영하는 방식입니다. 자유로운 입체 회전은 가능하지만, 전용 3D 엔진이나 물리 시뮬레이션은 사용하지 않습니다. 표정의 원근 처리는 간단한 근사입니다.

대화와 저장은 브라우저 안에 머뭅니다. 게임 코드에는 서버 전송, 분석 SDK, API 키, 인증 토큰 또는 기존 배포의 프로젝트 식별자가 들어 있지 않습니다.
