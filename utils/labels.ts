const labels: NestedLocalizedString = {
  app_name: {
    en: "Student Union",
    ja: "Student Union",
  },
  rights: {
    en: '2024 Student Union. All rights reserved.',
    ja: '2024 Student Union'
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
      // If the object is a LocalizedString, return the string for the locale or fallback to English
      return obj[locale as keyof LocalizedString] || obj.en;
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
