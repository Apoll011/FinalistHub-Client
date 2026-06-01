# FinalistHub-Client 🚀
![license](https://img.shields.io/github/license/Apoll011/FinalistHub-Client?style=default&logo=opensourceinitiative&logoColor=white&color=0080ff)
![last-commit](https://img.shields.io/github/last-commit/Apoll011/FinalistHub-Client?style=default&logo=git&logoColor=white&color=0080ff)
![repo-top-language](https://img.shields.io/github/languages/top/Apoll011/FinalistHub-Client?style=default&color=0080ff)
![repo-language-count](https://img.shields.io/github/languages/count/Apoll011/FinalistHub-Client?style=default&color=0080ff)

**FinalistHub-Client** is a web application for managing and interacting with events, financial data, and resources in real-time. It is designed to provide a seamless dashboard experience with a focus on managing events, finances, and inventory.

---

## Table of Contents 📑

- [Overview](#overview)
- [Features](#features)
- [Project Structure](#project-structure)
- [Project Index](#project-index)
- [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
- [Usage](#usage)
- [Testing](#testing)
- [Project Roadmap](#project-roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)

---

## Overview

FinalistHub-Client is the frontend interface for interacting with FinalistHub's event management and financial services. Built using TypeScript and React, it enables users to manage a wide range of data, including events, financial transactions, and inventory reports. It provides dashboards, charts, and insights to track real-time business activities effectively.

## Running with Docker Compose

### Quick Start

From the server repository (https://github.com/Apoll011/FinalistHub-server):

**Test Mode** (with SQLite and default admin):
```bash
./run.sh --test
```

**Production Mode** (with SQLiteCloud):
```bash
./run.sh
```

Both will build and run:
- **Client** (from this repo): http://localhost:5173
- **Server** (from FinalistHub-server): http://localhost:8000
- **API Docs**: http://localhost:8000/docs

Test mode includes default admin account: `admin` / `admin`

---

## Features

- **Event Management**: Organize and manage events, view event details, and track ticket sales.
- **Financial Dashboard**: View financial reports, cashflow forecasts, and transaction data.
- **Inventory Management**: Monitor and manage inventory, low-stock alerts, and item sales.
- **Admin Controls**: Secure admin-only access and controls for privileged users.
- **Interactive Charts**: Visualize revenue sources, transaction categories, and more.
- **User Authentication**: Support for secure sign-in, sign-up, and password management.
- **Responsive UI**: Optimized for use on both desktop and mobile devices.
- **OpenAPI Integration**: Seamlessly interact with the backend using a well-defined OpenAPI.

---

## Project Structure

```
└── FinalistHub-Client/
    ├── Dockerfile
    ├── LICENSE
    ├── README.md
    ├── eslint.config.js
    ├── index.html
    ├── openapitools.json
    ├── package-lock.json
    ├── package.json
    ├── public/
    │   ├── android-chrome-192x192.png
    │   ├── favicon.ico
    │   └── images/
    │       ├── bg.jpg
    │       └── logo.png
    ├── src/
    │   ├── App.tsx
    │   ├── components/
    │   │   ├── auth/
    │   │   ├── event/
    │   │   ├── financial/
    │   ├── hooks/
    │   ├── layouts/
    │   ├── pages/
    │   ├── styles/
    ├── tsconfig.json
    └── vite.config.ts
```

---

## Project Index

- **src/**: Contains all TypeScript source code, including components, pages, hooks, and APIs.
- **public/**: Static assets like images, icons, and manifests.
- **styles/**: CSS and SCSS files for styling the app.
- **Dockerfile**: Container configuration for Docker deployment.

---

## Getting Started

### Prerequisites

Before getting started with **FinalistHub-Client**, ensure your environment meets the following requirements:

- **Programming Language**: TypeScript
- **Package Manager**: npm
- **Container Runtime**: Docker (optional)

### Installation

#### Build from Source

1. Clone the FinalistHub-Client repository:
    ```bash
    git clone https://github.com/Apoll011/FinalistHub-Client
    ```

2. Navigate to the project directory:
    ```bash
    cd FinalistHub-Client
    ```

3. Install the project dependencies:
    - Using **npm**:
      ```bash
      npm install
      ```

    - Using **Docker** (alternative):
      ```bash
      docker build -t Apoll011/FinalistHub-Client .
      ```

---

## Usage

Run FinalistHub-Client in your local environment:

- Using **npm**:
    ```bash
    npm start
    ```

- Using **Docker**:
    ```bash
    docker run -it {image_name}
    ```

---

## Testing

Run the test suite using **npm**:

```bash
npm test
```

---

## Project Roadmap

Here are some key features and tasks we're planning for the future:

1. **Feature 1**: Implement advanced reporting tools for event insights.
2. **Feature 2**: Integrate with external payment gateways for real-time transactions.
3. **Feature 3**: Add user notifications for events and financial status.

---

## Contributing

We welcome contributions to **FinalistHub-Client**! Here’s how you can get involved:

- 💬 **Join the Discussions**: Share your ideas, provide feedback, or ask questions.
- 🐛 **Report Issues**: Found a bug or have a feature request? Please submit it [here](https://github.com/Apoll011/FinalistHub-Client/issues).
- 💡 **Submit Pull Requests**: Feel free to review open PRs and contribute your own!

### Contributing Guidelines
1. Fork the repository.
2. Create a new branch for your changes.
3. Write tests to cover your changes.
4. Ensure your code adheres to our style guide.
5. Submit a pull request!

---

## License

This project is licensed under the MIT License. For more details, please refer to the LICENSE file in the repository.

---

## Acknowledgments

- **React** and **TypeScript** for providing the tools to build modern web applications.
- **OpenAPI** for enabling seamless communication between the frontend and backend.
- Special thanks to all the contributors and supporters of FinalistHub!

---

Thank you for using **FinalistHub-Client**! We hope it serves as an essential tool for your event management and financial tracking needs. 🚀

---