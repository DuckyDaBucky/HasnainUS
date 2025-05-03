"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ChipStack from "./components/ChipStack";

type Player = {
  id: string;
  name: string;
  chips: number;
  bet: number;
  loans: number;
  isEditing?: boolean;
  folded?: boolean;
};

export default function Home() {
  const [players, setPlayers] = useState<Player[]>([
    { id: "1", name: "Player 1", chips: 500, bet: 0, loans: 0, folded: false },
    { id: "2", name: "Player 2", chips: 500, bet: 0, loans: 0, folded: false },
  ]);
  const [editingPlayer, setEditingPlayer] = useState<string | null>(null);
  const [editValue, setEditValue] = useState({ name: "", chips: 0 });
  const [loanAmount, setLoanAmount] = useState(100);
  const [potAmount, setPotAmount] = useState(0);
  const [smallBlind, setSmallBlind] = useState(5);
  const [gamePhase, setGamePhase] = useState<'preflop' | 'flop' | 'turn' | 'river' | 'showdown'>('preflop');

  const addPlayer = () => {
    const newPlayer = {
      id: Date.now().toString(),
      name: `Player ${players.length + 1}`,
      chips: 500,
      bet: 0,
      loans: 0,
      folded: false,
    };
    setPlayers([...players, newPlayer]);
  };

  const updateChips = (id: string, amount: number) => {
    setPlayers(
      players.map((player) =>
        player.id === id
          ? { ...player, chips: Math.max(0, player.chips + amount) }
          : player
      )
    );
  };

  const takeLoan = (id: string, amount: number) => {
    setPlayers(
      players.map((player) =>
        player.id === id
          ? { ...player, chips: player.chips + amount, loans: player.loans + amount }
          : player
      )
    );
  };

  const placeBet = (id: string, amount: number) => {
    setPlayers(
      players.map((player) =>
        player.id === id && player.chips >= amount
          ? { ...player, chips: player.chips - amount, bet: player.bet + amount }
          : player
      )
    );
    setPotAmount(potAmount + amount);
  };

  const matchBet = (id: string) => {
    const highestBet = Math.max(...players.map(p => p.bet));
    const player = players.find(p => p.id === id);
    if (player) {
      const amountToMatch = highestBet - player.bet;
      if (amountToMatch > 0 && player.chips >= amountToMatch) {
        placeBet(id, amountToMatch);
      }
    }
  };

  const raiseBet = (id: string, raiseAmount: number) => {
    const highestBet = Math.max(...players.map(p => p.bet));
    const player = players.find(p => p.id === id);
    if (player) {
      const totalAmount = (highestBet - player.bet) + raiseAmount;
      if (totalAmount > 0 && player.chips >= totalAmount) {
        placeBet(id, totalAmount);
      }
    }
  };

  const fold = (id: string) => {
    setPlayers(
      players.map((player) =>
        player.id === id ? { ...player, folded: true } : player
      )
    );
  };

  const placeBlind = (id: string, isSmall: boolean) => {
    const blindAmount = isSmall ? smallBlind : smallBlind * 2;
    placeBet(id, Math.min(blindAmount, players.find(p => p.id === id)?.chips || 0));
  };

  const nextPhase = () => {
    const phases: ('preflop' | 'flop' | 'turn' | 'river' | 'showdown')[] = ['preflop', 'flop', 'turn', 'river', 'showdown'];
    const currentIndex = phases.indexOf(gamePhase);
    if (currentIndex < phases.length - 1) {
      setGamePhase(phases[currentIndex + 1]);
    } else {
      // Reset to preflop for new hand
      setGamePhase('preflop');
      clearBets();
    }
  };

  const allIn = (id: string) => {
    const player = players.find(p => p.id === id);
    if (player && player.chips > 0) {
      placeBet(id, player.chips);
    }
  };

  const clearBets = () => {
    setPlayers(players.map(player => ({ ...player, bet: 0, folded: false })));
    setPotAmount(0);
  };

  const payPlayer = (id: string) => {
    setPlayers(
      players.map((player) =>
        player.id === id
          ? { ...player, chips: player.chips + potAmount }
          : player
      )
    );
    setPotAmount(0);
    // Reset folded status for new hand
    setPlayers(players.map(player => ({ ...player, folded: false })));
  };

  const startEditing = (player: Player) => {
    setEditingPlayer(player.id);
    setEditValue({ name: player.name, chips: player.chips });
  };

  const saveEdit = (id: string) => {
    setPlayers(
      players.map((player) =>
        player.id === id
          ? { ...player, name: editValue.name, chips: Math.max(0, editValue.chips) }
          : player
      )
    );
    setEditingPlayer(null);
  };

  const removePlayer = (id: string) => {
    setPlayers(players.filter((player) => player.id !== id));
  };

  const resetAll = () => {
    setPlayers(players.map((player) => ({ ...player, chips: 500, bet: 0, loans: 0, folded: false })));
    setPotAmount(0);
    setGamePhase('preflop');
  };

  const gamePhaseText = () => {
    switch(gamePhase) {
      case 'preflop': return 'Pre-Flop';
      case 'flop': return 'Flop';
      case 'turn': return 'Turn';
      case 'river': return 'River';
      case 'showdown': return 'Showdown';
    }
  };

  return (
    <div className="min-h-screen p-6 font-sans">
      <motion.header 
        className="text-center mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl md:text-4xl font-bold text-white shadow-sm">Poker Chip Tracker</h1>
        <p className="text-white/80 mt-2">Current Phase: {gamePhaseText()}</p>
      </motion.header>

      {/* Loan and Game Controls */}
      <motion.div
        className="max-w-6xl mx-auto mb-8 bg-white/10 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="flex flex-col sm:flex-row items-center justify-between">
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-white mb-2">Bank & Game Controls</h2>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setLoanAmount(Math.max(50, loanAmount - 50))}
                  className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center font-semibold"
                >
                  -
                </button>
                <div className="bg-white/20 px-3 py-1 rounded-lg">
                  <span className="text-white font-semibold">${loanAmount}</span>
                </div>
                <button
                  onClick={() => setLoanAmount(loanAmount + 50)}
                  className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-semibold"
                >
                  +
                </button>
              </div>
              
              <div className="flex items-center gap-2 ml-4">
                <span className="text-white text-sm">Blind:</span>
                <button
                  onClick={() => setSmallBlind(Math.max(1, smallBlind - 1))}
                  className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold"
                >
                  -
                </button>
                <div className="bg-white/20 px-3 py-1 rounded-lg">
                  <span className="text-white font-semibold">${smallBlind}/${smallBlind*2}</span>
                </div>
                <button
                  onClick={() => setSmallBlind(smallBlind + 1)}
                  className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold"
                >
                  +
                </button>
              </div>
              
              <button
                onClick={nextPhase}
                className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 rounded-lg text-white text-sm ml-4"
              >
                Next Phase
              </button>
            </div>
          </div>
          <div className="mt-4 sm:mt-0 flex gap-2 flex-wrap justify-center">
            {players.map((player) => (
              <motion.button
                key={`loan-${player.id}`}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => takeLoan(player.id, loanAmount)}
              >
                Loan to {player.name}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {players.map((player) => (
              <motion.div
                key={player.id}
                className={`bg-white/10 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 transition-all ${
                  player.folded ? 'opacity-60' : ''
                }`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: player.folded ? 0.6 : 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                {editingPlayer === player.id ? (
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={editValue.name}
                      onChange={(e) => setEditValue({ ...editValue, name: e.target.value })}
                      className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-slate-800"
                      autoFocus
                    />
                    <input
                      type="number"
                      value={editValue.chips}
                      onChange={(e) => setEditValue({ ...editValue, chips: parseInt(e.target.value) || 0 })}
                      className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-slate-800"
                    />
                    <div className="flex justify-end space-x-2">
                      <motion.button
                        onClick={() => setEditingPlayer(null)}
                        className="px-3 py-1.5 bg-slate-200 rounded-lg text-slate-700 text-sm"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Cancel
                      </motion.button>
                      <motion.button
                        onClick={() => saveEdit(player.id)}
                        className="px-3 py-1.5 bg-blue-600 rounded-lg text-white text-sm"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Save
                      </motion.button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-center mb-2">
                      <h2 className="text-xl font-semibold text-white">{player.name}</h2>
                      <motion.button
                        onClick={() => removePlayer(player.id)}
                        className="text-sm text-white/60 hover:text-red-400"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        &times;
                      </motion.button>
                    </div>
                    
                    {player.loans > 0 && (
                      <div className="text-sm text-red-400 mb-2">Loans: ${player.loans}</div>
                    )}
                    
                    <div className="h-20 flex items-center justify-center mb-2">
                      <ChipStack totalValue={player.chips} />
                    </div>
                    
                    <div className="text-2xl font-bold text-white text-center mb-4">${player.chips}</div>
                    
                    {/* Chip adjustment buttons */}
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex space-x-2">
                        <motion.button
                          onClick={() => updateChips(player.id, -10)}
                          className="w-9 h-9 rounded-full bg-red-500 text-white flex items-center justify-center font-semibold text-sm"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          -10
                        </motion.button>
                        <motion.button
                          onClick={() => updateChips(player.id, -1)}
                          className="w-9 h-9 rounded-full bg-red-500 text-white flex items-center justify-center font-semibold text-sm"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          -
                        </motion.button>
                        <motion.button
                          onClick={() => updateChips(player.id, 1)}
                          className="w-9 h-9 rounded-full bg-green-500 text-white flex items-center justify-center font-semibold text-sm"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          +
                        </motion.button>
                        <motion.button
                          onClick={() => updateChips(player.id, 10)}
                          className="w-9 h-9 rounded-full bg-green-500 text-white flex items-center justify-center font-semibold text-sm"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          +10
                        </motion.button>
                      </div>
                      <motion.button
                        onClick={() => startEditing(player)}
                        className="px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-white text-sm"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Edit
                      </motion.button>
                    </div>
                    
                    {/* Betting controls */}
                    <div className="border-t border-white/20 pt-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-white text-sm">Current Bet: ${player.bet}</span>
                        {player.folded && <span className="text-red-400 text-sm">Folded</span>}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        <motion.button
                          onClick={() => placeBlind(player.id, true)}
                          className="px-2 py-1 bg-yellow-600 hover:bg-yellow-700 rounded-lg text-white text-sm"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          disabled={player.chips < smallBlind}
                        >
                          Small Blind (${smallBlind})
                        </motion.button>
                        <motion.button
                          onClick={() => placeBlind(player.id, false)}
                          className="px-2 py-1 bg-yellow-600 hover:bg-yellow-700 rounded-lg text-white text-sm"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          disabled={player.chips < smallBlind * 2}
                        >
                          Big Blind (${smallBlind * 2})
                        </motion.button>
                        <motion.button
                          onClick={() => matchBet(player.id)}
                          className="px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          disabled={player.folded}
                        >
                          Call
                        </motion.button>
                        <motion.button
                          onClick={() => raiseBet(player.id, smallBlind * 2)}
                          className="px-2 py-1 bg-pink-600 hover:bg-pink-700 rounded-lg text-white text-sm"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          disabled={player.folded}
                        >
                          Raise
                        </motion.button>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <motion.button
                          onClick={() => fold(player.id)}
                          className="px-2 py-1 bg-gray-600 hover:bg-gray-700 rounded-lg text-white text-sm"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          disabled={player.folded}
                        >
                          Fold
                        </motion.button>
                        <motion.button
                          onClick={() => allIn(player.id)}
                          className="px-2 py-1 bg-red-600 hover:bg-red-700 rounded-lg text-white text-sm"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          disabled={player.folded || player.chips === 0}
                        >
                          All In
                        </motion.button>
                      </div>
                      
                      {potAmount > 0 && (
                        <motion.button
                          onClick={() => payPlayer(player.id)}
                          className="w-full mt-2 px-2 py-1 bg-green-600 hover:bg-green-700 rounded-lg text-white text-sm"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Win Pot
                        </motion.button>
                      )}
                    </div>
                  </>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          <motion.div
            className="bg-white/5 rounded-2xl border border-dashed border-white/20 flex items-center justify-center cursor-pointer h-[300px]"
            onClick={addPlayer}
            whileHover={{ scale: 1.02, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex flex-col items-center text-white/60">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              <span className="mt-2">Add Player</span>
            </div>
          </motion.div>
        </div>

        {/* Pot Section */}
        <motion.div
          className="mt-12 bg-white/10 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-col items-center md:items-start">
              <div className="text-xl font-semibold text-white mb-2">Pot</div>
              <div className="text-3xl font-bold text-white">${potAmount}</div>
            </div>
            
            <div className="h-24 md:h-28 flex items-center justify-center">
              <ChipStack totalValue={potAmount} />
            </div>
            
            <div className="flex gap-2">
              <motion.button
                onClick={clearBets}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                New Hand
              </motion.button>
              <motion.button
                onClick={resetAll}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Reset All
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
