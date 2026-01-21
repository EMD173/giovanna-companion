import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ShieldCheck, ArrowRight } from 'lucide-react';

export function Signup() {
    const { signInWithGoogle, user } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    useEffect(() => {
        if (user) {
            navigate('/onboarding');
        }
    }, [user, navigate]);

    const handleGoogleSignIn = async () => {
        try {
            setError('');
            await signInWithGoogle();
        } catch (err) {
            setError('Failed to sign in. Please try again.');
        }
    };

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center">
                <div>
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-teal-100">
                        <ShieldCheck className="h-6 w-6 text-teal-600" />
                    </div>
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                        Welcome to Giovanna
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        A safe, private space to support your child's journey.
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">
                        {error}
                    </div>
                )}

                <div className="space-y-4">
                    <button
                        onClick={handleGoogleSignIn}
                        className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 shadow-sm transition-colors"
                    >
                        Sign in with Google <ArrowRight className="ml-2 h-5 w-5" />
                    </button>

                    <p className="text-xs text-slate-400 mt-4">
                        By signing in, you agree to our privacy-first principles.
                        We store the minimum data necessary and never share it without your explicit permission.
                    </p>
                </div>
            </div>
        </div>
    );
}
