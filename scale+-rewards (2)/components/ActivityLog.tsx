import React from 'react';
import { useLoyalty } from '../hooks/useLoyalty';
import { Transaction } from '../types';
import { ListIcon, StarIcon, ArrowPathIcon, ArrowUpCircleIcon, ArrowDownCircleIcon } from './icons/Icons'; // Added specific icons

const ActivityLog: React.FC = () => {
  const { getTransactionsForCurrentUser } = useLoyalty();
  const transactions = getTransactionsForCurrentUser();
  const [visibleCount, setVisibleCount] = React.useState(10);

  const loadMore = () => {
    setVisibleCount(prevCount => prevCount + 10);
  };

  const TransactionRow: React.FC<{ tx: Transaction, index: number }> = ({ tx, index }) => (
    <tr className={`border-b border-neutral-200 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-neutral-50'} hover:bg-neutral-100`}>
      <td className="py-3.5 px-4 text-sm text-neutral-500 whitespace-nowrap">
        {new Date(tx.timestamp).toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' })}
        <span className="block text-xs text-neutral-400">
          {new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </td>
      <td className="py-3.5 px-4 text-neutral-700 text-sm">
        <div className="flex items-center">
           {tx.type === 'earn' ? 
            <ArrowUpCircleIcon className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" /> : 
            <ArrowDownCircleIcon className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" />
          }
          {tx.description}
        </div>
      </td>
      <td className={`py-3.5 px-4 font-semibold text-sm whitespace-nowrap ${tx.type === 'earn' ? 'text-green-600' : 'text-red-500'}`}>
        {tx.type === 'earn' ? '+' : '-'}{tx.points.toLocaleString()}
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-6 rounded-xl shadow-xl">
      <div className="flex items-center mb-6 pb-4 border-b border-neutral-200">
        <ListIcon className="w-8 h-8 text-primary mr-3" />
        <h2 className="text-2xl sm:text-3xl font-semibold text-neutral-800">Transaction History</h2>
      </div>
      
      {transactions.length > 0 ? (
        <>
          <div className="overflow-x-auto rounded-lg border border-neutral-200">
            <table className="min-w-full table-auto">
              <thead className="bg-neutral-100 border-b border-neutral-300">
                <tr>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">Date & Time</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">Description</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">Points</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {transactions.slice(0, visibleCount).map((tx, index) => (
                  <TransactionRow key={tx.id} tx={tx} index={index} />
                ))}
              </tbody>
            </table>
          </div>
          {visibleCount < transactions.length && (
            <div className="mt-6 text-center">
              <button
                onClick={loadMore}
                className="bg-primary hover:bg-primary-dark text-white font-semibold py-2.5 px-6 rounded-lg shadow-md hover:shadow-lg transition duration-150 flex items-center mx-auto"
              >
                <ArrowPathIcon className="w-5 h-5 mr-2" />
                Load More Transactions
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <ListIcon className="w-20 h-20 text-neutral-300 mx-auto mb-6" />
          <p className="text-xl text-neutral-500 font-medium">No Transactions Yet</p>
          <p className="text-neutral-400 mt-1">Your points earning and spending activity will appear here.</p>
        </div>
      )}
    </div>
  );
};

export default ActivityLog;