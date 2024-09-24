import React, { createContext, useState, useEffect } from 'react';

interface AuthContextType {
  // ユーザーが認証されているかどうかを示す
  isAuthenticated: boolean;
  // ログインメソッド (tokenを引数に取って認証を行う関数)
  login: (token: string) => void;
  // ログアウトメソッド (認証を解除する関数)
  logout: () => void;
}

// AuthContextを作成し、初期値を設定します
export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
});

// AuthProviderコンポーネントを定義します
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 認証状態を管理するためのステートを定義します
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // コンポーネントがマウントされたときに実行されるエフェクトを定義します
  useEffect(() => {
    // localStorageは、ブラウザのWeb Storage APIの一部で、キーと値のペアを保存するためのストレージです。データはブラウザを閉じても保持されます。
    // getItemメソッドは、指定されたキー（この場合は'token'）に対応する値を取得します
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  // ログイン関数を定義します
  const login = (token: string) => {
    // setItemメソッドは、ブラウザのlocalStorageに指定されたキーと値のペアを保存します
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
  };

  // ログアウト関数を定義します
  const logout = () => {
    // removeItemメソッドは、ブラウザのlocalStorageから指定されたキー（この場合は'token'）に対応する値を削除します
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  // AuthContext.Providerで子コンポーネントをラップし、認証状態と関数を提供します
  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};