# Ideas

## About The Project

The app is dedicated to companies / organizations who want to benefit from their people creativity and engagement and might need some help to organize the process. 

Every registered person can post their ideas for improvement which starts the 2-stage review and approval process executed by authorized members. In the meantime, everyone can comment and vote on chosen ideas. At the end, the author gets a feedback on his / her idea.

Thanks to the application the whole process is well coordinated. The target organizations / companies that would benefit most might be of different background such as Manufacturing, IT, Logistics, Finance, etc... , the recommended company size however, would be ca. 100+ employees.
 
## Technical Features
Frontend:
- React
- Axios with interceptors
- MUI
- Styled Components
- React Router
- hooks: useContext, useState, useEffect, useCallback, useMemo, useRef, useNavigate...
- custom hooks
- Lodash - debounce
- Google reCaptcha

Backend:
- Spring Boot
- Spring Security - Username/Password registration/login
- Google reCaptcha
- PostgreSQL

## Application Presentation:

### Overview

<img  src="https://github.com/asynoradzki/MyIdeas/blob/main/client/public/overview.gif"  alt="github"  width="800px"  height="450px">

### Registering a new user

<img  src="https://github.com/asynoradzki/MyIdeas/blob/main/client/public/registration.gif"  alt="github"  width="800px"  height="450px">

### Reseting password

<img  src="https://github.com/asynoradzki/MyIdeas/blob/main/client/public/reset.gif"  alt="github"  width="800px"  height="450px">

### Adding a new idea

<img  src="https://github.com/asynoradzki/MyIdeas/blob/main/client/public/add_remove.gif"  alt="github"  width="800px"  height="450px">

### Reviewing an idea - Admin role only

<img  src="https://github.com/asynoradzki/MyIdeas/blob/main/client/public/add_upvote.gif"  alt="github"  width="800px"  height="450px">

### Searching and editing a user profile - Admin role only

<img  src="https://github.com/asynoradzki/MyIdeas/blob/main/client/public/user.gif"  alt="github"  width="800px"  height="450px">


## Built With
Frontend: 

<a  href="https://www.typescriptlang.org/"  title="Typescript"><img  src="https://github.com/get-icon/geticon/raw/master/icons/typescript-icon.svg"  alt="Typescript"  width="50px"  height="50px"></a>
<a  href="https://reactjs.org/"  title="React"><img  src="https://github.com/get-icon/geticon/raw/master/icons/react.svg"  alt="React"  width="50px"  height="50px"></a>
<a  href="https://en.wikipedia.org/wiki/HTML5"  title="HTML"><img  src="https://github.com/get-icon/geticon/raw/master/icons/html-5.svg"  alt="HTML" height="50px"></a>
<a  href="https://en.wikipedia.org/wiki/CSS"  title="CSS"><img  src="https://github.com/get-icon/geticon/raw/master/icons/css-3.svg"  alt="CSS" height="50px"></a>
<a  href="https://material-ui.com/"  title="Material UI"><img  src="https://github.com/get-icon/geticon/raw/master/icons/material-ui.svg"  alt="Material UI"  width="50px"  height="50px"></a>
<a  href="https://code.visualstudio.com/"  title="Visual Studio Code"><img  src="https://github.com/get-icon/geticon/raw/master/icons/visual-studio-code.svg"  alt="Visual Studio Code"  width="50px"  height="50px"></a>
<a  href="https://www.npmjs.com/"  title="npm"><img  src="https://github.com/get-icon/geticon/raw/master/icons/npm.svg"  alt="npm"  width="50px"  height="50px"></a>

Backend:

<a  href="https://www.java.com/"  title="Java"><img  src="https://github.com/get-icon/geticon/raw/master/icons/java.svg"  alt="Java"  width="50px"  height="50px"></a>
<a  href="https://spring.io/"  title="Spring"><img  src="https://github.com/get-icon/geticon/raw/master/icons/spring.svg"  alt="Spring"  width="50px"  height="50px"></a>
<a  href="https://www.postgresql.org/"  title="PostgreSQL"><img  src="https://github.com/get-icon/geticon/raw/master/icons/postgresql.svg"  alt="PostgreSQL"  width="50px"  height="50px"></a>
<a  href="https://www.jetbrains.com/idea/"  title="IntelliJ"><img  src="https://github.com/get-icon/geticon/raw/master/icons/intellij-idea.svg"  alt="IntelliJ"  width="50px"  height="50px"></a>

Other Technologies:

<a href="https://www.figma.com" title="figma"><img  src="https://github.com/get-icon/geticon/raw/master/icons/figma.svg"  alt="figma"  width="50px"  height="50px">
<a  href="https://discord.com/"  title="Discord"><img  src="https://github.com/get-icon/geticon/raw/master/icons/discord.svg"  alt="Discord"  width="50px"  height="50px"></a>
<a  href="https://git-scm.com/"  title="Git"><img  src="https://github.com/get-icon/geticon/raw/master/icons/git-icon.svg"  alt="Git"  width="50px"  height="50px"></a>
<a  href="https://github.com/"  title="github"><img  src="https://github.com/ptatarczuk/Ideas/blob/main/server/images/github.svg"  alt="github"  width="50px"  height="50px"></a>
<a  href="https://postman.com/"  title="postman"><img  src="https://github.com/get-icon/geticon/raw/master/icons/postman.svg"  alt="postman"  width="50px"  height="50px"></a>
<a  href="https://swagger.io/"  title="swagger"><img  src="https://github.com/get-icon/geticon/raw/master/icons/swagger.svg"  alt="swagger"  width="50px"  height="50px"></a>
<a  href="https://www.docker.com/"  title="docker"><img  src="https://github.com/get-icon/geticon/raw/master/icons/docker-icon.svg"  alt="docker"  width="50px"  height="50px"></a>
<a  href="https://trello.com/"  title="trello"><img  src="https://github.com/get-icon/geticon/raw/master/icons/trello.svg"  alt="trello"  width="50px"  height="50px"></a>

## Running the Application

### In Docker: 

- Clone the Repository.
- Create accounts for Google reCaptcha and define the following environment variables in you operating system:

  - ${GOOGLE_RECAPTCHA_SECRET}
  - ${GOOGLE_RECAPTCHA_SITE_KEY}

- Provide google email and password (the account must be configured to enable sending e-mails from an application) and assign them to the following environment variables in you operating system:

  - ${MAIL_SENDER_USERNAME}
  - ${MAIL_SENDER_PASSWORD}

- Finally create PostgreSQL database and also assign it to the following environment variables in you operating system:

  - ${IDEAS_DB}
  - ${POSTGRES_USER}
  - ${POSTGRES_PASSWORD}

- In the console navigate to the main MyIdeas directory and run "docker compose up" command

### On local machine
- Clone the Repository.
- Set up all the accounts and enviroment variables described above in the Running in Docker section.

Client Application:
- Navigate to the client directory. Install dependencies using the following command: npm install
- Run the application with: npm run dev

Server Application:
- Open server directory in your IDE
- Install dependencies with Maven
- Run the services

## Authors

Aleksander Synoradzki:

<a  href="https://github.com/asynoradzki"  title="github"><img  src="https://github.com/ptatarczuk/Ideas/blob/main/server/images/github.svg"  alt="github"  width="50px"  height="50px"></a>

Piotr Tatarczuk:

<a  href="https://github.com/ptatarczuk"  title="github"><img  src="https://github.com/ptatarczuk/Ideas/blob/main/server/images/github.svg"  alt="github"  width="50px"  height="50px"></a><a  href="https://www.linkedin.com/in/ptatarczuk/"  title="github"><img  src="https://github.com/get-icon/geticon/raw/master/icons/linkedin-icon.svg"  alt="github"  width="50px"  height="50px"></a> 

<p align="right">(<a href="#readme-top">back to top</a>)</p>
