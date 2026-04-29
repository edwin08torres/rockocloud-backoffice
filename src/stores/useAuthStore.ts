import axios from 'axios'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const API_URL = import.meta.env.VITE_API_URL

interface UserInfo {
  id: string
  email: string
  role: string
  tenantId: string
  tenantName: string
}

interface AuthState {
  token: string | null
  user: UserInfo | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true })
        try {
          const { data } = await axios.post(`${API_URL}/api/Auth/login`, {
            email,
            password,
          })

          set({
            token: data.token,
            user: {
              id: data.user?.id ?? data.id ?? data.userId ?? '',
              email: data.user?.email ?? data.email ?? email,
              role: data.user?.role ?? data.role ?? data.roles?.[0] ?? '',
              tenantId: data.user?.tenantId ?? data.tenantId ?? '',
              tenantName: data.user?.tenantName ?? data.tenantName ?? 'RockoCloud',
            },
          })
        } finally {
          set({ isLoading: false })
        }
      },

      logout: () => set({ token: null, user: null }),
    }),
    {
      name: 'rockocloud-auth',
      partialize: (state) => ({ token: state.token, user: state.user }),
    }
  )
)
