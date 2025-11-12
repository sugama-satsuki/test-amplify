import { useEffect, useState } from "react"
import { fetchAuthSession } from "aws-amplify/auth"


export function useGroups() {
  const [groups, setGroups] = useState<string[] | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        // 現在の認証セッション情報を取得
        const session = await fetchAuthSession()
        // IDトークンを取得
        const id = session.tokens?.idToken
        // トークンのpayloadからグループ情報を取得
        const list = (id?.payload?.["cognito:groups"] as string[] | undefined) ?? []
        // マウント中ならグループ情報をセット
        if (mounted) { setGroups(list) }
      } finally {
        // マウント中ならローディング終了
        if (mounted) { setLoading(false) }
      }
    })()
    // クリーンアップ: アンマウント時にフラグをfalseに
    return () => {
      mounted = false
    }
  }, [])

  // 指定したグループに所属しているか判定する関数
  const isIn = (...required: string[]) => (groups ?? []).some((g) => required.includes(g));

  // グループ一覧、判定関数、ローディング状態を返す
  return { groups, isIn, loading }
}
