export function friendlyAuthError(err) {
  const code = err?.code || "";
  if (code === "auth/user-not-found" || code === "auth/invalid-credential" || code === "auth/wrong-password") {
    return "No account found with this email and password. Please sign up first.";
  }
  if (code === "auth/invalid-email") {
    return "Please enter a valid email address.";
  }
  if (code === "auth/too-many-requests") {
    return "Too many attempts. Please wait a moment and try again.";
  }
  return err?.message || "Something went wrong. Please try again.";
}