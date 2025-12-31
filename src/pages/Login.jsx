import { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { MdEmail, MdLock, MdPerson } from "react-icons/md";
import { Context } from "../context/contextApi";

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  const { isAuthenticated, googleSignIn, emailSignIn, emailSignUp, authLoading } =
    useContext(Context);

  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleGoogleSignIn = async () => {
    setFormLoading(true);
    const result = await googleSignIn();
    if (result.success) {
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    }
    setFormLoading(false);
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    let result;
    if (isSignUp) {
      result = await emailSignUp(email, password, displayName);
    } else {
      result = await emailSignIn(email, password);
    }

    if (result.success) {
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    }
    setFormLoading(false);
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setEmail("");
    setPassword("");
    setDisplayName("");
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-56px)] bg-black">
        <div className="w-12 h-12 border-4 border-white/20 border-t-red-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-56px)] bg-black px-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <svg
              className="w-10 h-10 text-red-600"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
            </svg>
            <h1 className="text-2xl font-bold text-white">YouTube Clone</h1>
          </div>
          <p className="text-white/70">
            {isSignUp ? "Create your account" : "Sign in to continue"}
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          {/* Google Sign In */}
          <button
            onClick={handleGoogleSignIn}
            disabled={formLoading}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-gray-800 font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FcGoogle className="text-xl" />
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-white/20"></div>
            <span className="text-white/50 text-sm">or</span>
            <div className="flex-1 h-px bg-white/20"></div>
          </div>

          {/* Email Form */}
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            {/* Display Name (Sign Up only) */}
            {isSignUp && (
              <div className="relative">
                <MdPerson className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 text-xl" />
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Display Name"
                  required={isSignUp}
                  className="w-full bg-white/10 border border-white/20 rounded-lg py-3 pl-10 pr-4 text-white placeholder-white/50 focus:outline-none focus:border-red-500 transition-colors"
                />
              </div>
            )}

            {/* Email */}
            <div className="relative">
              <MdEmail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 text-xl" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                required
                className="w-full bg-white/10 border border-white/20 rounded-lg py-3 pl-10 pr-4 text-white placeholder-white/50 focus:outline-none focus:border-red-500 transition-colors"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <MdLock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 text-xl" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                minLength={6}
                className="w-full bg-white/10 border border-white/20 rounded-lg py-3 pl-10 pr-12 text-white placeholder-white/50 focus:outline-none focus:border-red-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
              >
                {showPassword ? (
                  <IoMdEyeOff className="text-xl" />
                ) : (
                  <IoMdEye className="text-xl" />
                )}
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={formLoading}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {formLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : isSignUp ? (
                "Create Account"
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Toggle Mode */}
          <p className="text-center text-white/70 mt-6">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              onClick={toggleMode}
              className="text-red-500 hover:text-red-400 font-medium transition-colors"
            >
              {isSignUp ? "Sign In" : "Sign Up"}
            </button>
          </p>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link
            to="/"
            className="text-white/50 hover:text-white text-sm transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
