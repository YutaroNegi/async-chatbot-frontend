## 🗒️ Description

This project is a frontend application. It features a chat widget that allows users to interact with a chatbot, supporting actions such as sending, editing, and deleting messages. The frontend is built using **React**, **TypeScript**, and **Vite**, and integrates with a backend API developed using **Python** and **FastAPI**.

## 🚀 Technologies Used

- **Frontend:**

  - React
  - TypeScript
  - Vite
  - React Router DOM
  - React Context API

- **Testing:**

  - Vitest
  - React Testing Library
  - Jest DOM

- **Code Quality:**

  - ESLint
  - Prettier
  - Husky
  - lint-staged

- **Other Tools:**
  - Git
  - GitHub

## 📂 Project Structure

```
async-chatbot-frontend/
├── src/
│   ├── components/
│   │   ├── ChatWidget.tsx
│   │   └── ChatWidget.test.tsx
│   ├── context/
│   │   └── ChatContext.tsx
│   ├── pages/
│   │   ├── Home.tsx
│   │   └── Home.test.tsx
│   ├── App.tsx
│   ├── App.test.tsx
│   ├── main.tsx
│   ├── setupTests.ts
│   └── index.css
├── .eslintrc.js
├── .gitignore
├── .husky/
│   └── pre-commit
├── .prettierrc
├── .prettierignore
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

## 🛠️ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/YutaroNegi/async-chatbot-frontend.git
cd async-chatbot-frontend
```

### 2. Install Dependencies

Ensure you have **Node.js** and **npm** installed. Then, install the project dependencies:

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory to store environment variables. Example:

```env
VITE_API_URL=http://localhost:8000
```

### 4. Run the Application

Start the development server:

```bash
npm run dev
```

Open your browser and navigate to [http://localhost:5173](http://localhost:5173) to view the application.

## 🧪 Testing

### Run Tests

Execute all tests using Vitest:

```bash
npm run test
```

### Test Coverage

- **Component Rendering:** Ensures components render correctly.

## 🔧 Code Formatting and Linting

### Prettier

Prettier is configured to maintain consistent code formatting.

- **Format All Files:**

  ```bash
  npm run format
  ```

### ESLint

ESLint is set up to enforce code quality and consistency.

### Husky and lint-staged

Pre-commit hooks are configured using Husky and lint-staged to automatically format and lint code before each commit.

- **Automatic Formatting and Linting on Commit:**

  Husky will trigger lint-staged to run Prettier and ESLint on staged files.

## 📑 Scripts

- **Start Development Server:**

  ```bash
  npm run dev
  ```

- **Build for Production:**

  ```bash
  npm run build
  ```

- **Preview Production Build:**

  ```bash
  npm run preview
  ```

- **Run Tests:**

  ```bash
  npm run test
  ```

- **Format Code:**

  ```bash
  npm run format
  ```

## 🔗 Integration with Backend API

This frontend application is designed to integrate seamlessly with a backend API developed using **Python** and **FastAPI**. Ensure the backend is running and accessible at the URL specified in the `.env` file (`VITE_API_URL`).

### API Endpoints

- **Send Message:** `POST /messages/`
- **Edit Message:** `PUT /messages/{id_message}`
- **Delete Message:** `DELETE /messages/{id_message}`
- **List Messages:** `GET /messages/`

---

## 🛠️ Setup Instructions

For detailed setup instructions, refer to the sections above.

---

## 📚 Resources

- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [Vite Documentation](https://vitejs.dev/guide/)
- [Vitest Documentation](https://vitest.dev/)
- [Prettier Documentation](https://prettier.io/docs/en/index.html)
- [ESLint Documentation](https://eslint.org/docs/user-guide/getting-started)
- [Husky Documentation](https://typicode.github.io/husky/#/)
- [lint-staged Documentation](https://github.com/okonet/lint-staged)
