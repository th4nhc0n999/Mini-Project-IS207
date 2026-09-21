/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react"
import { getStoredPatientProfiles, savePatientProfiles } from "@/lib/mockData"

const AuthContext = createContext(null)

const MOCK_ACCOUNTS = {
  patient: {
    id: 1,
    name: "Nguyễn Văn A",
    email: "nguyenvana@gmail.com",
    phone: "0901234567",
    role: "patient",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
  },
  admin: {
    id: 99,
    name: "Quản Trị Viên MedSi",
    email: "admin@medsi.vn",
    phone: "19002805",
    role: "admin",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
  },
}

const AUTH_STORAGE_KEY = "medsi_mock_auth_user"

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem(AUTH_STORAGE_KEY)
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch {
        return MOCK_ACCOUNTS.patient
      }
    }
    return MOCK_ACCOUNTS.patient
  })

  const [patientProfiles, setPatientProfiles] = useState(() => getStoredPatientProfiles())

  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user))
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY)
    }
  }, [user])

  const login = (identifier, _password, targetRole = "patient") => {
    const isLoginAsAdmin =
      targetRole === "admin" ||
      identifier?.toLowerCase().includes("admin") ||
      identifier === "admin@medsi.vn"

    const selectedUser = isLoginAsAdmin ? MOCK_ACCOUNTS.admin : {
      ...MOCK_ACCOUNTS.patient,
      email: identifier?.includes("@") ? identifier : MOCK_ACCOUNTS.patient.email,
      phone: !identifier?.includes("@") ? identifier : MOCK_ACCOUNTS.patient.phone,
    }

    setUser(selectedUser)
    return { success: true, user: selectedUser }
  }

  const register = (userData) => {
    const newUser = {
      id: Date.now(),
      name: userData.name || "Người dùng mới",
      email: userData.email,
      phone: userData.phone,
      role: "patient",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    }
    setUser(newUser)

    const newProfile = {
      id: Date.now(),
      user_id: newUser.id,
      full_name: newUser.name,
      dob: userData.dob || "1995-01-01",
      gender: userData.gender || "male",
      phone: newUser.phone,
      relationship: "Bản thân",
      identity_card: "",
      address: userData.address || "",
    }
    const updatedProfiles = [...patientProfiles, newProfile]
    setPatientProfiles(updatedProfiles)
    savePatientProfiles(updatedProfiles)

    return { success: true, user: newUser }
  }

  const logout = () => {
    setUser(null)
  }

  const switchRole = (role) => {
    if (role === "admin") {
      setUser(MOCK_ACCOUNTS.admin)
    } else if (role === "patient") {
      setUser(MOCK_ACCOUNTS.patient)
    } else {
      setUser(null)
    }
  }

  const updateUserProfile = (updatedData) => {
    const updated = { ...user, ...updatedData }
    setUser(updated)
    return updated
  }

  const addPatientProfile = (profileData) => {
    const newProfile = {
      ...profileData,
      id: profileData.id || Date.now(),
      user_id: user?.id || 1,
    }
    const updated = [...patientProfiles, newProfile]
    setPatientProfiles(updated)
    savePatientProfiles(updated)
    return newProfile
  }

  const updatePatientProfile = (profileId, profileData) => {
    const updated = patientProfiles.map((p) => {
      if (p.id === profileId) {
        return { ...p, ...profileData }
      }
      return p
    })
    setPatientProfiles(updated)
    savePatientProfiles(updated)
    return updated
  }

  const deletePatientProfile = (profileId) => {
    const updated = patientProfiles.filter((p) => p.id !== profileId)
    setPatientProfiles(updated)
    savePatientProfiles(updated)
    return updated
  }

  const role = user ? user.role : "guest"
  const isAuthenticated = Boolean(user)
  const isPatient = role === "patient"
  const isAdmin = role === "admin"
  const isGuest = role === "guest"

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated,
        isPatient,
        isAdmin,
        isGuest,
        login,
        register,
        logout,
        switchRole,
        patientProfiles,
        addPatientProfile,
        updatePatientProfile,
        deletePatientProfile,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
