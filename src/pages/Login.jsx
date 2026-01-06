import { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { FaYoutube } from "react-icons/fa";
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
      <div className="flex items-center justify-center h-[calc(100vh-56px)] bg-[#0f0f0f]">
        <div className="w-12 h-12 border-4 border-white/20 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-56px)] bg-[#0f0f0f] px-4">
      <div className="w-full max-w-[450px]">
        {/* Card */}
        <div className="bg-[#0f0f0f] border border-white/20 rounded-lg p-10">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-2">
            <FaYoutube className="text-red-600 text-4xl" />
          </div>

          {/* Title */}
          <h1 className="text-white text-2xl text-center mb-1">
            {isSignUp ? "Create account" : "Sign in"}
          </h1>
          <p className="text-white/70 text-base text-center mb-8">
            {isSignUp ? "to continue to YouTube" : "to continue to YouTube"}
          </p>

          {/* Google Sign In */}
          <button
            onClick={handleGoogleSignIn}
            disabled={formLoading}
            className="w-full flex items-center justify-center gap-3 bg-[#0f0f0f] border border-white/40 text-white font-medium py-3 px-4 rounded-full hover:bg-white/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-6"
          >
            <FcGoogle className="text-xl" />
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-white/20"></div>
            <span className="text-white/50 text-sm">or</span>
            <div className="flex-1 h-px bg-white/20"></div>
          </div>

          {/* Email Form */}
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            {/* Display Name (Sign Up only) */}
            {isSignUp && (
              <div>
                <label className="block text-white/70 text-sm mb-1.5">Name</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Enter your name"
                  required={isSignUp}
                  className="w-full bg-[#0f0f0f] border border-white/40 rounded-md py-3 px-4 text-white placeholder-white/40 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-white/70 text-sm mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full bg-[#0f0f0f] border border-white/40 rounded-md py-3 px-4 text-white placeholder-white/40 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-white/70 text-sm mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  minLength={6}
                  className="w-full bg-[#0f0f0f] border border-white/40 rounded-md py-3 px-4 pr-12 text-white placeholder-white/40 focus:outline-none focus:border-blue-500 transition-colors"
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
              {!isSignUp && (
                <button
                  type="button"
                  className="text-blue-400 text-sm font-medium mt-2 hover:text-blue-300"
                >
                  Forgot password?
                </button>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={toggleMode}
                className="text-blue-400 text-sm font-medium hover:text-blue-300"
              >
                {isSignUp ? "Sign in instead" : "Create account"}
              </button>
              <button
                type="submit"
                disabled={formLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {formLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  "Next"
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-6 px-2">
          <select className="bg-transparent text-white/50 text-sm border border-white/20 rounded px-2 py-1">
            <option>English (United States)</option>
            <option>Français (France)</option>
          </select>
          <div className="flex gap-4 text-white/50 text-xs">
            <a href="#" className="hover:text-white">Help</a>
            <a href="#" className="hover:text-white">Privacy</a>
            <a href="#" className="hover:text-white">Terms</a>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link
            to="/"
            className="text-white/50 hover:text-white text-sm transition-colors"
          >
            ← Back to YouTube
          </Link>
        </div>
      </div>
    </div>
  );
}
