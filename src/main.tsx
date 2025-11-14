import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Amplify } from "aws-amplify";
import { Authenticator, CheckboxField, SelectField, ThemeProvider, useAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import outputs from "../amplify_outputs.json";
import { I18n } from "aws-amplify/utils";
// import { generateClient } from "aws-amplify/api";
// import { Schema } from "$amplify/data/resource.ts";


Amplify.configure(outputs);
// const client = generateClient<Schema>();

const myTheme = {
  name: 'my-theme',
  tokens: {
    colors: {
      brand: { primary: { 10: '#ff0000' } }
    }
  }
};

I18n.putVocabulariesForLanguage('ja', {
  'Sign In': 'サインイン', // Tab header
  'Sign in': 'サインイン', // Button label
  'Sign in to your account': 'お帰りなさい！',
  'Create Account': 'アカウント作成',
  Username: 'ユーザー名を入力してください', // Username label
  Password: 'パスワードを入力してください', // Password label
  'Forgot your password?': 'パスワードをお忘れですか？',
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={myTheme}>
      <Authenticator
        components={{
          SignIn: {
            Header: () => <h2>カスタムサインインヘッダー</h2>
          },
          SignUp: {
            FormFields() {
              const { validationErrors } = useAuthenticator();
              return (
                <>
                  <Authenticator.SignUp.FormFields />
                  <SelectField
                    label="ロール"
                    name="role"
                    placeholder="ロールを選択してください"
                    required
                    onChange={e => localStorage.setItem('signup_role', e.target.value)}
                  >
                    <option value="USER">一般ユーザー</option>
                    <option value="ADMIN">管理者</option>
                    <option value="OWNER">オーナー</option>
                    <option value="SUPER_ADMIN">スーパーアドミン</option>
                  </SelectField>
                  <CheckboxField
                    errorMessage={validationErrors.acknowledgement as string}
                    hasError={!!validationErrors.acknowledgement}
                    name="acknowledgement"
                    value="yes"
                    label={<span><a href="#">利用規約</a>に同意する</span>}
                  />
                </>
              );
            },
          }
        }}
      >
        {({ signOut, user }) => (
          <App 
            signOut={signOut}
            user={user}
            // onSignUp={async (role: string) => {
            //   const userId = user?.username;
            //   if (userId && role) {
            //     await client.mutations.addUserToGroup({
            //       userId,
            //       groupName: role
            //     });
            //   }
            // }}
          />
        )}
      </Authenticator>
    </ThemeProvider>
  </React.StrictMode>
);
