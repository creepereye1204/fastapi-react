const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); // CSS 추출 플러그인

// Webpack 설정 함수 (mode 인자를 받아 개발/프로덕션 설정 구분)
module.exports = (argv) => {
  const isProduction = argv.mode === "production"; // 현재 모드가 프로덕션인지 확인

  return {
    // Webpack 실행 모드 설정 ('development' 또는 'production')
    mode: isProduction ? "production" : "development",

    // 애플리케이션의 시작점(들) 설정
    entry: {
      // 'bundle' 이라는 이름의 청크(chunk)로 번들 파일이 생성됩니다.
      bundle: "./src/index.tsx",
    },

    // 번들링된 파일들의 출력 설정
    output: {
      // 빌드 결과 파일이 저장될 디렉토리 경로
      path: path.resolve(__dirname, "dist"),

      // JS 번들 파일의 이름 형식 설정
      // 프로덕션 모드에서는 캐시 버스팅을 위해 [contenthash]를 포함시킵니다.
      // 예: development 모드 -> bundle.js
      // 예: production 모드 -> bundle.a1b2c3d4e5f6.js
      filename: isProduction ? "bundle.[contenthash].js" : "[name].js",

      // 이미지, 폰트 등 'asset/resource' 타입으로 처리되는 자산 파일의 이름 형식 설정
      // 프로덕션 모드에서는 [contenthash]를 포함시킵니다.
      // 예: development 모드 -> assets/logo.png
      // 예: production 모드 -> assets/logo.m3n4o5p6q7r8.png
      assetModuleFilename: isProduction ? "assets/[name].[contenthash][ext]" : "assets/[name][ext]",

      // 이전 빌드 결과를 정리하는 설정 (새로운 파일만 남김)
      clean: true,
    },

    // 개발 서버 설정 (개발 모드에서만 사용)
    devServer: {
      // 정적 파일 제공 디렉토리 설정 (빌드된 파일 또는 public 폴더 등)
      static: {
        directory: path.resolve(__dirname, "dist"),
      },
      // 개발 서버 포트 번호
      port: 3000,
      // SPA에서 클라이언트 라우팅을 사용할 때 필요한 설정 (모든 경로 요청 시 index.html 서빙)
      historyApiFallback: true,
      // 서버 실행 후 브라우저 자동 열기
      open: true,
      // HMR(Hot Module Replacement) 활성화 (코드 변경 시 전체 새로고침 없이 모듈만 업데이트)
      hot: true,
    },

    // 다양한 파일 타입(모듈)을 처리하기 위한 규칙 설정
    module: {
      rules: [
        {
          // .js, .jsx, .ts, .tsx 확장자를 가진 파일들을 대상으로 함
          test: /\.(js|jsx|ts|tsx)$/,
          // node_modules 디렉토리 내의 파일은 처리 대상에서 제외
          exclude: /node_modules/,
          // 사용할 로더와 옵션 설정 (Babel을 사용하여 ES6+, React, TypeScript 문법 변환)
          use: {
            loader: "babel-loader",
            options: {
              presets: [
                "@babel/preset-env", // 최신 JS 문법을 하위 버전으로 트랜스파일링
                "@babel/preset-react", // React JSX 문법 트랜스파일링
                "@babel/preset-typescript", // TypeScript를 JavaScript로 변환
              ],
            },
          },
        },
        {
          // .css 확장자를 가진 파일들을 대상으로 함
          test: /\.css$/,
          // 사용할 로더 설정
          use: [
            // 프로덕션 모드에서는 CSS 파일을 별도의 파일로 추출, 개발 모드에서는 style 태그로 삽입
            isProduction ? MiniCssExtractPlugin.loader : "style-loader",
            "css-loader", // CSS 파일을 CommonJS 모듈로 변환
          ],
        },
        {
          // 이미지(.png, .jpg 등), 폰트(.ttf, .woff 등) 확장자를 가진 파일들을 대상으로 함 (대소문자 구분 안 함)
          test: /\.(png|jpg|jpeg|gif|svg|eot|ttf|woff|woff2)$/i,
          // Webpack 5의 Asset Modules 타입 설정
          type: "asset/resource", // 파일을 별도의 파일로 출력하고 URL 경로를 제공
          // type: "asset/inline", // 파일을 Base64 URI로 변환하여 번들 파일에 삽입 (작은 파일에 적합)
          // type: "asset", // 파일 크기에 따라 resource 또는 inline을 자동으로 선택
        },
        // 필요한 경우 다른 파일 타입(예: .graphql, .txt 등)에 대한 로더 규칙 추가
      ],
    },

    // 번들링 후 추가 작업을 위한 플러그인 설정
    plugins: [
      // HTML 파일을 생성하고 빌드된 번들 파일을 자동으로 <script>, <link> 태그로 삽입하는 플러그인
      new HtmlWebpackPlugin({
        template: "./public/index.html", // 템플릿으로 사용할 HTML 파일 경로
        // filename: "index.html", // 출력될 HTML 파일 이름 (기본값: index.html)
      }),
      // 프로덕션 모드일 때만 CSS 파일을 별도로 추출하는 플러그인
      isProduction && new MiniCssExtractPlugin({
        // 추출될 CSS 파일의 이름 형식 설정 (캐시 버스팅을 위해 [contenthash] 포함)
        filename: "bundle.[contenthash].css",
      }),
      // 필요한 경우 다른 플러그인 추가 (예: DefinePlugin, CopyWebpackPlugin 등)
    ].filter(Boolean), // isProduction 조건으로 인해 null이 될 수 있는 항목 제거

    // 모듈 해석(import) 설정
    resolve: {
      // 모듈 경로에서 생략할 수 있는 파일 확장자 목록
      extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
    },

    // 소스맵(Source Map) 생성 방식 설정 (디버깅 용이)
    // 개발 모드에서는 디버깅에 용이한 옵션, 프로덕션에서는 보안 및 성능 고려하여 다르게 설정
    devtool: isProduction ? "source-map" : "eval-source-map",
  };
};
