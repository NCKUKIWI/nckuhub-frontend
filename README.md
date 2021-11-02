# [NCKU HUB](https://nckuhub.com/) Frontend

* This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 12.2.7
* An Frontend for NCKUHUB websit
* Using
    - Angular Universal 
    - Angular 12.2.7
    - Yarn

## I. Setup

- Install [yarn](https://classic.yarnpkg.com/en/docs/install) first!

## II. Attention

- Use **yarn** instead of **npm**

## III. Start Development

### Start Frontend Server
```
yarn start
```
Run `yarn start` for a frontend server. Navigate to `http://localhost:4200/`. 
The app will automatically reload if you change any of the source files.

### or Start SSR Server

```
yarn dev:ssr
```
Run `yarn dev:ssr` for a SSR server. Navigate to `http://localhost:4200/`. 

## IV. Project Structure 

### 1. App Folder
```
├── ...
├── app                     
│   ├── core                        # For `Service`, `utils`, `enum`, `model` (Global use)
│   ├── pages                       # Each view component in project
│   ├── shared                      # Angular share `directive`, `pipes`, `components`
│   ├── app-routing.module.ts       # Main router
│   ├── app.module.ts               # Main module
│   ├── app-server.module.ts        # SSR server module
│   ├── app.component.ts            # Main component
│   ├── app.component.html          # Main html
│   └── ...
└── ....
```

### 2. Core Folder
> 全站共用的放這
```
├── ...
├── core                    
│   ├── authentication     # Login/Logout service
│   ├── http               # API url setting, service about calling API define here
│   ├── models             # Define class for type 
│   ├── service            # Define Common service for common logic
│   ├── utils              # Define some tool for code
│   ├── enum               # Define come constant
│   └── ...
└── ....
```

### 3. Pages Folder
```
├── ...
├── pages                    
│   ├── pages.module.ts         # Export all the page components
│   ├── homepage                # Showing all courses
│   ├── course                  # Showing single course with comments
│   ├── timetable               # Showing timetable
│   ├── user                    # Showing user's comments
│   └── page-not-found          # For 404
└── ....
```

## V. For Developer Guideline
### [1. Commit Guideline](https://www.notion.so/Commit-4a5c182851aa4c75b19861a6858870f9)
```
<type>: <short summary>
  │            │
  │            └─⫸ Summary in present tense. Not capitalized. No period at the end.
  │  
  └─⫸ Commit Type: build|ci|docs|feat|fix|perf|refactor|test|chore|style|revert

```
- `build`: Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)
- `ci`: Changes to our CI configuration files and scripts (example scopes: Circle, BrowserStack, SauceLabs)
- `docs`: Documentation only changes
- `feat`: 新增/修改功能 (feature)。
- `fix`: 修補 bug (bug fix)。
- `perf`:  改善效能 (A code change that improves performance)。
- `refactor`: 重構 (既不是新增功能，也不是修補 bug 的程式碼變動)。
- `test`: 增加測試 (when adding missing tests)。
- `chore`: 建構程序或輔助工具的變動 (maintain)。
- `style`: 格式 (不影響程式碼運行的變動 white-space, formatting, missing semi colons, etc)。
- `revert`: 撤銷回覆先前的 commit 例如：revert: type(scope): subject (回覆版本：xxxx)。

### [2. Branch name style](https://www.notion.so/Commit-4a5c182851aa4c75b19861a6858870f9)
```
{feature|hotfix}/{Issue No.}-{(feature|hotfix)-description}
```
### [3. Git Flow](https://www.notion.so/Git-Flow-07e0a1f720374e9c8802b84898531c91)

### [4. Develop Flow](https://www.notion.so/c659d713ff724890af1b8b604cc6fdf4)

### [5. Deploy Flow](https://www.notion.so/e3288456661349dd9ca03dbcad3a3422)

## VI. Key Packages

## VII. Usage

## VIII. License
