import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Hand, Lock } from 'lucide-react';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';

export function Onboarding() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAccept = async () => {
        if (!user) return;
        setIsSubmitting(true);

        try {
            // Create user profile on Firestore with 'pledgeAccepted' flag
            await setDoc(doc(db, 'users', user.uid), {
                uid: user.uid,
                email: user.email,
                pledgeAccepted: true,
                pledgeAcceptedAt: serverTimestamp(),
                createdAt: serverTimestamp(),
            }, { merge: true }); // Merge to avoid overwriting if exists

            navigate('/');
        } catch (error) {
            console.error("Error creating user profile:", error);
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-12">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-teal-700 px-6 py-8 text-white text-center">
                    <h1 className="text-2xl font-bold mb-2">The Dignity Pledge</h1>
                    <p className="text-teal-100">Before we begin, let's align on our purpose.</p>
                </div>

                <div className="p-8 space-y-8">
                    <div className="flex gap-4">
                        <div className="flex-shrink-0">
                            <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600">
                                <Heart size={20} />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">Understanding, Not Compliance</h3>
                            <p className="text-gray-600 mt-1">
                                We use this tool to understand the <i>why</i> behind behaviors, not to enforce rigid compliance or extinguish "autistic" traits (like stimming) that are harmless.
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-shrink-0">
                            <div className="w-10 h-10 bg-rose-50 rounded-full flex items-center justify-center text-rose-600">
                                <Lock size={20} />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">Privacy & Ownership</h3>
                            <p className="text-gray-600 mt-1">
                                This is <i>your</i> family's data. School staff see only what you explicitly share, and you can revoke access at any time. We are anti-surveillance.
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-shrink-0">
                            <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center text-amber-600">
                                <Hand size={20} />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">Support, Not Medical Advice</h3>
                            <p className="text-gray-600 mt-1">
                                Giovanna is an educational resource. We provide strategies and organization, not medical diagnoses or crisis intervention.
                            </p>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-gray-100">
                        <button
                            onClick={handleAccept}
                            disabled={isSubmitting}
                            className="w-full flex items-center justify-center px-8 py-4 bg-teal-700 text-white font-bold rounded-xl hover:bg-teal-800 transition-colors disabled:opacity-50"
                        >
                            {isSubmitting ? 'Setting up...' : 'I Agree & Commit'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
