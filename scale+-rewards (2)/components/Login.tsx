
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { LoginIcon as DoorIcon, UserPlusIcon } from './icons/Icons'; // Renamed for context
import RegisterModal from './RegisterModal';
import { User } from '../types';

const Login: React.FC = () => {
  const { users, login } = useAuth();
  const [selectedUserId, setSelectedUserId] = useState<string>(users.length > 0 ? users[0].id : '');
  const [isLoading, setIsLoading] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUserId) {
      setIsLoading(true);
      // Simulate a short delay for UX, remove in production if login is instant
      setTimeout(() => {
        login(selectedUserId);
        setIsLoading(false);
      }, 500);
    }
  };
  
  const handleRegisterSuccess = (newUser: User) => {
    setShowRegisterModal(false);
    login(newUser.id); // Automatically log in the new user
  };


  if (users.length === 0 && !showRegisterModal) { // Don't show "No users" if register modal might appear
    return (
        <div className="bg-white p-8 sm:p-10 rounded-xl shadow-2xl w-full max-w-md text-center">
            <DoorIcon className="w-16 h-16 text-primary mx-auto mb-4"/>
            <h2 className="text-2xl font-bold text-neutral-800 mb-6">No Users Available for Login</h2>
            <p className="text-neutral-600">Please ensure users are configured or create a new account.</p>
             <button
                type="button"
                onClick={() => setShowRegisterModal(true)}
                className="mt-6 w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-secondary hover:bg-secondary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-light transition duration-150"
              >
                <UserPlusIcon className="w-5 h-5 mr-2" />
                Create New Account
            </button>
             {showRegisterModal && (
                <RegisterModal 
                    onClose={() => setShowRegisterModal(false)}
                    onRegisterSuccess={handleRegisterSuccess}
                />
            )}
        </div>
    );
  }

  return (
    <div className="bg-white p-8 sm:p-10 rounded-xl shadow-2xl w-full max-w-lg transform transition-all duration-300">
      <div className="text-center mb-8">
        <DoorIcon className="w-16 h-16 text-primary mx-auto mb-4"/>
        <h2 className="text-3xl font-bold text-neutral-800">Welcome Back!</h2>
        <p className="text-neutral-600 mt-2">Select your profile or create a new account.</p>
      </div>
      <form onSubmit={handleLogin} className="space-y-6">
        <div>
          <label htmlFor="user-select" className="block text-sm font-medium text-neutral-700 mb-1.5">
            Choose your account
          </label>
          <select
            id="user-select"
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-3 text-base rounded-lg shadow-sm bg-primary text-white border-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary-light sm:text-sm disabled:bg-primary/70 disabled:text-white/90 disabled:border-primary-dark/70 disabled:cursor-not-allowed"
            disabled={isLoading || users.length === 0}
          >
            {users.map((user) => (
              <option key={user.id} value={user.id} className="bg-white text-neutral-900">
                {user.name} ({user.email})
              </option>
            ))}
             {users.length === 0 && <option disabled value="">No existing users</option>}
          </select>
        </div>
        <button
          type="submit"
          disabled={isLoading || !selectedUserId || users.length === 0}
          className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-base font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-light transition duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <>
              <DoorIcon className="w-5 h-5 mr-2"/>
              Sign In
            </>
          )}
        </button>
      </form>
      <div className="mt-6 pt-6 border-t border-neutral-200 text-center">
        <p className="text-sm text-neutral-600">
          New here?
          <button
            type="button"
            onClick={() => setShowRegisterModal(true)}
            className="ml-1.5 font-medium text-secondary hover:text-secondary-dark hover:underline focus:outline-none focus:ring-2 focus:ring-secondary-light rounded"
          >
            Create an account
          </button>
        </p>
      </div>

      {showRegisterModal && (
        <RegisterModal 
          onClose={() => setShowRegisterModal(false)}
          onRegisterSuccess={handleRegisterSuccess}
        />
      )}
    </div>
  );
};

export default Login;
