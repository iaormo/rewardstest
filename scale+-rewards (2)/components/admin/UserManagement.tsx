import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useLoyalty } from '../../hooks/useLoyalty';
import { User } from '../../types';
import Modal from '../Modal';
import { PencilIcon, StarIcon, UserCircleIcon, UserGroupIcon, QrCodeIcon, CheckIcon, AlertTriangleIcon } from '../icons/Icons'; 
import UserQRCodeModal from './UserQRCodeModal';
import UserProfileModal from './UserProfileModal'; // New import

const EditUserPointsModal: React.FC<{
  user: User;
  onClose: () => void;
  onSave: (userId: string, newPoints: number) => void;
}> = ({ user, onClose, onSave }) => {
  const [points, setPoints] = useState(user.points.toString());
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const numPoints = parseInt(points, 10);
    if (!isNaN(numPoints) && numPoints >= 0) {
      onSave(user.id, numPoints);
      onClose();
    } else {
      setError("Please enter a valid non-negative number for points.");
    }
  };

  return (
    <Modal title={`Edit Points for ${user.name}`} onClose={onClose} size="sm">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="userPoints" className="block text-sm font-medium text-neutral-700 mb-1">
            Points
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <StarIcon className="h-5 w-5 text-white" aria-hidden="true" />
            </div>
            <input
              type="number"
              name="userPoints"
              id="userPoints"
              className="appearance-none focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-neutral-300 rounded-md py-2.5 bg-neutral-700 text-white"
              value={points}
              onChange={(e) => setPoints(e.target.value)}
              min="0"
              required
              aria-describedby={error ? "points-error" : undefined}
            />
          </div>
          {error && <p id="points-error" className="mt-2 text-sm text-red-600">{error}</p>}
        </div>
        <div className="flex justify-end space-x-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 transition font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg shadow hover:shadow-md transition font-medium"
          >
            Save Changes
          </button>
        </div>
      </form>
    </Modal>
  );
};

interface UserManagementProps {
  scannedUserId: string | null;
  clearScannedUserId: () => void;
}

const UserManagement: React.FC<UserManagementProps> = ({ scannedUserId, clearScannedUserId }) => {
  const { users, updateUserPoints } = useAuth();
  const { getTierById } = useLoyalty();
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showingQRUser, setShowingQRUser] = useState<User | null>(null);
  const [viewingProfileUser, setViewingProfileUser] = useState<User | null>(null); // New state for profile modal
  const [searchTerm, setSearchTerm] = useState('');
  const [scanFeedback, setScanFeedback] = useState<{type: 'success' | 'error', message: string} | null>(null);

  useEffect(() => {
    if (scannedUserId) {
      const foundUser = users.find(user => user.id === scannedUserId);
      if (foundUser) {
        setSearchTerm(foundUser.name); 
        // Optionally, directly open profile or edit modal upon scan
        // setViewingProfileUser(foundUser); 
        // setEditingUser(foundUser);
        setScanFeedback({type: 'success', message: `Displaying details for scanned user: ${foundUser.name}.`});
      } else {
        setScanFeedback({type: 'error', message: `Scanned User ID "${scannedUserId}" not found.`});
      }
      clearScannedUserId(); 
      const timer = setTimeout(() => setScanFeedback(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [scannedUserId, users, clearScannedUserId]);


  const handleSavePoints = (userId: string, newPoints: number) => {
    updateUserPoints(userId, newPoints);
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.id === searchTerm 
  );

  return (
    <section aria-labelledby="user-management-heading">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-5 gap-4">
        <h3 id="user-management-heading" className="text-xl sm:text-2xl font-semibold text-neutral-700">Manage Users ({filteredUsers.length})</h3>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <input 
            type="text"
            placeholder="Search users by name, email, or ID..."
            className="px-4 py-2 border border-neutral-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary sm:text-sm w-full sm:flex-grow max-w-xs"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
      </div>

      {scanFeedback && (
        <div className={`p-3 mb-4 rounded-md text-sm flex items-center ${scanFeedback.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {scanFeedback.type === 'success' ? <CheckIcon className="w-5 h-5 mr-2" /> : <AlertTriangleIcon className="w-5 h-5 mr-2" />}
          {scanFeedback.message}
           <button onClick={() => setScanFeedback(null)} className="ml-auto text-lg font-semibold leading-none opacity-70 hover:opacity-100">&times;</button>
        </div>
      )}

      <div className="overflow-x-auto bg-white rounded-lg shadow-md border border-neutral-200">
        {filteredUsers.length > 0 ? (
        <table className="min-w-full table-auto">
          <thead className="bg-neutral-100 border-b border-neutral-300">
            <tr>
              <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-neutral-700 sm:pl-6">User</th>
              <th scope="col" className="hidden px-3 py-3.5 text-left text-sm font-semibold text-neutral-700 lg:table-cell">Email</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-neutral-700">Points</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-neutral-700">Tier</th>
              <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-neutral-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 bg-white">
            {filteredUsers.map((user) => {
              const tier = getTierById(user.tierId);
              return (
                <tr key={user.id} className={`hover:bg-neutral-50/70 transition-colors duration-150 ${editingUser?.id === user.id || viewingProfileUser?.id === user.id ? 'bg-primary-light/10' : ''}`}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 mr-3 bg-neutral-200 rounded-full flex items-center justify-center">
                        <UserCircleIcon className="h-6 w-6 text-neutral-500" />
                      </div>
                      <div>
                        <div className="font-medium text-neutral-900">{user.name}</div>
                        <div className="text-neutral-500 lg:hidden">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="hidden whitespace-nowrap px-3 py-4 text-sm text-neutral-500 lg:table-cell">{user.email}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-neutral-500">{user.points.toLocaleString()}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-neutral-500">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium shadow-sm
                                      ${tier?.id === 'platinum' ? 'bg-blue-100 text-blue-700 ring-1 ring-inset ring-blue-200' :
                                        tier?.id === 'gold' ? 'bg-yellow-100 text-yellow-800 ring-1 ring-inset ring-yellow-200' :
                                        tier?.id === 'silver' ? 'bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-200' :
                                        'bg-orange-100 text-orange-700 ring-1 ring-inset ring-orange-200'}`}>
                       {tier?.icon && React.cloneElement(tier.icon, {className: "w-3 h-3 mr-1.5"})}
                       {tier ? tier.name : 'N/A'}
                    </span>
                  </td>
                  <td className="whitespace-nowrap py-4 pl-3 pr-4 text-center text-sm font-medium sm:pr-6">
                    <div className="flex items-center justify-center space-x-1 sm:space-x-2">
                        <button
                            onClick={() => setViewingProfileUser(user)}
                            className="text-neutral-500 hover:text-primary transition-colors p-1.5 rounded-md hover:bg-primary-light/10"
                            aria-label={`View profile for ${user.name}`}
                            title="View Profile"
                        >
                            <UserCircleIcon className="w-5 h-5"/>
                        </button>
                        <button
                            onClick={() => setShowingQRUser(user)}
                            className="text-neutral-500 hover:text-primary transition-colors p-1.5 rounded-md hover:bg-primary-light/10"
                            aria-label={`Show QR Code for ${user.name}`}
                            title="Show QR Code"
                        >
                            <QrCodeIcon className="w-5 h-5"/>
                        </button>
                        <button
                            onClick={() => setEditingUser(user)}
                            className="text-primary hover:text-primary-dark transition-colors p-1.5 rounded hover:bg-primary-light/20"
                            aria-label={`Edit points for ${user.name}`}
                            title="Edit Points"
                        >
                            <PencilIcon className="w-5 h-5" />
                        </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        ) : (
          <div className="text-center py-12">
            <UserGroupIcon className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
            <p className="text-xl text-neutral-500 font-medium">No Users Found</p>
            <p className="text-neutral-400 mt-1">
              {searchTerm ? "No users match your search criteria." : "No users in the system."}
            </p>
          </div>
        )}
      </div>
      {editingUser && (
        <EditUserPointsModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSave={handleSavePoints}
        />
      )}
      {showingQRUser && (
        <UserQRCodeModal
            user={showingQRUser}
            onClose={() => setShowingQRUser(null)}
        />
      )}
      {viewingProfileUser && (
        <UserProfileModal
          user={viewingProfileUser}
          onClose={() => setViewingProfileUser(null)}
        />
      )}
    </section>
  );
};

export default UserManagement;