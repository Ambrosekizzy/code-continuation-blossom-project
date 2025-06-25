
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useToast } from '../hooks/use-toast';

const Auth = () => {
  const { user, signIn, signUp, signInWithGoogle, resetPassword } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [resetMode, setResetMode] = useState(false);

  const [signInData, setSignInData] = useState({
    emailOrUsername: '',
    password: '',
  });

  const [signUpData, setSignUpData] = useState({
    email: '',
    password: '',
    username: '',
  });

  const [resetEmail, setResetEmail] = useState('');

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await signIn(signInData.emailOrUsername, signInData.password);
    
    if (error) {
      toast({
        title: "Error signing in",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Welcome back!",
        description: "You have been signed in successfully.",
      });
    }
    
    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await signUp(signUpData.email, signUpData.password, signUpData.username);
    
    if (error) {
      toast({
        title: "Error signing up",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Account created!",
        description: "Please check your email to verify your account.",
      });
    }
    
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    
    try {
      const { error } = await signInWithGoogle();
      
      if (error) {
        console.error('Google sign-in error:', error);
        toast({
          title: "Google Sign-In Not Available",
          description: "Google authentication is not configured. Please use email/password to sign in.",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error('Google sign-in error:', err);
      toast({
        title: "Google Sign-In Error",
        description: "Unable to sign in with Google. Please try email/password instead.",
        variant: "destructive",
      });
    }
    
    setLoading(false);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await resetPassword(resetEmail);
    
    if (error) {
      toast({
        title: "Error resetting password",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Password reset email sent",
        description: "Please check your email for reset instructions.",
      });
      setResetMode(false);
    }
    
    setLoading(false);
  };

  if (resetMode) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Reset Password</CardTitle>
            <CardDescription className="text-gray-400">
              Enter your email to receive a password reset link
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <Label htmlFor="reset-email" className="text-white">Email</Label>
                <Input
                  id="reset-email"
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  required
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={loading} className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black">
                  {loading ? 'Sending...' : 'Send Reset Email'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setResetMode(false)}
                  className="border-gray-600 text-white hover:bg-gray-700"
                >
                  Back
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white text-center">Welcome to FilmCave</CardTitle>
          <CardDescription className="text-gray-400 text-center">
            Sign in to your account or create a new one
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-700">
              <TabsTrigger value="signin" className="text-white data-[state=active]:bg-yellow-500 data-[state=active]:text-black">
                Sign In
              </TabsTrigger>
              <TabsTrigger value="signup" className="text-white data-[state=active]:bg-yellow-500 data-[state=active]:text-black">
                Sign Up
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin" className="space-y-4">
              <Button 
                onClick={handleGoogleSignIn} 
                disabled={loading}
                className="w-full bg-white text-black hover:bg-gray-100"
              >
                Continue with Google
              </Button>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-600" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-gray-800 px-2 text-gray-400">Or continue with</span>
                </div>
              </div>
              
              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <Label htmlFor="signin-email" className="text-white">Email or Username</Label>
                  <Input
                    id="signin-email"
                    type="text"
                    value={signInData.emailOrUsername}
                    onChange={(e) => setSignInData({...signInData, emailOrUsername: e.target.value})}
                    required
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="signin-password" className="text-white">Password</Label>
                  <Input
                    id="signin-password"
                    type="password"
                    value={signInData.password}
                    onChange={(e) => setSignInData({...signInData, password: e.target.value})}
                    required
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <Button type="submit" disabled={loading} className="w-full bg-yellow-500 hover:bg-yellow-600 text-black">
                  {loading ? 'Signing In...' : 'Sign In'}
                </Button>
                <Button 
                  type="button" 
                  variant="link" 
                  onClick={() => setResetMode(true)}
                  className="w-full text-yellow-500 hover:text-yellow-400"
                >
                  Forgot your password?
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup" className="space-y-4">
              <Button 
                onClick={handleGoogleSignIn} 
                disabled={loading}
                className="w-full bg-white text-black hover:bg-gray-100"
              >
                Continue with Google
              </Button>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-600" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-gray-800 px-2 text-gray-400">Or continue with</span>
                </div>
              </div>
              
              <form onSubmit={handleSignUp} className="space-y-4">
                <div>
                  <Label htmlFor="signup-username" className="text-white">Username</Label>
                  <Input
                    id="signup-username"
                    type="text"
                    value={signUpData.username}
                    onChange={(e) => setSignUpData({...signUpData, username: e.target.value})}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="signup-email" className="text-white">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    value={signUpData.email}
                    onChange={(e) => setSignUpData({...signUpData, email: e.target.value})}
                    required
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="signup-password" className="text-white">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    value={signUpData.password}
                    onChange={(e) => setSignUpData({...signUpData, password: e.target.value})}
                    required
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <Button type="submit" disabled={loading} className="w-full bg-yellow-500 hover:bg-yellow-600 text-black">
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
