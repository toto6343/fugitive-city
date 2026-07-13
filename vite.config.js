import { defineConfig } from 'vite';

// base: './' 를 쓰면 GitHub Pages에서 레포 이름이 뭐든(사용자.github.io/레포명)
// 상대경로로 잘 동작합니다. 커스텀 도메인을 쓸 경우 '/'로 바꿔도 됩니다.
export default defineConfig({
  base: './',
});
