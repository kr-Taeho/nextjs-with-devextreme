로컬 실행 명령어:

```bash
npm run dev
# or
yarn dev
```

빌드:

```bash
npm run build
```

product 실행:

```bash
npm run start
```

실행시 주소 : [http://localhost:3000](http://localhost:3000)
[appDir](https://beta.nextjs.org/docs/api-reference/next.config.js#appdir) 사용하여 [devextreme](https://js.devexpress.com/Documentation/)으로 사이트 구성했습니다.
[Page Routes](https://beta.nextjs.org/docs/routing/pages-and-layouts) Root Page는 `app/page.tsx`에서 커스텀 할 수 있습니다.
이하 다른 페이지는 `app/...whatever/page.tsx` 경로에서 페이지 커스텀 할 수 있습니다.

기본적으로

1. `_app.tsx`
2. `layout.tsx`
3. `page.tsx`

순으로 페이지를 구성 하여 response 됩니다.
경로마다 `layout.tsx`를 구성 할 수는 있으나 `app/layout.tsx`와 겹칠 수 있습니다.
`page.tsx` 까지 SSR로 처리하고 이하 Component는 [devextreme](https://js.devexpress.com/Documentation/Guide/React_Components/Create_a_DevExtreme_Application/)으로 사이트를 구성하기 때문에 `content.tsx` 부터는 모두 CSR 입니다. `content.tsx`는 필수는 아니지만 서버에서 데이터 가공해서 넘기려면 `content.tsx`처럼 다음 client Component를 만들어서 처리해야 합니다.

devextreme-react import 할때 index를 import하지마세요. 에러납니다.
좋은 예) import Button from 'devextreme-react/button'
나쁜 예) import { Button } from 'devextreme-react'

필요한 데이터는 `page.tsx`에서 불러와 파라미터 형식으로 props를 넘겨줘야 합니다. ([DataFetching](https://beta.nextjs.org/docs/data-fetching/fetching#asyncawait-in-server-components)아직 async/await을 지원하지 않기때문에 비동기로 데이터를 가져올때 에러가 발생할 수 있습니다.)

[Error 처리](https://beta.nextjs.org/docs/api-reference/file-conventions/error#error)`app/global-error.tsx` 파일을 생성하면 페이지 관련된 error처리를 할 수 있습니다. (반드시 파일 'use client' 입력해야함.)

[API routes](https://nextjs.org/docs/api-routes/introduction) API 사용시 route.ts 파일에서 method 별로 로직 처리하게 됩니다.
[http://localhost:3000/api/hello](http://localhost:3000/api/hello). `pages/api/hello/route.ts`.

[middleware](https://nextjs.org/docs/advanced-features/middleware)사용하여 인증 처리하니 참고하세요.
