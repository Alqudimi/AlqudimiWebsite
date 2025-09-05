export function isAuthenticated(): boolean {
  const token = localStorage.getItem("admin_token");
  return !!token;
}

export function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem("admin_token");
  return token ? { "Authorization": `Bearer ${token}` } : {};
}

export function getAdminUser() {
  const userStr = localStorage.getItem("admin_user");
  try {
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
}

export function logout() {
  localStorage.removeItem("admin_token");
  localStorage.removeItem("admin_user");
}
