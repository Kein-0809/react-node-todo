import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import TaskPage from './pages/TaskPage';
import { AuthProvider } from './contexts/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    // エラーバウンダリでアプリケーション全体をラップします
    <ErrorBoundary>
      {/* 認証プロバイダーでアプリケーション全体をラップします */}
      <AuthProvider>
        {/* React Routerでルーティングを設定します */} 
        <Router>
          {/* 画面全体の最小高さを設定し、背景色をグレーにします */}
          <div className="min-h-screen bg-gray-100">
            {/* ヘッダーコンポーネントを表示します */}
            <Header />
            {/* メインコンテンツを表示するコンテナを設定します */}
            <main className="container mx-auto mt-4 p-4">
              {/* ルートを定義します */}
              <Routes>
                {/* ホームページのルートを定義します */}
                <Route path="/" element={<HomePage />} />
                {/* ログインページのルートを定義します */}
                <Route path="/login" element={<LoginPage />} />
                {/* サインアップページのルートを定義します */}
                <Route path="/signup" element={<SignupPage />} />
                {/* タスクページのルートを定義し、認証が必要な場合はPrivateRouteでラップします */}
                <Route 
                  path="/tasks" 
                  element={
                    <PrivateRoute>
                      <TaskPage />
                    </PrivateRoute>
                  } 
                />
              </Routes>
            </main>
          </div>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
