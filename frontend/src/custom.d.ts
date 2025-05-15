// 이미지 파일들을 모듈로 선언하여 TypeScript가 인식하도록 함
declare module "*.png";
declare module "*.jpg";
declare module "*.jpeg";
declare module "*.gif";
declare module "*.svg";
declare module "*.webp"; // 만약 webp 이미지도 사용한다면 추가

// 필요한 경우 다른 자산 파일 타입도 추가할 수 있습니다.
// declare module "*.css";
// declare module "*.module.css"; // CSS Modules 사용 시
// declare module "*.scss";
// declare module "*.module.scss"; // SCSS Modules 사용 시
// declare module "*.woff2";
// declare module "*.woff";
// declare module "*.ttf";
// declare module "*.eot";
