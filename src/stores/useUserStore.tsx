import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

import { removeToken } from "@/lib/cookie"
import { UserData } from "@/types/user"

type UserStoreProps = {
	user: UserData | null
	setUser: (pendaftar: UserData | null) => void
	logout: () => void
}

export const useUserStore = create<UserStoreProps>()(
	persist(
		(set) => ({
			user: null,
			setUser: (user: UserData | null) => set({ user }),
			logout: () => { 
                removeToken("renimo_token")
                set({ user: null })
            }
		}),
		{
			name: "user",
			storage: createJSONStorage(() => sessionStorage),
		},
	),
)

