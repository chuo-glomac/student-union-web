const labels: NestedLocalizedString = {
  app_name: {
    en: "Student Union",
    ja: "Student Union",
  },
  rights: {
    en: '2024 Student Union. All rights reserved.',
    ja: '2024 Student Union'
  },
  login: {
    title: {
      en: "- Login Page",
      ja: "ログインページ"
    },
    email_label: {
      en: "Email",
      ja: "メールアドレス"
    },
    password_label: {
      en: "Password",
      ja: "パスワード"
    },
    submit_button: {
      en: "Log In",
      ja: "ログイン"
    },
    registration_label: {
      en: "Not yet registered?",
      ja: "未登録ですか？"
    },
    registration_page: {
      en: "Create Account",
      ja: "アカウントの作成"
    },
  },
  registration: {
    title: {
      en: "- Registration Page",
      ja: "新規登録ページ"
    },
    login_label: {
      en: "Already have an account?",
      ja: "アカウントをお待ちですか？"
    },
    login_page: {
      en: "Login",
      ja: "ログインする"
    },
    user_exist: {
      en: "User exist already. Use different email to signup or login.",
      ja: "このメールアドレスはすでに登録されています。別のメールアドレスで登録をこなうか、ログインをお願いします。",
    },
    private_email_label: {
      en: "Private Email",
      ja: "個人メールアドレス"
    },
    private_email_desc: {
      en: "！DO NOT USE iCloud！<br />This email will be used after graduations. (Chuo Email is not allowed)",
      ja: "！iCloudは使用できません！<br />このメールアドレスは卒業後の連絡にも使用されます。(全学メールは使用できません）",
    },
    password_label: {
      en: "Private Email",
      ja: "個人メールアドレス"
    },
    password_desc: {
      en: "This is used to login to apps with Private Email.<br />Must contain letter, number, and be at least 8 characters.",
      ja: "個人メールアドレスと主にログイン時に必要です。<br />必ず英大文字、英小文字、数字を含んでください。"
    },
    password_confirm_label: {
      en: "Confirm Password",
      ja: "パスワード確認"
    },
    password_confirm_desc: {
      en: "Please confirm your password.",
      ja: "確認のためパスワードを再度入力してください。"
    },
    agreement_label_prefix: {
      en: "Agree to ",
      ja: ""
    },
    agreement_label: {
      en: "User Policy",
      ja: "利用規約"
    },
    agreement_label_suffix: {
      en: ".",
      ja: "に同意する。"
    },
    confirm_title: {
      en: "Confirmation Email Sent",
      ja: "メール送信完了"
    },
    confirm_text_1: {
      en: "Confirmation email has been sent to",
      ja: "以下のメールアドレスにメールを送信しました。"
    },
    confirm_text_2: {
      en: "Please continue through the email.",
      ja: "受信メールから引き続き登録をお願いいたします。"
    },
    confirm_text_3: {
      en: "* If you do not receive the email, it may have been blocked by your spam filter settings. We kindly ask you to configure your email to allow messages from @student-union.pro and then start the process again from the beginning.",
      ja: "※ メールが届かない場合は、迷惑メールの設定によりブロックされている場合がございます。お手数ですが、@student-union.pro を受信許可にご設定の上、再度最初からお手続きください。"
    },
  },
  header: {
    home: {
      en: "Home",
      ja: "ホーム",
    },
    post: {
      en: "Post",
      ja: "投稿",
    },
    profile: {
      en: "Profile",
      ja: "プロフィール",
    },
    message: {
      en: "Messages",
      ja: "メッセージ",
    },
    notification: {
      en: 'Notification',
      ja: '通知'
    },
    setting: {
      en: 'Setting',
      ja: '設定'
    }
  },
  post: {
    like: {
      en: "Like",
      ja: "いいね",
    },
    comment: {
      en: "Comment",
      ja: "コメント",
    },
    share: {
      en: "Share",
      ja: "共有する",
    },
  },
};

export type LocalizedString = {
  en: string;
  ja: string;
  zh?: string;
};

export function getLabels(locale: string) {
  const convert = (obj: NestedLocalizedString | LocalizedString): any => {
    if (isLocalizedString(obj)) {
      // If the object is a LocalizedString, use the locale value even if it's blank
      // Fallback to English only if the locale value is undefined
      return obj[locale as keyof LocalizedString] !== undefined
        ? obj[locale as keyof LocalizedString]
        : obj.en;
    }

    // If the object is a NestedLocalizedString, recursively convert its properties
    return Object.keys(obj).reduce((acc, key) => {
      acc[key] = convert(obj[key]);
      return acc;
    }, {} as Record<string, any>);
  };

  return convert(labels);
}

function isLocalizedString(
  obj: NestedLocalizedString | LocalizedString
): obj is LocalizedString {
  return typeof obj === "object" && "en" in obj;
}

type NestedLocalizedString = {
  [key: string]: LocalizedString | NestedLocalizedString;
};
